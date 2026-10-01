use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct SyndicateDebtVault {
    pub invoice_id_hash: [u8; 32],
    pub total_syndicated_debt: u64,
    pub total_shares_minted: u64,
    pub share_price_usdc: u64,
    pub target_apy_bps: u16,
    pub bump: u8,
}
