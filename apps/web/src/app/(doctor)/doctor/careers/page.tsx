import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function DoctorCareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full">
        doctor.mangahealthcare.com/careers
      </span>
      <h1 className="font-serif text-4xl text-[#080331] font-normal">
        Clinical Practice &amp; Advisory Opportunities
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-3">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Practicing Clinicians</h2>
          <p className="text-xs sm:text-sm text-[#747679]">
            General Practitioners, Mental Health Therapists, and On-Call Locum Physicians.
          </p>
          <Link href={getPortalUrl('doctor', '/auth?mode=apply')} className="text-xs font-semibold text-[#0a3922] hover:underline block">
            Apply via Clinician Portal →
          </Link>
        </div>

        <div className="bg-[#ebf0f8] rounded-3xl p-7 border border-[#4865ff]/20 space-y-3">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Clinical Leadership &amp; QA</h2>
          <p className="text-xs sm:text-sm text-[#222326]">
            Clinical QA Reviewers, Triage Protocol Advisors, and Medical Directors.
          </p>
          <Link href={getPortalUrl('marketing', '/careers')} className="text-xs font-semibold text-[#4865ff] hover:underline block">
            View Full Careers Hub →
          </Link>
        </div>
      </div>
    </div>
  );
}
