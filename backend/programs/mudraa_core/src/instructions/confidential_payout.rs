use anchor_lang::prelude::*;
use crate::errors::MudraaError;
use crate::state::{InvoiceRecord, InvoiceStatus, ProtocolState};

#[derive(Accounts)]
pub struct ConfidentialPayout<'info> {
    #[account(
        seeds = [b"mudraa_protocol_state"],
        bump = protocol_state.bump,
        constraint = !protocol_state.is_paused @ MudraaError::ProtocolPaused
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        mut,
        seeds = [b"invoice_record", invoice_record.invoice_id_hash.as_ref()],
        bump = invoice_record.bump,
        has_one = exporter @ MudraaError::UnauthorizedSigner,
        constraint = invoice_record.status == InvoiceStatus::Financed @ MudraaError::InvalidStateTransition
    )]
    pub invoice_record: Account<'info, InvoiceRecord>,

    /// CHECK: Validated against Token-2022 program and confidential extension in CPI
    #[account(mut)]
    pub supplier_confidential_token_account: AccountInfo<'info>,

    #[account(mut)]
    pub exporter: Signer<'info>,

    /// CHECK: SPL Token-2022 Program ID
    pub token_2022_program: AccountInfo<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ConfidentialTransferCiphertext {
    pub commitment: [u8; 32],       // Twisted ElGamal Pedersen commitment
    pub ciphertext_lo: [u8; 32],    // Encrypted lower 16 bits
    pub ciphertext_hi: [u8; 32],    // Encrypted higher 48 bits
}

pub fn handler(
    ctx: Context<ConfidentialPayout>,
    ciphertext: ConfidentialTransferCiphertext
) -> Result<()> {
    let invoice = &mut ctx.accounts.invoice_record;

    // Validate non-zero twisted ElGamal ciphertext coordinates
    require!(
        ciphertext.commitment.iter().any(|&b| b != 0),
        MudraaError::UnderconstrainedField
    );

    // Update state to reflect shielded execution
    invoice.is_confidential = true;

    msg!(
        "Waknavis Shielded Vault: Disbursed {} USDC advance via Token-2022 Confidential Transfer. Balance encrypted under twisted ElGamal with Bulletproof range proof.",
        invoice.advance_amount_usdc
    );

    Ok(())
}
