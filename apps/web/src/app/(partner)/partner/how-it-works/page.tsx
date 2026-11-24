import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function PartnerHowItWorksPage() {
  const steps = [
    '1. Facility Onboarding & Verification: Submit PCN or diagnostic facility credentials to activate partner portal logins.',
    '2. Patient Arrival & ID Presentation: Patient shares their Patient ID (PAT-XXXX) from app.mangahealthcare.com.',
    '3. Secure Portal Retrieval: Staff log into partner.mangahealthcare.com/auth and enter PAT-XXXX to view authorized orders.',
    '4. Dispense, Test, or Consult: Fulfill the order accurately and mark it as Fulfilled / Dispensed.',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="font-serif text-4xl text-[#080331] font-normal">How Partner Fulfillment Works</h1>
      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-[#efeeeb] text-sm text-[#222326]">
            {s}
          </div>
        ))}
      </div>
      <Link href={getPortalUrl('partner', '/getting-started')} className="bg-[#4865ff] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
        Register Your Facility →
      </Link>
    </div>
  );
}
