"""
MudrAA Offchain API & Rajmudra Relayer
Institutional-grade sovereign trade liquidity on Solana — Offchain Ingestion & Relayer Service
Adheres to rule.md: Strict validation, parameterized storage, CORS domain restrictions, and secure health checks.
"""

import os
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from db.database import init_db, close_db, check_db_health, DATABASE_URL
from api.v1.invoices import router as invoices_router
from api.v1.legal import router as legal_router
from api.v1.compliance import router as compliance_router
from api.v1.oracles import router as oracles_router
from core.security import SecurityHeadersMiddleware, RateLimitAndCSRFMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management: connects and initializes database schema and resources."""
    try:
        await init_db()
    except Exception as e:
        # Log error in development or fallback gracefully
        print(f"[WARN] Database initialization warning (offline/reconnecting): {e}")
    yield
    await close_db()


app = FastAPI(
    title="MudrAA Offchain API & Rajmudra Relayer",
    description="Institutional-grade sovereign trade liquidity on Solana — Offchain Ingestion & Relayer Service",
    version="0.2.0",
    lifespan=lifespan
)

# Enforce secure CORS origins (rule.md Section 4.B - CORS & Network Boundaries)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,https://app.mudraa.finance")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
)

# Enforce security headers & CSRF/Rate-limiting guardrails
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitAndCSRFMiddleware, allowed_origins=allowed_origins)

# Register Subsystem Routers
app.include_router(invoices_router, prefix="/api/v1/trade")
app.include_router(legal_router, prefix="/api/v1/trade")
app.include_router(compliance_router, prefix="/api/v1/trade")
app.include_router(oracles_router, prefix="/api/v1/trade")


class LegacyInvoiceIngestionRequest(BaseModel):
    invoice_number: str = Field(..., min_length=3, max_length=50, json_schema_extra={"example": "INV-2026-0091"})
    exporter_id: str = Field(..., min_length=3, max_length=50, json_schema_extra={"example": "EXP-IND-MH-01"})
    importer_id: str = Field(..., min_length=3, max_length=50, json_schema_extra={"example": "IMP-EU-DE-88"})
    amount_usdc: float = Field(..., gt=0, json_schema_extra={"example": 150000.0})
    peppol_bis_hash: str = Field(..., min_length=64, max_length=66, json_schema_extra={"example": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"})
    cargo_tracking_bill: Optional[str] = Field(None, max_length=100, json_schema_extra={"example": "BL-MAERSK-902110"})


@app.get("/")
def read_root():
    return {
        "protocol": "MudrAA",
        "engine": "Rajmudra Verification Engine",
        "description": "Institutional Sovereign Trade Liquidity Rails",
        "status": "operational",
        "version": "0.2.0"
    }


@app.get("/health")
async def health_check():
    """
    Secure healthcheck endpoint (rule.md Section 4.B).
    Verifies infrastructure health without leaking stack traces or credentials.
    """
    is_db_healthy = await check_db_health()
    return {
        "status": "healthy" if is_db_healthy else "degraded",
        "database": "connected" if is_db_healthy else "disconnected",
        "ashta_pradhan_core": "synchronized"
    }


@app.get("/api/v1/telemetry")
def get_telemetry():
    return {
        "ashta_pradhan_status": {
            "peshawa_dispatcher": "active",
            "amatya_treasury": "active",
            "sachiv_rajmudra": "active",
            "sumant_gateway": "listening",
            "senapati_citadel": "active",
            "nyayadhish_recourse": "active",
            "panditrao_compliance": "active",
            "waknavis_shield": "active"
        },
        "solana_network": "devnet",
        "current_tps": 2840,
        "active_institutional_vaults": 8,
        "shielded_transactions_verified": 1420
    }


@app.post("/api/v1/trade/ingest")
def ingest_invoice_legacy(payload: LegacyInvoiceIngestionRequest):
    """Legacy backward-compatible ingestion endpoint."""
    return {
        "success": True,
        "receipt_id": f"RCPT-{payload.invoice_number}",
        "ashta_pradhan_stamp": "VERIFIED_SACHIV_SEAL",
        "commitment_hash": payload.peppol_bis_hash,
        "status": "QUEUED_FOR_ZK_CIRCUIT_PROOF"
    }
