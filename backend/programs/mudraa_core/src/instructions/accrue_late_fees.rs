use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::{InvoiceRecord, InvoiceStatus};

#[derive(Accounts)]
pub struct AccrueLateFees<'info> {
    #[account(
        mut,
        seeds = [b"invoice_record", invoice_record.invoice_id_hash.as_ref()],
        bump = invoice_record.bump,
        constraint = invoice_record.status == InvoiceStatus::Financed 
                  || invoice_record.status == InvoiceStatus::PartiallySettled
                  || invoice_record.status == InvoiceStatus::Delinquent @ MudraaError::InvalidStateTransition
    )]
    pub invoice_record: Account<'info, InvoiceRecord>,

    pub keeper: Signer<'info>,
}

pub fn handler(ctx: Context<AccrueLateFees>) -> Result<()> {
    let clock = Clock::get()?;
    let invoice = &mut ctx.accounts.invoice_record;

    // Verify invoice is past maturity date
    require!(
        clock.unix_timestamp > invoice.due_timestamp,
        MudraaError::InvalidStateTransition
    );

    // Newly elapsed days past due since last accrual
    let seconds_overdue = clock.unix_timestamp - invoice.due_timestamp;
    let days_newly_overdue = (seconds_overdue / 86400) as u64;
    require!(days_newly_overdue > 0, MudraaError::InvalidStateTransition);

    // Linear penalty fee rate: SOFR + 800 bps (~13% annual / ~0.0356% daily)
    // penalty = (remaining_debt * 356 * days) / 1,000,000
    let remaining_debt = invoice.face_value_usdc
        .checked_sub(invoice.total_repaid_usdc)
        .ok_or(MudraaError::MathOverflow)?;

    let penalty_fee = remaining_debt
        .checked_mul(356)
        .ok_or(MudraaError::MathOverflow)?
        .checked_mul(days_newly_overdue)
        .ok_or(MudraaError::MathOverflow)?
        .checked_div(1_000_000)
        .ok_or(MudraaError::MathOverflow)?;

    invoice.face_value_usdc = invoice.face_value_usdc
        .checked_add(penalty_fee)
        .ok_or(MudraaError::MathOverflow)?;

    // Advance due_timestamp forward by the accrued days to prevent compounding duplication
    invoice.due_timestamp = invoice.due_timestamp
        .checked_add((days_newly_overdue as i64) * 86400)
        .ok_or(MudraaError::MathOverflow)?;

    invoice.status = InvoiceStatus::Delinquent;

    msg!(
        "Amatya State Machine: Invoice delinquent. Accrued {} days late fee: {} USDC.",
        days_newly_overdue,
        penalty_fee
    );

    Ok(())
}
