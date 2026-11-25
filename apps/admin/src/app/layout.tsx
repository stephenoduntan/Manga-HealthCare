import type { Metadata } from 'next';
import React from 'react';
import { DM_Serif_Display, DM_Sans } from 'next/font/google';
import { AdminShell } from '@/components/AdminShell';
import './globals.css';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Manga Healthcare — Admin & Clinical Operations Back Office',
  description:
    'Internal governance command center for live clinical queue monitoring, MDCN doctor verification, emergency divert audits, and booking dispute resolution.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased min-h-screen bg-[#f8f3eb] text-[#222326] font-sans flex flex-col pb-16"
        suppressHydrationWarning
      >
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
