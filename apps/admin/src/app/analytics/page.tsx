'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  Search,
  RefreshCcw,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface DisputeBooking {
  bookingId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  amountNgn: number;
  startTime: string;
  endTime: string;
  status: 'COMPLETED' | 'DISPUTED_NO_SHOW' | 'REFUNDED' | 'REASSIGNED';
  disputeNote: string;
}

export default function AdminAnalyticsPage() {
  const formatNgn = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

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

  // Booking & Payment Dispute Resolution (Sitemap Section 5.2.4)
  const [bookingLookupQuery, setBookingLookupQuery] = useState('BKG-2026-9914');
  const [disputes, setDisputes] = useState<DisputeBooking[]>([
    {
      bookingId: 'BKG-2026-9914',
      patientId: 'PAT-39102',
      patientName: 'Babatunde Ojo',
      doctorName: 'Dr. David Adekunle (DOC-1180)',
      amountNgn: 10000,
      startTime: '14:10:00 WAT (No doctor join)',
      endTime: '14:18:00 WAT (Timed out)',
      status: 'DISPUTED_NO_SHOW',
      disputeNote: 'Doctor network dropped before video handshake. Patient requested re-assignment or Paystack refund.',
    },
    {
      bookingId: 'BKG-2026-9881',
      patientId: 'PAT-48291',
      patientName: 'Amaka Adeleke',
      doctorName: 'Dr. Chidi Okafor (LOC-9941)',
      amountNgn: 10000,
      startTime: '10:30:12 WAT',
      endTime: '10:44:50 WAT',
      status: 'COMPLETED',
      disputeNote: 'Verified session duration: 14m 38s. No dispute.',
    },
  ]);

  const handleRefund = (bookingId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.bookingId === bookingId ? { ...d, status: 'REFUNDED' } : d))
    );
    alert(`Paystack full refund triggered for ${bookingId} and logged to audit_log.`);
  };

  const handleReassign = (bookingId: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.bookingId === bookingId
          ? { ...d, status: 'REASSIGNED', doctorName: 'Dr. Chidi Okafor (LOC-9941)' }
          : d
      )
    );
    alert(`Booking ${bookingId} manually re-assigned to on-duty Locum Dr. Chidi Okafor (LOC-9941).`);
  };

  const filteredDisputes = disputes.filter(
    (d) =>
      !bookingLookupQuery.trim() ||
      d.bookingId.toLowerCase().includes(bookingLookupQuery.toLowerCase()) ||
      d.patientId.toLowerCase().includes(bookingLookupQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          Beta Analytics & Booking Disputes (/admin/analytics)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Revenue, Follow-Ups & Dispute Resolution
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Real-time metrics on completed encounters, Paystack/Flutterwave settlement ledgers, and booking dispute intervention.
        </p>
      </div>

      {/* Bento Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#ebf0f8] p-6 rounded-3xl border border-[#4865ff]/20 space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4865ff]">
            Total Gross Revenue
          </span>
          <div className="text-3xl font-serif text-[#080331]">
            ₦{formatNgn(metrics.grossRevenueNgn)}
          </div>
          <span className="text-xs text-[#0f3e17] font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs previous cycle
          </span>
        </div>

        <div className="bg-[#e1f4df] p-6 rounded-3xl border border-[#b1dbb8] space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0f3e17]">
            Doctor Accrued Ledger (80%)
          </span>
          <div className="text-3xl font-serif text-[#080331]">
            ₦{formatNgn(metrics.doctorPayoutsNgn)}
          </div>
          <p className="text-[11px] text-[#747679]">Settled biweekly on 1st & 15th</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#080331]">
            Completed Consultations
          </span>
          <div className="text-3xl font-serif text-[#080331]">
            {metrics.completedConsultations}
          </div>
          <p className="text-[11px] text-[#747679]">Avg Rating: {metrics.averageDoctorRating}</p>
        </div>

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

      {/* Booking & Payment Dispute Resolution (Section 5.2.4) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="eyebrow-label text-[#ff643b] bg-[#ffede8] px-3 py-1 rounded-full">
              Ops Governance
            </span>
            <h2 className="font-serif text-2xl text-[#080331] font-normal mt-2">
              Booking & Payment Dispute Resolution
            </h2>
            <p className="text-xs text-[#747679] mt-0.5">
              Lookup bookings by Booking ID or Patient ID, inspect session timestamps, and issue refunds or doctor re-assignments.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={bookingLookupQuery}
              onChange={(e) => setBookingLookupQuery(e.target.value)}
              placeholder="Lookup Booking or PAT-XXXX..."
              className="w-full text-xs font-mono border border-neutral-200 rounded-full pl-9 pr-4 py-2.5 bg-[#f8f3eb]/40"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredDisputes.map((item) => (
            <div
              key={item.bookingId}
              className="p-5 rounded-2xl bg-[#f8f3eb]/60 border border-neutral-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-white px-2.5 py-0.5 rounded border border-neutral-200 text-[#080331]">
                    {item.bookingId}
                  </span>
                  <strong className="text-sm text-[#080331]">
                    {item.patientName} ({item.patientId})
                  </strong>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      item.status === 'DISPUTED_NO_SHOW'
                        ? 'bg-[#ffede8] text-[#ff643b]'
                        : item.status === 'REFUNDED'
                        ? 'bg-neutral-200 text-[#222326]'
                        : 'bg-[#e1f4df] text-[#0f3e17]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-xs text-[#747679]">
                  Assigned: <strong className="text-[#080331]">{item.doctorName}</strong> • Fee: <strong>₦{formatNgn(item.amountNgn)}</strong>
                </div>

                <div className="text-[11px] font-mono text-[#0f3e17] inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>start_time: {item.startTime} | end_time: {item.endTime}</span>
                </div>

                <p className="text-xs text-[#222326]">{item.disputeNote}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={item.status === 'REFUNDED'}
                  onClick={() => handleRefund(item.bookingId)}
                  className="bg-white text-[#ff643b] border border-[#ff643b]/40 px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#ffede8] transition inline-flex items-center gap-1.5 disabled:opacity-40"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Trigger Refund</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReassign(item.bookingId)}
                  className="bg-[#0a3922] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#0f3e17] transition inline-flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Manual Re-Assign</span>
                </button>
              </div>
            </div>
          ))}
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
                    ₦{formatNgn(Math.round(row.revenue / row.volume))}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#080331]">
                    ₦{formatNgn(row.revenue)}
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
