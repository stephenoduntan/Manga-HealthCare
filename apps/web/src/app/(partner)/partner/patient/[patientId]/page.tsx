'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Building2,
  Pill,
  FileText,
  Download,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { PersistentEmergencyBar } from '@manga/design-system';

export default function PartnerPatientFulfillmentPage() {
  const params = useParams();
  const patientId = ((params?.patientId as string) || 'PAT-48291').toUpperCase();
  const [rxStatus, setRxStatus] = useState<'ACTIVE' | 'DISPENSED'>('ACTIVE');

  return (
    <div className="min-h-screen bg-[#f8f3eb] flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#efeeeb] shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/partner/lookup" className="inline-flex items-center gap-2 text-xs font-semibold text-[#080331] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Patient Lookup
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <Building2 className="w-4 h-4 text-[#4865ff]" />
            <strong className="text-[#080331]">MedPlus Pharmacy VI</strong>
            <span className="font-mono text-[#747679]">(PRT-MEDPLUS-VI-01)</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* NDPR Consent & Audit Log Banner */}
        <div className="bg-[#e1f4df] p-4 rounded-2xl border border-[#b1dbb8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#0f3e17]">
          <span className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#31ce01]" />
            NDPR Consent Verified for {patientId} • Private consultation & therapy notes remain redacted.
          </span>
          <span className="font-mono text-[11px] bg-white px-2.5 py-0.5 rounded inline-flex items-center gap-1">
            <Lock className="w-3 h-3" /> audit_log recorded
          </span>
        </div>

        {/* Active E-Prescription Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3 py-1 rounded-full">
                Authorized E-Prescription (RX-99120)
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#080331] font-normal mt-2">
                Patient: Amaka Adeleke ({patientId})
              </h1>
              <p className="text-xs text-[#747679] mt-0.5">
                Prescriber: <strong>Dr. Chidi Okafor</strong> (MDCN Folio: <strong>MDCN-78320</strong>) • Allergy Alert: <strong className="text-[#ff643b]">Penicillin</strong>
              </p>
            </div>

            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto ${
                rxStatus === 'ACTIVE'
                  ? 'bg-[#e1f4df] text-[#0f3e17]'
                  : 'bg-neutral-200 text-[#222326]'
              }`}
            >
              {rxStatus === 'ACTIVE' ? 'Ready for Dispensing' : '✓ Fulfilled / Dispensed'}
            </span>
          </div>

          <div className="border border-neutral-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#ebf0f8] text-[#080331] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Medication</th>
                  <th className="p-3.5">Dosage</th>
                  <th className="p-3.5">Frequency</th>
                  <th className="p-3.5">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="p-3.5 font-semibold text-[#080331]">Paracetamol Tablets</td>
                  <td className="p-3.5">1000mg (2 tabs)</td>
                  <td className="p-3.5">Three times daily (TDS)</td>
                  <td className="p-3.5">5 days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-[#080331]">Cetirizine Hydrochloride</td>
                  <td className="p-3.5">10mg</td>
                  <td className="p-3.5">Once daily at night (OD)</td>
                  <td className="p-3.5">7 days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => alert('Printable E-Prescription PDF opened.')}
              className="bg-[#f8f3eb] text-[#080331] border border-neutral-300 px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-neutral-100"
            >
              <Download className="w-3.5 h-3.5" /> Printable PDF View
            </button>

            <button
              type="button"
              disabled={rxStatus === 'DISPENSED'}
              onClick={() => setRxStatus('DISPENSED')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition ${
                rxStatus === 'DISPENSED'
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : 'bg-[#0a3922] text-white hover:bg-[#0f3e17]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{rxStatus === 'DISPENSED' ? 'Dispensed (Locked)' : 'Mark as Fulfilled / Dispensed'}</span>
            </button>
          </div>
        </div>

        {/* Lab Requests & Referrals */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0f3e17]" />
            <h2 className="font-serif text-xl text-[#080331]">Diagnostic Lab Requests & Referrals</h2>
          </div>
          <div className="p-4 rounded-2xl bg-[#f8f3eb] border border-neutral-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-[#080331] block">LAB-2026-081 • Ordered by Dr. Chidi Okafor</strong>
              <span className="text-[#747679]">Full Blood Count (FBC) with Differential, Malaria Parasite (MP) Slide</span>
            </div>
            <span className="font-semibold text-[#4865ff] bg-white px-3 py-1 rounded-full border border-neutral-200 self-start">
              PENDING_COLLECTION
            </span>
          </div>
        </div>
      </main>

      <PersistentEmergencyBar position="bottom" ambulanceNumber="112" lagosEmergencyNumber="767" />
    </div>
  );
}
