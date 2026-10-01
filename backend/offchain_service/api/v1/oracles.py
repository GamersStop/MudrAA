"""
MudrAA Oracle Gateway API - Sumant External Oracle Services
Exposes:
1. Sovereign Tax Clearance & Cooldown Check (TASK-401)
2. DCSA eBL Maritime Carrier Departure Telemetry (TASK-402)
3. Marine Cargo Insurance Subrogation Validator (TASK-403)
4. Pyth Network FX Rate-Lock & Dynamic Haircut Calculator (TASK-404)
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from core.tax_oracle import evaluate_tax_clearance, TaxOracleError
from core.carrier_oracle import verify_carrier_telemetry, CarrierOracleError
from core.insurance_oracle import evaluate_marine_insurance_policy, InsuranceOracleError
from core.pyth_oracle import evaluate_pyth_fx_rate, PythOracleError

router = APIRouter(prefix="/oracles", tags=["Sumant External Oracles"])


# ----------------------------------------------------------------------
# 1. TAX CLEARANCE SCHEMAS & ENDPOINTS
# ----------------------------------------------------------------------

class TaxClearanceRequest(BaseModel):
    irn: str = Field(..., min_length=16, max_length=66, json_schema_extra={"example": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"})
    irn_generation_timestamp: int = Field(..., gt=0, json_schema_extra={"example": 1727700000})
    is_cancelled: bool = Field(default=False)


@router.post("/tax-clearance")
def check_tax_clearance(payload: TaxClearanceRequest):
    """Evaluates IRN clearance and enforces the 25-hour statutory cancellation cooldown."""
    try:
        report = evaluate_tax_clearance(
            irn=payload.irn,
            irn_generation_timestamp=payload.irn_generation_timestamp,
            is_cancelled_on_portal=payload.is_cancelled
        )
        return report
    except TaxOracleError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tax Clearance Error: {str(e)}"
        )


# ----------------------------------------------------------------------
# 2. CARRIER TELEMETRY SCHEMAS & ENDPOINTS
# ----------------------------------------------------------------------

class CarrierTelemetryRequest(BaseModel):
    carrier_code: str = Field(..., min_length=2, max_length=20, json_schema_extra={"example": "MAERSK"})
    bill_of_lading: str = Field(..., min_length=5, max_length=50, json_schema_extra={"example": "BL-MAERSK-902110"})
    container_id: str = Field(..., min_length=5, max_length=30, json_schema_extra={"example": "MSKU9021108"})
    milestone: str = Field(..., min_length=5, max_length=30, json_schema_extra={"example": "VESSEL_DEPARTED"})
    departure_timestamp: int = Field(..., gt=0, json_schema_extra={"example": 1727750000})
    carrier_signature_hex: str = Field(..., min_length=128, max_length=130)


@router.post("/carrier-telemetry")
def verify_freight_telemetry(payload: CarrierTelemetryRequest):
    """Verifies maritime cargo transit against authorized carrier allowlists."""
    try:
        report = verify_carrier_telemetry(
            carrier_code=payload.carrier_code,
            bill_of_lading=payload.bill_of_lading,
            container_id=payload.container_id,
            milestone=payload.milestone,
            departure_timestamp=payload.departure_timestamp,
            carrier_signature_hex=payload.carrier_signature_hex
        )
        return report
    except CarrierOracleError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Carrier Verification Error: {str(e)}"
        )


# ----------------------------------------------------------------------
# 3. MARINE CARGO INSURANCE SCHEMAS & ENDPOINTS
# ----------------------------------------------------------------------

class InsurancePolicyRequest(BaseModel):
    underwriter_code: str = Field(..., json_schema_extra={"example": "LLOYDS_LONDON"})
    policy_number: str = Field(..., min_length=5, json_schema_extra={"example": "POL-LLOYDS-2026-902"})
    invoice_id_hash: str = Field(..., min_length=64, max_length=66)
    invoice_face_value: float = Field(..., gt=0, json_schema_extra={"example": 150000.0})
    insured_coverage_amount: float = Field(..., gt=0, json_schema_extra={"example": 165000.0}) # 110%
    loss_payee_pubkey: str = Field(..., min_length=32, max_length=44)
    expected_vault_pubkey: str = Field(..., min_length=32, max_length=44)
    underwriter_signature_hex: str = Field(..., min_length=128, max_length=130)


@router.post("/insurance-policy")
def verify_cargo_insurance(payload: InsurancePolicyRequest):
    """Verifies cargo policy 110% coverage and loss-payee subrogation to MudrAA vault."""
    try:
        report = evaluate_marine_insurance_policy(
            underwriter_code=payload.underwriter_code,
            policy_number=payload.policy_number,
            invoice_id_hash=payload.invoice_id_hash,
            invoice_face_value=payload.invoice_face_value,
            insured_coverage_amount=payload.insured_coverage_amount,
            loss_payee_pubkey=payload.loss_payee_pubkey,
            expected_vault_pubkey=payload.expected_vault_pubkey,
            underwriter_signature_hex=payload.underwriter_signature_hex
        )
        return report
    except InsuranceOracleError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insurance Policy Error: {str(e)}"
        )


# ----------------------------------------------------------------------
# 4. PYTH FX RATE SCHEMAS & ENDPOINTS
# ----------------------------------------------------------------------

class PythFxRequest(BaseModel):
    currency_pair: str = Field(..., min_length=3, max_length=10, json_schema_extra={"example": "EUR/USD"})
    raw_price: float = Field(..., gt=0, json_schema_extra={"example": 1.0850})
    confidence: float = Field(..., gt=0, json_schema_extra={"example": 0.0004})
    feed_publish_timestamp: int = Field(..., gt=0)
    tenor_days: int = Field(default=60, gt=0, le=365)


@router.post("/pyth-fx")
def get_pyth_fx_lock(payload: PythFxRequest):
    """Evaluates Pyth price confidence, checks freshness, and locks dynamic FX haircut buffer."""
    try:
        report = evaluate_pyth_fx_rate(
            currency_pair=payload.currency_pair,
            raw_price=payload.raw_price,
            confidence=payload.confidence,
            feed_publish_timestamp=payload.feed_publish_timestamp,
            tenor_days=payload.tenor_days
        )
        return report
    except PythOracleError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Pyth Oracle Error: {str(e)}"
        )
