use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct LegalEscrowRecord {
    pub invoice_id_hash: [u8; 32],
    pub spv_authority: Pubkey,
    pub supplier_noa_signature: [u8; 64],
    pub buyer_waiver_signature: [u8; 64],
    pub is_mletr_perfected: bool,
    pub bump: u8,
}
