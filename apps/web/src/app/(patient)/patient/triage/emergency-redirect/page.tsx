'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, PhoneCall, MapPin, ShieldAlert } from 'lucide-react';
import { RED_FLAG_SYMPTOMS } from '@manga/api-contract';

function EmergencyRedirectContent() {
  const searchParams = useSearchParams();
  const rawFlags = searchParams.get('flags') || '';
  const flaggedCodes = rawFlags ? rawFlags.split(',').filter(Boolean) : [];

  const nearestFacilities = [
    {
      name: 'Lagos State University Teaching Hospital (LASUTH)',
      address: '1-5 Oba Akinjobi Way, GRA Ikeja, Lagos',
      phone: '+234 1 271 9081',
    },
    {
      name: 'Lagos University Teaching Hospital (LUTH)',
      address: 'Ishaga Road, Idi-Araba, Surulere, Lagos',
      phone: '+234 802 312 9000',
    },
    {
      name: 'National Hospital Trauma Centre',
      address: 'Plot 132 Central District, Phase II, Garki, Abuja',
      phone: '+234 9 234 4022',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-4 space-y-6">
      <div className="bg-[#ffede8] rounded-[32px] p-8 md:p-12 border border-[#ff643b]/35 shadow-[0_16px_36px_rgba(255,100,59,0.14)] space-y-7">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ff643b] text-white flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="eyebrow-label text-[#ff643b] bg-white px-3 py-1 rounded-full">
              Emergency Triage Halt • Logged to emergency_redirect_log
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
              Please Seek Immediate In-Person Emergency Care
            </h1>
            <p className="text-xs sm:text-sm text-[#080331]/85 mt-2 leading-relaxed">
              Manga Healthcare is a remote telemedicine service and cannot provide acute hospital resuscitation. Online booking has been paused for your safety, and Clinical Ops has been notified.
            </p>
          </div>
        </div>

        {flaggedCodes.length > 0 && (
          <div className="bg-white/85 rounded-2xl p-4 border border-[#ff643b]/25 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff643b] block">
              Flagged Red-Flag Symptoms:
            </span>
            <div className="flex flex-wrap gap-2">
              {flaggedCodes.map((code) => {
                const match = RED_FLAG_SYMPTOMS.find((s) => s.code === code);
                return (
                  <span
                    key={code}
                    className="text-xs font-medium bg-[#ffede8] text-[#ff643b] px-3 py-1 rounded-full border border-[#ff643b]/30"
                  >
                    {match ? match.label : code}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Tap-to-Call Ambulance Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="tel:112"
            className="bg-[#ff643b] text-white p-5 rounded-2xl flex items-center justify-between shadow-[0_8px_20px_rgba(255,100,59,0.3)] hover:brightness-105 transition"
          >
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/85 block">
                National Emergency Hotline
              </span>
              <span className="text-2xl font-bold font-mono">Call 112</span>
            </div>
            <PhoneCall className="w-7 h-7" />
          </a>

          <a
            href="tel:767"
            className="bg-[#0a3922] text-white p-5 rounded-2xl flex items-center justify-between hover:bg-[#0f3e17] transition"
          >
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#d2f2e3] block">
                Lagos Ambulance (LASAMBUS)
              </span>
              <span className="text-2xl font-bold font-mono">Call 767</span>
            </div>
            <PhoneCall className="w-7 h-7 text-[#31ce01]" />
          </a>
        </div>

        {/* Nearest Emergency Facilities */}
        <div className="bg-white rounded-2xl p-5 border border-[#efeeeb] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#080331]">
            <MapPin className="w-4 h-4 text-[#ff643b]" />
            <span>Nearest Emergency & Trauma Centers</span>
          </div>
          <div className="space-y-2.5 text-xs">
            {nearestFacilities.map((fac) => (
              <div key={fac.name} className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-100 last:border-0 last:pb-0">
                <div>
                  <strong className="text-[#080331] block">{fac.name}</strong>
                  <span className="text-[#747679]">{fac.address}</span>
                </div>
                <a href={`tel:${fac.phone.replace(/\s+/g, '')}`} className="font-mono font-bold text-[#4865ff] hover:underline mt-1 sm:mt-0">
                  {fac.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-[#747679]">
            <ShieldAlert className="w-4 h-4 text-[#ff643b]" />
            Persistent emergency dialer remains pinned below.
          </span>
          <Link
            href="/patient/triage"
            className="bg-white text-[#080331] border border-neutral-300 px-4 py-2 rounded-full font-semibold hover:bg-neutral-50"
          >
            ← Re-take Triage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyRedirectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#747679]">Loading emergency contacts...</div>}>
      <EmergencyRedirectContent />
    </Suspense>
  );
}
