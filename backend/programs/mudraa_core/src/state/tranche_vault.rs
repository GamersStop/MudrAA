use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct LiquidityTranchePool {
    pub tranche_type: u8, // 0 = Senior (6% APY), 1 = Junior First-Loss (18% APY)
    pub vault_token_account: Pubkey,
    pub total_deposited: u64,
    pub total_allocated: u64,
    pub target_yield_bps: u16,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct AmatyaReserveVault {
    pub reserve_token_account: Pubkey,
    pub dilution_reserve_balance: u64,
    pub fx_buffer_balance: u64,
    pub reinsurance_reserve_balance: u64,
    pub last_rebalanced_slot: u64,
    pub bump: u8,
}
