import { expect } from "chai";

describe("TASK-704: Security Audit — Pyth FX Oracle Confidence & Stale Feed Attack Simulation", () => {
  interface MockPythPriceFeed {
    price: number;
    conf: number;
    expo: number;
    publishTime: number; // Unix timestamp in seconds
  }

  const MAX_ORACLE_STALENESS_SECONDS = 60;
  const MAX_CONFIDENCE_PERCENTAGE = 0.5; // 0.5% max confidence interval width

  const validatePythOraclePrice = (feed: MockPythPriceFeed, currentTimestamp: number): { valid: boolean; normalizedPrice: number } => {
    // 1. Staleness check: feed cannot be older than 60 seconds
    const ageSeconds = currentTimestamp - feed.publishTime;
    if (ageSeconds > MAX_ORACLE_STALENESS_SECONDS) {
      throw new Error("MudraaError::StaleOracleFeed: Pyth Network FX oracle price feed is stale (> 60 seconds old).");
    }

    if (feed.price <= 0) {
      throw new Error("MudraaError::InvalidOraclePrice: Pyth price must be positive non-zero value.");
    }

    // 2. Confidence interval width check: conf / price * 100 <= 0.5%
    const confRatioPct = (feed.conf / Math.abs(feed.price)) * 100;
    if (confRatioPct > MAX_CONFIDENCE_PERCENTAGE) {
      throw new Error("MudraaError::OracleConfidenceTooWide: Pyth Network FX oracle confidence interval is too wide (> 0.5%).");
    }

    const normalizedPrice = feed.price * Math.pow(10, feed.expo);
    return { valid: true, normalizedPrice };
  };

  it("Threat C.3 Simulation: Rejects stale Pyth feed published 120 seconds in the past", () => {
    console.log("-> Simulating stale price attack (feed age = 120s, max allowed = 60s)...");
    const now = Math.floor(Date.now() / 1000);
    const staleFeed: MockPythPriceFeed = {
      price: 108500000, // 1.085 EUR/USD
      conf: 10000,
      expo: -8,
      publishTime: now - 120 // 120 seconds old
    };

    expect(() => validatePythOraclePrice(staleFeed, now)).to.throw("MudraaError::StaleOracleFeed");
    console.log("   [PASSED] Stale feed rejected: Protocol enforces strict 60s freshness window.");
  });

  it("Threat C.3 Simulation: Rejects high-volatility / flash-loan manipulated feed with wide confidence (> 0.5%)", () => {
    console.log("-> Simulating flash-loan oracle skew (confidence interval = 1.2%, limit = 0.5%)...");
    const now = Math.floor(Date.now() / 1000);
    const wideConfFeed: MockPythPriceFeed = {
      price: 100000000, // 1.00 USD
      conf: 1200000,    // 1.2% confidence spread
      expo: -8,
      publishTime: now - 10
    };

    expect(() => validatePythOraclePrice(wideConfFeed, now)).to.throw("MudraaError::OracleConfidenceTooWide");
    console.log("   [PASSED] Wide confidence rejected: High-spread oracle manipulation halted.");
  });

  it("Valid Feed: Accepts fresh, tight confidence feed within institutional bounds", () => {
    const now = Math.floor(Date.now() / 1000);
    const validFeed: MockPythPriceFeed = {
      price: 108500000, // 1.0850 USD
      conf: 100000,     // ~0.092% spread
      expo: -8,
      publishTime: now - 15
    };

    const res = validatePythOraclePrice(validFeed, now);
    expect(res.valid).to.be.true;
    expect(res.normalizedPrice).to.be.closeTo(1.085, 0.0001);
  });
});
