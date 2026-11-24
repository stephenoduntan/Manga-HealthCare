'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DM_Serif_Display, DM_Sans } from 'next/font/google';
import {
  ShieldAlert,
  Activity,
  UserCheck,
  FileSpreadsheet,
  BarChart3,
  Lock,
} from 'lucide-react';
import { PersistentEmergencyBar } from '@manga/design-system';
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

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const webOrigin = process.env.NEXT_PUBLIC_MARKETING_ORIGIN || 'http://localhost:3000';

  const navTabs = [
    { label: 'Live Ops', href: '/admin/live-ops', aliases: ['/', '/live-ops', '/admin', '/admin/live-ops'] },
    { label: 'Verifications', href: '/admin/verifications', aliases: ['/doctors', '/verifications', '/admin/verifications'] },
    { label: 'Compliance', href: '/admin/compliance', aliases: ['/redirects', '/compliance', '/admin/compliance'] },
    { label: 'Disputes', href: '/admin/disputes', aliases: ['/disputes', '/admin/disputes'] },
    { label: 'Analytics', href: '/admin/analytics', aliases: ['/analytics', '/admin/analytics'] },
  ];

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
        {/* Admin Top Header */}
        <header className="sticky top-0 z-40 bg-[#0a3922] text-white border-b border-[#0f3e17]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white text-[#0a3922] flex items-center justify-center font-serif text-lg font-bold">
                  M
                </div>
                <div>
                  <span className="font-serif text-xl tracking-tight text-white leading-none block">
                    MANGA
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.14em] text-[#d2f2e3] font-semibold">
                    Admin Back Office
                  </span>
                </div>
              </Link>

              {/* Admin Nav Tabs */}
              <nav className="hidden md:flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10">
                {navTabs.map((tab) => {
                  const isActive = tab.aliases.includes(pathname || '/');
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                        isActive
                          ? 'bg-white text-[#0a3922] shadow-xs'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-[#d2f2e3]">
                <Lock className="w-3.5 h-3.5" />
                <span>NDPR Audit Trail Active</span>
              </div>
              <Link
                href="/admin/auth"
                className="bg-[#ff643b] px-3 py-1.5 rounded-full text-white font-mono font-bold hover:brightness-110 transition"
                title="Switch Staff Role / RBAC Gate"
              >
                ADM-001 (Auth)
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* Module 6: Internal Ops Resources & Cross-Portal Links */}
        <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-8 pt-4 border-t border-[#0f3e17]/10 text-xs text-[#747679] flex flex-wrap items-center justify-between gap-4">
          <span>Internal Governance Portal • admin.mangahealthcare.com</span>
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <a href={`${webOrigin}/help`} className="hover:text-[#0a3922]">Support Queue (help)</a>
            <a href={`${webOrigin}/legal/ndpr-privacy`} className="hover:text-[#0a3922]">NDPR Legal Hub</a>
            <a href={webOrigin} className="hover:text-[#0a3922]">Patients Site</a>
            <a href={`${webOrigin}/doctor`} className="hover:text-[#0a3922]">Doctors Site</a>
            <a href={`${webOrigin}/partner`} className="hover:text-[#0a3922]">Partners Site</a>
          </div>
        </footer>

        {/* Persistent Emergency Hotline Bar */}
        <PersistentEmergencyBar
          position="bottom"
          message="Manga Operations Monitor: Telehealth is for non-emergencies. Red-flag patients are automatically diverted to 112:"
          ambulanceNumber="112"
          lagosEmergencyNumber="767"
        />
      </body>
    </html>
  );
}
