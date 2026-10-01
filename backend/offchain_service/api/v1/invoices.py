"""
MudrAA Ingestion API - Invoices Router
Handles Peppol BIS 3.0 UBL/XML ingestion, RFC 8785 canonicalization, and encrypted persistence.
Adheres to rule.md Section 4: Strict Pydantic v2 validation, parameterized queries, and zero data leakage.
"""

import os
import uuid
from datetime import datetime, date, timezone
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from db.database import get_db_session
from db.models import Invoice, Enterprise, EnterpriseRole, KybStatus, InvoiceStatus, encrypt_payload
from core.canonical import normalize_peppol_invoice, PeppolParseError, rfc8785_canonicalize, compute_canonical_hash

router = APIRouter(prefix="/invoices", tags=["Invoices"])


class IngestXmlRequest(BaseModel):
    xml_content: str = Field(..., min_length=50, description="Peppol BIS 3.0 UBL XML string")
    exporter_wallet: str = Field(..., min_length=32, max_length=44, pattern=r"^[1-9A-HJ-NP-za-km-z]{32,44}$")
    importer_wallet: str = Field(..., min_length=32, max_length=44, pattern=r"^[1-9A-HJ-NP-za-km-z]{32,44}$")
    zk_commitment_hex: str = Field(
        ...,
        min_length=64,
        max_length=66,
        pattern=r"^(0x)?[0-9a-fA-F]{64}$",
        description="Poseidon hash commitment (32 bytes hex)"
    )
    nullifier_hex: str = Field(
        ...,
        min_length=64,
        max_length=66,
        pattern=r"^(0x)?[0-9a-fA-F]{64}$",
        description="Poseidon nullifier (32 bytes hex)"
    )

    @field_validator("zk_commitment_hex", "nullifier_hex")
    @classmethod
    def clean_hex(cls, v: str) -> str:
        if v.startswith("0x") or v.startswith("0X"):
            return v[2:].lower()
        return v.lower()


class IngestResponse(BaseModel):
    success: bool
    invoice_id: str
    invoice_number: str
    invoice_identifier_hash: str
    canonical_byte_length: int
    face_value: float
    currency: str
    due_date: str
    status: str
    message: str


class InvoiceDetailResponse(BaseModel):
    id: str
    importer_wallet: str
    invoice_identifier_hash: str
    face_value: float
    currency: str
    due_date: str
    status: str
    created_at: str


@router.post("/ingest-xml", response_model=IngestResponse, status_code=status.HTTP_201_CREATED)
async def ingest_peppol_xml(
    payload: IngestXmlRequest,
    session: AsyncSession = Depends(get_db_session)
):
    """
    Ingests, validates, normalizes, and securely stores an institutional Peppol BIS 3.0 invoice.
    Enforces RFC 8785 canonical hashing and prevents duplicate ingestion attacks.
    """
    # 1. Parse and canonicalize Peppol XML
    try:
        parsed_data, canonical_bytes, canonical_hex_hash = normalize_peppol_invoice(payload.xml_content)
    except PeppolParseError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Peppol BIS 3.0 validation error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Malformed invoice XML payload: {str(e)}"
        )

    # 2. Check for duplicate invoice identifier hash in DB (Threat A.1 defense)
    canon_bytes_hash = bytes.fromhex(canonical_hex_hash)
    stmt_check = select(Invoice).where(Invoice.invoice_identifier_hash == canon_bytes_hash)
    result_check = await session.execute(stmt_check)
    existing_invoice = result_check.scalars().first()
    if existing_invoice:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": "DuplicateInvoicePledgeDetected",
                "message": "This canonical invoice receivable has already been ingested into MudrAA.",
                "existing_invoice_id": str(existing_invoice.id),
                "invoice_identifier_hash": canonical_hex_hash
            }
        )

    # 3. Check or auto-register Exporter Enterprise
    stmt_exp = select(Enterprise).where(Enterprise.wallet_address == payload.exporter_wallet)
    result_exp = await session.execute(stmt_exp)
    exporter = result_exp.scalars().first()
    if not exporter:
        # Register new enterprise entity
        exporter = Enterprise(
            wallet_address=payload.exporter_wallet,
            role=EnterpriseRole.EXPORTER,
            company_name=parsed_data["supplier"]["legal_name"] or "Sovereign Exporter",
            jurisdiction="IND",
            business_reg_hash=bytes.fromhex("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),
            kyb_status=KybStatus.PENDING
        )
        session.add(exporter)
        await session.flush()

    # 4. Encrypt commercial metadata at rest (AES-256-GCM)
    encrypted_commercial = encrypt_payload({
        "supplier": parsed_data["supplier"],
        "buyer": parsed_data["buyer"],
        "line_items": parsed_data["line_items"],
        "issue_date": parsed_data["issue_date"],
        "raw_canonical_digest": canonical_hex_hash
    })

    # 5. Parse due date safely
    try:
        due_date_obj = date.fromisoformat(parsed_data["due_date"])
    except (ValueError, TypeError):
        due_date_obj = date.today()

    # 6. Insert new Invoice Record
    new_invoice = Invoice(
        exporter_id=exporter.id,
        importer_wallet=payload.importer_wallet,
        invoice_identifier_hash=canon_bytes_hash,
        encrypted_commercial_metadata=encrypted_commercial,
        face_value=parsed_data["payable_amount"],
        currency=parsed_data["currency"],
        due_date=due_date_obj,
        zk_commitment=bytes.fromhex(payload.zk_commitment_hex),
        nullifier_hash=bytes.fromhex(payload.nullifier_hex),
        status=InvoiceStatus.PENDING_ATTESTATION
    )
    session.add(new_invoice)
    await session.commit()
    await session.refresh(new_invoice)

    return IngestResponse(
        success=True,
        invoice_id=str(new_invoice.id),
        invoice_number=parsed_data["invoice_id"],
        invoice_identifier_hash=canonical_hex_hash,
        canonical_byte_length=len(canonical_bytes),
        face_value=new_invoice.face_value,
        currency=new_invoice.currency,
        due_date=str(new_invoice.due_date),
        status=new_invoice.status.value,
        message="Invoice successfully normalized, encrypted, and registered in MudrAA."
    )


@router.get("/{invoice_id}", response_model=InvoiceDetailResponse)
async def get_invoice_by_id(
    invoice_id: uuid.UUID,
    session: AsyncSession = Depends(get_db_session)
):
    """Retrieves high-level invoice metadata without leaking commercial secrets."""
    stmt = select(Invoice).where(Invoice.id == invoice_id)
    result = await session.execute(stmt)
    invoice = result.scalars().first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice with ID {invoice_id} not found"
        )

    return InvoiceDetailResponse(
        id=str(invoice.id),
        importer_wallet=invoice.importer_wallet,
        invoice_identifier_hash=invoice.invoice_identifier_hash.hex(),
        face_value=invoice.face_value,
        currency=invoice.currency,
        due_date=str(invoice.due_date),
        status=invoice.status.value,
        created_at=invoice.created_at.isoformat()
    )
