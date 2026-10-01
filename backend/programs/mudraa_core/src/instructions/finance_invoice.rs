use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::{InvoiceRecord, InvoiceStatus, LiquidityTranchePool, AmatyaReserveVault, ProtocolState};

#[derive(Accounts)]
pub struct FinanceInvoice<'info> {
    #[account(
        mut,
        seeds = [b"mudraa_protocol_state"],
        bump = protocol_state.bump,
        constraint = !protocol_state.is_paused @ MudraaError::ProtocolPaused
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        mut,
        seeds = [b"invoice_record", invoice_record.invoice_id_hash.as_ref()],
        bump = invoice_record.bump,
        has_one = exporter @ MudraaError::UnauthorizedSigner,
        constraint = invoice_record.status == InvoiceStatus::Registered || invoice_record.status == InvoiceStatus::Attested @ MudraaError::InvalidStateTransition
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
    pub exporter: Signer<'info>,
}

pub fn handler(ctx: Context<FinanceInvoice>, fx_haircut_bps: u16) -> Result<()> {
    let clock = Clock::get()?;
    let invoice = &mut ctx.accounts.invoice_record;
    let senior_pool = &mut ctx.accounts.senior_tranche_pool;
    let reserve = &mut ctx.accounts.reserve_vault;
    let face_val = invoice.face_value_usdc;

    // 1. Calculate Waterfalled Capital Allocations using Checked Arithmetic (Rule 3.1 & Threat A.5)
    // 75% Advance Disbursement
    let advance_amount = face_val
        .checked_mul(75)
        .ok_or(MudraaError::MathOverflow)?
        .checked_div(100)
        .ok_or(MudraaError::MathOverflow)?;

    // 10% Base Dilution Reserve + FX Haircut
    let base_dilution = face_val
        .checked_mul(10)
        .ok_or(MudraaError::MathOverflow)?
        .checked_div(100)
        .ok_or(MudraaError::MathOverflow)?;

    let fx_buffer = face_val
        .checked_mul(fx_haircut_bps as u64)
        .ok_or(MudraaError::MathOverflow)?
        .checked_div(10000)
        .ok_or(MudraaError::MathOverflow)?;

    let total_dilution_reserve = base_dilution
        .checked_add(fx_buffer)
        .ok_or(MudraaError::MathOverflow)?;

    // 15% Unfinanced Retainage
    let retainage = face_val
        .checked_mul(15)
        .ok_or(MudraaError::MathOverflow)?
        .checked_div(100)
        .ok_or(MudraaError::MathOverflow)?;

    // 0.25% Protocol Reinsurance Fee
    let protocol_fee = face_val
        .checked_mul(25)
        .ok_or(MudraaError::MathOverflow)?
        .checked_div(10000)
        .ok_or(MudraaError::MathOverflow)?;

    // 2. Liquidity Pool Capacity Verification
    let available_liquidity = senior_pool
        .total_deposited
        .checked_sub(senior_pool.total_allocated)
        .ok_or(MudraaError::InsufficientPoolLiquidity)?;

    require!(
        available_liquidity >= advance_amount,
        MudraaError::InsufficientPoolLiquidity
    );

    // 3. Mutate State & Commit Allocations
    senior_pool.total_allocated = senior_pool
        .total_allocated
        .checked_add(advance_amount)
        .ok_or(MudraaError::MathOverflow)?;

    reserve.dilution_reserve_balance = reserve
        .dilution_reserve_balance
        .saturating_add(base_dilution);
    reserve.fx_buffer_balance = reserve
        .fx_buffer_balance
        .saturating_add(fx_buffer);
    reserve.reinsurance_reserve_balance = reserve
        .reinsurance_reserve_balance
        .saturating_add(protocol_fee);

    invoice.advance_amount_usdc = advance_amount;
    invoice.dilution_reserve_usdc = total_dilution_reserve;
    invoice.retainage_usdc = retainage;
    invoice.status = InvoiceStatus::Financed;
    invoice.financed_at_slot = clock.slot;

    let state = &mut ctx.accounts.protocol_state;
    state.total_liquidity_settled = state
        .total_liquidity_settled
        .saturating_add(advance_amount);

    msg!(
        "Amatya Treasury: Invoice financed. Advance: {} USDC, Dilution Reserve: {} USDC, Retainage: {} USDC",
        advance_amount,
        total_dilution_reserve,
        retainage
    );

    Ok(())
}
