"""
MudrAA Legal Recourse Subsystem - Nyayadhish Escrow & Ed25519 NOA Engine
Enforces UNCITRAL MLETR perfection, dual-signed NOA, and irrevocable waiver of set-off.
Mitigates Threat A.1 & Counterparty Commercial Disputes.
"""

import hashlib
from typing import Dict, Any, Tuple
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature


class LegalEscrowError(Exception):
    """Raised when digital assignment signatures fail cryptographic verification."""
    pass


def construct_supplier_noa_message(invoice_digest_hex: str, vault_pubkey: str) -> bytes:
    """
    Constructs canonical byte message for supplier assignment to MudrAA SPV.
    Format: SHA256(invoice_digest_hex || "ASSIGNMENT_TO_SPV" || vault_pubkey)
    """
    raw = f"{invoice_digest_hex}:ASSIGNMENT_TO_SPV:{vault_pubkey}".encode("utf-8")
    return hashlib.sha256(raw).digest()


def construct_buyer_waiver_message(invoice_digest_hex: str, vault_pubkey: str) -> bytes:
    """
    Constructs canonical byte message for buyer irrevocable waiver of defense and set-off.
    Format: SHA256(invoice_digest_hex || "WAIVER_OF_SETOFF" || vault_pubkey)
    """
    raw = f"{invoice_digest_hex}:WAIVER_OF_SETOFF:{vault_pubkey}".encode("utf-8")
    return hashlib.sha256(raw).digest()


def verify_ed25519_signature(
    public_key_bytes: bytes,
    signature_bytes: bytes,
    message_digest: bytes
) -> bool:
    """Cryptographically verifies a 64-byte Ed25519 signature over a 32-byte message digest."""
    if len(public_key_bytes) != 32:
        raise LegalEscrowError(f"Invalid Ed25519 public key length: {len(public_key_bytes)} (expected 32 bytes)")
    if len(signature_bytes) != 64:
        raise LegalEscrowError(f"Invalid Ed25519 signature length: {len(signature_bytes)} (expected 64 bytes)")

    try:
        public_key = ed25519.Ed25519PublicKey.from_public_bytes(public_key_bytes)
        public_key.verify(signature_bytes, message_digest)
        return True
    except InvalidSignature:
        return False
    except Exception as e:
        raise LegalEscrowError(f"Cryptographic signature evaluation failed: {str(e)}")


def verify_dual_signed_escrow(
    invoice_digest_hex: str,
    vault_pubkey: str,
    supplier_pubkey_bytes: bytes,
    supplier_signature_bytes: bytes,
    buyer_pubkey_bytes: bytes,
    buyer_signature_bytes: bytes
) -> Dict[str, Any]:
    """
    Verifies both Supplier Notice of Assignment and Buyer Waiver of Set-Off.
    Returns legal perfection manifest or raises LegalEscrowError.
    """
    supplier_msg = construct_supplier_noa_message(invoice_digest_hex, vault_pubkey)
    if not verify_ed25519_signature(supplier_pubkey_bytes, supplier_signature_bytes, supplier_msg):
        raise LegalEscrowError("Supplier Notice of Assignment (NOA) signature is invalid")

    buyer_msg = construct_buyer_waiver_message(invoice_digest_hex, vault_pubkey)
    if not verify_ed25519_signature(buyer_pubkey_bytes, buyer_signature_bytes, buyer_msg):
        raise LegalEscrowError("Buyer Waiver of Defense & Set-Off signature is invalid")

    return {
        "mletr_status": "PERFECTED",
        "invoice_digest": invoice_digest_hex,
        "vault_pubkey": vault_pubkey,
        "supplier_verified": True,
        "buyer_waiver_verified": True,
        "governing_law": "UNCITRAL MLETR & UCC-1",
        "lockbox_settlement_mandatory": True,
    }
