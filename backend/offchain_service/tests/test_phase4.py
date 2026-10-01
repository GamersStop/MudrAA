"""
MudrAA Phase 4 Automated Test Suite - Multimodal Freight, Tax & Pyth Oracle Gateway
Verifies:
1. Tax IRN Statutory Cooldown & Race Condition Defense (TASK-401 / Threat C.2)
2. Carrier Telemetry Allowlist & Departure Milestone Verification (TASK-402 / Threat C.1)
3. Marine Cargo Insurance 110% Coverage & Loss-Payee Subrogation (TASK-403)
4. Pyth FX Confidence Interval, Freshness & Dynamic Haircuts (TASK-404 / Threat C.3)
5. FastAPI Oracle Endpoints Integration
"""

import time
import pytest
from httpx import AsyncClient, ASGITransport

from core.tax_oracle import (
    evaluate_tax_clearance,
    verify_tax_oracle_attestation,
    TaxOracleError,
    TOTAL_COOLDOWN_SECONDS,
    ORACLE_PUBLIC_KEY_HEX
)
from core.carrier_oracle import (
    verify_carrier_telemetry,
    sign_mock_carrier_event,
    CarrierOracleError,
    CARRIER_ALLOWLIST
)
from core.insurance_oracle import (
    evaluate_marine_insurance_policy,
    sign_mock_insurance_certificate,
    InsuranceOracleError,
    UNDERWRITER_PUBKEY_HEX
)
from core.pyth_oracle import (
    evaluate_pyth_fx_rate,
    calculate_dynamic_fx_haircut_bps,
    PythOracleError
)
from main import app


def test_tax_clearance_statutory_cooldown():
    """Mitigates Threat C.2: Tax IRN Cancellation Race Condition."""
    current_time = int(time.time())
    irn = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

    # 1. Invoice generated 5 hours ago: cooldown must be ACTIVE
    recent_timestamp = current_time - (5 * 3600)
    report_cooling = evaluate_tax_clearance(
        irn=irn,
        irn_generation_timestamp=recent_timestamp,
        current_timestamp=current_time
    )
    assert report_cooling["status"] == "COOLING_PERIOD_ACTIVE"
    assert report_cooling["is_cleared"] is False
    assert report_cooling["remaining_cooldown_hours"] == 20.0
    assert report_cooling["oracle_signature_hex"] is None

    # 2. Invoice generated 26 hours ago (cooldown > 25h): must be STATUTORY_CLEARED
    cleared_timestamp = current_time - (26 * 3600)
    report_cleared = evaluate_tax_clearance(
        irn=irn,
        irn_generation_timestamp=cleared_timestamp,
        current_timestamp=current_time
    )
    assert report_cleared["status"] == "STATUTORY_CLEARED"
    assert report_cleared["is_cleared"] is True
    assert report_cleared["oracle_signature_hex"] is not None

    # 3. Verify Oracle Signature
    is_valid_sig = verify_tax_oracle_attestation(
        irn_hex=irn,
        generation_timestamp=cleared_timestamp,
        signature_hex=report_cleared["oracle_signature_hex"],
        oracle_pubkey_hex=ORACLE_PUBLIC_KEY_HEX
    )
    assert is_valid_sig is True

    # 4. Cancelled invoice on tax portal must raise exception
    with pytest.raises(TaxOracleError, match="cancelled by seller"):
        evaluate_tax_clearance(
            irn=irn,
            irn_generation_timestamp=cleared_timestamp,
            current_timestamp=current_time,
            is_cancelled_on_portal=True
        )


