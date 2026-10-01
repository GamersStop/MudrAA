use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct KybRegistry {
    pub wallet: Pubkey,
    pub kyb_tier: u8, // 1 = Exporter, 2 = Buyer, 3 = Institutional LP, 4 = Auditor
    pub is_verified: bool,
    pub is_sanctioned: bool, // OFAC / Sanctions flag
    pub verified_at_slot: u64,
    pub bump: u8,
}
