"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Lock,
  Receipt,
  FileCheck2,
  Terminal,
  Check,
  Copy,
  ChevronRight,
  Play,
  ShieldCheck,
} from "lucide-react";

export const InstitutionalInfrastructure: React.FC = () => {
  const [slot, setSlot] = useState(264891048);
  const [copied, setCopied] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "solana-cli mudraa telemetry --live",
    "Connected to Anchor RPC :: cluster=mainnet-beta latency=392ms",
    "Rajmudra ZK Verifier alt_bn128 ready. Slot synced.",
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlot((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = () => {
    const code = `// 1. Ingesting Peppol BIS 3.0 Commercial Bill of Lading
pub fn verify_and_lock_collateral(
    ctx: Context<SovereignVaultDispatch>,
    invoice_merkle_root: [u8; 32],
    zk_proof_bytes: Vec<u8>,
    jurisdiction_code: "MLETR-SG-2021",
) -> Result<()> {
    // Check anti-fraud double pledge registry across all clusters
    require!(!senapati_citadel::is_pledged(&invoice_merkle_root), ErrorCode::DuplicatePledgeCollateral);
    // Rajmudra Zero-Knowledge Groth16 verification
    sachiv_commitment::verify_state_seal(&zk_proof_bytes, &invoice_merkle_root)?;
    // SPL-Token2022 Confidential Transfer Escrow instruction
    amatya_vault::mint_wrapped_receivable(ctx, invoice_valuation_usd)?;
    msg!("॥ राजमुद्रा प्रमाणीकरण संपन्न ॥ Collateral perfect under Solana slot #264891048");
    Ok(())
}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response = "";
    if (cmd === "help") {
      response = "Available commands: status, verify, slot, zk, peers, clear";
    } else if (cmd === "status") {
      response = "STATUS: ONLINE | Consensus=400ms | 0 Collisions | 100% Provenance";
    } else if (cmd === "verify") {
      response = "✔ ZK-SNARK proof validated via alt_bn128 curve in 38.4ms. Hash: 0x9f2a...8c1e";
    } else if (cmd === "slot") {
      response = `CURRENT SLOT: ${slot.toLocaleString()} (Epoch 698)`;
    } else if (cmd === "zk") {
      response = "ZK CIRCOM CIRCUIT: RajmudraGroth16 v3.4.12 | Constraints: 28,492 | Public Inputs: 4";
    } else if (cmd === "peers") {
      response = "Active institutional validators: 1,842 nodes worldwide";
    } else if (cmd === "clear") {
      setTerminalLogs([]);
      setTerminalInput("");
      return;
    } else {
      response = `Command '${cmd}' not recognized. Type 'help' for options.`;
    }

    setTerminalLogs((prev) => [...prev, `> ${terminalInput}`, response]);
    setTerminalInput("");
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto" id="institutions">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Institutional Architecture highlights */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00F2FE]/10 border border-[#00F2FE]/30 rounded text-[#00F2FE] font-mono text-xs uppercase tracking-widest w-max">
            <span>ENTERPRISE SPECIFICATIONS</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">
            Institutional Infrastructure Built for Sovereign Scale
          </h2>

          <p className="font-body text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            MudrAA reconciles off-chain maritime &amp; supply-chain realities with Solana L1 execution speed. Trade finance instruments achieve non-fungible legal perfection with microsecond cryptographic finality.
          </p>

          {/* Highlight Feature Cards */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="p-4 bg-[#111318]/80 border border-slate-800 hover:border-[#00F2FE]/40 rounded-xl flex items-start gap-4 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5 text-[#00F2FE]" />
              </div>
              <div>
                <h4 className="font-body font-bold text-slate-200 text-sm">
                  SPL Token-2022 Confidential Transfers
                </h4>
                <p className="font-body text-xs text-slate-400 mt-1 leading-relaxed">
                  Cryptographically obscure payment volumes while allowing designated regulatory authorities real-time cryptographic audit views via ElGamal encryption.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#111318]/80 border border-slate-800 hover:border-[#F59E0B]/40 rounded-xl flex items-start gap-4 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center shrink-0 mt-0.5">
                <Receipt className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <h4 className="font-body font-bold text-slate-200 text-sm">
                  Peppol BIS 3.0 Canonical Standard
                </h4>
                <p className="font-body text-xs text-slate-400 mt-1 leading-relaxed">
                  Direct ingestion and validation of universal electronic invoices, cross-referencing invoice hashes against the Rajmudra global double-pledge registry.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#111318]/80 border border-slate-800 hover:border-[#9945FF]/40 rounded-xl flex items-start gap-4 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#9945FF]/10 border border-[#9945FF]/30 flex items-center justify-center shrink-0 mt-0.5">
                <FileCheck2 className="w-5 h-5 text-[#9945FF]" />
              </div>
              <div>
                <h4 className="font-body font-bold text-slate-200 text-sm">
                  MLETR Digital Bill of Lading Perfection
                </h4>
                <p className="font-body text-xs text-slate-400 mt-1 leading-relaxed">
                  Seamless transition of possessory title from sea cargo manifests directly into Solana program ownership with irrevocable legal perfection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Network Telemetry Terminal IDE */}
        <div
          className="lg:col-span-6 bg-[#0B0D13] border border-[#F59E0B]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          id="terminal-ide"
        >
          {/* Terminal Window Header */}
          <div className="px-4 py-3 bg-[#111318] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-400 truncate max-w-[200px] sm:max-w-none">
                mudaa-core-validator :: anchor-rpc-v0.29.0
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer mr-2 flex items-center gap-1 text-[11px] font-mono"
                title="Copy Anchor Rust contract code"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#14F195]" />
                    <span className="text-[#14F195]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Rust</span>
                  </>
                )}
              </button>

              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping" />
              <span className="font-mono text-[10px] text-[#14F195] hidden sm:inline">
                RPC: MAINNET-BETA
              </span>
            </div>
          </div>

          {/* Terminal Telemetry Stats Row */}
          <div className="grid grid-cols-3 bg-[#06070A]/90 border-b border-slate-800/80 p-3 text-center">
            <div className="border-r border-slate-800/80">
              <span className="block font-mono text-[10px] text-slate-500 uppercase">
                CURRENT SLOT
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">
                {slot.toLocaleString()}
              </span>
            </div>
            <div className="border-r border-slate-800/80">
              <span className="block font-mono text-[10px] text-slate-500 uppercase">
                CONSENSUS LATENCY
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#00F2FE]">
                392 ms
              </span>
            </div>
            <div>
              <span className="block font-mono text-[10px] text-slate-500 uppercase">
                ZK SNARK PROOF
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#F59E0B]">
                Groth16 VALID
              </span>
            </div>
          </div>

          {/* Code View Area with Rust Syntax Highlighting */}
          <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed overflow-x-auto text-slate-300 bg-[#06070A]/60">
            <p className="text-slate-500">// 1. Ingesting Peppol BIS 3.0 Commercial Bill of Lading</p>
            <p>
              <span className="text-[#9945FF]">pub fn</span>{" "}
              <span className="text-[#00F2FE]">verify_and_lock_collateral</span>(
            </p>
            <p className="pl-4">
              ctx: <span className="text-[#FCD34D]">Context</span>&lt;SovereignVaultDispatch&gt;,
            </p>
            <p className="pl-4">
              invoice_merkle_root: [<span className="text-[#F59E0B]">u8</span>;{" "}
              <span className="text-[#00F2FE]">32</span>],
            </p>
            <p className="pl-4">
              zk_proof_bytes: <span className="text-[#FCD34D]">Vec</span>&lt;
              <span className="text-[#F59E0B]">u8</span>&gt;,
            </p>
            <p className="pl-4">
              jurisdiction_code: <span className="text-[#14F195]">&quot;MLETR-SG-2021&quot;</span>,
            </p>
            <p>) -&gt; <span className="text-[#FCD34D]">Result</span>&lt;()&gt; &#123;</p>
            <p className="pl-4 text-slate-500">
              // Check anti-fraud double pledge registry across all clusters
            </p>
            <p className="pl-4">
              <span className="text-[#9945FF]">require!</span>(!
              <span className="text-[#00F2FE]">senapati_citadel</span>::
              <span className="text-[#F59E0B]">is_pledged</span>(&amp;invoice_merkle_root),
              ErrorCode::DuplicatePledgeCollateral);
            </p>
            <p className="pl-4 text-slate-500">
              // Rajmudra Zero-Knowledge Groth16 verification
            </p>
            <p className="pl-4">
              <span className="text-[#00F2FE]">sachiv_commitment</span>::
              <span className="text-[#F59E0B]">verify_state_seal</span>(&amp;zk_proof_bytes,
              &amp;invoice_merkle_root)?;
            </p>
            <p className="pl-4 text-[#14F195]">
              // SPL-Token2022 Confidential Transfer Escrow instruction
            </p>
            <p className="pl-4">
              <span className="text-[#00F2FE]">amatya_vault</span>::
              <span className="text-[#F59E0B]">mint_wrapped_receivable</span>(ctx,
              invoice_valuation_usd)?;
            </p>
            <p className="pl-4">
              <span className="text-[#9945FF]">msg!</span>(
              <span className="text-[#14F195]">
                &quot;॥ राजमुद्रा प्रमाणीकरण संपन्न ॥ Collateral perfect under Solana slot #{slot}&quot;
              </span>
              );
            </p>
            <p className="pl-4">
              <span className="text-[#FCD34D]">Ok</span>(())
            </p>
            <p>&#125;</p>

            {/* Checkmark Verification Lines */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-1.5">
              <p className="flex items-center gap-2">
                <span className="text-[#14F195]">✔</span>
                <span>
                  Anchor Transaction Confirmed:{" "}
                  <span className="text-slate-500 font-mono">5Kx8q...9T4p</span>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#00F2FE]">✔</span>
                <span>
                  Zero-Knowledge Batch Verification:{" "}
                  <span className="text-slate-500 font-mono">42ms on Solana JIT</span>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#F59E0B]">✔</span>
                <span>
                  Double-Pledge Check:{" "}
                  <span className="text-[#FCD34D] font-bold">Passed (0 Collision Worldwide)</span>
                </span>
              </p>
            </div>
          </div>

          {/* Interactive CLI Input Console */}
          <div className="px-4 py-2.5 bg-black/80 border-t border-slate-800 flex flex-col gap-2 text-xs font-mono">
            {terminalLogs.slice(-3).map((log, i) => (
              <div key={i} className="text-slate-400 text-[11px]">
                {log}
              </div>
            ))}

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-1">
              <span className="text-[#F59E0B] font-bold">mudaa@validator:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type 'help', 'verify', or 'status'..."
                className="flex-1 bg-transparent text-[#00F2FE] outline-none border-none text-xs placeholder:text-slate-600"
              />
              <span className="w-2 h-4 bg-[#F59E0B] animate-pulse" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
