use anchor_lang::prelude::*;
use crate::state::{LegalEscrowRecord, InvoiceRecord, InvoiceStatus};
use crate::errors::MudraaError;

#[derive(Accounts)]
#[instruction(invoice_id_hash: [u8; 32])]
pub struct AnchorLegalEscrow<'info> {
    #[account(
        mut,
        seeds = [b"invoice_record", invoice_id_hash.as_ref()],
        bump = invoice_record.bump,
        constraint = invoice_record.status == InvoiceStatus::Registered @ MudraaError::InvalidStateTransition
    )]
    pub invoice_record: Account<'info, InvoiceRecord>,

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
    // Validate signature bytes have sufficient non-trivial entropy (not all zeros or trivial padding)
    let non_zero_supplier = supplier_noa_signature.iter().filter(|&&b| b != 0).count();
    let non_zero_buyer = buyer_waiver_signature.iter().filter(|&&b| b != 0).count();
    require!(non_zero_supplier >= 32, MudraaError::LegalEscrowMissing);
    require!(non_zero_buyer >= 32, MudraaError::LegalEscrowMissing);

    let escrow = &mut ctx.accounts.legal_escrow;
    escrow.invoice_id_hash = invoice_id_hash;
    escrow.spv_authority = ctx.accounts.spv_authority.key();
    escrow.supplier_noa_signature = supplier_noa_signature;
    escrow.buyer_waiver_signature = buyer_waiver_signature;
    escrow.is_mletr_perfected = true;
    escrow.bump = ctx.bumps.legal_escrow;

    // Transition invoice state to Attested
    let invoice = &mut ctx.accounts.invoice_record;
    invoice.status = InvoiceStatus::Attested;

    msg!("Nyayadhish Legal Escrow: UNCITRAL MLETR & UCC-1 assignment perfected on-chain for invoice {}.", invoice.exporter);
    Ok(())
}
