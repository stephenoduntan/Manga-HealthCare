import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { getPortalUrl } from '../../../lib/domains';

export default function MarketingAboutPage() {
  return (
    <MarketingPageShell activeSurface="marketing">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            mangahealthcare.com/about
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
            Making licensed, empathetic healthcare accessible without compromising clinical safety.
          </h1>
          <p className="text-sm sm:text-base text-[#747679] leading-relaxed">
            Manga Healthcare connects patients across Nigeria to MDCN-verified physicians, clinical psychologists, and local pharmacy/diagnostic partners under strict NDPR privacy rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-3">
            <AlertTriangle className="w-6 h-6 text-[#ff643b]" />
            <h2 className="font-serif text-xl text-[#080331] font-normal">Pre-Payment Safety Gate</h2>
            <p className="text-xs text-[#747679] leading-relaxed">
              We block remote bookings whenever acute emergency symptoms appear—prioritizing patient survival over transaction volume.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#31ce01]" />
            <h2 className="font-serif text-xl text-[#080331] font-normal">Strict MDCN Verification</h2>
            <p className="text-xs text-[#747679] leading-relaxed">
              Every doctor and therapist undergoes manual credential verification before entering the consultation pool.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-3">
            <Lock className="w-6 h-6 text-[#4865ff]" />
            <h2 className="font-serif text-xl text-[#080331] font-normal">NDPR Audit Accountability</h2>
            <p className="text-xs text-[#747679] leading-relaxed">
              All clinical records are encrypted and every lookup by clinicians or partners is permanently audited.
            </p>
          </div>
        </div>

        {/* Founder & Clinical Leadership */}
        <div className="bg-[#e1f4df] rounded-[32px] p-8 md:p-10 border border-[#b1dbb8] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0f3e17]">
              Leadership &amp; Clinical Governance
            </span>
            <h2 className="font-serif text-3xl text-[#080331] font-normal">
              Dr. Precious David-Okoro, Founder &amp; Clinical Lead
            </h2>
            <p className="text-xs sm:text-sm text-[#0f3e17] leading-relaxed">
              Built in collaboration with practicing Nigerian physicians, clinical psychologists, and healthcare infrastructure engineers to create trustworthy digital care loops.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Link href={getPortalUrl('doctor', '/')} className="bg-[#0a3922] text-white px-5 py-2.5 rounded-full text-xs font-semibold text-center">
              Join as Clinician →
            </Link>
            <Link href={getPortalUrl('partner', '/')} className="bg-white text-[#080331] px-5 py-2.5 rounded-full text-xs font-semibold text-center">
              Partner Pharmacy / Lab →
            </Link>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
