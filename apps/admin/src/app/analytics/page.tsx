'use client';

import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  PieChart,
  Activity,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const metrics = {
    grossRevenueNgn: 3850000,
    doctorPayoutsNgn: 3080000, // 80% per PRD Section 7
    platformNetNgn: 770000, // 20% platform margin
    completedConsultations: 385,
    followUpConversionRate: '38.4%',
    averageDoctorRating: '4.88 / 5.0',
    emergencyRedirectsHalted: 12,
  };

  const channelBreakdown = [
    { channel: 'General Physician Teleconsultation (₦10,000)', volume: 290, revenue: 2900000 },
    { channel: 'Mental Health Therapy Sessions (₦15,000)', volume: 45, revenue: 675000 },
    { channel: '14-Day Follow-Up Review (₦5,000)', volume: 50, revenue: 250000 },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          Financial & Clinical Performance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Revenue, Consultations & Follow-Up Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Real-time metrics on completed encounters, Paystack settlement ledgers, and clinical follow-up retention.
        </p>
      </div>

      {/* Bento Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-[#ebf0f8] p-6 rounded-3xl border border-[#4865ff]/20 space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4865ff]">
            Total Gross Revenue
          </span>
          <div className="text-3xl font-serif text-[#080331]">
            ₦{metrics.grossRevenueNgn.toLocaleString()}
          </div>
          <span className="text-xs text-[#0f3e17] font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs previous cycle
          </span>
        </div>

        {/* Doctor Payouts */}
        <div className="bg-[#e1f4df] p-6 rounded-3xl border border-[#b1dbb8] space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0f3e17]">
            Doctor Accrued Ledger (80%)
          </span>
          <div className="text-3xl font-serif text-[#080331]">
            ₦{metrics.doctorPayoutsNgn.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#747679]">Settled biweekly on 1st & 15th</p>
        </div>

        {/* Platform Net */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#080331]">
            Platform Margin (20%)
          </span>
          <div className="text-3xl font-serif text-[#080331]">
            ₦{metrics.platformNetNgn.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#747679]">Infrastructure & clinical ops</p>
        </div>

        {/* Follow-up Rate */}
        <div className="bg-[#f8f3eb] p-6 rounded-3xl border border-neutral-300 space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#ff643b]">
            Follow-Up Conversion
          </span>
          <div className="text-3xl font-serif text-[#080331]">
            {metrics.followUpConversionRate}
          </div>
          <p className="text-[11px] text-[#747679]">Within 14 days of initial visit</p>
        </div>
      </div>

      {/* Revenue Breakdown by Clinical Specialty */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
        <h3 className="font-serif text-2xl text-[#080331] font-normal">
          Revenue Breakdown by Clinical Track
        </h3>

        <div className="border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ebf0f8] text-[#080331] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Consultation Channel</th>
                <th className="p-3.5">Completed Consultations</th>
                <th className="p-3.5">Average Fee</th>
                <th className="p-3.5 text-right">Gross Total (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-[#222326]">
              {channelBreakdown.map((row) => (
                <tr key={row.channel} className="hover:bg-[#f8f3eb]/40 transition">
                  <td className="p-3.5 font-medium">{row.channel}</td>
                  <td className="p-3.5 font-mono font-bold text-[#080331]">{row.volume}</td>
                  <td className="p-3.5 font-mono">
                    ₦{(row.revenue / row.volume).toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#080331]">
                    ₦{row.revenue.toLocaleString()}
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
