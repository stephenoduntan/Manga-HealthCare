'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Calendar,
  FileText,
  Clock,
  Bell,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Download,
  Sparkles,
} from 'lucide-react';

export default function PatientHomePage() {
  const [patientId] = useState('PAT-48291');
  const [fcmReminderActive] = useState(true);

  return (
    <div className="w-full space-y-8">
      {/* Upcoming Appointment Banner (Section 3.2.1) */}
      <div className="bg-[#ebf0f8] rounded-3xl p-5 sm:p-6 border border-[#4865ff]/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#4865ff] text-white flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-white text-[#4865ff] px-2.5 py-0.5 rounded-full">
                Upcoming Scheduled Appointment
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0f3e17] bg-[#e1f4df] px-2.5 py-0.5 rounded-full">
                <Bell className="w-3 h-3 text-[#31ce01]" />
                {fcmReminderActive ? 'FCM Push Reminders Active' : 'Reminders Off'}
              </span>
            </div>
            <h2 className="font-serif text-xl text-[#080331] font-normal">
              Dr. Folake Davies (Clinical Psychologist • DOC-1102)
            </h2>
            <p className="text-xs text-[#747679]">
              Tomorrow, 11:00 AM WAT • 45-Minute Protected Therapy Slot • Begins in <strong className="font-mono text-[#080331]">18h 24m</strong>
            </p>
          </div>
        </div>

        <Link
          href="/patient/consultation/enc-live-01"
          className="bg-[#080331] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition inline-flex items-center gap-2 self-start md:self-auto"
        >
          <span>Test Waiting Room</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Action Cards Grid (Section 3.2.1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Talk to Doctor Now (Canopy Green #0a3922) */}
        <div className="lg:col-span-7 bg-[#0a3922] rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-[0_16px_36px_rgba(75,68,57,0.12)] border border-[#0f3e17] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#d2f2e3]">
              <span className="w-2 h-2 rounded-full bg-[#31ce01] animate-ping" />
              <span>Instant Lobby Active • 7 Doctors On-Duty</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
              Talk to Doctor Now
            </h1>

            <p className="text-sm text-[#cfe7d3] leading-relaxed max-w-lg">
              Enter the live triage queue for non-emergency consultations. Mandatory 8-symptom safety screen runs first (~60s). Standard GP fee: ₦10,000.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/patient/triage"
              className="bg-[#ff643b] text-white px-7 py-4 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition shadow-[0_8px_20px_rgba(255,100,59,0.3)] inline-flex items-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Start Safety Triage & Join Lobby</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Book Scheduled / Therapy Session (Paper White) */}
        <div className="lg:col-span-5 bg-white rounded-[32px] p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3 py-1 rounded-full inline-block">
              Calendar Booking • Mandatory for Therapy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#080331] font-normal">
              Book Scheduled / Therapy Session
            </h2>
            <p className="text-xs sm:text-sm text-[#747679] leading-relaxed">
              Browse MDCN-verified doctors and mental health therapists filtered by specialty, spoken language, and protected calendar slots.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/patient/triage"
              className="w-full bg-[#f8f3eb] hover:bg-[#e1f4df]/60 text-[#080331] border border-[#080331]/20 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#0f3e17]" />
              <span>Open Specialty & Calendar Picker</span>
            </Link>
            <p className="text-[11px] text-center text-[#747679]">
              Includes mandatory 8-point emergency safety screen before checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Prescriptions & Follow-Up Strip (Section 3.2.1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full">
                Recent Prescriptions & Follow-Ups
              </span>
              <h3 className="font-serif text-2xl text-[#080331] font-normal mt-2">
                Active Medications & Discounted Rebooking
              </h3>
            </div>
            <Link
              href="/patient/records"
              className="text-xs font-semibold text-[#4865ff] hover:underline inline-flex items-center gap-1"
            >
              <span>All Medical Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#f8f3eb]/70 border border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#080331] bg-white px-2 py-0.5 rounded border border-neutral-200">
                  RX-99120
                </span>
                <span className="text-[11px] font-semibold text-[#0f3e17] bg-[#e1f4df] px-2 py-0.5 rounded-full">
                  Active Rx
                </span>
              </div>
              <div className="text-xs text-[#222326]">
                <strong className="block text-sm font-serif text-[#080331]">
                  Paracetamol 1000mg + Cetirizine 10mg
                </strong>
                <span className="text-[#747679]">Prescribed by Dr. Chidi Okafor • 14 Nov 2026</span>
              </div>
              <Link
                href="/patient/records"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a3922] hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View & Download Signed PDF</span>
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-[#e1f4df]/45 border border-[#b1dbb8] space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#0f3e17]">
                  <Sparkles className="w-3 h-3 text-[#31ce01]" />
                  <span>14-Day Follow-Up Discount Eligible</span>
                </div>
                <strong className="block text-sm font-serif text-[#080331]">
                  Re-consult Dr. Chidi Okafor for ₦5,000
                </strong>
                <p className="text-xs text-[#747679]">
                  50% follow-up discount automatically applied for encounter ENC-2026-0811 review.
                </p>
              </div>
              <Link
                href="/patient/triage"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a3922] hover:underline"
              >
                <span>Book ₦5,000 Follow-Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Partner Pharmacy Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#31ce01]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#080331]">
                Your Patient ID
              </span>
            </div>
            <div className="font-mono text-2xl font-bold text-[#080331] bg-[#f8f3eb] px-4 py-3 rounded-2xl border border-neutral-200 text-center">
              {patientId}
            </div>
            <p className="text-xs text-[#747679] leading-relaxed">
              Share this ID at any verified Manga Partner Pharmacy or Lab to pull your authorized prescriptions and lab orders.
            </p>
          </div>
          <Link
            href="/patient/profile"
            className="text-xs font-semibold text-[#4865ff] hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Allergies, Languages & NDPR Consents</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
