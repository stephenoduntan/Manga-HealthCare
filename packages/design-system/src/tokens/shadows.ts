/**
 * MANGA HEALTHCARE — Elevation & Shadow Tokens
 * August Health warm-brown elevation shadows instead of cold gray
 */

export const shadows = {
  // Warm brown elevation shadows
  warmLg: 'rgba(75, 68, 57, 0.1) 0px 12px 24px 0px, rgba(75, 68, 57, 0.1) 0px 48px 48px 0px',
  warmMd: 'rgba(75, 68, 57, 0.08) 0px 8px 16px 0px, rgba(75, 68, 57, 0.04) 0px 32px 32px 0px',
  warmSm: 'rgba(75, 68, 57, 0.05) 0px 4px 4px 0px, rgba(75, 68, 57, 0.08) 0px 32px 16px 0px',
  cta: 'rgba(75, 68, 57, 0.1) 0px 12px 24px 0px',

  // Subtle inset shadows for metric rings and inset panels
  insetSubtle: 'rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(75, 68, 57, 0.05) 0px 1px 2px 0px',
} as const;

export const radii = {
  pill: '9999px',       // Buttons, tags, badges, nav capsule
  bento: '24px',        // Feature/metric bento cards (Bevel style)
  clinical: '16px',     // Clinical EHR cards & modal containers
  innerCard: '14px',    // Form inputs and inner documentation rows (Ease style)
  sm: '8px',            // Minor badges and chips
} as const;

export type Shadows = typeof shadows;
export type Radii = typeof radii;
