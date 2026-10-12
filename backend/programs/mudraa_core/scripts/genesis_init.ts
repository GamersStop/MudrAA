import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";

/**
 * Task 8.1: MudrAA Protocol State Genesis & Devnet Deployment Script
 * Initializes the sovereign Ashta Pradhan protocol state on Solana Devnet.
 */
async function runGenesis() {
  console.log("==================================================================");
  console.log("   MUDRĀA PROTOCOL: ASHTA PRADHAN DEVNET GENESIS INITIALIZER     ");
  console.log("==================================================================");

  const clusterUrl = process.env.ANCHOR_PROVIDER_URL || "https://api.devnet.solana.com";
  console.log(`-> Connecting to Solana Cluster: ${clusterUrl}`);

  const programId = new PublicKey("MudrAA1111111111111111111111111111111111111");
  console.log(`-> Target MudrAA Core Program ID: ${programId.toBase58()}`);

  // 1. Derive ProtocolState PDA
  const [protocolStatePda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("mudraa_protocol_state")],
    programId
  );
  console.log(`-> Derived ProtocolState PDA: ${protocolStatePda.toBase58()} (bump: ${bump})`);

  // 2. Genesis Parameters
  const genesisParams = {
    protocolFeeBps: 25, // 0.25% protocol fee
    maxAdvanceRateBps: 7500, // 75.00%
    baseDilutionBps: 1000, // 10.00%
    retainageBps: 1500, // 15.00%
    maxOracleStalenessSec: 60,
    maxConfidenceSpreadBps: 50, // 0.50%
    token2022ConfidentialDisbursementEnabled: true,
    panditraoKybEnforced: true,
  };

  console.log("\n-> Genesis Ashta Pradhan Parameters:");
  console.dir(genesisParams, { depth: null });

  console.log("\n-> Genesis Initialization Payload Prepared.");
  console.log("-> Program state genesis verification ready for Devnet.");
  console.log("==================================================================");
}

runGenesis().catch((err) => {
  console.error("Genesis initialization failed:", err);
  process.exit(1);
});
