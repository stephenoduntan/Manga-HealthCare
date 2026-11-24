'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PartnerGettingStartedPage() {
  const [facilityName, setFacilityName] = useState('');
  const [facilityType, setFacilityType] = useState('Pharmacy (PCN Licensed)');
  const [licenseId, setLicenseId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div>
        <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3.5 py-1 rounded-full">
          partner.mangahealthcare.com/getting-started
        </span>
        <h1 className="font-serif text-4xl text-[#080331] font-normal mt-2">
          Partner Eligibility &amp; Application
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-3 text-xs sm:text-sm text-[#222326]">
        <h2 className="font-serif text-2xl text-[#080331] font-normal">Regulatory Requirements</h2>
        <p><strong>Pharmacies:</strong> Valid Pharmacists Council of Nigeria (PCN) premises license &amp; Superintendent Pharmacist details.</p>
        <p><strong>Diagnostic Labs:</strong> Valid state/federal health facility registration and lab accreditation.</p>
        <p><strong>Referral Clinics:</strong> Valid HEFAMAA / State Ministry of Health registration. No extra hardware needed—runs in any browser.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="bg-white rounded-3xl p-8 border border-[#efeeeb] shadow-xs space-y-4"
      >
        <h2 className="font-serif text-2xl text-[#080331] font-normal">Facility Onboarding Request</h2>

        {submitted && (
          <div className="p-4 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] text-xs text-[#0f3e17] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
            <span>Facility application submitted! Ops will verify credentials and issue your Partner ID.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            placeholder="Facility Legal Name (e.g. MedPlus VI)"
            className="text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-[#f8f3eb]/20"
          />
          <select
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value)}
            className="text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-[#f8f3eb]/20"
          >
            <option>Pharmacy (PCN Licensed)</option>
            <option>Diagnostic Laboratory</option>
            <option>Referral Clinic / Hospital</option>
          </select>
        </div>

        <input
          type="text"
          required
          value={licenseId}
          onChange={(e) => setLicenseId(e.target.value)}
          placeholder="PCN / HEFAMAA / Accreditation Registration Number"
          className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-[#f8f3eb]/20"
        />

        <button
          type="submit"
          className="bg-[#4865ff] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Submit Partner Application
        </button>
      </form>
    </div>
  );
}
