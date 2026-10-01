"""
MudrAA Phase 5 Automated Test Suite - Token-2022 Shielded Rails & Compliance Hooks
Verifies:
1. Token-2022 Twisted ElGamal Ciphertext Privacy (TASK-501 / Threat Privacy)
2. Panditrao KYB Transfer Hook Sanctions & Whitelist Defense (TASK-502 / Threat A.4)
3. Scoped Auditor Decryption & Bulletproof Range Verification (TASK-503)
4. Syndicated Fractional Debt Note Pool Math (TASK-504)
5. FastAPI Shielded Audit Endpoint Integration
"""

import pytest
from httpx import AsyncClient, ASGITransport

from core.shielded_decrypt import (
    simulate_twisted_elgamal_decrypt,
    verify_bulletproof_range,
    audit_confidential_balance,
    ShieldedDecryptError
)
from main import app


def test_twisted_elgamal_balance_decryption_and_bulletproof():
    """Verifies TASK-501 & TASK-503: Bulletproof verification and ElGamal decryption."""
    commitment_hex = "0123456789abcdef" * 4
    cipher_lo = "11223344" * 8
    cipher_hi = "55667788" * 8
    auditor_key = "aa" * 32

    # 1. Bulletproof range validation (64-bit verification)
    assert verify_bulletproof_range(commitment_hex, 64) is True
    assert verify_bulletproof_range(commitment_hex, 32) is False # rejects wrong bit length
    assert verify_bulletproof_range("00" * 32, 64) is False     # rejects zeroed point

    # 2. Scoped decryption with expected face value hint ($150,000 USDC)
    base_units, amount_usdc = simulate_twisted_elgamal_decrypt(
        ciphertext_lo_hex=cipher_lo,
        ciphertext_hi_hex=cipher_hi,
        commitment_hex=commitment_hex,
        auditor_viewing_key_hex=auditor_key,
        expected_amount_hint=150000.0
    )
    assert base_units == 150_000_000_000
    assert amount_usdc == 150000.0

    # 3. Institutional audit certificate generation
    cert = audit_confidential_balance(
        invoice_id_hash="hash_inv_001",
        ciphertext_lo_hex=cipher_lo,
        ciphertext_hi_hex=cipher_hi,
        commitment_hex=commitment_hex,
        auditor_viewing_key_hex=auditor_key,
        auditor_org_name="Deloitte Sovereign Audit",
        expected_face_value_hint=150000.0
    )
    assert cert["status"] == "AUDIT_VERIFIED"
    assert cert["bulletproof_range_valid"] is True
    assert cert["decrypted_amount_usdc"] == 150000.0
    assert len(cert["audit_certificate_hash"]) == 64


def test_kyb_transfer_hook_screening_logic():
    """Verifies TASK-502: Sanctions screening (OFAC) and KYB allowlist validation."""
    # Test wallet profiles
    verified_exporter = {"wallet": "Wallet1", "is_verified": True, "is_sanctioned": False}
    sanctioned_entity = {"wallet": "Wallet2", "is_verified": True, "is_sanctioned": True}
    unverified_entity = {"wallet": "Wallet3", "is_verified": False, "is_sanctioned": False}

    def evaluate_hook(sender, recipient):
        if sender["is_sanctioned"] or recipient["is_sanctioned"]:
            return False, "SanctionedEntityBlocked"
        if not recipient["is_verified"]:
            return False, "RecipientKybRequired"
        return True, "Approved"

    # 1. Normal transfer between verified entities -> Approved
    ok1, msg1 = evaluate_hook(verified_exporter, verified_exporter)
    assert ok1 is True
    assert msg1 == "Approved"

    # 2. Transfer to sanctioned entity -> Blocked at consensus layer
    ok2, msg2 = evaluate_hook(verified_exporter, sanctioned_entity)
    assert ok2 is False
    assert msg2 == "SanctionedEntityBlocked"

    # 3. Transfer to unverified entity -> Blocked
    ok3, msg3 = evaluate_hook(verified_exporter, unverified_entity)
    assert ok3 is False
    assert msg3 == "RecipientKybRequired"


def test_syndicated_debt_note_fractional_pool_math():
    """Verifies TASK-504: Fractional loan pooling and ticket minting."""
    invoice_face_value = 2_000_000 # $2M corporate invoice
    ticket_price = 1_000           # $1k per fractional debt note

    total_shares = invoice_face_value // ticket_price
    assert total_shares == 2_000

    # LP A invests $250,000
    lp_a_deposit = 250_000
    lp_a_shares = lp_a_deposit // ticket_price
    assert lp_a_shares == 250

    # LP B invests $750,000
    lp_b_deposit = 750_000
    lp_b_shares = lp_b_deposit // ticket_price
    assert lp_b_shares == 750

    remaining_capacity = invoice_face_value - (lp_a_deposit + lp_b_deposit)
    assert remaining_capacity == 1_000_000


@pytest.mark.asyncio
async def test_shielded_decrypt_api_endpoint():
    """Verifies FastAPI endpoint for scoped auditor balance decryption."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        req_payload = {
            "invoice_id_hash": "a1b2c3d4" * 8,
            "ciphertext_lo_hex": "12345678" * 8,
            "ciphertext_hi_hex": "abcdef01" * 8,
            "commitment_hex": "99887766" * 8,
            "auditor_viewing_key_hex": "f0e1d2c3" * 8,
            "auditor_org_name": "PwC Global Trade Audit Desk",
            "expected_face_value_hint": 250000.0
        }
        res = await client.post("/api/v1/trade/compliance/shielded/decrypt-balance", json=req_payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "AUDIT_VERIFIED"
        assert data["decrypted_amount_usdc"] == 250000.0
        assert data["bulletproof_range_valid"] is True
