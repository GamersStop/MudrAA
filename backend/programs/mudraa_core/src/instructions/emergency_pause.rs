use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::ProtocolState;

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
    #[account(
        mut,
        seeds = [b"mudraa_protocol_state"],
        bump = protocol_state.bump,
        has_one = authority @ MudraaError::UnauthorizedSigner
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    pub authority: Signer<'info>,
}

pub fn handler_pause(ctx: Context<EmergencyPause>) -> Result<()> {
    let state = &mut ctx.accounts.protocol_state;
    state.is_paused = true;
    msg!("Peshawa Dispatcher: Emergency Circuit Breaker TRIGGERED. Disbursements halted.");
    Ok(())
}

pub fn handler_unpause(ctx: Context<EmergencyPause>) -> Result<()> {
    let state = &mut ctx.accounts.protocol_state;
    state.is_paused = false;
    msg!("Peshawa Dispatcher: Protocol operations RESUMED by sovereign authority.");
    Ok(())
}
