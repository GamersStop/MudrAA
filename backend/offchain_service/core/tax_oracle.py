"""
MudrAA Tax Oracle - Sumant Sovereign Tax Clearance Subsystem
Mitigates Threat C.2: Tax IRN Cancellation Race Condition.
Enforces 24-hour statutory cancellation cooldown + 1-hour safety buffer (25h total)
before permitting on-chain collateral financing.
"""

import time
import hashlib
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature

STATUTORY_CANCEL_WINDOW_SECONDS = 24 * 3600  # 24 hours
SAFETY_BUFFER_SECONDS = 1 * 3600            # 1 hour safety margin
TOTAL_COOLDOWN_SECONDS = STATUTORY_CANCEL_WINDOW_SECONDS + SAFETY_BUFFER_SECONDS  # 25 hours

# Dedicated Ed25519 Keypair for the Sumant Tax Oracle (Persistent Key Management)
import os
_KEY_ENV = os.getenv("SUMANT_TAX_ORACLE_KEY_HEX")
if _KEY_ENV and len(_KEY_ENV) == 64:
    _ORACLE_PRIVATE_KEY = ed25519.Ed25519PrivateKey.from_private_bytes(bytes.fromhex(_KEY_ENV))
else:
    # Deterministic persistent seed preventing key drift across service restarts
    _DETERMINISTIC_SEED = hashlib.sha256(b"mudraa_tax_oracle_master_seed_v1").digest()
    _ORACLE_PRIVATE_KEY = ed25519.Ed25519PrivateKey.from_private_bytes(_DETERMINISTIC_SEED)

ORACLE_PUBLIC_KEY = _ORACLE_PRIVATE_KEY.public_key()
ORACLE_PUBLIC_KEY_BYTES = ORACLE_PUBLIC_KEY.public_bytes_raw()
ORACLE_PUBLIC_KEY_HEX = ORACLE_PUBLIC_KEY_BYTES.hex()


class TaxOracleError(Exception):
    """Raised when tax clearance fails verification or cooldown constraints."""
    pass


def construct_tax_attestation_digest(
    irn_hex: str,
    generation_timestamp: int,
    status_tag: str = "TAX_CLEARED"
) -> bytes:
    """Constructs canonical 32-byte digest for tax oracle attestation."""
    raw = f"{irn_hex.lower()}:{generation_timestamp}:{status_tag}".encode("utf-8")
    return hashlib.sha256(raw).digest()


def evaluate_tax_clearance(
    irn: str,
    irn_generation_timestamp: int,
    current_timestamp: Optional[int] = None,
    is_cancelled_on_portal: bool = False
) -> Dict[str, Any]:
    """
    Evaluates government IRN clearance.
    Enforces mandatory 25-hour elapsed cooldown to eliminate cancellation race conditions.
    """
    if current_timestamp is None:
        current_timestamp = int(time.time())

    cleaned_irn = irn.strip()
    if cleaned_irn.startswith("0x") or cleaned_irn.startswith("0X"):
        cleaned_irn = cleaned_irn[2:]

    if len(cleaned_irn) < 16:
        raise TaxOracleError("Invalid IRN format: Invoice Reference Number too short")

    if is_cancelled_on_portal:
        raise TaxOracleError(
            f"Tax Portal Alert: Invoice {cleaned_irn} was cancelled by seller. Financing prohibited."
        )

    elapsed_seconds = current_timestamp - irn_generation_timestamp
    if elapsed_seconds < 0:
        raise TaxOracleError("Invalid IRN timestamp: generation date is in the future")

    if elapsed_seconds < TOTAL_COOLDOWN_SECONDS:
        remaining_seconds = TOTAL_COOLDOWN_SECONDS - elapsed_seconds
        remaining_hours = round(remaining_seconds / 3600, 2)
        return {
            "status": "COOLING_PERIOD_ACTIVE",
            "is_cleared": False,
            "irn": cleaned_irn,
            "elapsed_hours": round(elapsed_seconds / 3600, 2),
            "remaining_cooldown_hours": remaining_hours,
            "message": f"Statutory cancellation window still open. Financing locked for {remaining_hours} more hours.",
            "oracle_signature_hex": None,
            "oracle_pubkey_hex": ORACLE_PUBLIC_KEY_HEX,
        }

    # 25-hour cooldown elapsed: sign official tax clearance attestation
    digest = construct_tax_attestation_digest(cleaned_irn, irn_generation_timestamp, "TAX_CLEARED")
    signature = _ORACLE_PRIVATE_KEY.sign(digest)

    return {
        "status": "STATUTORY_CLEARED",
        "is_cleared": True,
        "irn": cleaned_irn,
        "elapsed_hours": round(elapsed_seconds / 3600, 2),
        "cooldown_satisfied": True,
        "message": "Statutory cancellation window elapsed. Government tax clearance confirmed.",
        "oracle_signature_hex": signature.hex(),
        "oracle_pubkey_hex": ORACLE_PUBLIC_KEY_HEX,
        "cleared_at_timestamp": current_timestamp,
    }


def verify_tax_oracle_attestation(
    irn_hex: str,
    generation_timestamp: int,
    signature_hex: str,
    oracle_pubkey_hex: Optional[str] = None
) -> bool:
    """Verifies the Ed25519 signature of the Tax Oracle."""
    pubkey_bytes = bytes.fromhex(oracle_pubkey_hex) if oracle_pubkey_hex else ORACLE_PUBLIC_KEY_BYTES
    sig_bytes = bytes.fromhex(signature_hex)
    digest = construct_tax_attestation_digest(irn_hex, generation_timestamp, "TAX_CLEARED")

    try:
        pk = ed25519.Ed25519PublicKey.from_public_bytes(pubkey_bytes)
        pk.verify(sig_bytes, digest)
        return True
    except InvalidSignature:
        return False
    except Exception:
        return False
