# MudrAA Design System

## Brand Identity
MudrAA is an institutional-grade sovereign trade liquidity protocol built on Solana L1. The visual identity fuses Chhatrapati Shivaji Maharaj's Maratha royal governance philosophy with cryptographic cybernetics.

## Colour Palette
- **Obsidian Void** `#06070A` — Primary background, the fortress at night
- **Radiant Gold** `#F59E0B` / `#FCD34D` — Royal authority, CTA accents, headlines
- **Solana Violet** `#9945FF` — Protocol identity, neon accents
- **Electric Cyan** `#00F2FE` — Telemetry, circuit traces, secondary neon
- **Emerald Green** `#14F195` — Positive state, Solana L1 identity
- **Deep Charcoal** `#111318` — Card surfaces, glass panels

## Typography
- **Display / Headline** — Playfair Display (serif authority) — used for H1–H2 level, gold coloured
- **Interface / Body** — Plus Jakarta Sans — used for all UI text, descriptions, nav links
- **Telemetry / Monospace** — JetBrains Mono — used for TVL, APY, hash values, code

## Graphic Language
- **Ashtakona (8-sided) polygon** `clip-path: polygon(29.29% 0%, 70.71% 0%, 100% 29.29%, 100% 70.71%, 70.71% 100%, 29.29% 100%, 0% 70.71%, 0% 29.29%)` — primary geometric motif for badges, icon containers, hero medallion
- **PCB circuit-trace lines** — radiate from the central medallion, very low opacity cyan #00F2FE ~5%
- **Gold radial glow halo** — behind the central Ashtakona coin
- **Neon frame accents** — purple-to-cyan gradient at page corners / section borders
- **Glassmorphism cards** — `rgba(17, 19, 24, 0.7)` with 1px gold border `rgba(245, 158, 11, 0.3)`

## Component Tokens
```css
:root {
  --color-void: #06070A;
  --color-gold: #F59E0B;
  --color-gold-light: #FCD34D;
  --color-violet: #9945FF;
  --color-cyan: #00F2FE;
  --color-green: #14F195;
  --color-surface: rgba(17,19,24,0.7);
  --border-gold: 1px solid rgba(245,158,11,0.3);
  --ashtakona: polygon(29.29% 0%,70.71% 0%,100% 29.29%,100% 70.71%,70.71% 100%,29.29% 100%,0% 70.71%,0% 29.29%);
}
```