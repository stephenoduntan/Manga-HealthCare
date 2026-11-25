'use client';

import React, { useState } from 'react';
import {
  Search,
  RefreshCcw,
  UserCheck,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { adminApiFetch } from '@/lib/api-client';

interface DisputeBooking {
  bookingId: string;
  providerReference: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  amountNgn: number;
  paymentStatus: 'PAID' | 'REFUNDED';
  triageClearedAt: string;
  startTime: string;
  endTime: string;
  soapCompleted: boolean;
  status: 'COMPLETED' | 'DISPUTED_NO_SHOW' | 'REFUNDED' | 'REASSIGNED';
  resolutionNote: string;
}

function formatNgn(val: number) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function AdminDisputesPage() {
  const [query, setQuery] = useState('');
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const [bookings, setBookings] = useState<DisputeBooking[]>([
    {
      bookingId: 'BKG-2026-9914',
      providerReference: 'PSK_REF_9048120',
      patientId: 'PAT-39102',
      patientName: 'Babatunde Ojo',
      doctorId: 'DOC-1180',
      doctorName: 'Dr. David Adekunle',
      amountNgn: 10000,
      paymentStatus: 'PAID',
      triageClearedAt: '2026-11-24 14:04:12 WAT',
      startTime: '14:10:00 WAT (No doctor join)',
      endTime: '14:18:00 WAT (Timed out)',
      soapCompleted: false,
      status: 'DISPUTED_NO_SHOW',
      resolutionNote: 'Patient waited 8 minutes; doctor connection failed.',
    },
    {
      bookingId: 'BKG-2026-9881',
      providerReference: 'FLW_TX_8812093',
      patientId: 'PAT-48291',
      patientName: 'Amaka Adeleke',
      doctorId: 'LOC-9941',
      doctorName: 'Dr. Chidi Okafor',
      amountNgn: 10000,
      paymentStatus: 'PAID',
      triageClearedAt: '2026-11-24 10:25:01 WAT',
      startTime: '10:30:12 WAT',
      endTime: '10:44:50 WAT',
      soapCompleted: true,
      status: 'COMPLETED',
      resolutionNote: 'Encounter verified complete with signed SOAP & PDF Rx.',
    },
  ]);

  const filtered = bookings.filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.bookingId.toLowerCase().includes(q) ||
      b.patientId.toLowerCase().includes(q) ||
      b.doctorId.toLowerCase().includes(q) ||
      b.providerReference.toLowerCase().includes(q)
    );
  });

  const handleRefund = async (bookingId: string) => {
    await adminApiFetch(`/api/v1/admin/disputes/${encodeURIComponent(bookingId)}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ action: 'REFUND', note: noteInputs[bookingId] }),
    });
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? { ...b, status: 'REFUNDED', paymentStatus: 'REFUNDED' }
          : b
      )
    );
    alert(`Paystack/Flutterwave refund issued for ${bookingId} and recorded in audit_log.`);
  };

  const handleReassign = async (bookingId: string) => {
    await adminApiFetch(`/api/v1/admin/disputes/${encodeURIComponent(bookingId)}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ action: 'REASSIGN', note: noteInputs[bookingId] }),
    });
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? {
              ...b,
              status: 'REASSIGNED',
              doctorId: 'LOC-9941',
              doctorName: 'Dr. Chidi Okafor (On-Duty Locum)',
            }
          : b
      )
    );
    alert(`Booking ${bookingId} reassigned to on-duty Locum LOC-9941.`);
  };

  const handleSaveNote = (bookingId: string) => {
    const note = noteInputs[bookingId]?.trim();
    if (!note) return;
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, resolutionNote: note } : b))
    );
    setNoteInputs((prev) => ({ ...prev, [bookingId]: '' }));
    alert(`Dispute resolution note saved for ${bookingId}.`);
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <span className="eyebrow-label text-[#ff643b] bg-[#ffede8] px-3 py-1 rounded-full border border-[#ff643b]/30">
          Module 4 • Bookings, Payments &amp; Dispute Resolution
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Universal Booking &amp; Payment Inspection
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Search by Booking ID, Patient ID, Doctor ID, or Paystack/Flutterwave provider_reference to inspect session telemetry and resolve disputes.
        </p>
      </div>

      {/* Universal Lookup Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Booking ID (BKG-...), Patient ID (PAT-...), Doctor ID (DOC-/LOC-...), or Paystack/Flutterwave provider_reference..."
            className="w-full text-xs sm:text-sm font-mono border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 bg-[#f8f3eb]/30 focus:outline-none focus:border-[#4865ff]"
          />
        </div>
      </div>

      {/* Dispute Inspection Cards */}
      <div className="space-y-5">
        {filtered.map((item) => (
          <div
            key={item.bookingId}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#f8f3eb] px-2.5 py-1 rounded border border-neutral-200 text-[#080331]">
                    {item.bookingId}
                  </span>
                  <span className="font-mono text-[11px] bg-[#ebf0f8] text-[#4865ff] px-2.5 py-0.5 rounded-full font-semibold">
                    Ref: {item.providerReference}
                  </span>
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
                  Patient: <strong className="text-[#080331]">{item.patientName} ({item.patientId})</strong> • Clinician: <strong className="text-[#080331]">{item.doctorName} ({item.doctorId})</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={item.status === 'REFUNDED'}
                  onClick={() => handleRefund(item.bookingId)}
                  className="bg-white text-[#ff643b] border border-[#ff643b]/40 px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#ffede8] transition inline-flex items-center gap-1.5 disabled:opacity-40"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Issue Refund / Credit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReassign(item.bookingId)}
                  className="bg-[#0a3922] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#0f3e17] transition inline-flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Reassign Doctor</span>
                </button>
              </div>
            </div>

            {/* Inspection View Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f8f3eb]">
                <span className="text-[10px] uppercase font-semibold text-[#747679] block">Payment Status</span>
                <strong className="text-[#080331] font-mono">₦{formatNgn(item.amountNgn)} ({item.paymentStatus})</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f8f3eb]">
                <span className="text-[10px] uppercase font-semibold text-[#747679] block">Triage Clearance</span>
                <strong className="text-[#0f3e17] inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#31ce01]" /> {item.triageClearedAt}
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f8f3eb]">
                <span className="text-[10px] uppercase font-semibold text-[#747679] block">Session Timestamps</span>
                <strong className="text-[#080331] font-mono inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#ff643b]" /> {item.startTime} → {item.endTime}
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f8f3eb]">
                <span className="text-[10px] uppercase font-semibold text-[#747679] block">SOAP Documentation</span>
                <strong className={item.soapCompleted ? 'text-[#0f3e17]' : 'text-[#ff643b]'}>
                  {item.soapCompleted ? '✓ Completed & Signed' : '✗ Incomplete / Missing'}
                </strong>
              </div>
            </div>

            {/* Resolution Note Input */}
            <div className="pt-2 space-y-2">
              <div className="text-xs text-[#222326] bg-[#ebf0f8]/60 p-3 rounded-xl flex items-start gap-2">
                <FileText className="w-4 h-4 text-[#4865ff] shrink-0 mt-0.5" />
                <span><strong>Resolution Log:</strong> {item.resolutionNote}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteInputs[item.bookingId] || ''}
                  onChange={(e) =>
                    setNoteInputs((prev) => ({ ...prev, [item.bookingId]: e.target.value }))
                  }
                  placeholder="Add official dispute resolution note..."
                  className="flex-1 text-xs border border-neutral-200 rounded-xl px-3.5 py-2"
                />
                <button
                  type="button"
                  onClick={() => handleSaveNote(item.bookingId)}
                  className="bg-[#4865ff] text-white px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Log Note
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
