import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function PartnerPricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3.5 py-1 rounded-full">
        partner.mangahealthcare.com/pricing
      </span>
      <h1 className="font-serif text-4xl text-[#080331] font-normal">
        Zero-Fee Beta Partner Network
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="bg-[#e1f4df] rounded-3xl p-7 border border-[#b1dbb8] space-y-2">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Zero Software Cost (Beta)</h2>
          <p className="text-[#0f3e17]">
            Verified pharmacies, labs, and referral clinics access the partner.mangahealthcare.com portal at ₦0 subscription cost during Beta.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-2">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Direct Counter Settlement</h2>
          <p className="text-[#747679]">
            Patients pay your facility directly at your counter for dispensed medications and diagnostic tests during Beta.
          </p>
        </div>
      </div>
      <Link href={getPortalUrl('help', '/partners')} className="text-xs font-semibold text-[#4865ff] hover:underline inline-block">
        Read Partner Operations FAQ →
      </Link>
    </div>
  );
}
