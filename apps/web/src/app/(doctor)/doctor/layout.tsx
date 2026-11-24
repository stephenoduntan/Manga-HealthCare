'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Stethoscope,
  Calendar,
  DollarSign,
  User,
  Activity,
  CheckCircle2,
  Video,
} from 'lucide-react';
import { PersistentEmergencyBar } from '@manga/design-system';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [providerId] = useState('LOC-9941');
  const [mdcnNumber] = useState('MDCN-78320');
  const [isAvailable, setIsAvailable] = useState(true);

  const navItems = [
    { label: 'Dashboard', href: '/doctor/dashboard' },
    { label: 'Schedule', href: '/doctor/schedule' },
    { label: 'Consult EHR', href: '/doctor/consultation/enc-live-01' },
    { label: 'Payout Ledger', href: '/doctor/ledger' },
    { label: 'Credentials', href: '/doctor/onboarding/credentials' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f3eb] flex flex-col pb-16">
      {/* Doctor Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#efeeeb] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0a3922] text-[#e1f4df] flex items-center justify-center font-serif text-lg">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-tight text-[#080331] leading-none">
                  MANGA
                </span>
                <span className="text-[9px] uppercase tracking-[0.14em] text-[#0f3e17] font-semibold">
                  Provider Workspace
                </span>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[#f8f3eb] p-1 rounded-full border border-neutral-200/60">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                      isActive
                        ? 'bg-white text-[#080331] shadow-xs'
                        : 'text-[#747679] hover:text-[#080331]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-3">
            {/* Availability Toggle */}
            <div className="hidden sm:flex items-center gap-2 bg-[#f8f3eb] px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAvailable ? 'bg-[#31ce01] shadow-[0_0_8px_#31ce01]' : 'bg-neutral-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className="text-xs text-[#080331] hover:underline"
              >
                {isAvailable ? 'On-Duty (Queue Active)' : 'Off-Duty'}
              </button>
            </div>

            {/* MDCN Verified Badge */}
            <div className="flex items-center gap-1.5 bg-[#e1f4df] px-3 py-1.5 rounded-full border border-[#b1dbb8] text-xs font-semibold text-[#0f3e17]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#31ce01]" />
              <span className="hidden sm:inline">MDCN Verified:</span>
              <span className="font-mono">{mdcnNumber}</span>
            </div>

            {/* Doctor / Locum ID Badge */}
            <div className="flex items-center gap-2 bg-[#ebf0f8] px-3 py-1.5 rounded-full border border-[#4865ff]/20 text-xs">
              <span className="text-[#4865ff] font-semibold text-[10px] uppercase">Locum ID:</span>
              <strong className="font-mono text-[#080331]">{providerId}</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>

      {/* Persistent Emergency Hotline Bar */}
      <PersistentEmergencyBar
        position="bottom"
        message="Doctor Workspace Notice: In case of acute decompensation during remote call, trigger emergency 112 dispatch immediately:"
        ambulanceNumber="112"
        lagosEmergencyNumber="767"
      />
    </div>
  );
}
