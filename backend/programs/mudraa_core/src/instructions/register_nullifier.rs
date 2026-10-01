use anchor_lang::prelude::*;
use crate::state::NullifierRecord;
use crate::errors::MudraaError;

#[derive(Accounts)]
#[instruction(nullifier_hash: [u8; 32])]
pub struct RegisterNullifier<'info> {
    #[account(
        init,
        payer = supplier,
        space = 8 + NullifierRecord::INIT_SPACE,
        seeds = [b"nullifier", nullifier_hash.as_ref()],
        bump
    )]
    pub nullifier_record: Account<'info, NullifierRecord>,

    #[account(mut)]
    pub supplier: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterNullifier>, nullifier_hash: [u8; 32]) -> Result<()> {
    let clock = Clock::get()?;
    let record = &mut ctx.accounts.nullifier_record;

    record.supplier = ctx.accounts.supplier.key();
    record.nullifier_hash = nullifier_hash;
    record.registered_at_slot = clock.slot;
    record.is_spent = true;
    record.bump = ctx.bumps.nullifier_record;

    msg!(
        "Senapati Citadel: Anti-replay nullifier registered at slot {}. Duplicate pledge permanently blocked.",
        clock.slot
    );
    Ok(())
}
