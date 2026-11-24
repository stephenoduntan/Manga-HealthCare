import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function DoctorContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full">
        doctor.mangahealthcare.com/contact
      </span>
      <h1 className="font-serif text-4xl text-[#080331] font-normal">
        Clinician Verification &amp; Onboarding Support
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-2">
          <strong className="text-sm text-[#080331] block">Verification &amp; Credential Desk</strong>
          <p className="text-[#747679]">Pending MDCN reviews and Locum ID (LOC-XXXX) issuance.</p>
          <Link href={getPortalUrl('help', '/doctors')} className="text-[#4865ff] font-semibold hover:underline block">
            Clinician Help Desk →
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-2">
          <strong className="text-sm text-[#080331] block">Payout &amp; Ledger Support</strong>
          <p className="text-[#747679]">Biweekly settlement inquiries and encounter fee reconciliation.</p>
          <Link href={getPortalUrl('help', '/contact')} className="text-[#4865ff] font-semibold hover:underline block">
            Open Payout Ticket →
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-2">
          <strong className="text-sm text-[#080331] block">Clinical Safety Feedback</strong>
          <p className="text-[#747679]">Report 8-symptom red-flag triage edge cases directly to the Clinical Lead.</p>
          <Link href={getPortalUrl('help', '/contact')} className="text-[#4865ff] font-semibold hover:underline block">
            Escalate to Clinical Lead →
          </Link>
        </div>
      </div>
    </div>
  );
}
