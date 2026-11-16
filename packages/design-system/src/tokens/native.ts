/**
 * MANGA HEALTHCARE — React Native Specific Design Tokens
 * Provides clean numeric values for StyleSheet compatibility in Expo/React Native.
 */

import { colors } from './colors';

export const nativeColors = colors;

export const nativeRadii = {
  pill: 9999,
  bento: 24,
  clinical: 16,
  innerCard: 14,
  sm: 8,
} as const;

export const nativeSpacing = {
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  14: 14,
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
} as const;

export const nativeTypography = {
  display: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '400' as const,
  },
  headingLg: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400' as const,
  },
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  headingSm: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySm: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
} as const;

export const nativeShadows = {
  warmSm: {
    shadowColor: '#4b4439',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  warmLg: {
    shadowColor: '#4b4439',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
