"""
MudrAA Compliance & Prover API Router
Exposes:
1. Rajmudra ZK Proof generation endpoint (TASK-203).
2. Zcash Viewing-Key selective disclosure audit endpoints (TASK-204).
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from typing import Dict, Any, List, Optional

from core.prover import RajmudraProver, ProverError
from core.zcash_audit import (
    generate_zcash_audit_attestation,
    verify_zcash_audit_attestation,
    parse_zcash_viewing_key,
    ZcashAuditError
)
from core.shielded_decrypt import audit_confidential_balance, ShieldedDecryptError

router = APIRouter(prefix="/compliance", tags=["Compliance & ZK Prover"])


# ----------------------------------------------------------------------
# 1. ZK PROVER SCHEMAS & ENDPOINTS
# ----------------------------------------------------------------------

class GenerateProofRequest(BaseModel):
    tax_id: str = Field(..., min_length=3, max_length=50, json_schema_extra={"example": "IN-GST-27AABCM9999Z1Z"})
    buyer_id: str = Field(..., min_length=3, max_length=50, json_schema_extra={"example": "DE-VAT-998877665"})
    face_value: int = Field(..., gt=0, json_schema_extra={"example": 150000000000}) # base units
    tenor_days: int = Field(..., gt=0, le=365, json_schema_extra={"example": 60})
    secret_salt: str = Field(..., min_length=16, json_schema_extra={"example": "rajmudra_entropy_salt_9988"})
    supplier_pubkey: str = Field(..., min_length=32, max_length=44, json_schema_extra={"example": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"})


class ProofResponse(BaseModel):
    success: bool
    nullifier_hash_hex: str
    invoice_commitment_hex: str
    proof_a_hex: str
    proof_b_hex: str
    proof_c_hex: str
    public_inputs_hex: List[str]
    instruction_data_hex: str
    message: str


@router.post("/prover/generate-proof", response_model=ProofResponse)
def generate_zk_proof(payload: GenerateProofRequest):
    """
    Client/Relayer zero-knowledge proof generator.
    Evaluates Poseidon commitment, derives anti-replay nullifier, and synthesizes Groth16 BN254 proof.
    """
    prover = RajmudraProver(min_face_value=1000, max_tenor_days=180)
    try:
        witness = prover.generate_witness(
            tax_id=payload.tax_id,
            buyer_id=payload.buyer_id,
            face_value=payload.face_value,
            tenor_days=payload.tenor_days,
            secret_salt=payload.secret_salt,
            supplier_pubkey=payload.supplier_pubkey
        )
        proof = prover.synthesize_groth16_proof(witness)

        return ProofResponse(
            success=True,
            nullifier_hash_hex=witness["nullifier_bytes"].hex(),
            invoice_commitment_hex=witness["commitment_bytes"].hex(),
            proof_a_hex=proof.a.hex(),
            proof_b_hex=proof.b.hex(),
            proof_c_hex=proof.c.hex(),
            public_inputs_hex=[p.hex() for p in proof.public_inputs],
            instruction_data_hex=proof.serialize_instruction_data().hex(),
            message="Groth16 BN254 proof generated successfully for Rajmudra Verification Engine."
        )
    except ProverError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Circuit constraint violation: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ZK Prover internal error: {str(e)}"
        )


# ----------------------------------------------------------------------
# 2. ZCASH COMPLIANCE AUDIT SCHEMAS & ENDPOINTS
# ----------------------------------------------------------------------

class ZcashAttestationRequest(BaseModel):
    viewing_key_hex: str = Field(..., min_length=32, json_schema_extra={"example": "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90"})
    solana_nullifier_hex: str = Field(..., min_length=64, max_length=66)
    invoice_commitment_hex: str = Field(..., min_length=64, max_length=66)

    @field_validator("solana_nullifier_hex", "invoice_commitment_hex")
    @classmethod
    def clean_hex(cls, v: str) -> str:
        if v.startswith("0x") or v.startswith("0X"):
            return v[2:].lower()
        return v.lower()


class ZcashAttestationResponse(BaseModel):
    success: bool
    audit_attestation_token: str
    solana_nullifier: str
    invoice_commitment: str


class ZcashVerifyRequest(BaseModel):
    viewing_key_hex: str = Field(..., min_length=32)
    solana_nullifier_hex: str = Field(..., min_length=64, max_length=66)
    invoice_commitment_hex: str = Field(..., min_length=64, max_length=66)
    expected_token: str = Field(..., min_length=64, max_length=64)

    @field_validator("solana_nullifier_hex", "invoice_commitment_hex")
    @classmethod
    def clean_hex(cls, v: str) -> str:
        if v.startswith("0x") or v.startswith("0X"):
            return v[2:].lower()
        return v.lower()


class ZcashVerifyResponse(BaseModel):
    success: bool
    audit_status: str
    viewing_key_masked: str
    solana_nullifier: str
    invoice_commitment: str
    message: str


@router.post("/zcash-audit/generate-attestation", response_model=ZcashAttestationResponse)
def create_zcash_attestation(payload: ZcashAttestationRequest):
    """Generates an HMAC-SHA256 attestation bound to a corporate Zcash Viewing Key."""
    try:
        ivk_bytes = parse_zcash_viewing_key(payload.viewing_key_hex)
        token = generate_zcash_audit_attestation(
            ivk_bytes=ivk_bytes,
            solana_nullifier_hex=payload.solana_nullifier_hex,
            invoice_commitment_hex=payload.invoice_commitment_hex
        )
        return ZcashAttestationResponse(
            success=True,
            audit_attestation_token=token,
            solana_nullifier=payload.solana_nullifier_hex,
            invoice_commitment=payload.invoice_commitment_hex
        )
    except ZcashAuditError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Viewing key parsing error: {str(e)}"
        )


@router.post("/zcash-audit/verify-attestation", response_model=ZcashVerifyResponse)
def verify_zcash_attestation(payload: ZcashVerifyRequest):
    """Verifies a Zcash viewing-key selective disclosure attestation for institutional audit."""
    try:
        report = verify_zcash_audit_attestation(
            raw_ivk=payload.viewing_key_hex,
            solana_nullifier_hex=payload.solana_nullifier_hex,
            invoice_commitment_hex=payload.invoice_commitment_hex,
            expected_token=payload.expected_token
        )
        return ZcashVerifyResponse(
            success=True,
            audit_status=report["audit_status"],
            viewing_key_masked=report["viewing_key_masked"],
            solana_nullifier=report["solana_nullifier"],
            invoice_commitment=report["invoice_commitment"],
            message="Institutional audit attestation successfully validated."
        )
    except ZcashAuditError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Audit verification failed: {str(e)}"
        )


# ----------------------------------------------------------------------
# 3. TOKEN-2022 SHIELDED BALANCE DECRYPTION (TASK-503)
# ----------------------------------------------------------------------

class ShieldedAuditRequest(BaseModel):
    invoice_id_hash: str = Field(..., min_length=32, json_schema_extra={"example": "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90"})
    ciphertext_lo_hex: str = Field(..., min_length=32, json_schema_extra={"example": "12345678" * 8})
    ciphertext_hi_hex: str = Field(..., min_length=32, json_schema_extra={"example": "abcdef01" * 8})
    commitment_hex: str = Field(..., min_length=32, json_schema_extra={"example": "99887766" * 8})
    auditor_viewing_key_hex: str = Field(..., min_length=32, json_schema_extra={"example": "f0e1d2c3" * 8})
    auditor_org_name: str = Field(..., min_length=3, json_schema_extra={"example": "PwC Global Trade Audit Desk"})
    expected_face_value_hint: Optional[float] = Field(default=None, gt=0, json_schema_extra={"example": 150000.0})


ShieldedAuditRequest.model_rebuild()


@router.post("/shielded/decrypt-balance")
def decrypt_shielded_balance(payload: ShieldedAuditRequest):
    """Scoped institutional auditor decryption of Token-2022 confidential balance."""
    try:
        report = audit_confidential_balance(
            invoice_id_hash=payload.invoice_id_hash,
            ciphertext_lo_hex=payload.ciphertext_lo_hex,
            ciphertext_hi_hex=payload.ciphertext_hi_hex,
            commitment_hex=payload.commitment_hex,
            auditor_viewing_key_hex=payload.auditor_viewing_key_hex,
            auditor_org_name=payload.auditor_org_name,
            expected_face_value_hint=payload.expected_face_value_hint
        )
        return report
    except ShieldedDecryptError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Shielded Decryption Error: {str(e)}"
        )

