import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Scale, AlertTriangle, FileText, Lock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MudrAA Sovereign Trade Liquidity",
  description: "Institutional terms of service, sovereign protocol agreements, and legal disclaimers for MudrAA.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Protocol Home</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400">Terms of Service</span>
        </div>

        {/* Header */}
        <header className="space-y-4 border-b border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Institutional Legal Rails</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service &amp; Protocol Agreement
          </h1>
          <p className="font-mono text-xs text-slate-400">
            Version 2.4 • Effective Date: October 2026 • Ashta Pradhan Sovereign Governance
          </p>
        </header>

        {/* Notice Box */}
        <div className="rounded-2xl bg-amber-500/5 border border-amber-500/25 p-5 text-xs text-slate-300 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Non-Custodial Cryptographic Infrastructure Notice</span>
          </div>
          <p>
            MudrAA is a decentralized, non-custodial liquidity and factoring protocol built on the Solana blockchain.
            By connecting a cryptographic keypair (wallet) or interacting with MudrAA smart contracts and offchain relayer services,
            you represent that you are an authorized institutional or commercial participant and agree to be bound by these Terms.
          </p>
        </div>

        {/* Legal Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300 font-sans">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">01.</span>
              Protocol Eligibility &amp; Compliance Verification
            </h2>
            <p>
              Access to MudrAA factoring desks, liquidity vaults, and secondary markets is restricted to verified commercial enterprises, exporters, and accredited institutional liquidity providers.
              Participants must not be located in, incorporated in, or residents of any jurisdiction subject to sanctions administered by OFAC, the United Nations, the European Union, or Indian statutory authorities.
            </p>
            <p>
              Users acknowledge that sovereign identity and business legitimacy are cryptographically attested via Panditrao KYB registries and zero-knowledge credentials.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">02.</span>
              Non-Custodial Architecture &amp; Key Custody
            </h2>
            <p>
              MudrAA does not take custody of user assets, cryptographic private keys, or corporate treasury funds at any time.
              All transactions (deposit, factoring advance draw, debt note transfer, yield claim) occur directly via decentralized Solana programs (smart contracts).
              You bear sole responsibility for safeguarding your cryptographic private keys and device security.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">03.</span>
              Groth16 Zero-Knowledge Verification &amp; Trade Ingestion
            </h2>
            <p>
              When invoices and electronic Bills of Lading (e-BLs) are submitted through the Exporter Factoring Station, invoice privacy is guaranteed through client-side Groth16 zero-knowledge proofs.
              The protocol verifies:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 font-mono text-xs">
              <li>Peppol BIS 3.0 cryptographic hash commitment</li>
              <li>Nullifier registry anti-double-financing check</li>
              <li>Carrier AIS GPS tracking and electronic Customs authorization</li>
            </ul>
            <p>
              Submitting fraudulent, duplicate, or counterfeit trade documents triggers automatic blacklisting across the Panditrao KYB Registry and forfeiture of protocol access.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">04.</span>
              Liquidity Desk Operations &amp; Risk Disclosure
            </h2>
            <p>
              Participation in Senior Tranches (fixed target yield, seniority in repayment waterfall) and Junior Tranches (first-loss underwriting, higher variable APY) carries inherent financial risks:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0F1320] border border-slate-800 space-y-1">
                <span className="font-mono text-xs text-amber-400 font-bold block">Senior Debt Tranche (6% Target)</span>
                <p className="text-xs text-slate-400">
                  Protected by junior first-loss subordination and physical cargo recourse. Yield distributions depend on importer invoice settlement.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1320] border border-slate-800 space-y-1">
                <span className="font-mono text-xs text-cyan-400 font-bold block">Junior First-Loss Tranche (18% Target)</span>
                <p className="text-xs text-slate-400">
                  Absorbs default losses in exchange for higher factoring fee distribution. Capital is at risk if international obligors fail to honor commitments.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">05.</span>
              Ashta Pradhan Sovereign Governance &amp; Circuit Breakers
            </h2>
            <p>
              To protect capital from systemic exploits or network anomalies, MudrAA deploys sovereign guardian roles (Senapati Emergency Pause, Peshawa Protocol Controller).
              In an extreme emergency event, the protocol may temporarily pause underwriting or liquidations to protect depositors.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">06.</span>
              Governing Law &amp; Nyayadhish Arbitration
            </h2>
            <p>
              These Terms and any cross-border claims arising out of trade financing transactions shall be resolved pursuant to international commercial arbitration standards under UNCITRAL rules, honoring the sovereign dispute resolution framework set forth in the Nyayadhish legal charter.
            </p>
          </section>
        </div>

        {/* Bottom Contact / Revision */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div>Have questions? Contact legal@mudraa.finance</div>
          <div className="flex gap-4 text-amber-400">
            <Link href="/privacy" className="hover:underline">
              Privacy &amp; Cookie Policy →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
