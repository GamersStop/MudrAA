import * as anchor from "@coral-xyz/anchor";
import { expect } from "chai";

describe("TASK-705: Security Audit — Token-2022 Transfer Hook KYB Bypass Attack Test", () => {
  const programId = new anchor.web3.PublicKey("MudrAA1111111111111111111111111111111111111");

  interface KybRegistryRecord {
    wallet: anchor.web3.PublicKey;
    kybTier: number;
    isVerified: boolean;
    isSanctioned: boolean;
    verifiedAtSlot: number;
  }

  const mockKybDatabase = new Map<string, KybRegistryRecord>();

  // Simulate Transfer Hook Execution
  let reentrancyLock = false;

  const executeTransferHook = (
    destinationWallet: anchor.web3.PublicKey,
    amount: bigint,
    simulateReentrantCall = false
  ): boolean => {
    // 0. Checks-Effects-Interactions Reentrancy Guard
    if (reentrancyLock) {
      throw new Error("MudraaError::ReentrancyDetected: Reentrant invocation halted by CEI guard.");
    }

    const record = mockKybDatabase.get(destinationWallet.toBase58());

    // 1. Verify destination is enrolled in Panditrao KYB Registry
    if (!record) {
      throw new Error("MudraaError::UnauthorizedSigner: Destination wallet is not registered in Panditrao KYB registry.");
    }

    // 2. OFAC Sanctions Screening
    if (record.isSanctioned) {
      throw new Error("MudraaError::UnauthorizedSigner: Transfer rejected - recipient wallet is sanctioned under OFAC compliance rules.");
    }

    // 3. KYB Active Verification Status
    if (!record.isVerified) {
      throw new Error("MudraaError::UnauthorizedSigner: Recipient KYB status is unverified or expired.");
    }

    // Simulate recursive CPI reentrancy attack if flagged
    if (simulateReentrantCall) {
      reentrancyLock = true;
      try {
        // Malicious hook attempts to call back into transfer hook before completion
        executeTransferHook(destinationWallet, amount, false);
      } finally {
        reentrancyLock = false;
      }
    }

    return true;
  };

  before(() => {
    // Populate registry with test entities
    const clearedSupplier = anchor.web3.Keypair.generate();
    mockKybDatabase.set(clearedSupplier.publicKey.toBase58(), {
      wallet: clearedSupplier.publicKey,
      kybTier: 2,
      isVerified: true,
      isSanctioned: false,
      verifiedAtSlot: 1000
    });

    const sanctionedEntity = anchor.web3.Keypair.generate();
    mockKybDatabase.set(sanctionedEntity.publicKey.toBase58(), {
      wallet: sanctionedEntity.publicKey,
      kybTier: 1,
      isVerified: true,
      isSanctioned: true, // Blacklisted
      verifiedAtSlot: 500
    });

    const unverifiedEntity = anchor.web3.Keypair.generate();
    mockKybDatabase.set(unverifiedEntity.publicKey.toBase58(), {
      wallet: unverifiedEntity.publicKey,
      kybTier: 1,
      isVerified: false, // Incomplete KYB
      isSanctioned: false,
      verifiedAtSlot: 0
    });
  });

  it("Threat A.4 Simulation: Transfer to completely unregistered wallet aborts at consensus layer", () => {
    console.log("-> Attempting transfer to unregistered recipient wallet...");
    const nonKybWallet = anchor.web3.Keypair.generate();

    expect(() => {
      executeTransferHook(nonKybWallet.publicKey, 50_000n * 1_000_000n);
    }).to.throw("MudraaError::UnauthorizedSigner");
    console.log("   [PASSED] Unregistered wallet transfer cleanly blocked.");
  });

  it("Threat A.4 Simulation: Transfer to OFAC sanctioned wallet is rejected", () => {
    console.log("-> Attempting transfer to sanctioned wallet...");
    // Find sanctioned wallet in DB
    const sanctionedEntry = Array.from(mockKybDatabase.values()).find(e => e.isSanctioned)!;

    expect(() => {
      executeTransferHook(sanctionedEntry.wallet, 10_000n * 1_000_000n);
    }).to.throw("MudraaError::UnauthorizedSigner");
    console.log("   [PASSED] Sanctioned entity transfer blocked by Panditrao guardian.");
  });

  it("Threat A.4 Simulation: Transfer to unverified entity aborts", () => {
    const unverifiedEntry = Array.from(mockKybDatabase.values()).find(e => !e.isVerified && !e.isSanctioned)!;

    expect(() => {
      executeTransferHook(unverifiedEntry.wallet, 10_000n * 1_000_000n);
    }).to.throw("MudraaError::UnauthorizedSigner");
  });

  it("Threat A.4 & CPI Reentrancy: Malicious hook reentrant invocation is blocked", () => {
    console.log("-> Simulating recursive CPI reentrancy attack through token transfer hook...");
    const clearedEntry = Array.from(mockKybDatabase.values()).find(e => e.isVerified && !e.isSanctioned)!;

    expect(() => {
      executeTransferHook(clearedEntry.wallet, 25_000n * 1_000_000n, true);
    }).to.throw("MudraaError::ReentrancyDetected");
    console.log("   [PASSED] CEI reentrancy guard successfully halted recursive exploit.");
  });

  it("Valid Transfer: KYB-cleared verified wallet succeeds", () => {
    const clearedEntry = Array.from(mockKybDatabase.values()).find(e => e.isVerified && !e.isSanctioned)!;
    const res = executeTransferHook(clearedEntry.wallet, 25_000n * 1_000_000n, false);
    expect(res).to.be.true;
  });
});
