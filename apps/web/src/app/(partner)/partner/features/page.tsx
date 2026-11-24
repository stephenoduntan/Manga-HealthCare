import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function PartnerFeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div>
        <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3.5 py-1 rounded-full">
          partner.mangahealthcare.com/features
        </span>
        <h1 className="font-serif text-4xl text-[#080331] font-normal mt-2">
          Built for rapid counter &amp; reception workflows.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-2">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">1-Input Patient ID Lookup (PAT-XXXX)</h2>
          <p className="text-[#747679]">Fast browser-based search bar designed for desktop and tablet counters.</p>
        </div>
        <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-2">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Tamper-Proof E-Prescription Verification</h2>
          <p className="text-[#747679]">Displays medication tables, doctor name, MDCN License Number, and printable PDF view.</p>
        </div>
        <div className="bg-[#ebf0f8] rounded-3xl p-7 border border-[#4865ff]/20 space-y-2">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Scoped Clinical Privacy</h2>
          <p className="text-[#222326]">Partners view only authorized orders—private therapy notes and unrelated history stay strictly hidden.</p>
        </div>
        <div className="bg-[#e1f4df] rounded-3xl p-7 border border-[#b1dbb8] space-y-2">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Automated NDPR Access Audit Trail</h2>
          <p className="text-[#0f3e17]">Every counter query automatically logs partner identity and timestamp to audit_log.</p>
        </div>
      </div>

      <Link href={getPortalUrl('partner', '/auth')} className="bg-[#4865ff] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
        Try Counter Lookup Portal →
      </Link>
    </div>
  );
}
