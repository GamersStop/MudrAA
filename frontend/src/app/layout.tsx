import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mudraa.finance"),
  title: "MudrAA | Sovereign Trade Liquidity & Verification Engine on Solana",
  description:
    "Institutional-grade sovereign trade finance protocol on Solana powered by the Rajmudra Verification Engine. Eliminating duplicate-pledge fraud, enforcing physical freight provenance, and settling confidential enterprise credit.",
  keywords: [
    "MudrAA",
    "Solana",
    "Trade Finance",
    "Rajmudra",
    "Ashta Pradhan",
    "Zero Knowledge",
    "SPL Token-2022",
    "RWA",
    "Peppol BIS 3.0",
    "Confidential Transfers",
  ],
  authors: [{ name: "MudrAA Protocol Foundation" }],
  openGraph: {
    title: "MudrAA | Sovereign Trade Liquidity on Solana",
    description:
      "Powered by the Rajmudra Verification Engine. Institutional credit allocation and zero-knowledge freight provenance.",
    url: "https://mudraa.finance",
    siteName: "MudrAA Protocol",
    images: [
      {
        url: "/assets/banner.png",
        width: 1920,
        height: 1080,
        alt: "MudrAA Sovereign Verification Engine on Solana",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MudrAA | Sovereign Trade Liquidity on Solana",
    description:
      "Eliminating duplicate-pledge systemic fraud, enforcing physical freight provenance, and settling confidential enterprise credit.",
    images: ["/assets/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-mudraa-obsidian text-slate-100 antialiased selection:bg-mudraa-purple selection:text-white">
        {children}
      </body>
    </html>
  );
}
