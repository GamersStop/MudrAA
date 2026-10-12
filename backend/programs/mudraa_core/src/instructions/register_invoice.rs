use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::{InvoiceRecord, InvoiceStatus, ProtocolState};

#[derive(Accounts)]
#[instruction(invoice_id_hash: [u8; 32])]
pub struct RegisterInvoice<'info> {
    #[account(
        seeds = [b"mudraa_protocol_state"],
        bump = protocol_state.bump,
        constraint = !protocol_state.is_paused @ MudraaError::ProtocolPaused
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        init,
        payer = exporter,
        space = 8 + InvoiceRecord::INIT_SPACE,
        seeds = [b"invoice_record", invoice_id_hash.as_ref()],
        bump
    )]
    pub invoice_record: Account<'info, InvoiceRecord>,

    #[account(mut)]
    pub exporter: Signer<'info>,

    /// CHECK: Importer wallet address (counterparty)
    pub importer_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RegisterInvoice>,
    invoice_id_hash: [u8; 32],
    peppol_commitment_hash: [u8; 32],
    face_value_usdc: u64,
    due_timestamp: i64,
) -> Result<()> {
    require!(face_value_usdc >= 1_000_000_000, MudraaError::UnderconstrainedField); // >= 1,000 USDC
    let clock = Clock::get()?;
    require!(due_timestamp > clock.unix_timestamp, MudraaError::UnderconstrainedField);

    let invoice = &mut ctx.accounts.invoice_record;
    invoice.exporter = ctx.accounts.exporter.key();
    invoice.importer_wallet = ctx.accounts.importer_wallet.key();
    invoice.invoice_id_hash = invoice_id_hash;
    invoice.peppol_commitment_hash = peppol_commitment_hash;
    invoice.face_value_usdc = face_value_usdc;
    invoice.advance_amount_usdc = 0;
    invoice.dilution_reserve_usdc = 0;
    invoice.retainage_usdc = 0;
    invoice.total_repaid_usdc = 0;
    invoice.due_timestamp = due_timestamp;
    invoice.last_fee_accrual_timestamp = due_timestamp;
    invoice.financed_at_slot = 0;
    invoice.status = InvoiceStatus::Registered;
    invoice.is_confidential = false;
    invoice.bump = ctx.bumps.invoice_record;

    msg!(
        "Peshawa Ingestion: Successfully registered on-chain InvoiceRecord. Exporter: {}, FaceValue: {} base units",
        invoice.exporter,
        face_value_usdc
    );

    Ok(())
}
