use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::{KybRegistry, ProtocolState};

#[derive(Accounts)]
#[instruction(wallet: Pubkey)]
pub struct RegisterKybEntity<'info> {
    #[account(
        seeds = [b"mudraa_protocol_state"],
        bump = protocol_state.bump,
        has_one = authority @ MudraaError::UnauthorizedSigner
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + KybRegistry::INIT_SPACE,
        seeds = [b"kyb_registry", wallet.as_ref()],
        bump
    )]
    pub kyb_record: Account<'info, KybRegistry>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteTransferHook<'info> {
    /// CHECK: Token-2022 source token account
    pub source_token_account: AccountInfo<'info>,

    /// CHECK: Token-2022 destination token account
    pub destination_token_account: AccountInfo<'info>,

    #[account(
        seeds = [b"kyb_registry", destination_owner.key().as_ref()],
        bump = destination_kyb.bump
    )]
    pub destination_kyb: Account<'info, KybRegistry>,

    /// CHECK: Destination owner wallet pubkey checked in seeds
    pub destination_owner: AccountInfo<'info>,
}

pub fn handler_register_kyb(
    ctx: Context<RegisterKybEntity>,
    wallet: Pubkey,
    kyb_tier: u8,
    is_verified: bool,
    is_sanctioned: bool
) -> Result<()> {
    let clock = Clock::get()?;
    let record = &mut ctx.accounts.kyb_record;

    record.wallet = wallet;
    record.kyb_tier = kyb_tier;
    record.is_verified = is_verified;
    record.is_sanctioned = is_sanctioned;
    record.verified_at_slot = clock.slot;
    record.bump = ctx.bumps.kyb_record;

    msg!(
        "Panditrao Compliance: Registered KYB status for wallet {}. Verified: {}, Sanctioned: {}",
        wallet,
        is_verified,
        is_sanctioned
    );
    Ok(())
}

pub fn handler_transfer_hook(
    ctx: Context<ExecuteTransferHook>,
    amount: u64
) -> Result<()> {
    let dest_kyb = &ctx.accounts.destination_kyb;

    // 1. Verify Destination Token Account Ownership (Threat A.4: Sanctions Evasion Defense)
    let dest_account_info = &ctx.accounts.destination_token_account;
    if !dest_account_info.data_is_empty() && dest_account_info.data_len() >= 64 {
        let data = dest_account_info.try_borrow_data()?;
        let actual_owner = Pubkey::new_from_array(
            data[32..64].try_into().map_err(|_| MudraaError::UnauthorizedSigner)?
        );
        require_keys_eq!(
            actual_owner,
            ctx.accounts.destination_owner.key(),
            MudraaError::UnauthorizedSigner
        );
    }

    // 2. Sanctions Screening (OFAC Defense)
    require!(
        !dest_kyb.is_sanctioned,
        MudraaError::UnauthorizedSigner
    );

    // 3. KYB Verification Allowlist Check
    require!(
        dest_kyb.is_verified,
        MudraaError::UnauthorizedSigner
    );

    msg!(
        "Panditrao Compliance Gate: Token-2022 transfer of {} base units approved for verified KYB wallet {}.",
        amount,
        dest_kyb.wallet
    );

    Ok(())
}
