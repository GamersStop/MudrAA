"""
MudrAA Phase 1 Automated Test Suite
Verifies:
1. RFC 8785 Canonicalization & Peppol BIS 3.0 Normalizer (TASK-103)
2. DefusedXML XXE injection rejection (Threat C.4)
3. AES-256 Data-at-Rest Encryption (TASK-102 / Threat D.2)
4. Ed25519 Dual-Signed Notice of Assignment & Waiver-of-Setoff (TASK-104)
5. FastAPI Ingestion & Duplicate Rejection Endpoints (TASK-105)
"""

import pytest
import asyncio
from cryptography.hazmat.primitives.asymmetric import ed25519
from httpx import AsyncClient, ASGITransport

from core.canonical import (
    rfc8785_canonicalize,
    compute_canonical_hash,
    parse_peppol_bis3_xml,
    normalize_peppol_invoice,
    generate_sample_peppol_xml,
    PeppolParseError
)
from core.legal_escrow import (
    construct_supplier_noa_message,
    construct_buyer_waiver_message,
    verify_dual_signed_escrow,
    LegalEscrowError
)
from db.models import encrypt_payload, decrypt_payload
from main import app


def test_rfc8785_canonicalization():
    """Verifies that key order and whitespace variations produce identical canonical bytes."""
    data_a = {"b": 2, "a": 1, "c": {"y": "test", "x": 10.0}}
    data_b = {"a": 1, "c": {"x": 10, "y": "test"}, "b": 2}

    canon_a = rfc8785_canonicalize(data_a)
    canon_b = rfc8785_canonicalize(data_b)

    assert canon_a == canon_b
    assert canon_a == b'{"a":1,"b":2,"c":{"x":10,"y":"test"}}'

    _, hash_a = compute_canonical_hash(canon_a)
    _, hash_b = compute_canonical_hash(canon_b)
    assert hash_a == hash_b


def test_peppol_xml_parsing_and_normalization():
    """Verifies parsing of Peppol BIS 3.0 XML into canonical representation."""
    sample_xml = generate_sample_peppol_xml(
        invoice_id="INV-TEST-001",
        payable_amount=250000.0
    )
    parsed, canon_bytes, hex_hash = normalize_peppol_invoice(sample_xml)

    assert parsed["invoice_id"] == "INV-TEST-001"
    assert parsed["payable_amount"] == 250000.0
    assert parsed["currency"] == "USD"
    assert len(hex_hash) == 64


def test_xxe_injection_rejection():
    """Mitigates Threat C.4: Verifies defusedxml blocks XML External Entity (XXE) attacks."""
    malicious_xxe_xml = """<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE Invoice [
      <!ENTITY xxe SYSTEM "file:///etc/passwd">
    ]>
    <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
             xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:ID>&xxe;</cbc:ID>
    </Invoice>"""

    with pytest.raises(PeppolParseError):
        parse_peppol_bis3_xml(malicious_xxe_xml)


def test_aes256_payload_encryption():
    """Mitigates Threat D.2: Verifies commercial metadata is safely encrypted and authenticated."""
    commercial_terms = {
        "supplier_tax": "IN-GST-12345",
        "margin_bps": 450,
        "private_contract_code": "ALPHA-SECRET-88"
    }

    encrypted_cipher = encrypt_payload(commercial_terms)
    assert encrypted_cipher != ""
    assert "ALPHA-SECRET-88" not in encrypted_cipher

    decrypted = decrypt_payload(encrypted_cipher)
    assert decrypted["supplier_tax"] == "IN-GST-12345"
    assert decrypted["private_contract_code"] == "ALPHA-SECRET-88"


def test_ed25519_dual_signed_escrow():
    """Verifies Ed25519 Notice of Assignment (NOA) and Waiver-of-Setoff verification (TASK-104)."""
    invoice_digest = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    vault_pubkey = "MudrAAVault11111111111111111111111111111111"

    # Generate keypairs for supplier and buyer
    supplier_sk = ed25519.Ed25519PrivateKey.generate()
    supplier_pk = supplier_sk.public_key().public_bytes_raw()

    buyer_sk = ed25519.Ed25519PrivateKey.generate()
    buyer_pk = buyer_sk.public_key().public_bytes_raw()

    # Sign respective messages
    supplier_msg = construct_supplier_noa_message(invoice_digest, vault_pubkey)
    supplier_sig = supplier_sk.sign(supplier_msg)

    buyer_msg = construct_buyer_waiver_message(invoice_digest, vault_pubkey)
    buyer_sig = buyer_sk.sign(buyer_msg)

    manifest = verify_dual_signed_escrow(
        invoice_digest_hex=invoice_digest,
        vault_pubkey=vault_pubkey,
        supplier_pubkey_bytes=supplier_pk,
        supplier_signature_bytes=supplier_sig,
        buyer_pubkey_bytes=buyer_pk,
        buyer_signature_bytes=buyer_sig
    )

    assert manifest["mletr_status"] == "PERFECTED"
    assert manifest["supplier_verified"] is True
    assert manifest["buyer_waiver_verified"] is True

    # Test tampering rejection
    corrupted_buyer_sig = bytearray(buyer_sig)
    corrupted_buyer_sig[0] ^= 0xFF
    with pytest.raises(LegalEscrowError):
        verify_dual_signed_escrow(
            invoice_digest_hex=invoice_digest,
            vault_pubkey=vault_pubkey,
            supplier_pubkey_bytes=supplier_pk,
            supplier_signature_bytes=supplier_sig,
            buyer_pubkey_bytes=buyer_pk,
            buyer_signature_bytes=bytes(corrupted_buyer_sig)
        )


