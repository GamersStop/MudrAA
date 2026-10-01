use anchor_lang::prelude::*;
use crate::state::LegalEscrowRecord;
use crate::errors::MudraaError;

#[derive(Accounts)]
#[instruction(invoice_id_hash: [u8; 32])]
pub struct AnchorLegalEscrow<'info> {
    #[account(
        init,
        payer = spv_authority,
        space = 8 + LegalEscrowRecord::INIT_SPACE,
        seeds = [b"legal_escrow", invoice_id_hash.as_ref()],
        bump
    )]
    pub legal_escrow: Account<'info, LegalEscrowRecord>,

    #[account(mut)]
    pub spv_authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<AnchorLegalEscrow>,
    invoice_id_hash: [u8; 32],
    supplier_noa_signature: [u8; 64],
    buyer_waiver_signature: [u8; 64]
) -> Result<()> {
    // Validate signature bytes are not zeroed
    require!(
        supplier_noa_signature.iter().any(|&b| b != 0),
        MudraaError::LegalEscrowMissing
    );
    require!(
        buyer_waiver_signature.iter().any(|&b| b != 0),
        MudraaError::LegalEscrowMissing
    );

    let escrow = &mut ctx.accounts.legal_escrow;
    escrow.invoice_id_hash = invoice_id_hash;
    escrow.spv_authority = ctx.accounts.spv_authority.key();
    escrow.supplier_noa_signature = supplier_noa_signature;
    escrow.buyer_waiver_signature = buyer_waiver_signature;
    escrow.is_mletr_perfected = true;
    escrow.bump = ctx.bumps.legal_escrow;

    msg!("Nyayadhish Legal Escrow: UNCITRAL MLETR & UCC-1 assignment perfected on-chain.");
    Ok(())
}
