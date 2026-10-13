import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export const runtime = "nodejs";

const SOLANA_DEVNET_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

// Zero-dependency pure JS Base58 decoder
const B58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function decodeBase58(str: string): Uint8Array {
  const bytes = [0];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const val = B58_ALPHABET.indexOf(c);
    if (val === -1) throw new Error("Invalid base58 character");
    for (let j = 0; j < bytes.length; j++) {
      bytes[j] *= 58;
    }
    bytes[0] += val;
    let carry = 0;
    for (let j = 0; j < bytes.length; j++) {
      bytes[j] += carry;
      carry = bytes[j] >> 8;
      bytes[j] &= 0xff;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (let i = 0; i < str.length && str[i] === "1"; i++) {
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}

function parseKeypair(keyStr?: string): Keypair | null {
  if (!keyStr) return null;
  try {
    if (keyStr.startsWith("[")) {
      return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keyStr)));
    }
    return Keypair.fromSecretKey(decodeBase58(keyStr));
  } catch (err) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action = "FACTORING",
      tranche = "senior",
      invoiceNumber = "INV-IND-2026-095",
      amount = 0.5,
      currency = "USDC",
      bolNumber = "BL-HAPAG-992144",
      supplierPubkey,
    } = body;

    // 1. Admin & Approver / Citadel Keypair
    const adminKeypair = parseKeypair(process.env.DEMO_RELAYER_PRIVATE_KEY?.trim());
    // 2. LP / Factor Keypair (Debit Payer)
    const lpKeypair = parseKeypair(process.env.LP_RELAYER_PRIVATE_KEY?.trim());
    // 3. Factory & Global Exporter Keypair (Credit Beneficiary)
    const exporterKeypair = parseKeypair(process.env.EXPORTER_RELAYER_PRIVATE_KEY?.trim());

    const payerKeypair = lpKeypair || adminKeypair;

    if (!payerKeypair) {
      return NextResponse.json({
        success: false,
        simulated: true,
        message:
          "Relayer private keys not configured in .env.local. Falling back to simulated attestation.",
      });
    }

    const connection = new Connection(SOLANA_DEVNET_RPC, "confirmed");

    // Check payer balance
    const balance = await connection.getBalance(payerKeypair.publicKey);
    if (balance < 5000) {
      return NextResponse.json(
        {
          success: false,
          simulated: true,
          message: `Relayer wallet (${payerKeypair.publicKey.toBase58()}) has insufficient Devnet SOL balance (${(
            balance / 1e9
          ).toFixed(4)} SOL).`,
        },
        { status: 200 }
      );
    }

    // Target recipient
    // For LP ALLOCATION: Payer is LP wallet -> Recipient is Citadel Vault (Admin wallet)
    // For FACTORING: Payer is LP/Factor -> Recipient is Factory & Exporter wallet
    let recipientPubkey =
      action === "ALLOCATE"
        ? (adminKeypair ? adminKeypair.publicKey : payerKeypair.publicKey)
        : (exporterKeypair ? exporterKeypair.publicKey : (adminKeypair ? adminKeypair.publicKey : payerKeypair.publicKey));

    if (supplierPubkey) {
      try {
        recipientPubkey = new PublicKey(supplierPubkey);
      } catch {
        // Fallback
      }
    }

    const transaction = new Transaction();

    if (action === "ALLOCATE") {
      // 1. LP Capital Allocation Transfer: LP (Debit) transfers to Amatya Vault (Credit)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payerKeypair.publicKey,
          toPubkey: recipientPubkey,
          lamports: 15000,
        })
      );

      // 2. SPL Memo recording LP allocation
      const memoData = Buffer.from(
        `MudrAA:LP_ALLOCATE:${tranche.toUpperCase()}:${amount}${currency}:TOKEN2022_CONFIDENTIAL:${Date.now()}`
      );
      transaction.add(
        new TransactionInstruction({
          keys: [
            {
              pubkey: payerKeypair.publicKey,
              isSigner: true,
              isWritable: true,
            },
          ],
          programId: MEMO_PROGRAM_ID,
          data: memoData,
        })
      );
    } else {
      // Factoring Advance Settlement Transfer: Factor (LP) transfers to Exporter
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payerKeypair.publicKey,
          toPubkey: recipientPubkey,
          lamports: 10000,
        })
      );

      // SPL Memo recording factoring commitment
      const memoData = Buffer.from(
        `MudrAA:FACTORING:${invoiceNumber}:${amount}${currency}:${bolNumber}:ZK-VERIFIED`
      );
      transaction.add(
        new TransactionInstruction({
          keys: [
            {
              pubkey: payerKeypair.publicKey,
              isSigner: true,
              isWritable: true,
            },
          ],
          programId: MEMO_PROGRAM_ID,
          data: memoData,
        })
      );
    }

    // Broadcast and confirm on Solana Devnet
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeypair],
      {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      }
    );

    return NextResponse.json({
      success: true,
      simulated: false,
      signature,
      txHash: signature,
      action,
      tranche,
      amount,
      currency,
      senderLp: payerKeypair.publicKey.toBase58(),
      recipientVault: recipientPubkey.toBase58(),
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("Devnet broadcast error:", error);
    return NextResponse.json(
      {
        success: false,
        simulated: true,
        error: error?.message || "Failed to broadcast to Solana Devnet",
      },
      { status: 500 }
    );
  }
}
