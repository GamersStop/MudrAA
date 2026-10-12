"""
MudrAA Phase 2 Automated Test Suite - ZK Prover & Zcash Audit Engine
Verifies:
1. Circom Range & Field Constraint Enforcement (TASK-201 / Threat B.1)
2. BN254 Poseidon Hashing & Nullifier Derivation (TASK-203 / Threat B.4)
3. Groth16 Proof Point Serialization (64 bytes G1, 128 bytes G2)
4. Zcash Viewing-Key (IVK) HMAC Audit Attestation & Selective Disclosure (TASK-204)
5. FastAPI Compliance Endpoints & Anti-Tamper Verification
"""

import pytest
from httpx import AsyncClient, ASGITransport

from core.prover import (
    RajmudraProver,
    ProverError,
    poseidon_hash_5,
    poseidon_hash_3,
    to_field_element,
    BN254_FR_MODULUS
)
from core.zcash_audit import (
    parse_zcash_viewing_key,
    generate_zcash_audit_attestation,
    verify_zcash_audit_attestation,
    generate_mock_zcash_keypair,
    ZcashAuditError
)
from main import app


def test_bn254_field_conversion():
    """Verifies that field element conversion stays strictly within Fr modulus."""
    assert to_field_element(0) == 0
    assert to_field_element(BN254_FR_MODULUS) == 0
    assert to_field_element(BN254_FR_MODULUS + 5) == 5

    # String and hex conversion
    elem_hex = to_field_element("0x1234567890abcdef")
    assert isinstance(elem_hex, int)
    assert 0 <= elem_hex < BN254_FR_MODULUS


def test_poseidon_commitment_and_nullifier_derivation():
    """Verifies deterministic Poseidon commitments and nullifier derivations (TASK-203)."""
    tax_id = "IN-GST-27AABCM9999Z1Z"
    buyer_id = "DE-VAT-998877665"
    face_value = 150000000000 # $150,000 in micro-units
    tenor_days = 60
    salt = "secret_entropy_salt_12345"
    supplier_pubkey = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

    commitment = poseidon_hash_5(tax_id, buyer_id, face_value, tenor_days, salt)
    assert 0 < commitment < BN254_FR_MODULUS

    nullifier = poseidon_hash_3(commitment, salt, supplier_pubkey)
    assert 0 < nullifier < BN254_FR_MODULUS

    # Different salt must yield different commitment and nullifier
    diff_commitment = poseidon_hash_5(tax_id, buyer_id, face_value, tenor_days, "different_salt")
    assert diff_commitment != commitment

    diff_nullifier = poseidon_hash_3(diff_commitment, "different_salt", supplier_pubkey)
    assert diff_nullifier != nullifier


def test_prover_range_checks():
    """Mitigates Threat B.1: Prover must enforce min face value and max tenor range limits."""
    prover = RajmudraProver(min_face_value=1000, max_tenor_days=180)

    # 1. Valid witness generation
    witness = prover.generate_witness(
        tax_id="EXP-001",
        buyer_id="BUY-001",
        face_value=100000,
        tenor_days=90,
        secret_salt="salt_abc",
        supplier_pubkey="pubkey_abc"
    )
    assert len(witness["commitment_bytes"]) == 32
    assert len(witness["nullifier_bytes"]) == 32

    # 2. Reject face value below protocol minimum
    with pytest.raises(ProverError, match="below protocol minimum"):
        prover.generate_witness(
            tax_id="EXP-001",
            buyer_id="BUY-001",
            face_value=500, # Below 1000
            tenor_days=90,
            secret_salt="salt_abc",
            supplier_pubkey="pubkey_abc"
        )

    # 3. Reject tenor above protocol maximum
    with pytest.raises(ProverError, match="exceeds protocol maximum"):
        prover.generate_witness(
            tax_id="EXP-001",
            buyer_id="BUY-001",
            face_value=50000,
            tenor_days=200, # Above 180 days
            secret_salt="salt_abc",
            supplier_pubkey="pubkey_abc"
        )


