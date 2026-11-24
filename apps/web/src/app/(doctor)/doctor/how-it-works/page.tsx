import React from 'react';
import { getPortalUrl } from '../../../../lib/domains';
import Link from 'next/link';

export default function DoctorHowItWorksPage() {
  const steps = [
    '1. Application & MDCN Credential Verification: Submit email, medical degree details, and MDCN license (or apply as Locum). Admin/Ops verifies credentials before going live.',
    '2. Profile & Availability Configuration: Set bio, spoken languages, consultation fees, and weekly calendar slots.',
    '3. Claiming Queue Patients or Joining Booked Slots: Receive FCM push alerts for booked slots or claim waiting patients in the live lobby.',
    '4. Conducting the Consultation: Review patient allergies/history, run Video/Audio/Chat session, and inspect uploaded clinical photos.',
    '5. Structured Charting & E-Prescribing: Complete Chief Complaint, Hx, Assessment & Plan, and generate PDF prescriptions or lab orders.',
    '6. Real-Time Ledger & Biweekly Payout: Accrued fees update immediately on your dashboard and settle biweekly.',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full">
          doctor.mangahealthcare.com/how-it-works
        </span>
        <h1 className="font-serif text-4xl text-[#080331] font-normal mt-2">
          Clinician Operational Workflow
        </h1>
      </div>

      <div className="space-y-4">
        {steps.map((text, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-[#efeeeb] text-sm text-[#222326]">
            {text}
          </div>
        ))}
      </div>

      <Link href={getPortalUrl('doctor', '/getting-started')} className="bg-[#0f3e17] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
        Review Credential Requirements →
      </Link>
    </div>
  );
}
