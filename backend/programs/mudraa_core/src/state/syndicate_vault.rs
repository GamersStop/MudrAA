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

#[account]
#[derive(InitSpace)]
pub struct InvestorDebtShareRecord {
    pub invoice_id_hash: [u8; 32],
    pub investor: Pubkey,
    pub shares_owned: u64,
    pub total_usdc_invested: u64,
    pub bump: u8,
}
