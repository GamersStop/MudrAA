"""
MudrAA Offchain Relayer - Relational Data Models & Encryption Helpers
Implements the 4 core entities from prd.md (L306-L343) & architecture.md Section 5.1.
Adheres to rule.md Section 4: Strict validation, parameterized storage, AES-256 encryption at rest.
"""

import os
import uuid
import base64
import json
from datetime import datetime, date, timezone
from enum import Enum
from typing import Optional, Dict, Any, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, DateTime, Index
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# Environment-configurable 256-bit symmetric encryption key for data-at-rest protection
ENCRYPTION_KEY_RAW = os.getenv("METADATA_ENCRYPTION_KEY", "mudraa_dev_aes256_secret_key_32b!")
if len(ENCRYPTION_KEY_RAW.encode("utf-8")) < 32:
    ENCRYPTION_KEY = ENCRYPTION_KEY_RAW.encode("utf-8").ljust(32, b"0")[:32]
else:
    ENCRYPTION_KEY = ENCRYPTION_KEY_RAW.encode("utf-8")[:32]


def encrypt_payload(data: Dict[str, Any]) -> str:
    """Encrypts sensitive commercial metadata using AES-256-GCM before database write (Threat D.2)."""
    aesgcm = AESGCM(ENCRYPTION_KEY)
    nonce = os.urandom(12)
    plaintext = json.dumps(data, sort_keys=True).encode("utf-8")
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    # Store nonce + ciphertext encoded in Base64
    return base64.b64encode(nonce + ciphertext).decode("utf-8")


def decrypt_payload(encrypted_str: str) -> Dict[str, Any]:
    """Decrypts commercial metadata using AES-256-GCM with authentication check."""
    raw = base64.b64decode(encrypted_str)
    nonce, ciphertext = raw[:12], raw[12:]
    aesgcm = AESGCM(ENCRYPTION_KEY)
    decrypted_bytes = aesgcm.decrypt(nonce, ciphertext, None)
    return json.loads(decrypted_bytes.decode("utf-8"))


class EnterpriseRole(str, Enum):
    EXPORTER = "EXPORTER"
    IMPORTER = "IMPORTER"
    LIQUIDITY_PROVIDER = "LIQUIDITY_PROVIDER"
    AUDITOR = "AUDITOR"


