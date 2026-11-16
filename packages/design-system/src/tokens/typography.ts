/**
 * MANGA HEALTHCARE — Typography Tokens
 * Strict Editorial Rule: Serif headings MUST be regular weight (400) or light (300). NEVER bold.
 */

export const typography = {
  fonts: {
    serif: "'DM Serif Display', 'Cormorant Garamond', Georgia, serif",
    sans: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    // Note: Do NOT use bold (700+) for serif headings!
  },
  scale: {
    caption: {
      size: '12px',
      lineHeight: '1.4',
      tracking: '0px',
    },
    bodySm: {
      size: '14px',
      lineHeight: '1.5',
      tracking: '0px',
    },
    body: {
      size: '16px',
      lineHeight: '1.6',
      tracking: '0px',
    },
    subheading: {
      size: '20px',
      lineHeight: '1.3',
      tracking: '-0.01em',
    },
    headingSm: {
      size: '24px',
      lineHeight: '1.3',
      tracking: '-0.01em',
    },
    heading: {
      size: '32px',
      lineHeight: '1.15',
      tracking: '-0.02em',
    },
    headingLg: {
      size: '48px',
      lineHeight: '1.1',
      tracking: '-0.03em',
    },
    display: {
      size: '64px',
      lineHeight: '1.05',
      tracking: '-0.03em',
    },
  },
  eyebrow: {
    size: '11px',
    weight: 600,
    tracking: '0.08em',
    transform: 'uppercase',
  },
  openTypeFeatures: {
    sans: '"ss03" 1',
  },
} as const;

export type Typography = typeof typography;
