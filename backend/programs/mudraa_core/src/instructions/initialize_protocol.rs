use anchor_lang::prelude::*;
use crate::state::ProtocolState;

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProtocolState::INIT_SPACE,
        seeds = [b"mudraa_protocol_state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeProtocol>, protocol_fee_bps: u16) -> Result<()> {
    let state = &mut ctx.accounts.protocol_state;
    state.authority = ctx.accounts.authority.key();
    state.protocol_fee_bps = protocol_fee_bps;
    state.total_invoices_registered = 0;
    state.total_liquidity_settled = 0;
    state.is_paused = false;
    state.bump = ctx.bumps.protocol_state;

    msg!("Peshawa Dispatcher: MudrAA Protocol Initialized with Rajmudra Verification Engine");
    Ok(())
}