def test_groth16_proof_serialization():
    """Verifies that serialized proof matches Solana alt_bn128 syscall expectations."""
    prover = RajmudraProver()
    witness = prover.generate_witness(
        tax_id="EXP-001",
        buyer_id="BUY-001",
        face_value=100000,
        tenor_days=60,
        secret_salt="salt_abc",
        supplier_pubkey="pubkey_abc"
    )

    proof = prover.synthesize_groth16_proof(witness)

    # G1 Point A: 64 bytes
    assert len(proof.a) == 64
    # G2 Point B: 128 bytes
    assert len(proof.b) == 128
    # G1 Point C: 64 bytes
    assert len(proof.c) == 64
    # Public Inputs: 5 elements of 32 bytes each (includes supplierPubkey front-running mitigation)
    assert len(proof.public_inputs) == 5
    for pi in proof.public_inputs:
        assert len(pi) == 32

    # Total instruction data: 64 + 128 + 64 + (5 * 32) = 416 bytes
    instruction_data = proof.serialize_instruction_data()
    assert len(instruction_data) == 416


def test_zcash_viewing_key_audit_workflow():
    """Verifies TASK-204: Scoped Zcash Viewing-Key selective disclosure and HMAC attestation."""
    keys = generate_mock_zcash_keypair()
    ivk_hex = keys["incoming_viewing_key_hex"]
    bech32_ivk = keys["simulated_bech32_ivk"]

    nullifier_hex = "bb" * 32
    commitment_hex = "cc" * 32

    # 1. Generate attestation from hex IVK
    ivk_bytes = parse_zcash_viewing_key(ivk_hex)
    token = generate_zcash_audit_attestation(ivk_bytes, nullifier_hex, commitment_hex)
    assert len(token) == 64

    # 2. Verify attestation
    report = verify_zcash_audit_attestation(
        raw_ivk=ivk_hex,
        solana_nullifier_hex=nullifier_hex,
        invoice_commitment_hex=commitment_hex,
        expected_token=token
    )
    assert report["audit_status"] == "VERIFIED_COMPLIANT"
    assert report["selective_disclosure"]["ofac_cleared"] is True

    # 3. Test Bech32 IVK parsing
    bech32_bytes = parse_zcash_viewing_key(bech32_ivk)
    assert len(bech32_bytes) == 32

    # 4. Corrupted token must fail verification
    with pytest.raises(ZcashAuditError, match="mismatch"):
        verify_zcash_audit_attestation(
            raw_ivk=ivk_hex,
            solana_nullifier_hex=nullifier_hex,
            invoice_commitment_hex=commitment_hex,
            expected_token="00" * 32
        )


@pytest.mark.asyncio
async def test_compliance_api_endpoints():
    """Verifies FastAPI endpoints for ZK proof generation and Zcash audit attestation."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Test Proof Generation API
        proof_req = {
            "tax_id": "IN-GST-27AABCM9999Z1Z",
            "buyer_id": "DE-VAT-998877665",
            "face_value": 150000000000,
            "tenor_days": 60,
            "secret_salt": "rajmudra_entropy_salt_9988",
            "supplier_pubkey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
        }
        res_proof = await client.post("/api/v1/trade/compliance/prover/generate-proof", json=proof_req)
        assert res_proof.status_code == 200
        proof_data = res_proof.json()
        assert proof_data["success"] is True
        assert len(proof_data["proof_a_hex"]) == 128 # 64 bytes = 128 hex chars
        assert len(proof_data["proof_b_hex"]) == 256 # 128 bytes = 256 hex chars
        assert len(proof_data["proof_c_hex"]) == 128 # 64 bytes = 128 hex chars
        assert len(proof_data["instruction_data_hex"]) == 832 # 416 bytes = 832 hex chars

        nullifier_hex = proof_data["nullifier_hash_hex"]
        commitment_hex = proof_data["invoice_commitment_hex"]

        # 2. Test Zcash Audit Attestation Token Generation
        ivk_hex = "f" * 64
        res_token = await client.post("/api/v1/trade/compliance/zcash-audit/generate-attestation", json={
            "viewing_key_hex": ivk_hex,
            "solana_nullifier_hex": nullifier_hex,
            "invoice_commitment_hex": commitment_hex
        })
        assert res_token.status_code == 200
        token_data = res_token.json()
        attestation_token = token_data["audit_attestation_token"]

        # 3. Test Zcash Audit Verification API
        res_verify = await client.post("/api/v1/trade/compliance/zcash-audit/verify-attestation", json={
            "viewing_key_hex": ivk_hex,
            "solana_nullifier_hex": nullifier_hex,
            "invoice_commitment_hex": commitment_hex,
            "expected_token": attestation_token
        })
        assert res_verify.status_code == 200
        verify_data = res_verify.json()
        assert verify_data["success"] is True
        assert verify_data["audit_status"] == "VERIFIED_COMPLIANT"
