"""
MudrAA Marine Cargo Insurance Oracle - Nyayadhish Escrow Subsystem
Implements TASK-403:
- Inspects marine cargo insurance policies and verifies automated Loss-Payee subrogation.
- Enforces minimum 110% CIF coverage ratio matching international Institute Cargo Clauses (A).
- Binds insurance claim payouts directly to MudrAA Reserve Vault PDA in case of loss at sea.
"""

import hashlib
from typing import Dict, Any, Optional
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature

# Underwriter Allowlist
APPROVED_UNDERWRITERS = {
    "LLOYDS_LONDON": "Lloyd's of London Marine Syndicate",
    "ALLIANZ_MARINE": "Allianz Global Corporate & Specialty",
    "MUNICH_RE": "Munich Re Marine Underwriting",
    "SWISS_RE": "Swiss Re Corporate Solutions"
}

_UNDERWRITER_KEYPAIR = ed25519.Ed25519PrivateKey.generate()
UNDERWRITER_PUBKEY_HEX = _UNDERWRITER_KEYPAIR.public_key().public_bytes_raw().hex()


class InsuranceOracleError(Exception):
    """Raised when cargo insurance policy fails validation or subrogation clauses."""
    pass


def construct_insurance_policy_digest(
    policy_number: str,
    invoice_id_hash: str,
    vault_pubkey: str,
    coverage_amount: float
) -> bytes:
    """Constructs canonical 32-byte digest for insurance loss-payee assignment."""
    raw = f"{policy_number.strip().upper()}:{invoice_id_hash.lower()}:{vault_pubkey}:{coverage_amount:.2f}".encode("utf-8")
    return hashlib.sha256(raw).digest()


def sign_mock_insurance_certificate(
    policy_number: str,
    invoice_id_hash: str,
    vault_pubkey: str,
    coverage_amount: float
) -> str:
    """Utility to sign simulated underwriter certificate."""
    digest = construct_insurance_policy_digest(policy_number, invoice_id_hash, vault_pubkey, coverage_amount)
    return _UNDERWRITER_KEYPAIR.sign(digest).hex()


def evaluate_marine_insurance_policy(
    underwriter_code: str,
    policy_number: str,
    invoice_id_hash: str,
    invoice_face_value: float,
    insured_coverage_amount: float,
    loss_payee_pubkey: str,
    expected_vault_pubkey: str,
    underwriter_signature_hex: str
) -> Dict[str, Any]:
    """
    Evaluates marine insurance policy certificate.
    Enforces minimum 110% coverage and validates automated loss-payee subrogation to vault.
    """
    uw_upper = underwriter_code.strip().upper()
    if uw_upper not in APPROVED_UNDERWRITERS:
        raise InsuranceOracleError(
            f"Unauthorized Underwriter: '{underwriter_code}' is not an approved institutional marine insurer."
        )

    # 1. Enforce 110% Coverage Ratio (Institute Cargo Clauses A standard)
    min_required_coverage = invoice_face_value * 1.10
    if insured_coverage_amount < min_required_coverage:
        raise InsuranceOracleError(
            f"Insufficient Insurance Coverage: Insured {insured_coverage_amount:.2f} USDC is below "
            f"the mandatory 110% threshold ({min_required_coverage:.2f} USDC)."
        )

    # 2. Enforce Loss-Payee Subrogation Assignment to MudrAA Vault
    if loss_payee_pubkey != expected_vault_pubkey:
        raise InsuranceOracleError(
            f"Subrogation Breach: Loss-Payee beneficiary must be designated as MudrAA Vault PDA ({expected_vault_pubkey})."
        )

    # 3. Verify Underwriter Cryptographic Signature
    digest = construct_insurance_policy_digest(policy_number, invoice_id_hash, expected_vault_pubkey, insured_coverage_amount)
    try:
        sig_bytes = bytes.fromhex(underwriter_signature_hex)
        pk = _UNDERWRITER_KEYPAIR.public_key()
        pk.verify(sig_bytes, digest)
    except InvalidSignature:
        raise InsuranceOracleError("Underwriter digital signature verification failed.")
    except Exception as e:
        raise InsuranceOracleError(f"Insurance signature evaluation failed: {str(e)}")

    coverage_ratio = round((insured_coverage_amount / invoice_face_value) * 100, 2)

    return {
        "status": "POLICY_PERFECTED",
        "underwriter": APPROVED_UNDERWRITERS[uw_upper],
        "underwriter_code": uw_upper,
        "policy_number": policy_number.upper(),
        "coverage_ratio_percent": coverage_ratio,
        "insured_amount": insured_coverage_amount,
        "loss_payee_vault": expected_vault_pubkey,
        "subrogation_active": True,
        "message": "Marine cargo policy subrogation verified. Loss-Payee assigned to protocol vault."
    }
