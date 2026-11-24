'use client';

import React from 'react';

export interface DoctorPayoutBentoProps {
  doctorName?: string;
  providerId?: string;
  totalPatientsSeen?: number;
  accruedFeesNgn?: number;
  daysUntilBiweeklyPayout?: number;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

function formatCurrency(val: number): string {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function DoctorPayoutBento({
  doctorName = 'Dr. Chidi Okafor',
  providerId = 'LOC-8492',
  totalPatientsSeen = 24,
  accruedFeesNgn = 186000,
  daysUntilBiweeklyPayout = 4,
  verificationStatus = 'VERIFIED',
}: DoctorPayoutBentoProps) {
  // Calculate payout cycle completion percentage for the circular ring (14-day cycle)
  const cycleDaysTotal = 14;
  const cycleDaysCompleted = Math.max(0, cycleDaysTotal - daysUntilBiweeklyPayout);
  const cyclePercentage = Math.round((cycleDaysCompleted / cycleDaysTotal) * 100);
  const strokeDashoffset = Math.round(283 - (283 * cyclePercentage) / 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header Card in Cloud Wash */}
      <div className="bg-[#ebf0f8] rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-[#b6ced5]/40 shadow-[0_8px_20px_rgba(75,68,57,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#415eee] bg-white px-2.5 py-0.5 rounded-full border border-[#415eee]/20">
                Provider Ledger (Beta)
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0f3e17] bg-[#e1f4df] px-2.5 py-0.5 rounded-full border border-[#b1dbb8]">
                MDCN: {verificationStatus}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#222326] mt-2 mb-0.5 tracking-[-0.025em]">
              {doctorName}
            </h2>
            <p className="text-xs text-[#747679] m-0">
              Assigned ID: <strong className="text-[#222326]">{providerId}</strong> • Biweekly Automatic Settlement
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-[#efeeeb] self-start sm:self-auto shadow-xs">
            <div className="text-[11px] uppercase text-[#747679] tracking-wider font-semibold">
              Cycle Frequency
            </div>
            <div className="text-sm font-semibold text-[#222326] mt-0.5">
              Biweekly (Every 2nd Friday)
            </div>
          </div>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Accrued Fees */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-[0_4px_12px_rgba(75,68,57,0.04)] border border-[#efeeeb]">
            <span className="text-xs font-semibold text-[#747679] uppercase tracking-wider">
              Accrued Consultation Fees
            </span>
            <div className="my-3">
              <span className="text-3xl sm:text-4xl font-semibold text-[#222326] tracking-[-0.03em] leading-none">
                ₦{formatCurrency(accruedFeesNgn)}
              </span>
            </div>
            <span className="text-xs text-[#31ce01] font-medium flex items-center gap-1">
              ✓ Locked for next payout cycle
            </span>
          </div>

          {/* Card 2: Patients Seen */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-[0_4px_12px_rgba(75,68,57,0.04)] border border-[#efeeeb]">
            <span className="text-xs font-semibold text-[#747679] uppercase tracking-wider">
              Patients Consulted
            </span>
            <div className="my-3">
              <span className="text-3xl sm:text-4xl font-semibold text-[#222326] tracking-[-0.03em] leading-none">
                {totalPatientsSeen}
              </span>
            </div>
            <span className="text-xs text-[#415eee] font-medium">
              100% structured note compliance
            </span>
          </div>

          {/* Card 3: Payout Ring & Countdown */}
          <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-[0_4px_12px_rgba(75,68,57,0.04)] border border-[#efeeeb]">
            <div>
              <span className="text-xs font-semibold text-[#747679] uppercase tracking-wider">
                Next Settlement
              </span>
              <div className="text-2xl sm:text-3xl font-semibold text-[#222326] tracking-[-0.03em] mt-1">
                {daysUntilBiweeklyPayout} days
              </div>
              <span className="text-xs text-[#747679] mt-0.5 block">
                {cyclePercentage}% cycle completed
              </span>
            </div>

            {/* Circular Ring SVG in Recovery Green */}
            <div className="relative w-[70px] h-[70px] shrink-0">
              <svg width="70" height="70" viewBox="0 0 100 100" className="-rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#ebf0f8"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#31ce01"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-[stroke-dashoffset] duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#080331]">
                {cyclePercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
