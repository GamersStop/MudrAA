"""
MudrAA Legal Recourse API - Nyayadhish Escrow Router
Handles submission and verification of dual-signed Notice of Assignment (NOA) and Waiver of Set-Off.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from core.legal_escrow import verify_dual_signed_escrow, LegalEscrowError

router = APIRouter(prefix="/legal", tags=["Legal Escrow"])


class DualSignEscrowRequest(BaseModel):
    invoice_digest_hex: str = Field(
        ...,
        min_length=64,
        max_length=66,
        pattern=r"^(0x)?[0-9a-fA-F]{64}$",
        description="32-byte canonical invoice digest in hex"
    )
    vault_pubkey: str = Field(
        ...,
        min_length=32,
        max_length=44,
        pattern=r"^[1-9A-HJ-NP-za-km-z]{32,44}$",
        description="MudrAA Solana Program Vault Public Key"
    )
    supplier_pubkey_hex: str = Field(
        ...,
        min_length=64,
        max_length=66,
        pattern=r"^(0x)?[0-9a-fA-F]{64}$",
        description="Supplier Ed25519 32-byte public key in hex"
    )
    supplier_signature_hex: str = Field(
        ...,
        min_length=128,
        max_length=130,
        pattern=r"^(0x)?[0-9a-fA-F]{128}$",
        description="Supplier Ed25519 64-byte NOA signature in hex"
    )
    buyer_pubkey_hex: str = Field(
        ...,
        min_length=64,
        max_length=66,
        pattern=r"^(0x)?[0-9a-fA-F]{64}$",
        description="Corporate Buyer Ed25519 32-byte public key in hex"
    )
    buyer_signature_hex: str = Field(
        ...,
        min_length=128,
        max_length=130,
        pattern=r"^(0x)?[0-9a-fA-F]{128}$",
        description="Corporate Buyer Ed25519 64-byte Waiver-of-Setoff signature in hex"
    )

    @field_validator(
        "invoice_digest_hex",
        "supplier_pubkey_hex",
        "supplier_signature_hex",
        "buyer_pubkey_hex",
        "buyer_signature_hex"
    )
    @classmethod
    def clean_hex(cls, v: str) -> str:
        if v.startswith("0x") or v.startswith("0X"):
            return v[2:].lower()
        return v.lower()


class DualSignEscrowResponse(BaseModel):
    success: bool
    mletr_status: str
    invoice_digest: str
    vault_pubkey: str
    supplier_verified: bool
    buyer_waiver_verified: bool
    governing_law: str
    lockbox_settlement_mandatory: bool
    message: str


@router.post("/verify-escrow", response_model=DualSignEscrowResponse)
async def verify_escrow_signatures(payload: DualSignEscrowRequest):
    """
    Verifies dual-signed Notice of Assignment (NOA) and irrevocable Waiver of Set-Off.
    Ensures that receivable legal perfection adheres to UNCITRAL MLETR and UCC-1.
    """
    try:
        manifest = verify_dual_signed_escrow(
            invoice_digest_hex=payload.invoice_digest_hex,
            vault_pubkey=payload.vault_pubkey,
            supplier_pubkey_bytes=bytes.fromhex(payload.supplier_pubkey_hex),
            supplier_signature_bytes=bytes.fromhex(payload.supplier_signature_hex),
            buyer_pubkey_bytes=bytes.fromhex(payload.buyer_pubkey_hex),
            buyer_signature_bytes=bytes.fromhex(payload.buyer_signature_hex)
        )
        return DualSignEscrowResponse(
            success=True,
            mletr_status=manifest["mletr_status"],
            invoice_digest=manifest["invoice_digest"],
            vault_pubkey=manifest["vault_pubkey"],
            supplier_verified=manifest["supplier_verified"],
            buyer_waiver_verified=manifest["buyer_waiver_verified"],
            governing_law=manifest["governing_law"],
            lockbox_settlement_mandatory=manifest["lockbox_settlement_mandatory"],
            message="Dual-signed assignment and waiver of set-off cryptographically perfected."
        )
    except LegalEscrowError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Legal escrow verification failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cryptographic error verifying legal escrow: {str(e)}"
        )
