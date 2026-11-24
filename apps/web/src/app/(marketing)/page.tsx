'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Video,
  FileText,
  AlertTriangle,
  PhoneCall,
  Lock,
  ArrowRight,
  Calendar,
  Wifi,
  Download,
  Stethoscope,
  MessageSquare,
} from 'lucide-react';
import { MarketingPageShell } from '../../components/ecosystem/EcosystemChrome';
import { getPortalUrl } from '../../lib/domains';

export default function MarketingPage() {
  const instantAuthHref = getPortalUrl('patient', '/auth?intent=instant');
  const scheduleAuthHref = getPortalUrl('patient', '/auth?intent=schedule');

  const faqs = [
    {
      q: 'What payment methods are supported & how do follow-ups work?',
      a: 'We accept Paystack and Flutterwave across Debit/Credit Cards, Direct Bank Transfer, and Nigerian bank USSD (*737#, *919#, *894#). General Physician visits are ₦10,000 and scheduled Therapy sessions are ₦15,000. Returning within 14 days automatically applies the discounted ₦5,000 follow-up rate.',
    },
    {
      q: 'How does the mandatory 8-point emergency safety triage work?',
      a: 'Before entering the lobby or paying for a slot, every patient completes a 60-second clinical screen covering 8 red-flag symptoms. If any flag is detected, online booking halts immediately and displays tap-to-call access for 112 and Lagos 767 ambulance services.',
    },
    {
      q: 'How are prescriptions fulfilled at partner pharmacies and labs?',
      a: 'Every encounter outputs structured SOAP notes and a signed PDF E-Prescription bearing your physician’s MDCN folio number. Present your Patient ID (PAT-XXXX) at any partner pharmacy or diagnostic lab on partner.mangahealthcare.com for instant lookup.',
    },
  ];

  return (
    <MarketingPageShell activeSurface="marketing">
      {/* Hero Section (Split Two-Column: Keylime Wash #e1f4df & Slate Hush #b6ced5) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-14 w-full">
        <div className="rounded-[28px] overflow-hidden shadow-[0_16px_36px_rgba(75,68,57,0.1)] border border-[#0f3e17]/15 grid grid-cols-1 lg:grid-cols-12">
          {/* Left Panel: Keylime Wash (#e1f4df) */}
          <div className="lg:col-span-7 bg-[#e1f4df] text-[#0f3e17] p-8 md:p-11 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] bg-white/80 text-[#0f3e17] px-3.5 py-1.5 rounded-full border border-[#b1dbb8]">
                LICENSED DOCTORS &amp; THERAPISTS ON DEMAND
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[64px] text-[#0f3e17] font-normal leading-[1.04] tracking-[-0.03em]">
                Thoughtful healthcare, wherever you are.
              </h1>

              <p className="text-[#222326]/90 text-base md:text-lg leading-relaxed max-w-xl">
                Consult verified Nigerian doctors and therapists via video, audio, or chat—with built-in emergency safety screening and instant PDF prescriptions.
              </p>

              {/* Transparent NGN Consultation Pricing Callout */}
              <div className="bg-white/85 rounded-2xl p-4 border border-[#b1dbb8] grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#f8f3eb] rounded-xl p-2.5 border border-[#efeeeb]">
                  <div className="text-lg font-serif text-[#080331]">₦10,000</div>
                  <div className="text-[10px] text-[#0f3e17] uppercase font-semibold">General GP</div>
                </div>
                <div className="bg-[#0a3922] rounded-xl p-2.5 text-white">
                  <div className="text-lg font-serif text-[#31ce01]">₦5,000</div>
                  <div className="text-[10px] text-[#d2f2e3] uppercase font-semibold">Follow-Up</div>
                </div>
                <div className="bg-[#f8f3eb] rounded-xl p-2.5 border border-[#efeeeb]">
                  <div className="text-lg font-serif text-[#080331]">₦15,000</div>
                  <div className="text-[10px] text-[#4865ff] uppercase font-semibold">Therapy Slot</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={instantAuthHref}
                  className="bg-[#ff643b] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase hover:brightness-110 transition shadow-[0_8px_24px_rgba(255,100,59,0.35)] inline-flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Talk to a Doctor Now</span>
                </Link>
                <Link
                  href={scheduleAuthHref}
                  className="bg-transparent text-[#080331] hover:bg-white/60 border border-[#080331]/30 px-6 py-4 rounded-full text-sm font-medium transition inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#0f3e17]" />
                  <span>Book a Scheduled Visit</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Panel: Slate Hush (#b6ced5) */}
          <div className="lg:col-span-5 bg-[#b6ced5] p-8 md:p-10 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between bg-white/85 rounded-2xl p-4 border border-white">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0a3922] text-white border-2 border-white flex items-center justify-center text-sm">
                  👩🏾‍⚕️
                </div>
                <div className="w-10 h-10 rounded-full bg-[#4865ff] text-white border-2 border-white flex items-center justify-center text-sm">
                  👨🏾‍⚕️
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0f3e17] text-white border-2 border-white flex items-center justify-center text-sm">
                  👩🏾
                </div>
              </div>
              <div className="text-right">
                <strong className="text-xs text-[#080331] block">MDCN Vetted Clinicians</strong>
                <span className="text-[11px] text-[#0f3e17]">Lagos, Abuja &amp; Nationwide</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#efeeeb] space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#ff643b] bg-[#ffede8] px-2.5 py-0.5 rounded-full">
                1. 8-Point Emergency Triage Gate
              </span>
              <p className="text-xs text-[#222326]">
                Every visit checks for chest pressure, breathing distress, stroke signs, and 5 other red flags before booking.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#efeeeb] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#0f3e17]">
                  <Video className="w-3.5 h-3.5 text-[#31ce01]" /> 2. Video / Audio / Chat Room
                </span>
                <span className="font-mono text-[10px] text-[#747679]">Encrypted</span>
              </div>
              <p className="text-xs text-[#747679]">
                Upload skin rash or lab photos directly inside your consultation session.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#efeeeb] flex items-center justify-between text-xs">
              <div>
                <div className="inline-flex items-center gap-1.5 font-semibold text-[#080331]">
                  <FileText className="w-3.5 h-3.5 text-[#4865ff]" /> 3. Signed PDF E-Prescription
                </div>
                <span className="block text-[11px] text-[#747679] mt-0.5">
                  Accepted at partner.mangahealthcare.com pharmacies
                </span>
              </div>
              <Download className="w-4 h-4 text-[#0a3922]" />
            </div>
          </div>
        </div>
      </section>

      {/* Safety-First Triage Highlight Band (Peach Wash #ffede8) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12 w-full">
        <div className="bg-[#ffede8] rounded-[28px] p-8 md:p-10 border border-[#ff643b]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-11 h-11 rounded-full bg-[#ff643b] text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#ff643b]">
                Safety-First Emergency Triage
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#080331] font-normal">
                Built to redirect acute emergencies to ambulance care immediately.
              </h2>
              <p className="text-xs sm:text-sm text-[#222326]/85 leading-relaxed">
                Patients reporting chest pain, difficulty breathing, stroke symptoms, or pregnancy bleeding are calmly halted prior to payment and given direct one-tap dialers for 112 / 767 ambulance services.
              </p>
            </div>
          </div>
          <Link
            href={getPortalUrl('marketing', '/features')}
            className="bg-white text-[#080331] border border-[#ff643b]/30 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50 shrink-0"
          >
            Explore Safety Features →
          </Link>
        </div>
      </section>

      {/* Care Modes Bento Grid (Cloud Card #ebf0f8 & Sage Mist #b1dbb8) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#b1dbb8] rounded-[28px] p-8 border border-[#0f3e17]/15 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <Stethoscope className="w-6 h-6 text-[#0a3922]" />
            <h3 className="font-serif text-2xl text-[#080331] font-normal">
              Instant Lobby (&ldquo;Talk to Doctor Now&rdquo;)
            </h3>
            <p className="text-xs sm:text-sm text-[#0f3e17] leading-relaxed">
              Connect with an on-duty doctor in minutes for fever, malaria, infections, skin rashes, and acute non-emergency illness.
            </p>
          </div>
          <Link href={instantAuthHref} className="text-xs font-semibold uppercase text-[#0a3922] hover:underline">
            Enter Instant Lobby →
          </Link>
        </div>

        <div className="bg-[#ebf0f8] rounded-[28px] p-8 border border-[#4865ff]/20 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <Calendar className="w-6 h-6 text-[#4865ff]" />
            <h3 className="font-serif text-2xl text-[#080331] font-normal">
              Scheduled Therapy &amp; Specialist Care
            </h3>
            <p className="text-xs sm:text-sm text-[#222326]/80 leading-relaxed">
              Dedicated 45-minute calendar booking for confidential mental health therapy and specialist follow-ups.
            </p>
          </div>
          <Link href={scheduleAuthHref} className="text-xs font-semibold uppercase text-[#4865ff] hover:underline">
            Browse Calendar Slots →
          </Link>
        </div>

        <div className="bg-white rounded-[28px] p-8 border border-[#efeeeb] flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <Wifi className="w-6 h-6 text-[#ff643b]" />
            <h3 className="font-serif text-2xl text-[#080331] font-normal">
              Low-Bandwidth Flexibility
            </h3>
            <p className="text-xs sm:text-sm text-[#747679] leading-relaxed">
              Switch seamlessly between HD Video, Audio, and Text Chat with instant clinical photo uploads (e.g., skin rashes).
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#080331]">
            <MessageSquare className="w-4 h-4 text-[#0f3e17]" /> Works on 3G / Mobile Data
          </div>
        </div>
      </section>

      {/* How It Works 4-Step Strip */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12 w-full">
        <div className="bg-white rounded-[28px] p-8 border border-[#efeeeb] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#080331] font-normal">
              How Manga Healthcare Works
            </h2>
            <Link href={getPortalUrl('marketing', '/how-it-works')} className="text-xs font-semibold text-[#4865ff] hover:underline">
              See Detailed Walkthrough →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#f8f3eb]">
              <strong className="font-serif text-lg text-[#080331] block">1. Sign Up &amp; Intake</strong>
              <span className="text-[#747679]">OTP verification, NDPR consent, and allergies/conditions log.</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#ffede8]">
              <strong className="font-serif text-lg text-[#080331] block">2. Safety Triage</strong>
              <span className="text-[#747679]">Mandatory 8 red-flag clinical safety gate.</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#ebf0f8]">
              <strong className="font-serif text-lg text-[#080331] block">3. Paystack / USSD Checkout</strong>
              <span className="text-[#747679]">Card, Direct Transfer, or USSD with follow-up discounts.</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#e1f4df]">
              <strong className="font-serif text-lg text-[#080331] block">4. Consult &amp; Get PDF Rx</strong>
              <span className="text-[#0f3e17]">Structured summary + pharmacy-verified PDF prescription.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust, MDCN & NDPR Assurance Strip */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white rounded-2xl p-5 border border-[#efeeeb] flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#31ce01] shrink-0" />
            <div>
              <strong className="text-[#080331] block">MDCN Verified Doctors</strong>
              <Link href={getPortalUrl('doctor', '/')} className="text-[#4865ff] hover:underline">
                View Clinician Portal →
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#efeeeb] flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#4865ff] shrink-0" />
            <div>
              <strong className="text-[#080331] block">NDPR Encrypted Records</strong>
              <Link href={getPortalUrl('legal', '/ndpr-privacy')} className="text-[#4865ff] hover:underline">
                Read NDPR Policy →
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#efeeeb] flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#0f3e17] shrink-0" />
            <div>
              <strong className="text-[#080331] block">Partner Pharmacy &amp; Lab Network</strong>
              <Link href={getPortalUrl('partner', '/')} className="text-[#4865ff] hover:underline">
                View Partner Fulfillment →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial FAQ Preview & Canopy Green Closing CTA */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12 w-full space-y-12">
        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-[#efeeeb] divide-y divide-[#efeeeb]">
          <h2 className="font-serif text-3xl text-[#080331] font-normal pb-6">
            Common Patient Questions
          </h2>
          {faqs.map((faq, i) => (
            <div key={i} className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <h3 className="font-serif text-2xl text-[#0f3e17] font-normal">{faq.q}</h3>
              </div>
              <div className="lg:col-span-7">
                <p className="text-sm sm:text-base text-[#222326] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0a3922] rounded-[32px] p-8 md:p-14 text-center text-white space-y-5">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal">
            Speak with an MDCN-verified physician today.
          </h2>
          <p className="text-sm text-[#cfe7d3] max-w-xl mx-auto">
            Complete your 60-second safety screen and enter our secure telemedicine lobby in Lagos, Abuja, or anywhere in Nigeria.
          </p>
          <div className="pt-2">
            <Link
              href={instantAuthHref}
              className="bg-[#ff643b] text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider hover:brightness-110 transition inline-flex items-center gap-2"
            >
              <span>Enter Patient Portal (app.mangahealthcare.com)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
