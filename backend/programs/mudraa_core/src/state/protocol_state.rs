use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProtocolState {
    pub authority: Pubkey,
    pub protocol_fee_bps: u16,
    pub total_invoices_registered: u64,
    pub total_liquidity_settled: u64,
    pub is_paused: bool,
    pub bump: u8,
}
