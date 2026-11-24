import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { getPortalUrl } from '../../../../lib/domains';

export default function DoctorGettingStartedPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full">
          doctor.mangahealthcare.com/getting-started
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal mt-2">
          Credential &amp; Onboarding Requirements
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-3">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">1. Medical Doctors (GPs &amp; Specialists)</h2>
          <ul className="space-y-2 text-[#222326]">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#31ce01] shrink-0 mt-1" /> Valid current MDCN Practicing License Number.</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#31ce01] shrink-0 mt-1" /> Proof of MBBS / MBChB and specialist fellowship certificates.</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#31ce01] shrink-0 mt-1" /> Government photo ID &amp; Nigerian bank account for biweekly payouts.</li>
          </ul>
        </div>

        <div className="bg-[#ebf0f8] rounded-3xl p-7 border border-[#4865ff]/20 space-y-3">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">2. Therapists &amp; Mental Health Practitioners</h2>
          <ul className="space-y-2 text-[#222326]">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#4865ff] shrink-0 mt-1" /> Degree/certification in Clinical Psychology, Counseling, or Psychiatry.</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#4865ff] shrink-0 mt-1" /> Valid professional license / regulatory registration in Nigeria.</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#4865ff] shrink-0 mt-1" /> Commitment to scheduled calendar slots (instant queue disabled).</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#e1f4df] rounded-3xl p-8 border border-[#b1dbb8] space-y-3">
        <h2 className="font-serif text-2xl text-[#080331] font-normal">3. Locum Track (LOC-XXXX) &amp; NDPR Workspace Checklist</h2>
        <p className="text-xs sm:text-sm text-[#0f3e17] leading-relaxed">
          On-call locum physicians undergo rapid Ops verification to receive an Admin-issued Locum ID (LOC-XXXX) for instant surge-shift access. Ensure a private, quiet room maintaining NDPR patient confidentiality, stable internet, and camera/microphone access.
        </p>
        <div className="pt-2">
          <Link
            href={getPortalUrl('doctor', '/auth?mode=apply')}
            className="bg-[#0a3922] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <span>Start Credential Verification</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
