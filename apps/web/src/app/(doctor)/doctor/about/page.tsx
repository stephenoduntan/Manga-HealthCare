import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function DoctorAboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full">
        doctor.mangahealthcare.com/about
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
        Built by clinicians, for Nigerian clinicians.
      </h1>
      <div className="bg-white rounded-3xl p-8 border border-[#efeeeb] space-y-4 text-sm text-[#222326] leading-relaxed">
        <p>
          Founded by Dr. Precious David-Okoro, Manga Healthcare prioritizes clinician autonomy, strict adherence to MDCN telemedicine governance, and clean structured documentation that protects both doctor and patient.
        </p>
        <p>
          Our connected care loop pairs patients on <strong>mangahealthcare.com</strong> with verified doctors on <strong>doctor.mangahealthcare.com</strong> and local pharmacies/labs on <strong>partner.mangahealthcare.com</strong>.
        </p>
        <Link href={getPortalUrl('legal', '/clinician-compliance')} className="text-xs font-semibold text-[#4865ff] hover:underline inline-block">
          Read MDCN Clinician Compliance Policy →
        </Link>
      </div>
    </div>
  );
}
