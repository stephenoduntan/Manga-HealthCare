import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function DoctorPricingCompensationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div>
        <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3.5 py-1 rounded-full">
          doctor.mangahealthcare.com/pricing
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal mt-2">
          Compensation &amp; Biweekly Payout Schedule
        </h1>
        <p className="text-sm text-[#747679] mt-2">
          Transparent clinician splits accrued per completed, SOAP-documented consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-2">
          <span className="text-xs font-semibold uppercase text-[#0f3e17]">General Consult</span>
          <div className="font-serif text-3xl text-[#080331]">₦7,500 Net / Visit</div>
          <p className="text-xs text-[#747679]">75% clinician split on ₦10,000 standard consultation fees.</p>
        </div>

        <div className="bg-[#ebf0f8] rounded-3xl p-7 border border-[#4865ff]/20 space-y-2">
          <span className="text-xs font-semibold uppercase text-[#4865ff]">Therapy Session</span>
          <div className="font-serif text-3xl text-[#080331]">₦11,250 Net / Slot</div>
          <p className="text-xs text-[#222326]">75% clinician split on ₦15,000 protected 45-minute therapy appointments.</p>
        </div>

        <div className="bg-[#e1f4df] rounded-3xl p-7 border border-[#b1dbb8] space-y-2">
          <span className="text-xs font-semibold uppercase text-[#0f3e17]">Payout Cadence</span>
          <div className="font-serif text-3xl text-[#080331]">14-Day Biweekly</div>
          <p className="text-xs text-[#0f3e17]">Ledger transitions cleanly from ACCRUED to PAID_BIWEEKLY every 1st and 15th.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-[#efeeeb] space-y-4">
        <h2 className="font-serif text-2xl text-[#080331] font-normal">Compensation FAQ</h2>
        <p className="text-xs sm:text-sm text-[#747679] leading-relaxed">
          What happens if a call drops? Low-bandwidth chat automatically bridges the encounter and preserves session duration. Unresolved billing disputes are reviewed fairly against auto-logged start_time and end_time records via Admin/Ops.
        </p>
        <Link href={getPortalUrl('help', '/doctors')} className="text-xs font-semibold text-[#4865ff] hover:underline inline-block">
          Read Payout Guides in Help Centre →
        </Link>
      </div>
    </div>
  );
}
