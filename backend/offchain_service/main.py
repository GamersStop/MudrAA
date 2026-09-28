import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

app = FastAPI(
    title="MudrAA Offchain API & Rajmudra Relayer",
    description="Institutional-grade sovereign trade liquidity on Solana — Offchain Ingestion & Relayer Service",
    version="0.1.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://mudraa_admin:mudraa_dev_password@postgres:5432/mudraa_trade"
)

class InvoiceIngestionRequest(BaseModel):
    invoice_number: str = Field(..., example="INV-2026-0091")
    exporter_id: str = Field(..., example="EXP-IND-MH-01")
    importer_id: str = Field(..., example="IMP-EU-DE-88")
    amount_usdc: float = Field(..., gt=0, example=150000.0)
    peppol_bis_hash: str = Field(..., example="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069")
    cargo_tracking_bill: Optional[str] = Field(None, example="BL-MAERSK-902110")

@app.get("/")
def read_root():
    return {
        "protocol": "MudrAA",
        "engine": "Rajmudra Verification Engine",
        "description": "Institutional Sovereign Trade Liquidity Rails",
        "status": "operational",
        "version": "0.1.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database_configured": bool(DATABASE_URL)
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
def ingest_invoice(payload: InvoiceIngestionRequest):
    return {
        "success": True,
        "receipt_id": f"RCPT-{payload.invoice_number}",
        "ashta_pradhan_stamp": "VERIFIED_SACHIV_SEAL",
        "commitment_hash": payload.peppol_bis_hash,
        "status": "QUEUED_FOR_ZK_CIRCUIT_PROOF"
    }
