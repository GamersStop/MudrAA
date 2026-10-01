use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::{InvoiceRecord, InvoiceStatus, LiquidityTranchePool, AmatyaReserveVault};

#[derive(Accounts)]
pub struct ExecuteBuyback<'info> {
    #[account(
        mut,
        seeds = [b"invoice_record", invoice_record.invoice_id_hash.as_ref()],
        bump = invoice_record.bump,
        constraint = invoice_record.status == InvoiceStatus::Delinquent @ MudraaError::InvalidStateTransition
    )]
    pub invoice_record: Account<'info, InvoiceRecord>,

    #[account(
        mut,
        seeds = [b"tranche_pool", &[senior_tranche_pool.tranche_type]],
        bump = senior_tranche_pool.bump
    )]
    pub senior_tranche_pool: Account<'info, LiquidityTranchePool>,

    #[account(
        mut,
        seeds = [b"reserve_vault"],
        bump = reserve_vault.bump
    )]
    pub reserve_vault: Account<'info, AmatyaReserveVault>,

    #[account(mut)]
    pub caller: Signer<'info>,
}

pub fn handler(ctx: Context<ExecuteBuyback>) -> Result<()> {
    let clock = Clock::get()?;
    let invoice = &mut ctx.accounts.invoice_record;
    let pool = &mut ctx.accounts.senior_tranche_pool;
    let reserve = &mut ctx.accounts.reserve_vault;

    let seconds_overdue = clock.unix_timestamp.saturating_sub(invoice.due_timestamp);
    let days_overdue = seconds_overdue / 86400;

    let remaining_debt = invoice.face_value_usdc
        .checked_sub(invoice.total_repaid_usdc)
        .ok_or(MudraaError::MathOverflow)?;

    if days_overdue <= 22 {
        // Recourse Window (Days 16–22): Exporter repurchases delinquent debt
        require_keys_eq!(
            ctx.accounts.caller.key(),
            invoice.exporter,
            MudraaError::UnauthorizedSigner
        );
        invoice.total_repaid_usdc = invoice.face_value_usdc;
        invoice.status = InvoiceStatus::RecourseBuyback;
        pool.total_allocated = pool.total_allocated.saturating_sub(remaining_debt);

        msg!(
            "Nyayadhish Recourse: Exporter exercised buyback window within {} days overdue.",
            days_overdue
        );
    } else {
        // Day 23+: Default & Collateral Slashing
        // Slashes retainage and draws from Parametric Reinsurance Reserve to make senior pool whole
        reserve.reinsurance_reserve_balance = reserve
            .reinsurance_reserve_balance
            .saturating_sub(remaining_debt);
        pool.total_allocated = pool.total_allocated.saturating_sub(remaining_debt);
        invoice.status = InvoiceStatus::DefaultSlashed;

        msg!(
            "Nyayadhish Default: Recourse window expired ({} days). Slashed originator bond and drew reinsurance reserve.",
            days_overdue
        );
    }

    Ok(())
}
