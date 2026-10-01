use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum InvoiceStatus {
    Registered,
    Attested,
    Financed,
    PartiallySettled,
    FullyRepaid,
    Delinquent,
    RecourseBuyback,
    DefaultSlashed,
}

#[account]
#[derive(InitSpace)]
pub struct InvoiceRecord {
    pub exporter: Pubkey,
    pub importer_wallet: Pubkey,
    pub invoice_id_hash: [u8; 32],
    pub peppol_commitment_hash: [u8; 32],
    pub face_value_usdc: u64,
    pub advance_amount_usdc: u64,
    pub dilution_reserve_usdc: u64,
    pub retainage_usdc: u64,
    pub total_repaid_usdc: u64,
    pub due_timestamp: i64,
    pub financed_at_slot: u64,
    pub status: InvoiceStatus,
    pub is_confidential: bool,
    pub bump: u8,
}