def test_carrier_telemetry_allowlist_and_milestones():
    """Mitigates Threat C.1: Phantom Freight & Sybil Carrier Telemetry."""
    carrier_code = "MAERSK"
    bol = "BL-MAERSK-902110"
    container = "MSKU9021108"
    milestone = "VESSEL_DEPARTED"
    departure_ts = int(time.time()) - 3600

    # 1. Valid Carrier Signature
    sig_hex = sign_mock_carrier_event(carrier_code, container, milestone, departure_ts)
    report = verify_carrier_telemetry(
        carrier_code=carrier_code,
        bill_of_lading=bol,
        container_id=container,
        milestone=milestone,
        departure_timestamp=departure_ts,
        carrier_signature_hex=sig_hex
    )
    assert report["status"] == "FREIGHT_VERIFIED"
    assert report["dcsa_compliant"] is True

    # 2. Reject Unauthorized / Fake Carrier
    with pytest.raises(CarrierOracleError, match="Unauthorized Carrier"):
        verify_carrier_telemetry(
            carrier_code="FAKE_CARRIER_INC",
            bill_of_lading=bol,
            container_id=container,
            milestone=milestone,
            departure_timestamp=departure_ts,
            carrier_signature_hex=sig_hex
        )

    # 3. Reject Incomplete Milestone (Cargo not yet departed)
    with pytest.raises(CarrierOracleError, match="Premature milestone"):
        verify_carrier_telemetry(
            carrier_code=carrier_code,
            bill_of_lading=bol,
            container_id=container,
            milestone="BOOKING_CONFIRMED",
            departure_timestamp=departure_ts,
            carrier_signature_hex=sig_hex
        )


def test_marine_insurance_subrogation_and_coverage():
    """Verifies TASK-403: 110% coverage requirement & automated Loss-Payee subrogation."""
    underwriter = "LLOYDS_LONDON"
    policy_num = "POL-LLOYDS-2026-902"
    invoice_hash = "f" * 64
    invoice_face_value = 150000.0
    insured_coverage = 165000.0  # Exactly 110%
    vault_pubkey = "MudrAAVault11111111111111111111111111111111"

    sig_hex = sign_mock_insurance_certificate(policy_num, invoice_hash, vault_pubkey, insured_coverage)

    # 1. Valid policy with 110% coverage and vault loss-payee
    report = evaluate_marine_insurance_policy(
        underwriter_code=underwriter,
        policy_number=policy_num,
        invoice_id_hash=invoice_hash,
        invoice_face_value=invoice_face_value,
        insured_coverage_amount=insured_coverage,
        loss_payee_pubkey=vault_pubkey,
        expected_vault_pubkey=vault_pubkey,
        underwriter_signature_hex=sig_hex
    )
    assert report["status"] == "POLICY_PERFECTED"
    assert report["coverage_ratio_percent"] == 110.0
    assert report["subrogation_active"] is True

    # 2. Reject Insufficient Coverage (< 110%)
    with pytest.raises(InsuranceOracleError, match="Insufficient Insurance Coverage"):
        evaluate_marine_insurance_policy(
            underwriter_code=underwriter,
            policy_number=policy_num,
            invoice_id_hash=invoice_hash,
            invoice_face_value=invoice_face_value,
            insured_coverage_amount=150000.0, # 100% instead of required 110%
            loss_payee_pubkey=vault_pubkey,
            expected_vault_pubkey=vault_pubkey,
            underwriter_signature_hex=sig_hex
        )

    # 3. Reject Wrong Loss-Payee Beneficiary
    with pytest.raises(InsuranceOracleError, match="Subrogation Breach"):
        evaluate_marine_insurance_policy(
            underwriter_code=underwriter,
            policy_number=policy_num,
            invoice_id_hash=invoice_hash,
            invoice_face_value=invoice_face_value,
            insured_coverage_amount=insured_coverage,
            loss_payee_pubkey="AttackerWallet1111111111111111111111111111",
            expected_vault_pubkey=vault_pubkey,
            underwriter_signature_hex=sig_hex
        )