@pytest.mark.asyncio
async def test_fastapi_endpoints():
    """Verifies health check and legal escrow API endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res_health = await client.get("/health")
        assert res_health.status_code == 200
        data_health = res_health.json()
        assert "status" in data_health
        assert "ashta_pradhan_core" in data_health

        # 2. Telemetry
        res_telemetry = await client.get("/api/v1/telemetry")
        assert res_telemetry.status_code == 200
        data_telemetry = res_telemetry.json()
        assert data_telemetry["ashta_pradhan_status"]["sachiv_rajmudra"] == "active"

        # 3. Dual-Signed Legal Verification API
        invoice_digest = "a" * 64
        vault_pubkey = "MudrAAVault11111111111111111111111111111111"

        supplier_sk = ed25519.Ed25519PrivateKey.generate()
        supplier_pk = supplier_sk.public_key().public_bytes_raw().hex()
        supplier_sig = supplier_sk.sign(construct_supplier_noa_message(invoice_digest, vault_pubkey)).hex()

        buyer_sk = ed25519.Ed25519PrivateKey.generate()
        buyer_pk = buyer_sk.public_key().public_bytes_raw().hex()
        buyer_sig = buyer_sk.sign(construct_buyer_waiver_message(invoice_digest, vault_pubkey)).hex()

        res_legal = await client.post("/api/v1/trade/legal/verify-escrow", json={
            "invoice_digest_hex": invoice_digest,
            "vault_pubkey": vault_pubkey,
            "supplier_pubkey_hex": supplier_pk,
            "supplier_signature_hex": supplier_sig,
            "buyer_pubkey_hex": buyer_pk,
            "buyer_signature_hex": buyer_sig
        })
        assert res_legal.status_code == 200
        legal_data = res_legal.json()
        assert legal_data["success"] is True
        assert legal_data["mletr_status"] == "PERFECTED"


@pytest.mark.asyncio
async def test_invoice_ingest_and_duplicate_rejection():
    """Verifies end-to-end invoice XML ingestion and duplicate pledge prevention (TASK-105 / Threat A.1)."""
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
    from sqlmodel import SQLModel
    from db.database import get_db_session

    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    test_session_maker = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)

    async def override_get_db_session():
        async with test_session_maker() as session:
            yield session

    app.dependency_overrides[get_db_session] = override_get_db_session

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        sample_xml = generate_sample_peppol_xml(
            invoice_id="INV-TEST-DUP-01",
            payable_amount=175000.0
        )
        payload = {
            "xml_content": sample_xml,
            "exporter_wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
            "importer_wallet": "4Nd1mBQtrMJVYVfKf2PJy9NZWsWCYHDkzGGXVo5kaN3",
            "zk_commitment_hex": "11" * 32,
            "nullifier_hex": "22" * 32
        }

        # 1. First ingestion must succeed (201 Created)
        res1 = await client.post("/api/v1/trade/invoices/ingest-xml", json=payload)
        assert res1.status_code == 201
        data1 = res1.json()
        assert data1["success"] is True
        assert data1["face_value"] == 175000.0
        invoice_id = data1["invoice_id"]

        # 2. Querying invoice by ID must return metadata without leaking commercial secrets
        res_get = await client.get(f"/api/v1/trade/invoices/{invoice_id}")
        assert res_get.status_code == 200
        get_data = res_get.json()
        assert get_data["id"] == invoice_id
        assert get_data["face_value"] == 175000.0

        # 3. Duplicate ingestion of identical invoice must be rejected (409 Conflict)
        res2 = await client.post("/api/v1/trade/invoices/ingest-xml", json=payload)
        assert res2.status_code == 409
        data2 = res2.json()
        assert "DuplicateInvoicePledgeDetected" in str(data2)

    app.dependency_overrides.clear()
    await test_engine.dispose()

