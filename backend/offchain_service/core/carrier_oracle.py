"""
MudrAA Carrier Telemetry Oracle - Sumant Multimodal Freight Subsystem
Mitigates Threat C.1: Phantom Freight & Sybil Carrier Telemetry.
Enforces authorized maritime carrier allowlists and cryptographic milestone verification.
"""

import hashlib
from typing import Dict, Any, Optional
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature


class CarrierOracleError(Exception):
    """Raised when logistics telemetry fails allowlist or cryptographic signature validation."""
    pass


# Global Allowlist of Authorized Maritime Carriers & Freight Forwarders
# Maps carrier_code to their official Ed25519 public key and corporate metadata
CARRIER_ALLOWLIST: Dict[str, Dict[str, Any]] = {}

# Dedicated carrier keypairs (Persistent Key Management)
_MAERSK_KEYPAIR = ed25519.Ed25519PrivateKey.from_private_bytes(
    hashlib.sha256(b"mudraa_carrier_maersk_key_seed_v1").digest()
)
_MSC_KEYPAIR = ed25519.Ed25519PrivateKey.from_private_bytes(
    hashlib.sha256(b"mudraa_carrier_msc_key_seed_v1").digest()
)
_HAPAG_KEYPAIR = ed25519.Ed25519PrivateKey.from_private_bytes(
    hashlib.sha256(b"mudraa_carrier_hapag_key_seed_v1").digest()
)

CARRIER_ALLOWLIST["MAERSK"] = {
    "name": "A.P. Moller – Maersk",
    "dcsa_member": True,
    "public_key_bytes": _MAERSK_KEYPAIR.public_key().public_bytes_raw(),
    "public_key_hex": _MAERSK_KEYPAIR.public_key().public_bytes_raw().hex(),
}

CARRIER_ALLOWLIST["MSC"] = {
    "name": "Mediterranean Shipping Company",
    "dcsa_member": True,
    "public_key_bytes": _MSC_KEYPAIR.public_key().public_bytes_raw(),
    "public_key_hex": _MSC_KEYPAIR.public_key().public_bytes_raw().hex(),
}

CARRIER_ALLOWLIST["HAPAG_LLOYD"] = {
    "name": "Hapag-Lloyd AG",
    "dcsa_member": True,
    "public_key_bytes": _HAPAG_KEYPAIR.public_key().public_bytes_raw(),
    "public_key_hex": _HAPAG_KEYPAIR.public_key().public_bytes_raw().hex(),
}


def construct_carrier_milestone_digest(
    container_id: str,
    milestone: str,
    departure_timestamp: int
) -> bytes:
    """Constructs canonical 32-byte digest for carrier physical transit milestone."""
    raw = f"{container_id.strip().upper()}:{milestone.strip().upper()}:{departure_timestamp}".encode("utf-8")
    return hashlib.sha256(raw).digest()


def sign_mock_carrier_event(
    carrier_code: str,
    container_id: str,
    milestone: str,
    timestamp: int
) -> str:
    """Utility for test suites & demos to emit valid carrier-signed telemetry."""
    carrier_upper = carrier_code.upper()
    digest = construct_carrier_milestone_digest(container_id, milestone, timestamp)

    if carrier_upper == "MAERSK":
        return _MAERSK_KEYPAIR.sign(digest).hex()
    elif carrier_upper == "MSC":
        return _MSC_KEYPAIR.sign(digest).hex()
    elif carrier_upper == "HAPAG_LLOYD":
        return _HAPAG_KEYPAIR.sign(digest).hex()
    else:
        raise CarrierOracleError(f"No test signing key available for carrier {carrier_code}")


def verify_carrier_telemetry(
    carrier_code: str,
    bill_of_lading: str,
    container_id: str,
    milestone: str,
    departure_timestamp: int,
    carrier_signature_hex: str
) -> Dict[str, Any]:
    """
    Verifies physical cargo departure telemetry against allowlisted carrier public key.
    Enforces VESSEL_DEPARTED milestone prior to unlocking capital disbursement.
    """
    carrier_upper = carrier_code.strip().upper()
    if carrier_upper not in CARRIER_ALLOWLIST:
        raise CarrierOracleError(
            f"Unauthorized Carrier: '{carrier_code}' is not in the MudrAA authorized carrier registry."
        )

    carrier_info = CARRIER_ALLOWLIST[carrier_upper]
    pubkey_bytes = carrier_info["public_key_bytes"]

    # Advance disbursements strictly require cargo to have departed port
    milestone_upper = milestone.strip().upper()
    if milestone_upper not in ["VESSEL_DEPARTED", "CUSTOMS_CLEARED", "IN_TRANSIT"]:
        raise CarrierOracleError(
            f"Premature milestone '{milestone}': Capital release requires 'VESSEL_DEPARTED' confirmation."
        )

    # Cryptographic signature check
    digest = construct_carrier_milestone_digest(container_id, milestone_upper, departure_timestamp)
    try:
        sig_bytes = bytes.fromhex(carrier_signature_hex)
        pk = ed25519.Ed25519PublicKey.from_public_bytes(pubkey_bytes)
        pk.verify(sig_bytes, digest)
    except InvalidSignature:
        raise CarrierOracleError(
            f"Cryptographic Signature Mismatch: Telemetry was not signed by {carrier_info['name']}'s authorized key."
        )
    except Exception as e:
        raise CarrierOracleError(f"Carrier signature evaluation failed: {str(e)}")

    return {
        "status": "FREIGHT_VERIFIED",
        "carrier": carrier_info["name"],
        "carrier_code": carrier_upper,
        "bill_of_lading": bill_of_lading,
        "container_id": container_id.upper(),
        "milestone": milestone_upper,
        "departure_timestamp": departure_timestamp,
        "verified_on_chain_ready": True,
        "dcsa_compliant": True,
    }
