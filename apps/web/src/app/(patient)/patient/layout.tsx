'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  PhoneCall,
  Calendar,
  FileText,
  User,
  LogOut,
  Bell,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { PersistentEmergencyBar } from '@manga/design-system';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [patientId] = useState('PAT-48291');
  const [patientName] = useState('Amaka Adeleke');

  const navItems = [
    { label: 'Overview', href: '/patient' },
    { label: 'Book / Instant Lobby', href: '/patient/book' },
    { label: 'Intake Profile', href: '/patient/onboarding' },
    { label: 'Consultation Room', href: '/patient/consultation/enc-live-01' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f3eb] flex flex-col pb-16">
      {/* Patient Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#efeeeb] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
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
                  Patient Care
                </span>
              </div>
            </Link>

            {/* Sub-nav tabs */}
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

          {/* Right Header Identity Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/patient/book"
              className="hidden sm:inline-flex items-center gap-2 bg-[#ff643b] text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Talk to Doctor</span>
            </Link>

            {/* Patient ID Badge */}
            <div className="flex items-center gap-2.5 bg-[#f8f3eb] pl-3 pr-2 py-1.5 rounded-full border border-neutral-200">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-[#747679] uppercase font-medium leading-none">
                  Verified Patient
                </span>
                <span className="font-mono text-xs font-bold text-[#080331] leading-tight">
                  {patientId}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#e1f4df] text-[#0f3e17] border border-[#b1dbb8] flex items-center justify-center font-bold text-xs">
                {patientName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>

      {/* Persistent Emergency Hotline Bar */}
      <PersistentEmergencyBar
        position="bottom"
        message="Notice: Manga Telemedicine is strictly non-emergency. In acute crises or chest pain, call national ambulance:"
        ambulanceNumber="112"
        lagosEmergencyNumber="767"
      />
    </div>
  );
}
