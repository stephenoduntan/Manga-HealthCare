import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { getPortalUrl } from '../../../lib/domains';

export default function PatientGettingStartedPage() {
  return (
    <MarketingPageShell activeSurface="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-10">
        <div className="space-y-3">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            mangahealthcare.com/getting-started
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
            Patient Readiness Checklist
          </h1>
          <p className="text-sm text-[#747679]">
            Everything you need before starting your first remote consultation or therapy appointment.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#efeeeb] space-y-4">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">
            What You Need Before Your First Visit
          </h2>
          <ul className="space-y-3 text-sm text-[#222326]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#31ce01] shrink-0 mt-1" />
              <span>Active Nigerian phone number (+234) or email address for 6-digit OTP verification.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#31ce01] shrink-0 mt-1" />
              <span>List of current medications, known drug allergies (e.g., Penicillin), and existing conditions.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#31ce01] shrink-0 mt-1" />
              <span>Well-lit space and phone/laptop camera if uploading a photo of a skin rash or lab report.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#31ce01] shrink-0 mt-1" />
              <span>Payment readiness via Debit Card, Bank Transfer, or USSD on Paystack / Flutterwave.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#efeeeb] space-y-4">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">
            Instant Care vs. Scheduled Therapy Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] space-y-2">
              <strong className="text-sm text-[#080331] block">Instant Lobby (&ldquo;Talk to Doctor Now&rdquo;)</strong>
              <p className="text-[#0f3e17]">Best for acute general medical complaints (fever, cough, malaria symptoms, rashes). Average wait under 5 minutes.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#ebf0f8] border border-[#4865ff]/25 space-y-2">
              <strong className="text-sm text-[#080331] block">Scheduled Calendar Booking</strong>
              <p className="text-[#222326]">Mandatory for Mental Health &amp; Therapy sessions (45-min protected slots) and preferred for follow-up continuity.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href={getPortalUrl('patient', '/auth?mode=signup')}
            className="bg-[#ff643b] text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <span>Create Patient Account Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </MarketingPageShell>
  );
}