class KybStatus(str, Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    SUSPENDED = "SUSPENDED"
    REJECTED = "REJECTED"


class InvoiceStatus(str, Enum):
    PENDING_ATTESTATION = "PENDING_ATTESTATION"
    PROVED = "PROVED"
    ONCHAIN_SUBMITTED = "ONCHAIN_SUBMITTED"
    FUNDED = "FUNDED"
    PARTIALLY_SETTLED = "PARTIALLY_SETTLED"
    REPAID = "REPAID"
    DELINQUENT = "DELINQUENT"
    DEFAULTED = "DEFAULTED"


class CarrierStatus(str, Enum):
    CARGO_RECEIVED = "CARGO_RECEIVED"
    IN_TRANSIT = "IN_TRANSIT"
    VESSEL_DEPARTED = "VESSEL_DEPARTED"
    CUSTOMS_CLEARED = "CUSTOMS_CLEARED"
    DELIVERED = "DELIVERED"


class Enterprise(SQLModel, table=True):
    __tablename__ = "enterprises"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    wallet_address: str = Field(
        max_length=44,
        unique=True,
        index=True,
        nullable=False,
        description="Solana Base58 Wallet Address"
    )
    role: EnterpriseRole = Field(
        default=EnterpriseRole.EXPORTER,
        nullable=False
    )
    company_name: str = Field(
        max_length=255,
        nullable=False
    )
    jurisdiction: str = Field(
        max_length=3,
        nullable=False,
        description="ISO 3166-1 alpha-3 Country Code"
    )
    business_reg_hash: bytes = Field(
        nullable=False,
        description="Salted SHA-256 hash of corporate tax/KYB documentation"
    )
    kyb_status: KybStatus = Field(
        default=KybStatus.PENDING,
        nullable=False
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )

    # Relationships
    invoices: List["Invoice"] = Relationship(back_populates="exporter")


class Invoice(SQLModel, table=True):
    __tablename__ = "invoices"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    exporter_id: uuid.UUID = Field(
        foreign_key="enterprises.id",
        nullable=False,
        index=True
    )
    importer_wallet: str = Field(
        max_length=44,
        nullable=False,
        description="Buyer Solana Wallet Address"
    )
    invoice_identifier_hash: bytes = Field(
        unique=True,
        index=True,
        nullable=False,
        description="Canonical RFC 8785 SHA-256 Digest rejecting duplicate ingestion"
    )
    encrypted_commercial_metadata: str = Field(
        nullable=False,
        description="AES-256-GCM encrypted commercial payload"
    )
    face_value: float = Field(
        gt=0,
        nullable=False,
        description="Face value in currency base units"
    )
    currency: str = Field(
        default="USD",
        max_length=10,
        nullable=False
    )
    due_date: date = Field(
        nullable=False
    )
    zk_commitment: bytes = Field(
        nullable=False,
        description="Poseidon hash commitment published on-chain"
    )
    nullifier_hash: bytes = Field(
        unique=True,
        index=True,
        nullable=False,
        description="Poseidon nullifier preventing double-pledge replay"
    )
    status: InvoiceStatus = Field(
        default=InvoiceStatus.PENDING_ATTESTATION,
        nullable=False
    )
    solana_tx_signature: Optional[str] = Field(
        default=None,
        max_length=88,
        nullable=True
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )

    # Relationships
    exporter: Enterprise = Relationship(back_populates="invoices")
    telemetry: List["CarrierTelemetry"] = Relationship(back_populates="invoice")
    proof_manifests: List["ZkProofManifest"] = Relationship(back_populates="invoice")


class CarrierTelemetry(SQLModel, table=True):
    __tablename__ = "carrier_telemetry"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    invoice_id: uuid.UUID = Field(
        foreign_key="invoices.id",
        nullable=False,
        index=True
    )
    carrier_code: str = Field(
        max_length=50,
        nullable=False,
        description="Carrier code (e.g. MAERSK, MSC, DHL)"
    )
    bill_of_lading: str = Field(
        max_length=100,
        nullable=False,
        description="Electronic Bill of Lading (eBL) Identifier"
    )
    vessel_departure_timestamp: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True)
    )
    current_status: CarrierStatus = Field(
        default=CarrierStatus.CARGO_RECEIVED,
        nullable=False
    )
    carrier_signature: bytes = Field(
        nullable=False,
        description="Ed25519 signature from allowlisted carrier key"
    )
    verified_on_chain: bool = Field(
        default=False,
        nullable=False
    )
    last_polled_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )

    # Relationships
    invoice: Invoice = Relationship(back_populates="telemetry")


class ZkProofManifest(SQLModel, table=True):
    __tablename__ = "zk_proof_manifests"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    invoice_id: uuid.UUID = Field(
        foreign_key="invoices.id",
        nullable=False,
        index=True
    )
    proof_a: bytes = Field(
        nullable=False,
        description="Groth16 G1 point A (64 bytes)"
    )
    proof_b: bytes = Field(
        nullable=False,
        description="Groth16 G2 point B (128 bytes)"
    )
    proof_c: bytes = Field(
        nullable=False,
        description="Groth16 G1 point C (64 bytes)"
    )
    public_inputs_json: str = Field(
        nullable=False,
        description="JSON serialized public inputs array"
    )
    solana_slot_verified: Optional[int] = Field(
        default=None,
        nullable=True
    )
    verified_on_chain: bool = Field(
        default=False,
        nullable=False
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )

    # Relationships
    invoice: Invoice = Relationship(back_populates="proof_manifests")