def test_pyth_fx_oracle_manipulation_defenses():
    """Mitigates Threat C.3: Pyth FX Sandwiching, Stale Feeds & Dynamic Dilution."""
    now = int(time.time())

    # 1. Valid price feed within freshness and confidence bounds
    report = evaluate_pyth_fx_rate(
        currency_pair="EUR/USD",
        raw_price=1.0850,
        confidence=0.0003, # 0.027% confidence ratio <= 0.5%
        feed_publish_timestamp=now - 15, # 15s latency <= 60s
        tenor_days=60,
        current_timestamp=now
    )
    assert report["status"] == "RATE_LOCKED"
    assert report["fx_haircut_bps"] >= 500 # At least 5% (500 bps)

    # 2. Reject Stale Price Feed (> 60 seconds old)
    with pytest.raises(PythOracleError, match="StaleOracleFeed"):
        evaluate_pyth_fx_rate(
            currency_pair="EUR/USD",
            raw_price=1.0850,
            confidence=0.0003,
            feed_publish_timestamp=now - 90, # 90s latency > 60s
            tenor_days=60,
            current_timestamp=now
        )

    # 3. Reject Wide Confidence Interval (> 0.5% - flash loan manipulation indicator)
    with pytest.raises(PythOracleError, match="OracleConfidenceTooWide"):
        evaluate_pyth_fx_rate(
            currency_pair="EUR/USD",
            raw_price=1.0850,
            confidence=0.0150, # 1.38% confidence ratio > 0.5%
            feed_publish_timestamp=now - 10,
            tenor_days=60,
            current_timestamp=now
        )

    # 4. USD invoices require 0 FX haircut bps
    usd_haircut = calculate_dynamic_fx_haircut_bps("USD", 60)
    assert usd_haircut == 0


@pytest.mark.asyncio
async def test_oracles_fastapi_endpoints():
    """Verifies all external oracle endpoints via FastAPI."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Tax clearance endpoint
        res_tax = await client.post("/api/v1/trade/oracles/tax-clearance", json={
            "irn": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "irn_generation_timestamp": int(time.time()) - (30 * 3600), # 30h ago
            "is_cancelled": False
        })
        assert res_tax.status_code == 200
        tax_data = res_tax.json()
        assert tax_data["status"] == "STATUTORY_CLEARED"
        assert tax_data["is_cleared"] is True

        # 2. Carrier telemetry endpoint
        departure_ts = int(time.time()) - 1000
        sig_hex = sign_mock_carrier_event("MAERSK", "MSKU9021108", "VESSEL_DEPARTED", departure_ts)
        res_carrier = await client.post("/api/v1/trade/oracles/carrier-telemetry", json={
            "carrier_code": "MAERSK",
            "bill_of_lading": "BL-MAERSK-902110",
            "container_id": "MSKU9021108",
            "milestone": "VESSEL_DEPARTED",
            "departure_timestamp": departure_ts,
            "carrier_signature_hex": sig_hex
        })
        assert res_carrier.status_code == 200
        carrier_data = res_carrier.json()
        assert carrier_data["status"] == "FREIGHT_VERIFIED"

        # 3. Marine cargo insurance endpoint
        vault_key = "MudrAAVault11111111111111111111111111111111"
        ins_sig = sign_mock_insurance_certificate("POL-LLOYDS-2026-902", "a"*64, vault_key, 165000.0)
        res_ins = await client.post("/api/v1/trade/oracles/insurance-policy", json={
            "underwriter_code": "LLOYDS_LONDON",
            "policy_number": "POL-LLOYDS-2026-902",
            "invoice_id_hash": "a"*64,
            "invoice_face_value": 150000.0,
            "insured_coverage_amount": 165000.0,
            "loss_payee_pubkey": vault_key,
            "expected_vault_pubkey": vault_key,
            "underwriter_signature_hex": ins_sig
        })
        assert res_ins.status_code == 200
        ins_data = res_ins.json()
        assert ins_data["status"] == "POLICY_PERFECTED"

        # 4. Pyth FX rate-lock endpoint
        res_fx = await client.post("/api/v1/trade/oracles/pyth-fx", json={
            "currency_pair": "EUR/USD",
            "raw_price": 1.0850,
            "confidence": 0.0003,
            "feed_publish_timestamp": int(time.time()) - 20,
            "tenor_days": 60
        })
        assert res_fx.status_code == 200
        fx_data = res_fx.json()
        assert fx_data["status"] == "RATE_LOCKED"
        assert fx_data["fx_haircut_bps"] >= 500
