use anchor_lang::prelude::*;

pub mod errors;
pub mod state;
pub mod instructions;

use crate::state::*;
use crate::instructions::*;

declare_id!("MudrAA1111111111111111111111111111111111111");

#[program]
pub mod mudraa_core {
    use super::*;

    /// 1. Peshawa Dispatcher: Initialize Sovereign Protocol State
    pub fn initialize_protocol(
        ctx: Context<InitializeProtocol>,
        protocol_fee_bps: u16,
    ) -> Result<()> {
        instructions::initialize_protocol::handler(ctx, protocol_fee_bps)
    }

    /// 2. Senapati Anti-Replay Citadel: Register Single-Asset Nullifier PDA
    pub fn register_nullifier(
        ctx: Context<RegisterNullifier>,
        nullifier_hash: [u8; 32],
    ) -> Result<()> {
        instructions::register_nullifier::handler(ctx, nullifier_hash)
    }

    /// 3. Sachiv Rajmudra Verifier: Verify Groth16 Zero-Knowledge Proof (BN254)
    pub fn verify_groth16(
        ctx: Context<VerifyGroth16Proof>,
        args: Groth16ProofArgs,
    ) -> Result<()> {
        instructions::verify_groth16::handler(ctx, args)
    }

    /// 4. Peshawa Ingestion: Register On-Chain InvoiceRecord PDA
    pub fn register_invoice(
        ctx: Context<RegisterInvoice>,
        invoice_id_hash: [u8; 32],
        peppol_commitment_hash: [u8; 32],
        face_value_usdc: u64,
        due_timestamp: i64,
    ) -> Result<()> {
        instructions::register_invoice::handler(
            ctx,
            invoice_id_hash,
            peppol_commitment_hash,
            face_value_usdc,
            due_timestamp,
        )
    }

    /// 5. Amatya Treasury: Waterfalled Invoice Financing (75% Advance, Dilution, Retainage)
    pub fn finance_invoice(
        ctx: Context<FinanceInvoice>,
        fx_haircut_bps: u16,
    ) -> Result<()> {
        instructions::finance_invoice::handler(ctx, fx_haircut_bps)
    }

    /// 5. Nyayadhish Legal Escrow: Anchor UNCITRAL MLETR Dual-Signed NOA & Waiver of Set-Off
    pub fn anchor_legal_escrow(
        ctx: Context<AnchorLegalEscrow>,
        invoice_id_hash: [u8; 32],
        supplier_noa_signature: [u8; 64],
        buyer_waiver_signature: [u8; 64],
    ) -> Result<()> {
        instructions::anchor_legal_escrow::handler(
            ctx,
            invoice_id_hash,
            supplier_noa_signature,
            buyer_waiver_signature,
        )
    }

    /// 6. Amatya Waterfall: Settle Partial / Full Repayments via Virtual IBAN Lockbox
    pub fn settle_partial(
        ctx: Context<SettlePartial>,
        repayment_amount_usdc: u64,
    ) -> Result<()> {
        instructions::settle_partial::handler(ctx, repayment_amount_usdc)
    }

    /// 7. Post-Maturity Engine: Accrue Programmatic Grace-Period Late Fees (SOFR + 8%)
    pub fn accrue_late_fees(
        ctx: Context<AccrueLateFees>,
    ) -> Result<()> {
        instructions::accrue_late_fees::handler(ctx)
    }

    /// 8. Nyayadhish Recourse: Execute Originator Buyback Window or Slashes Collateral
    pub fn execute_buyback(
        ctx: Context<ExecuteBuyback>,
    ) -> Result<()> {
        instructions::execute_buyback::handler(ctx)
    }

    /// 9. Peshawa Circuit Breaker: Emergency Protocol Pause
    pub fn pause_protocol(
        ctx: Context<EmergencyPause>,
    ) -> Result<()> {
        instructions::emergency_pause::handler_pause(ctx)
    }

    /// 10. Peshawa Circuit Breaker: Resume Protocol Operations
    pub fn unpause_protocol(
        ctx: Context<EmergencyPause>,
    ) -> Result<()> {
        instructions::emergency_pause::handler_unpause(ctx)
    }

    /// 11. Waknavis Shielded Vault: Token-2022 Confidential Advance Disbursement
    pub fn confidential_payout(
        ctx: Context<ConfidentialPayout>,
        ciphertext: ConfidentialTransferCiphertext,
    ) -> Result<()> {
        instructions::confidential_payout::handler(ctx, ciphertext)
    }

    /// 12. Panditrao Compliance: Register KYB Whitelist Entity
    pub fn register_kyb_entity(
        ctx: Context<RegisterKybEntity>,
        wallet: Pubkey,
        kyb_tier: u8,
        is_verified: bool,
        is_sanctioned: bool,
    ) -> Result<()> {
        instructions::transfer_hook_kyb::handler_register_kyb(
            ctx,
            wallet,
            kyb_tier,
            is_verified,
            is_sanctioned,
        )
    }

    /// 13. Panditrao Compliance: Token-2022 Transfer Hook Enforcement
    pub fn execute_transfer_hook(
        ctx: Context<ExecuteTransferHook>,
        amount: u64,
    ) -> Result<()> {
        instructions::transfer_hook_kyb::handler_transfer_hook(ctx, amount)
    }

    /// 14. Amatya Syndication: Mint Fractional Yield Debt Notes ($1M+ Tickets)
    pub fn mint_debt_notes(
        ctx: Context<MintSyndicateDebtNotes>,
        invoice_id_hash: [u8; 32],
        deposit_amount_usdc: u64,
        share_price_usdc: u64,
    ) -> Result<()> {
        instructions::mint_debt_notes::handler(
            ctx,
            invoice_id_hash,
            deposit_amount_usdc,
            share_price_usdc,
        )
    }
}
