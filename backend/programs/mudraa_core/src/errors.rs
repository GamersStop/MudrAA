use anchor_lang::prelude::*;

#[error_code]
pub enum MudraaError {
    #[msg("Senapati Citadel: Duplicate pledge detected. This nullifier has already been spent.")]
    DuplicatePledgeDetected,

    #[msg("Unauthorized signer for the requested sovereign instruction.")]
    UnauthorizedSigner,

    #[msg("Sachiv Verifier: Invalid Groth16 zero-knowledge proof coordinates or pairing check failure.")]
    InvalidGroth16Proof,

    #[msg("Circuit field element exceeds BN254 field modulus.")]
    InvalidFieldElement,

    #[msg("Input parameters violate circuit range constraints (Num2Bits bound breach).")]
    UnderconstrainedField,

    #[msg("Pyth Network FX oracle confidence interval is too wide (> 0.5%).")]
    OracleConfidenceTooWide,

    #[msg("Pyth Network FX oracle price feed is stale (> 60 seconds old).")]
    StaleOracleFeed,

    #[msg("Amatya Treasury: Insufficient tranche pool liquidity to finance invoice advance.")]
    InsufficientPoolLiquidity,

    #[msg("Peshawa Dispatcher: Protocol operations are currently paused by sovereign authority.")]
    ProtocolPaused,

    #[msg("Invalid state transition in invoice lifecycle state machine.")]
    InvalidStateTransition,

    #[msg("Nyayadhish Escrow: Missing or invalid UNCITRAL MLETR dual-signed legal assignment.")]
    LegalEscrowMissing,

    #[msg("Recourse window has expired; invoice is in delinquent default status.")]
    RecourseWindowExpired,

    #[msg("Repayment waterfall amount exceeds remaining outstanding debt.")]
    OverpaymentExceeded,

    #[msg("Arithmetic overflow or underflow detected in financial accounting.")]
    MathOverflow,
}
