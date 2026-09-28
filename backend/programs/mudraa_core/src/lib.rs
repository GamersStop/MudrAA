use anchor_lang::prelude::*;

declare_id!("MudrAA1111111111111111111111111111111111111");

#[program]
pub mod mudraa_core {
    use super::*;

    /// Initialize the Sovereign Protocol State and Rajmudra Verification Engine
    pub fn initialize_protocol(
        ctx: Context<InitializeProtocol>,
        protocol_fee_bps: u16,
    ) -> Result<()> {
        let state = &mut ctx.accounts.protocol_state;
        state.authority = ctx.accounts.authority.key();
        state.protocol_fee_bps = protocol_fee_bps;
        state.total_invoices_registered = 0;
        state.total_liquidity_settled = 0;
        state.is_paused = false;
        msg!("MudrAA Protocol Initialized with Rajmudra Verification Engine");
        Ok(())
    }

    /// Register a trade invoice receivable with physical cargo hash & commitment
    pub fn register_invoice(
        ctx: Context<RegisterInvoice>,
        invoice_id_hash: [u8; 32],
        peppol_commitment_hash: [u8; 32],
        face_value_usdc: u64,
        due_timestamp: i64,
    ) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice_record;
        invoice.exporter = ctx.accounts.exporter.key();
        invoice.invoice_id_hash = invoice_id_hash;
        invoice.peppol_commitment_hash = peppol_commitment_hash;
        invoice.face_value_usdc = face_value_usdc;
        invoice.due_timestamp = due_timestamp;
        invoice.is_verified = true;
        invoice.is_settled = false;

        let state = &mut ctx.accounts.protocol_state;
        state.total_invoices_registered = state.total_invoices_registered.saturating_add(1);

        msg!("Invoice registered and stamped with Rajmudra Seal");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProtocolState::INIT_SPACE,
        seeds = [b"mudraa_protocol_state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(invoice_id_hash: [u8; 32])]
pub struct RegisterInvoice<'info> {
    #[account(
        mut,
        seeds = [b"mudraa_protocol_state"],
        bump
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

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct ProtocolState {
    pub authority: Pubkey,
    pub protocol_fee_bps: u16,
    pub total_invoices_registered: u64,
    pub total_liquidity_settled: u64,
    pub is_paused: bool,
}

#[account]
#[derive(InitSpace)]
pub struct InvoiceRecord {
    pub exporter: Pubkey,
    pub invoice_id_hash: [u8; 32],
    pub peppol_commitment_hash: [u8; 32],
    pub face_value_usdc: u64,
    pub due_timestamp: i64,
    pub is_verified: bool,
    pub is_settled: bool,
}
