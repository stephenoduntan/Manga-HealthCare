import React from 'react';
import Link from 'next/link';
import { CheckCircle2, CreditCard, Building2, Smartphone } from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { getPortalUrl } from '../../../lib/domains';

export default function PatientPricingPage() {
  return (
    <MarketingPageShell activeSurface="marketing">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            mangahealthcare.com/pricing
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
            Pay only when you need care. Transparent fees, reduced rates for follow-ups.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Standard General Consultation (Keylime Wash) */}
          <div className="bg-[#e1f4df] rounded-[28px] p-8 border border-[#b1dbb8] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-white text-[#0f3e17] px-3 py-1 rounded-full">
                Standard General Consultation
              </span>
              <div className="font-serif text-4xl text-[#080331]">₦10,000</div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#0f3e17]">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Mandatory 8-point safety triage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Video, Audio, or Chat encounter</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Structured SOAP note &amp; PDF E-Rx</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Lab or specialist referral included</li>
              </ul>
            </div>
            <Link
              href={getPortalUrl('patient', '/auth?intent=instant')}
              className="bg-[#0a3922] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-center block"
            >
              Start Consultation
            </Link>
          </div>

          {/* Card 2: Follow-Up Consultation (Cloud Card) */}
          <div className="bg-[#ebf0f8] rounded-[28px] p-8 border border-[#4865ff]/25 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-white text-[#4865ff] px-3 py-1 rounded-full">
                14-Day Follow-Up Consultation
              </span>
              <div className="font-serif text-4xl text-[#080331]">₦5,000</div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#222326]">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#4865ff] shrink-0 mt-0.5" /> Automatic 50% continuity discount</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#4865ff] shrink-0 mt-0.5" /> Review of prior notes &amp; prescriptions</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#4865ff] shrink-0 mt-0.5" /> Updated PDF prescription if needed</li>
              </ul>
            </div>
            <Link
              href={getPortalUrl('patient', '/auth')}
              className="bg-[#4865ff] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-center block"
            >
              Book Follow-Up Review
            </Link>
          </div>

          {/* Card 3: Scheduled Therapy Session (Sage Mist) */}
          <div className="bg-[#b1dbb8] rounded-[28px] p-8 border border-[#0f3e17]/20 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-white text-[#0a3922] px-3 py-1 rounded-full">
                Scheduled Therapy Session
              </span>
              <div className="font-serif text-4xl text-[#080331]">₦15,000</div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#0f3e17]">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Protected 45-min calendar slot</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Licensed clinical psychologist / therapist</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Strictly confidential NDPR vault</li>
              </ul>
            </div>
            <Link
              href={getPortalUrl('patient', '/auth?intent=schedule')}
              className="bg-white text-[#080331] py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-center block"
            >
              Reserve Calendar Slot
            </Link>
          </div>
        </div>

        {/* Payment Methods Band */}
        <div className="bg-white rounded-3xl p-8 border border-[#efeeeb] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <strong className="font-serif text-2xl text-[#080331] block">
              Powered by Paystack &amp; Flutterwave
            </strong>
            <span className="text-xs text-[#747679]">
              If your session is halted at Emergency Triage, you incur zero charges.
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#080331]">
            <span className="bg-[#f8f3eb] px-4 py-2.5 rounded-full border border-neutral-200 inline-flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#4865ff]" /> Debit / Credit Cards
            </span>
            <span className="bg-[#f8f3eb] px-4 py-2.5 rounded-full border border-neutral-200 inline-flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0f3e17]" /> Bank Transfer
            </span>
            <span className="bg-[#f8f3eb] px-4 py-2.5 rounded-full border border-neutral-200 inline-flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#ff643b]" /> Nigerian USSD
            </span>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
