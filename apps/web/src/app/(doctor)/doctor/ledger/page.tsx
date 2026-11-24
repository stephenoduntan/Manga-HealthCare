'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { DoctorPayoutBento } from '@manga/design-system';

function formatNgn(val: number): string {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function DoctorLedgerPage() {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACCRUED' | 'PAID_BIWEEKLY'>('ALL');

  const ledgerEntries = [
    {
      encounterId: 'ENC-2026-0811',
      patientId: 'PAT-48291',
      date: '14 Nov 2026',
      startTime: '10:30:12 WAT',
      endTime: '10:44:50 WAT',
      type: 'INSTANT_QUEUE',
      grossFee: 10000,
      doctorCut: 7500,
      payoutStatus: 'ACCRUED',
    },
    {
      encounterId: 'ENC-2026-0792',
      patientId: 'PAT-19302',
      date: '14 Nov 2026',
      startTime: '09:15:04 WAT',
      endTime: '09:28:19 WAT',
      type: 'INSTANT_QUEUE',
      grossFee: 10000,
      doctorCut: 7500,
      payoutStatus: 'ACCRUED',
    },
    {
      encounterId: 'ENC-2026-0710',
      patientId: 'PAT-55210',
      date: '01 Nov 2026',
      startTime: '14:00:00 WAT',
      endTime: '14:45:11 WAT',
      type: 'THERAPY_MANDATORY_SLOT',
      grossFee: 15000,
      doctorCut: 11250,
      payoutStatus: 'PAID_BIWEEKLY',
    },
    {
      encounterId: 'ENC-2026-0688',
      patientId: 'PAT-33104',
      date: '31 Oct 2026',
      startTime: '11:20:08 WAT',
      endTime: '11:31:42 WAT',
      type: 'FOLLOW_UP',
      grossFee: 5000,
      doctorCut: 3750,
      payoutStatus: 'PAID_BIWEEKLY',
    },
  ];

  const filtered = ledgerEntries.filter(
    (entry) => statusFilter === 'ALL' || entry.payoutStatus === statusFilter
  );

  return (
    <div className="w-full space-y-8">
      <div>
        <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3 py-1 rounded-full">
          Biweekly Provider Ledger (/doctor/ledger)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Consultation History & Payout Breakdown
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Itemized per-consultation fee ledger with auto-logged start_time and end_time timestamps.
        </p>
      </div>

      <DoctorPayoutBento
        doctorName="Dr. Chidi Okafor"
        providerId="LOC-9941"
        totalPatientsSeen={28}
        accruedFeesNgn={210000}
        daysUntilBiweeklyPayout={3}
        verificationStatus="VERIFIED"
      />

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">
            Itemized Settlement Entries
          </h2>
          <div className="flex gap-2 bg-[#f8f3eb] p-1 rounded-full border border-neutral-200 text-xs">
            {(['ALL', 'ACCRUED', 'PAID_BIWEEKLY'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                  statusFilter === status ? 'bg-[#0a3922] text-white' : 'text-[#747679]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-neutral-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ebf0f8] text-[#080331] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Encounter / Patient</th>
                <th className="p-3.5">Session Timestamps (WAT)</th>
                <th className="p-3.5">Booking Type</th>
                <th className="p-3.5">Ledger Status</th>
                <th className="p-3.5 text-right">Provider Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-[#222326]">
              {filtered.map((item) => (
                <tr key={item.encounterId} className="hover:bg-[#f8f3eb]/40 transition">
                  <td className="p-3.5">
                    <strong className="font-mono text-[#080331] block">{item.encounterId}</strong>
                    <span className="text-[11px] text-[#747679]">
                      {item.patientId} • {item.date}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-[#0f3e17]">
                    <div className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {item.startTime} → {item.endTime}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[11px] font-medium">{item.type}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        item.payoutStatus === 'PAID_BIWEEKLY'
                          ? 'bg-[#e1f4df] text-[#0f3e17]'
                          : 'bg-[#ebf0f8] text-[#4865ff]'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {item.payoutStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#080331]">
                    ₦{formatNgn(item.doctorCut)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
