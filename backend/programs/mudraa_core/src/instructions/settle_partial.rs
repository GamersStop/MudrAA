use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::{InvoiceRecord, InvoiceStatus, LiquidityTranchePool};

#[derive(Accounts)]
pub struct SettlePartial<'info> {
    #[account(
        mut,
        seeds = [b"invoice_record", invoice_record.invoice_id_hash.as_ref()],
        bump = invoice_record.bump,
        constraint = invoice_record.status == InvoiceStatus::Financed 
                  || invoice_record.status == InvoiceStatus::PartiallySettled 
                  || invoice_record.status == InvoiceStatus::Delinquent @ MudraaError::InvalidStateTransition
    )]
    pub invoice_record: Account<'info, InvoiceRecord>,

    #[account(
        mut,
        seeds = [b"tranche_pool", &[senior_tranche_pool.tranche_type]],
        bump = senior_tranche_pool.bump
    )]
    pub senior_tranche_pool: Account<'info, LiquidityTranchePool>,

    pub payer: Signer<'info>,
}

pub fn handler(ctx: Context<SettlePartial>, repayment_amount_usdc: u64) -> Result<()> {
    let invoice = &mut ctx.accounts.invoice_record;
    let pool = &mut ctx.accounts.senior_tranche_pool;

    let remaining_debt = invoice.face_value_usdc
        .checked_sub(invoice.total_repaid_usdc)
        .ok_or(MudraaError::MathOverflow)?;

    require!(repayment_amount_usdc > 0, MudraaError::UnderconstrainedField);
    require!(repayment_amount_usdc <= remaining_debt, MudraaError::OverpaymentExceeded);

    // 1. Update pool allocation and returned capital (strictly bounded by advance amount)
    let prior_repaid = invoice.total_repaid_usdc;
    let unrecovered_advance = invoice.advance_amount_usdc.saturating_sub(prior_repaid);
    let advance_principal_repaid = std::cmp::min(repayment_amount_usdc, unrecovered_advance);
    pool.total_allocated = pool.total_allocated.saturating_sub(advance_principal_repaid);

    // 2. Update invoice repayment record
    invoice.total_repaid_usdc = invoice.total_repaid_usdc
        .checked_add(repayment_amount_usdc)
        .ok_or(MudraaError::MathOverflow)?;

    if invoice.total_repaid_usdc >= invoice.face_value_usdc {
        invoice.status = InvoiceStatus::FullyRepaid;
        msg!("Amatya Waterfall: Invoice fully repaid. Retainage unlocked for exporter.");
    } else {
        invoice.status = InvoiceStatus::PartiallySettled;
        msg!(
            "Amatya Waterfall: Partial payment settled: {} USDC. Remaining debt: {} USDC.",
            repayment_amount_usdc,
            invoice.face_value_usdc - invoice.total_repaid_usdc
        );
    }

    Ok(())
}
