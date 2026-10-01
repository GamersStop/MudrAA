use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct NullifierRecord {
    pub supplier: Pubkey,
    pub nullifier_hash: [u8; 32],
    pub registered_at_slot: u64,
    pub is_spent: bool,
    pub bump: u8,
}
