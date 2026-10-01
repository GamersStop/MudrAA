use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::{InvoiceRecord, SyndicateDebtVault};

#[derive(Accounts)]
#[instruction(invoice_id_hash: [u8; 32])]
pub struct MintSyndicateDebtNotes<'info> {
    #[account(
        seeds = [b"invoice_record", invoice_id_hash.as_ref()],
        bump = invoice_record.bump
    )]
    pub invoice_record: Account<'info, InvoiceRecord>,

    #[account(
        init_if_needed,
        payer = investor,
        space = 8 + SyndicateDebtVault::INIT_SPACE,
        seeds = [b"syndicate_vault", invoice_id_hash.as_ref()],
        bump
    )]
    pub syndicate_vault: Account<'info, SyndicateDebtVault>,

    #[account(mut)]
    pub investor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<MintSyndicateDebtNotes>,
    invoice_id_hash: [u8; 32],
    deposit_amount_usdc: u64,
    share_price_usdc: u64
) -> Result<()> {
    require!(deposit_amount_usdc >= share_price_usdc, MudraaError::UnderconstrainedField);
    require!(share_price_usdc > 0, MudraaError::UnderconstrainedField);

    let vault = &mut ctx.accounts.syndicate_vault;
    let invoice = &ctx.accounts.invoice_record;

    // Enforce immutable share price once initialized to prevent dilution attacks
    if vault.share_price_usdc > 0 {
        require_eq!(share_price_usdc, vault.share_price_usdc, MudraaError::UnderconstrainedField);
    } else {
        vault.share_price_usdc = share_price_usdc;
    }

    // Enforce that syndicated debt does not exceed the underlying invoice collateral face value
    let new_syndicated_total = vault
        .total_syndicated_debt
        .checked_add(deposit_amount_usdc)
        .ok_or(MudraaError::MathOverflow)?;
    require!(
        new_syndicated_total <= invoice.face_value_usdc,
        MudraaError::OverpaymentExceeded
    );

    let shares_to_mint = deposit_amount_usdc
        .checked_div(vault.share_price_usdc)
        .ok_or(MudraaError::MathOverflow)?;

    vault.invoice_id_hash = invoice_id_hash;
    vault.target_apy_bps = 1200; // 12% target blended APY
    vault.total_syndicated_debt = new_syndicated_total;
    vault.total_shares_minted = vault
        .total_shares_minted
        .checked_add(shares_to_mint)
        .ok_or(MudraaError::MathOverflow)?;
    vault.bump = ctx.bumps.syndicate_vault;

    msg!(
        "Amatya Syndication: Minted {} fractional debt note shares for investor {}. Total pool: {} USDC",
        shares_to_mint,
        ctx.accounts.investor.key(),
        vault.total_syndicated_debt
    );

    Ok(())
}
