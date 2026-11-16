/**
 * MANGA HEALTHCARE — Canonical Color Tokens
 * Synthesizing August Health EHR, Bevel, Ease Health, and Chat for Impact
 */

export const colors = {
  // Surfaces & Backgrounds
  creamCanvas: '#f8f3eb',    // August Cream — Default page background
  paperWhite: '#ffffff',     // Pure White — Clinical forms, EHR tables, inner cards
  keylimeWash: '#e1f4df',    // Ease Keylime Wash — Hero & intake panels
  sageMist: '#b1dbb8',       // Ease Sage Mist — Secondary feature/clinical panels
  slateHush: '#b6ced5',      // Ease Slate Hush — Doctor consultation workspace & UI containers
  cloudCard: '#ebf0f8',      // Bevel Cloud Card — Doctor payout ledger & patient metric bento cards
  canopyGreen: '#0a3922',    // Chat for Impact Canopy Green — High-contrast hero & sticky queue banners
  peachWash: '#ffede8',      // Calm surface for Emergency Triage Redirect screen

  // Inks & Typography
  deepInk: '#080331',        // August Deep Ink — Primary headers & display text
  forestInk: '#0f3e17',      // Ease Forest Ink — Botanical primary links & high-emphasis copy
  charcoal: '#222326',       // Bevel Ink — Clinical body & form copy
  bodyGray: '#747679',       // Bevel Body Gray — Helper text, labels, secondary metadata
  inkBlack: '#000000',       // High-contrast dividers & outlines

  // Action CTAs & Highlights
  primaryIndigo: '#4865ff',  // August Primary Indigo — Clinical Web CTA
  coralPulse: '#ff643b',     // Chat for Impact Coral Pulse — Urgent CTA & Emergency Tap-to-Call
  leafBright: '#1dbf73',     // Verification & active status highlight

  // Metrics & Clinical Indicators
  recoveryGreen: '#31ce01',  // Bevel Recovery Green — Verified MDCN, stable, paid
  metricBlue: '#415eee',     // Bevel Metric Blue — In queue, active consultation
  signalGold: '#ffca00',     // Bevel Signal Gold — Pending review, awaiting payout

  // Dividers & Hairlines
  borderMist: '#efeeeb',     // Ease Border Mist — Subtle cards and form borders
  frostGray: '#e0e0e0',      // Neutral form border
} as const;

export type Colors = typeof colors;
