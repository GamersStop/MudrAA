import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, EyeOff, Lock, Database, Cookie, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy | MudrAA Sovereign Trade Liquidity",
  description: "Cryptographic privacy policy, zero-knowledge data architecture, and local storage disclosures for MudrAA.",
};

export default function PrivacyPolicyPage() {
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
          <span className="text-amber-400">Privacy &amp; Cookie Policy</span>
        </div>

        {/* Header */}
        <header className="space-y-4 border-b border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-wider">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Privacy Architecture</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy &amp; Cookie Disclosure
          </h1>
          <p className="font-mono text-xs text-slate-400">
            Version 2.4 • Effective Date: October 2026 • Rajmudra Cryptographic Shield
          </p>
        </header>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#090C15] border border-slate-800 space-y-1.5">
            <div className="text-amber-400 flex items-center gap-1.5 font-bold">
              <Lock className="w-4 h-4" />
              <span>Zero Custody</span>
            </div>
            <p className="text-slate-400">
              No private keys, passwords, or personal credentials stored on any server.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090C15] border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 flex items-center gap-1.5 font-bold">
              <EyeOff className="w-4 h-4" />
              <span>ZK Invoice Privacy</span>
            </div>
            <p className="text-slate-400">
              Trade amounts and supplier identities are shielded using Groth16 zero-knowledge proofs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090C15] border border-slate-800 space-y-1.5">
            <div className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <Cookie className="w-4 h-4" />
              <span>Zero Ad Trackers</span>
            </div>
            <p className="text-slate-400">
              Zero tracking cookies, zero cross-site surveillance, and zero third-party ad pixels.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300 font-sans">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">01.</span>
              Information Handled by the Protocol
            </h2>
            <p>
              MudrAA operates on public distributed ledger rails (Solana Devnet and Mainnet).
              By nature of blockchain design, transaction records involving public keys, program calls, and token transfers are permanently visible on the public Solana ledger.
            </p>
            <p>
              When factoring requests are submitted, our offchain relayer computes Poseidon cryptographic hash commitments of the underlying Peppol BIS 3.0 XML invoice.
              Raw commercial counterparty details are retained client-side or in encrypted localized storage; only cryptographic proofs are verified on-chain.
            </p>
          </section>

          {/* Section 2 - Cookies and Local Storage */}
          <section id="cookies" className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base font-bold">02.</span>
              <h2 className="font-headline text-xl font-bold text-white tracking-tight">
                Cookies &amp; Local Storage Disclosure
              </h2>
            </div>
            <p>
              Under global regulatory privacy standards (EU GDPR, UK DPA, California CCPA, and India DPDP Act 2023), users have the right to transparent information regarding client storage:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090C15]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-900/60 text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Key Identifier</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-400">
                  <tr>
                    <td className="py-3 px-4 text-amber-300">mudraa_wallet_session</td>
                    <td className="py-3 px-4">localStorage</td>
                    <td className="py-3 px-4">Stores public wallet address and connection status across reloads</td>
                    <td className="py-3 px-4 text-emerald-400">Strictly Necessary</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-amber-300">mudraa_user_role</td>
                    <td className="py-3 px-4">localStorage</td>
                    <td className="py-3 px-4">Preserves active RBAC persona (Admin, Exporter, Lender, Auditor)</td>
                    <td className="py-3 px-4 text-emerald-400">Strictly Necessary</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-amber-300">mudraa_storage_consent</td>
                    <td className="py-3 px-4">localStorage</td>
                    <td className="py-3 px-4">Records user acknowledgment of cryptographic storage notice</td>
                    <td className="py-3 px-4 text-emerald-400">Strictly Necessary</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-amber-300">mudraa_role_confirmed</td>
                    <td className="py-3 px-4">localStorage</td>
                    <td className="py-3 px-4">Prevents repetitive modal prompt for demo evaluation sessions</td>
                    <td className="py-3 px-4 text-emerald-400">Strictly Necessary</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400">
              MudrAA does <strong>not</strong> use advertising cookies, marketing pixels (such as Google Ads, Meta Pixel, or TikTok tracker), or third-party behavioral profiling trackers.
            </p>
          </section>

          {/* Section 3 - CSRF and Network Security */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">03.</span>
              CSRF, Cookies &amp; Network Security Protections
            </h2>
            <p>
              MudrAA implements defense-in-depth security to protect user sessions and communication:
            </p>
            <ul className="space-y-2 text-slate-300 text-xs font-mono">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict CORS Boundaries:</strong> Backend offchain services reject requests from unauthorized origins and enforce rigorous preflight checks.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Anti-CSRF Architecture:</strong> We do not rely on vulnerable ambient cookie credentials for state-altering transactions; all on-chain actions require explicit Ed25519 cryptographic signatures from your wallet.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Hardened Security Headers:</strong> Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options (DENY), and Permissions-Policy are enforced on every response.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>XML External Entity (XXE) Protection:</strong> Peppol BIS parsing utilizes <code className="text-amber-300">defusedxml</code> to thwart XML entity expansion and server-side request forgery (SSRF).
                </span>
              </li>
            </ul>
          </section>

          {/* Section 4 - Global Data Rights */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400 font-mono text-base">04.</span>
              User Rights &amp; Data Erasure
            </h2>
            <p>
              Users may clear all local state at any time by signing out from the top navigation bar or clearing browser local storage.
              Because on-chain transaction records and nullifier roots are immutable by mathematical protocol law on Solana, on-chain state cannot be altered or retroactively erased once submitted to consensus.
            </p>
          </section>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div>Inquiries: security@mudraa.finance</div>
          <div className="flex gap-4 text-amber-400">
            <Link href="/terms" className="hover:underline">
              Terms of Service Agreement →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
