import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Calendar, PhoneCall, FileText, ArrowRight } from 'lucide-react';
import { getPortalUrl } from '../../../lib/domains';

export default function DoctorHomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 space-y-14">
      {/* Hero Split: Canopy Green #0a3922 & Slate Hush #b6ced5 */}
      <section className="rounded-[28px] overflow-hidden shadow-[0_16px_36px_rgba(75,68,57,0.1)] border border-[#0f3e17]/15 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 bg-[#0a3922] text-white p-8 md:p-11 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#d2f2e3] bg-white/10 px-3.5 py-1.5 rounded-full">
              FOR LICENSED DOCTORS, THERAPISTS &amp; LOCUMS
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[64px] text-white font-normal leading-[1.04] tracking-[-0.03em]">
              Practice medicine on your schedule, backed by clinical safety.
            </h1>
            <p className="text-[#d2f2e3] text-base md:text-lg leading-relaxed max-w-xl">
              Consult pre-screened patients via video, audio, or chat, document with structured SOAP templates, and earn transparent consultation fees paid out biweekly.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href={getPortalUrl('doctor', '/auth?mode=apply')}
                className="bg-[#ff643b] text-white px-7 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:brightness-110 transition"
              >
                Apply with MDCN License
              </Link>
              <Link
                href={getPortalUrl('doctor', '/auth')}
                className="border border-white/30 text-white px-6 py-4 rounded-full text-xs sm:text-sm font-medium hover:bg-white/10 transition"
              >
                Locum &amp; Practitioner Login
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel: Slate Hush #b6ced5 */}
        <div className="lg:col-span-5 bg-[#b6ced5] p-8 md:p-10 flex flex-col justify-between gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#e1f4df] text-[#0f3e17] px-2.5 py-1 rounded-full">
              Split-Screen SOAP EHR
            </span>
            <h2 className="font-serif text-xl text-[#080331] font-normal">
              Structured Charting + Allergy Warnings
            </h2>
            <p className="text-xs text-[#747679]">
              Pre-loaded patient intake (Penicillin allergy alerts, chronic conditions, uploaded rash images) beside Chief Complaint, Hx, Assessment &amp; Plan.
            </p>
          </div>

          <div className="bg-[#ebf0f8] rounded-3xl p-6 border border-[#4865ff]/20 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4865ff]">
              Bevel Biweekly Payout Ledger
            </span>
            <div className="font-serif text-3xl text-[#080331]">₦210,000 Accrued</div>
            <p className="text-xs text-[#0f3e17]">
              28 Patients Consulted • Automatic biweekly cycle settlement
            </p>
          </div>
        </div>
      </section>

      {/* Pre-Screened Safety Guarantee */}
      <section className="bg-[#e1f4df] rounded-[28px] p-8 border border-[#b1dbb8] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-2xl">
          <ShieldCheck className="w-7 h-7 text-[#0f3e17] shrink-0 mt-0.5" />
          <div>
            <h2 className="font-serif text-2xl text-[#080331] font-normal">
              Every Patient Clears 8-Point Emergency Triage Before Reaching You
            </h2>
            <p className="text-xs sm:text-sm text-[#0f3e17] mt-1">
              Acute chest pressure, strokes, breathing distress, and uncontrolled hemorrhage are automatically intercepted and routed to 112 ambulance services prior to queueing.
            </p>
          </div>
        </div>
        <Link
          href={getPortalUrl('doctor', '/getting-started')}
          className="bg-[#0a3922] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0"
        >
          View MDCN Requirements →
        </Link>
      </section>

      {/* Three Ways to Practice */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-3">
          <PhoneCall className="w-6 h-6 text-[#ff643b]" />
          <h3 className="font-serif text-2xl text-[#080331] font-normal">Instant Queue Shifts</h3>
          <p className="text-xs sm:text-sm text-[#747679]">
            Toggle online anytime to claim triage-cleared patients waiting in &ldquo;Talk to Doctor Now&rdquo;.
          </p>
        </div>

        <div className="bg-[#ebf0f8] rounded-3xl p-7 border border-[#4865ff]/20 space-y-3">
          <Calendar className="w-6 h-6 text-[#4865ff]" />
          <h3 className="font-serif text-2xl text-[#080331] font-normal">Scheduled Calendar Practice</h3>
          <p className="text-xs sm:text-sm text-[#222326]">
            Set recurring weekly slots for GP consultations and protected 45-minute therapy appointments.
          </p>
        </div>

        <div className="bg-[#b1dbb8] rounded-3xl p-7 border border-[#0f3e17]/20 space-y-3">
          <FileText className="w-6 h-6 text-[#0a3922]" />
          <h3 className="font-serif text-2xl text-[#080331] font-normal">Locum Clinician Dispatch</h3>
          <p className="text-xs sm:text-sm text-[#0f3e17]">
            Join our rapid-response locum roster with an Admin-issued LOC-XXXX ID during surge periods.
          </p>
        </div>
      </section>

      <div className="text-center">
        <Link
          href={getPortalUrl('doctor', '/auth?mode=apply')}
          className="bg-[#0a3922] text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <span>Apply as MDCN Clinician</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
