import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { getPortalUrl } from '../../../lib/domains';

export default function PatientHowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'One-Minute OTP Sign-Up & NDPR Consent',
      desc: 'Sign up via Phone, Email, or Patient ID + 6-digit OTP and review transparent Telemedicine & NDPR consent.',
      link: { label: 'Read Telemedicine Consent', href: getPortalUrl('legal', '/telemedicine-consent') },
    },
    {
      num: '02',
      title: 'Medical Intake & Language Preference',
      desc: 'Record allergies, existing conditions, current medications, and preferred language once—never repeat history.',
    },
    {
      num: '03',
      title: 'Emergency-Symptom Safety Check',
      desc: '8 red-flag screen branches safely: flagged symptoms redirect immediately to 112 ambulance care; cleared cases proceed.',
    },
    {
      num: '04',
      title: 'Instant Queue or Scheduled Calendar',
      desc: 'Choose "Talk to Doctor Now" instant lobby or pick a calendar slot (mandatory for therapy sessions).',
    },
    {
      num: '05',
      title: 'Flexible Local Checkout (Paystack & Flutterwave)',
      desc: 'Pay transparently via Debit Card, Instant Bank Transfer, or USSD (*737#, *919#, *894#).',
    },
    {
      num: '06',
      title: 'Consult, Rate & Fulfill',
      desc: 'Join Video/Audio/Chat, download your PDF E-Prescription, rate your doctor, and present PAT-XXXX at partner pharmacies/labs.',
      link: { label: 'View Partner Network', href: getPortalUrl('partner', '/') },
    },
  ];

  return (
    <MarketingPageShell activeSurface="marketing">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 space-y-10">
        <div className="space-y-3 max-w-2xl">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            mangahealthcare.com/how-it-works
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
            Six guarded steps from first tap to prescription fulfillment.
          </h1>
        </div>

        <div className="space-y-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start gap-5">
                <span className="font-serif text-3xl text-[#0a3922] bg-[#e1f4df] w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                  {s.num}
                </span>
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl text-[#080331] font-normal">{s.title}</h2>
                  <p className="text-xs sm:text-sm text-[#747679] leading-relaxed">{s.desc}</p>
                </div>
              </div>
              {s.link && (
                <Link href={s.link.href} className="text-xs font-semibold text-[#4865ff] hover:underline shrink-0">
                  {s.link.label} →
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href={getPortalUrl('patient', '/auth?intent=instant')}
            className="bg-[#ff643b] text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <span>Start Your First Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </MarketingPageShell>
  );
}
