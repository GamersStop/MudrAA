"""
MudrAA Pyth Network FX Engine - Amatya Treasury Subsystem
Mitigates Threat C.3: Pyth FX Oracle Manipulation, Stale Feeds & Sandwich Attacks.
Enforces confidence interval sanity checks (conf/price <= 0.5%), 60-second latency bounds,
and dynamic forward FX dilution haircuts.
"""

import time
import math
from typing import Dict, Any, Optional

MAX_FEED_LATENCY_SECONDS = 60          # 60-second freshness window
MAX_CONFIDENCE_RATIO = 0.005           # 0.5% maximum confidence width


class PythOracleError(Exception):
    """Raised when oracle price feeds are stale, manipulated, or out of confidence bounds."""
    pass


# Default Annualized Volatility Estimates for Major Currency Pairs
CURRENCY_VOLATILITY = {
    "EUR": 0.075,   # 7.5% annual vol
    "JPY": 0.095,   # 9.5% annual vol
    "GBP": 0.085,   # 8.5% annual vol
    "INR": 0.055,   # 5.5% annual vol
    "USD": 0.000,   # Baseline
}


def calculate_dynamic_fx_haircut_bps(currency: str, tenor_days: int) -> int:
    """
    Computes dynamic FX dilution buffer basis points.
    Formula: max(volatility * sqrt(tenor_days / 365), 5%)
    Expressed in basis points (1% = 100 bps).
    """
    curr = currency.strip().upper()
    if curr == "USD":
        return 0

    ann_vol = CURRENCY_VOLATILITY.get(curr, 0.10) # 10% default for other currencies
    tenor_fraction = tenor_days / 365.0
    vol_exposure = ann_vol * math.sqrt(tenor_fraction)

    # Floor at 5% (500 bps) minimum FX safety buffer
    haircut_percent = max(vol_exposure, 0.05)
    return int(round(haircut_percent * 10000))


def evaluate_pyth_fx_rate(
    currency_pair: str,
    raw_price: float,
    confidence: float,
    feed_publish_timestamp: int,
    tenor_days: int = 60,
    current_timestamp: Optional[int] = None
) -> Dict[str, Any]:
    """
    Validates Pyth price feed against manipulation and stale feed threat vectors.
    Returns locked forward conversion rate and required dilution haircut in bps.
    """
    if current_timestamp is None:
        current_timestamp = int(time.time())

    pair_upper = currency_pair.strip().upper()
    if raw_price <= 0:
        raise PythOracleError(f"Invalid negative or zero price feed for {currency_pair}: {raw_price}")

    # 1. Stale Price Check (Latency <= 60 seconds)
    latency = current_timestamp - feed_publish_timestamp
    if latency > MAX_FEED_LATENCY_SECONDS:
        raise PythOracleError(
            f"StaleOracleFeed: Pyth feed latency is {latency}s (exceeds {MAX_FEED_LATENCY_SECONDS}s maximum freshness)."
        )
    if latency < -10:
        raise PythOracleError("Future timestamp detected in oracle price feed.")

    # 2. Confidence Interval Check (conf / price <= 0.5%)
    # Mitigates Threat C.3: Detects illiquid market conditions or flash-loan manipulation
    confidence_ratio = confidence / raw_price
    if confidence_ratio > MAX_CONFIDENCE_RATIO:
        raise PythOracleError(
            f"OracleConfidenceTooWide: Pyth confidence interval is {confidence_ratio:.4%} "
            f"(exceeds {MAX_CONFIDENCE_RATIO:.1%} safety threshold)."
        )

    # 3. Dynamic Forward FX Dilution Haircut
    base_currency = pair_upper.split("/")[0] if "/" in pair_upper else pair_upper[:3]
    fx_haircut_bps = calculate_dynamic_fx_haircut_bps(base_currency, tenor_days)

    return {
        "status": "RATE_LOCKED",
        "currency_pair": pair_upper,
        "spot_rate": raw_price,
        "confidence_interval": confidence,
        "confidence_ratio_percent": round(confidence_ratio * 100, 3),
        "feed_latency_seconds": latency,
        "fx_haircut_bps": fx_haircut_bps,
        "fx_haircut_percent": round(fx_haircut_bps / 100, 2),
        "tenor_days": tenor_days,
        "solana_instruction_param_ready": True
    }
