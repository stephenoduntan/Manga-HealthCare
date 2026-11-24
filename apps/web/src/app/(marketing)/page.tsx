'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Video,
  FileText,
  Clock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Lock,
  ArrowRight,
  Users,
  Calendar,
  Wifi,
  Download,
  Stethoscope,
  MessageSquare,
} from 'lucide-react';
import { PersistentEmergencyBar } from '@manga/design-system';
import { getPortalUrl } from '../../lib/domains';

export default function MarketingPage() {
  const [activeLegalModal, setActiveLegalModal] = useState<'TOS' | 'NDPR' | 'TELEMED' | null>(null);

  const faqs = [
    {
      q: 'What payment methods are supported & how do follow-ups work?',
      a: 'We accept Paystack and Flutterwave across Debit/Credit Cards, Direct Bank Transfer, and Nigerian bank USSD (*737#, *919#, *894#). General Physician visits are ₦10,000 and scheduled Therapy sessions are ₦15,000. Returning for the same issue within 14 days automatically unlocks a discounted ₦5,000 follow-up rate.',
    },
    {
      q: 'How does the mandatory 8-point emergency safety triage work?',
      a: 'Before entering the lobby or paying for a slot, every patient completes a 60-second clinical screen covering 8 red-flag symptoms (such as chest pain, respiratory distress, stroke signs, or uncontrolled bleeding). If any flag is detected, online booking halts immediately and displays tap-to-call access for 112 and Lagos 767 ambulance services.',
    },
    {
      q: 'How are prescriptions fulfilled at partner pharmacies and labs?',
      a: 'Every encounter concludes with structured SOAP notes and a digitally signed PDF E-Prescription bearing your physician’s MDCN folio number. Simply present your Patient ID (PAT-XXXX) at any verified partner pharmacy or diagnostic lab to authorize secure order lookup—logged automatically to your NDPR audit trail.',
    },
    {
      q: 'How do you verify doctors and protect my health records under NDPR?',
      a: 'Every clinician is verified against Medical and Dental Council of Nigeria (MDCN) practicing registers before going live or receiving a Locum ID (LOC-XXXX). All intake history, clinical photos, and notes are encrypted at rest and in transit under the Nigeria Data Protection Act (NDPA/NDPR).',
    },
  ];

  const patientAuthHref = getPortalUrl('patient', '/auth');
  const patientTriageHref = getPortalUrl('patient', '/triage');
  const patientBookHref = getPortalUrl('patient', '/book');
  const doctorAuthHref = getPortalUrl('doctor', '/auth');
  const partnerAuthHref = getPortalUrl('partner', '/auth');
  const adminHref = getPortalUrl('admin', '/auth');

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f3eb] text-[#222326] selection:bg-[#b1dbb8] selection:text-[#0a3922] pb-20">
      {/* Top Persistent Emergency Disclaimer */}
      <div className="bg-[#0a3922] text-[#fffefc] px-4 py-2 text-center text-xs tracking-wide font-medium flex items-center justify-center gap-2 border-b border-[#ff643b]/20">
        <span className="inline-block w-2 h-2 rounded-full bg-[#ff643b] animate-pulse" />
        <span>
          <strong>Clinical Emergency Notice:</strong> Manga Healthcare is for non-emergency consultations. In acute emergencies, dial <strong className="text-[#ff643b]">112</strong> or <strong className="text-[#ff643b]">767</strong> immediately.
        </span>
      </div>

      {/* Section 2.1: Floating Capsule Navbar */}
      <header className="sticky top-4 z-40 px-4 md:px-8 py-2">
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-[#efeeeb] rounded-full px-5 py-3 shadow-[0_8px_24px_rgba(75,68,57,0.08)] flex items-center justify-between transition-all">
          {/* Left: Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#0a3922] flex items-center justify-center text-[#e1f4df] font-serif text-xl shadow-xs group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl tracking-tight text-[#080331] leading-none block">
                MANGA HEALTHCARE
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#0f3e17] font-semibold block mt-0.5">
                Clinical Telemedicine
              </span>
            </div>
          </Link>

          {/* Center: Section Anchor Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#747679]">
            <a href="#how-it-works" className="hover:text-[#0a3922] transition-colors py-1">
              How It Works
            </a>
            <a href="#specialties" className="hover:text-[#0a3922] transition-colors py-1">
              Specialties & Therapy
            </a>
            <a href="#safety" className="hover:text-[#0a3922] transition-colors py-1">
              Safety & Triage
            </a>
            <a href="#faq" className="hover:text-[#0a3922] transition-colors py-1">
              FAQ
            </a>
          </nav>

          {/* Right: Role Gateways & Primary Coral CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={doctorAuthHref}
              className="hidden md:inline-flex text-xs font-semibold uppercase tracking-wider text-[#0f3e17] px-3 py-2 hover:bg-[#e1f4df]/60 rounded-full transition"
            >
              For Doctors
            </Link>
            <Link
              href={patientAuthHref}
              className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-[#080331] border border-[#080331]/20 px-4 py-2 hover:bg-neutral-50 rounded-full transition"
            >
              Sign In
            </Link>
            <Link
              href={patientTriageHref}
              className="bg-[#ff643b] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase hover:brightness-105 transition shadow-[0_8px_20px_rgba(255,100,59,0.3)] flex items-center gap-2 active:scale-95"
            >
              <span>Talk to a Doctor Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Section 2.2.1: Hero Section (Split Two-Column: Keylime Wash #e1f4df & Slate Hush #b6ced5) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 w-full">
        <div className="rounded-[32px] overflow-hidden shadow-[0_16px_36px_rgba(75,68,57,0.1)] border border-[#0f3e17]/15 grid grid-cols-1 lg:grid-cols-12">
          {/* Left Panel: Keylime Wash (#e1f4df) */}
          <div className="lg:col-span-7 bg-[#e1f4df] text-[#080331] p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/80 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17] border border-[#b1dbb8]">
                <span className="w-2 h-2 rounded-full bg-[#31ce01] animate-ping" />
                <span>REMOTE CLINICAL CARE</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[64px] text-[#080331] font-normal leading-[1.05] tracking-[-0.03em]">
                Trusted Nigerian physicians, one safety-screened tap away.
              </h1>

              <p className="text-[#222326]/85 text-base md:text-lg leading-relaxed max-w-xl">
                Connect via HD Video, Audio, or low-bandwidth Chat with MDCN-verified doctors and therapists. Protected by mandatory 8-point emergency triage and NDPR-compliant medical records.
              </p>

              {/* Transparent NGN Consultation Pricing Callout */}
              <div className="bg-white/85 rounded-2xl p-4 border border-[#b1dbb8] shadow-xs space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-[#0f3e17] font-semibold flex items-center justify-between">
                  <span>Transparent NGN Consultation Pricing</span>
                  <span className="text-[#747679]">Paystack • Transfer • USSD</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-[#f8f3eb] rounded-xl p-2.5 border border-[#efeeeb]">
                    <div className="text-lg md:text-xl font-serif text-[#080331]">₦10,000</div>
                    <div className="text-[10px] text-[#0f3e17] uppercase font-semibold">General GP</div>
                  </div>
                  <div className="bg-[#0a3922] rounded-xl p-2.5 text-white">
                    <div className="text-lg md:text-xl font-serif text-[#31ce01]">₦5,000</div>
                    <div className="text-[10px] text-[#d2f2e3] uppercase font-semibold">14-Day Follow-Up</div>
                  </div>
                  <div className="bg-[#f8f3eb] rounded-xl p-2.5 border border-[#efeeeb]">
                    <div className="text-lg md:text-xl font-serif text-[#080331]">₦15,000</div>
                    <div className="text-[10px] text-[#4865ff] uppercase font-semibold">Therapy Slot</div>
                  </div>
                </div>
              </div>

              {/* Hero CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={patientTriageHref}
                  className="bg-[#ff643b] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase hover:brightness-110 transition shadow-[0_8px_24px_rgba(255,100,59,0.35)] flex items-center gap-2 active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Talk to a Doctor Now</span>
                </Link>
                <Link
                  href={patientBookHref}
                  className="bg-transparent text-[#080331] hover:bg-white/60 border border-[#080331]/30 px-6 py-4 rounded-full text-sm font-medium transition flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#0f3e17]" />
                  <span>Book a Scheduled Visit</span>
                </Link>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-8 border-t border-[#0f3e17]/15 grid grid-cols-3 gap-4 text-xs">
              <div>
                <strong className="block text-base font-serif font-normal text-[#080331]">8-Symptom</strong>
                <span className="text-[#0f3e17]">Mandatory Safety Gate</span>
              </div>
              <div>
                <strong className="block text-base font-serif font-normal text-[#080331]">100% MDCN</strong>
                <span className="text-[#0f3e17]">Verified Clinicians</span>
              </div>
              <div>
                <strong className="block text-base font-serif font-normal text-[#080331]">NDPR Compliant</strong>
                <span className="text-[#0f3e17]">Encrypted Audit Trail</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Slate Hush (#b6ced5) with Floating Paper White Clinical Previews */}
          <div className="lg:col-span-5 bg-[#b6ced5] p-8 md:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#080331]/10 space-y-6">
            {/* Warm Circular Clinician Portraits Strip */}
            <div className="flex items-center justify-between bg-white/75 backdrop-blur-xs rounded-2xl p-4 border border-white">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full bg-[#0a3922] text-white border-2 border-white flex items-center justify-center font-serif text-sm shadow-xs">
                  👩🏾‍⚕️
                </div>
                <div className="w-11 h-11 rounded-full bg-[#4865ff] text-white border-2 border-white flex items-center justify-center font-serif text-sm shadow-xs">
                  👨🏾‍⚕️
                </div>
                <div className="w-11 h-11 rounded-full bg-[#0f3e17] text-white border-2 border-white flex items-center justify-center font-serif text-sm shadow-xs">
                  👩🏾‍🔬
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#080331] block">7 Physicians On-Duty</span>
                <span className="text-[11px] text-[#0f3e17] font-medium">Avg. Lobby Wait: &lt; 5 mins</span>
              </div>
            </div>

            {/* Floating Preview Card 1: Live Consultation Room */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_12px_28px_rgba(75,68,57,0.1)] border border-[#efeeeb] space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#0f3e17] bg-[#e1f4df] px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#31ce01]" />
                  Live Consultation Preview
                </span>
                <span className="font-mono text-[10px] text-[#747679]">HD Video • Audio • Chat</span>
              </div>

              <div className="bg-[#0a3922] rounded-xl p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e1f4df] text-[#0a3922] flex items-center justify-center text-lg">
                    👨🏾‍⚕️
                  </div>
                  <div>
                    <div className="font-serif text-sm">Dr. Chidi Okafor, MBBS</div>
                    <div className="text-[10px] text-[#d2f2e3] font-mono">MDCN-78320 • LOC-9941</div>
                  </div>
                </div>
                <Video className="w-5 h-5 text-[#31ce01]" />
              </div>

              <div className="text-xs text-[#747679] flex items-center justify-between pt-1">
                <span>Allergy Alert: Penicillin flagged</span>
                <span className="text-[#4865ff] font-semibold">SOAP Auto-Saved</span>
              </div>
            </div>

            {/* Floating Preview Card 2: Downloadable PDF E-Prescription */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_12px_28px_rgba(75,68,57,0.1)] border border-[#efeeeb] space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#4865ff]" />
                  <span className="text-xs font-semibold text-[#080331]">Signed E-Prescription PDF</span>
                </div>
                <span className="font-mono text-[10px] bg-[#ebf0f8] text-[#4865ff] px-2 py-0.5 rounded font-bold">
                  RX-99120
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-[#080331]">Paracetamol 1000mg</span>
                  <span className="text-[#747679]">TDS • 5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#080331]">Cetirizine 10mg</span>
                  <span className="text-[#747679]">OD Nocte • 7 days</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <span className="text-[#0f3e17] font-medium">Valid at Partner Pharmacies</span>
                <span className="inline-flex items-center gap-1 text-[#080331] font-semibold bg-[#f8f3eb] px-2.5 py-1 rounded-full">
                  <Download className="w-3 h-3" /> PDF Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2.2.2: How It Works (4-Step Clinical Journey) */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 md:px-6 py-12 w-full space-y-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            4-Step Clinical Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal">
            From safety screening to verifiable care in minutes.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#0a3922] text-white flex items-center justify-center font-serif text-lg">
              1
            </div>
            <h3 className="font-serif text-xl text-[#080331] font-normal">
              Quick Intake & NDPR Consent
            </h3>
            <p className="text-xs text-[#747679] leading-relaxed">
              Sign in via Phone, Email, or Patient ID + OTP. Accept Telemedicine & NDPR consents and log allergies & medications once.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#ff643b]/30 shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#ff643b] text-white flex items-center justify-center font-serif text-lg">
              2
            </div>
            <h3 className="font-serif text-xl text-[#080331] font-normal">
              Mandatory 8-Point Emergency Screen
            </h3>
            <p className="text-xs text-[#747679] leading-relaxed">
              Every patient completes our 8 red-flag clinical safety checklist. Acute cases are immediately routed to 112 / 767 ambulance care.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#4865ff] text-white flex items-center justify-center font-serif text-lg">
              3
            </div>
            <h3 className="font-serif text-xl text-[#080331] font-normal">
              Lobby Queue or Slot + Paystack Checkout
            </h3>
            <p className="text-xs text-[#747679] leading-relaxed">
              Enter the live &ldquo;Talk to Doctor Now&rdquo; queue or book a scheduled slot (mandatory for therapy) via Card, Bank Transfer, or USSD.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#0f3e17] text-white flex items-center justify-center font-serif text-lg">
              4
            </div>
            <h3 className="font-serif text-xl text-[#080331] font-normal">
              Consultation & PDF E-Prescription
            </h3>
            <p className="text-xs text-[#747679] leading-relaxed">
              Consult over Video, Audio, or Chat with rash photo uploads, then download your SOAP summary and verifiable PDF prescription.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2.2.3: Consultation Modes & Specialties Grid (Sage Mist #b1dbb8 & Cloud Card #ebf0f8) */}
      <section id="specialties" className="max-w-6xl mx-auto px-4 md:px-6 py-12 w-full space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
              Consultation Modes & Specialties
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
              Care pathways tailored to urgency and bandwidth.
            </h2>
          </div>
          <Link
            href={patientTriageHref}
            className="text-xs font-semibold uppercase tracking-wider text-[#0a3922] hover:underline inline-flex items-center gap-1"
          >
            <span>Start Pre-Consult Screening</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Instant General Care (Sage Mist) */}
          <div className="bg-[#b1dbb8] rounded-[28px] p-8 border border-[#0f3e17]/15 shadow-[0_12px_28px_rgba(75,68,57,0.08)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-full bg-[#0a3922] text-white flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-[#31ce01]" />
              </div>
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-white/80 text-[#0a3922] px-2.5 py-1 rounded-full">
                Instant Care • ₦10,000
              </span>
              <h3 className="font-serif text-2xl text-[#080331] font-normal">
                Instant General Care
              </h3>
              <p className="text-xs sm:text-sm text-[#0f3e17] leading-relaxed">
                &ldquo;Talk to Doctor Now&rdquo; live lobby queue for acute, non-emergency illnesses including fever, malaria symptoms, UTIs, skin rashes, and medication refills.
              </p>
            </div>
            <Link
              href={patientTriageHref}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0a3922] hover:underline"
            >
              <span>Join Instant Lobby</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Scheduled Specialist & Therapy (Cloud Card) */}
          <div className="bg-[#ebf0f8] rounded-[28px] p-8 border border-[#4865ff]/20 shadow-[0_12px_28px_rgba(75,68,57,0.08)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-full bg-[#4865ff] text-white flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-white text-[#4865ff] px-2.5 py-1 rounded-full">
                Mandatory Calendar Slot • ₦15,000
              </span>
              <h3 className="font-serif text-2xl text-[#080331] font-normal">
                Scheduled Specialist & Therapy
              </h3>
              <p className="text-xs sm:text-sm text-[#222326]/80 leading-relaxed">
                Dedicated 45-minute protected calendar appointments with licensed clinical psychologists, therapists, and specialists. Therapy strictly requires pre-booked slots.
              </p>
            </div>
            <Link
              href={patientBookHref}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4865ff] hover:underline"
            >
              <span>Browse Doctor Calendars</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Low-Bandwidth Flexibility (Paper White) */}
          <div className="bg-white rounded-[28px] p-8 border border-[#efeeeb] shadow-[0_12px_28px_rgba(75,68,57,0.08)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-full bg-[#f8f3eb] text-[#080331] border border-neutral-200 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-[#ff643b]" />
              </div>
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[#ffede8] text-[#ff643b] px-2.5 py-1 rounded-full">
                Low-Data Resilient
              </span>
              <h3 className="font-serif text-2xl text-[#080331] font-normal">
                Video, Audio & Chat Flexibility
              </h3>
              <p className="text-xs sm:text-sm text-[#747679] leading-relaxed">
                Switch seamlessly between HD Video, voice-only Audio, and low-bandwidth Text Chat inside the same room—with encrypted clinical photo uploads for rashes or lab results.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-[#080331]">
              <span className="inline-flex items-center gap-1 bg-[#f8f3eb] px-2.5 py-1 rounded-full">
                <Video className="w-3 h-3 text-[#0f3e17]" /> Video
              </span>
              <span className="inline-flex items-center gap-1 bg-[#f8f3eb] px-2.5 py-1 rounded-full">
                <PhoneCall className="w-3 h-3 text-[#0f3e17]" /> Audio
              </span>
              <span className="inline-flex items-center gap-1 bg-[#f8f3eb] px-2.5 py-1 rounded-full">
                <MessageSquare className="w-3 h-3 text-[#0f3e17]" /> Chat
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2.2.4: Clinical Safety, MDCN & NDPR Trust Band */}
      <section id="safety" className="max-w-6xl mx-auto px-4 md:px-6 py-12 w-full scroll-mt-24">
        <div className="bg-[#0a3922] rounded-[32px] p-8 md:p-14 text-white space-y-10 shadow-[0_16px_36px_rgba(75,68,57,0.12)]">
          <div className="max-w-2xl">
            <span className="eyebrow-label text-[#d2f2e3] bg-white/10 px-3.5 py-1 rounded-full">
              Clinical Governance & Regulatory Trust
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal mt-3">
              Telemedicine anchored by MDCN vetting, ER safety halts, and NDPR privacy.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#0a3922] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#31ce01]" />
              </div>
              <h3 className="font-serif text-xl text-white font-normal">MDCN License Verification</h3>
              <p className="text-xs text-[#cfe7d3] leading-relaxed">
                Doctors cannot go live until internal Clinical Ops verifies their Medical and Dental Council of Nigeria folio number and degree certificates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#ff643b] text-white flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-white font-normal">Zero-Delay Emergency Redirect</h3>
              <p className="text-xs text-[#cfe7d3] leading-relaxed">
                Any selected red flag blocks telehealth booking immediately, logs to <code className="font-mono text-white">emergency_redirect_log</code>, and provides one-tap 112/767 emergency calling.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#4865ff] text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-white font-normal">NDPR Encrypted Audit Trail</h3>
              <p className="text-xs text-[#cfe7d3] leading-relaxed">
                Every clinician and partner pharmacy read/write access to patient records writes an immutable audit trail entry under Nigerian Data Protection guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2.2.5: Editorial FAQ Section (Ease Health Two-Column Layout) */}
      <section id="faq" className="max-w-6xl mx-auto px-4 md:px-6 py-16 w-full scroll-mt-24">
        <div className="bg-white rounded-[32px] p-8 md:p-14 border border-[#efeeeb] shadow-[0_12px_28px_rgba(75,68,57,0.06)]">
          <div className="mb-10 pb-6 border-b border-[#efeeeb]">
            <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full">
              Editorial FAQ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-3">
              Clarity on clinical safety, fees, and prescriptions.
            </h2>
          </div>

          <div className="divide-y divide-[#efeeeb]">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="py-8 first:pt-2 last:pb-2 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start"
              >
                {/* Left Column: Editorial Serif Question */}
                <div className="lg:col-span-5">
                  <h3 className="font-serif text-2xl sm:text-[32px] lg:text-[36px] leading-[1.15] font-normal text-[#0f3e17]">
                    {item.q}
                  </h3>
                </div>

                {/* Right Column: DM Sans 16px Body Answer */}
                <div className="lg:col-span-7">
                  <p className="text-[16px] text-[#222326] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2.2.6: Role-Based Gateways & Legal Footer */}
      <footer className="border-t border-[#0f3e17]/10 bg-white/85 py-14 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 text-xs text-[#747679]">
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0a3922] flex items-center justify-center text-white font-serif text-lg">
                M
              </div>
              <div>
                <span className="font-serif text-xl text-[#080331] block">MANGA HEALTHCARE</span>
                <span className="text-[11px] text-[#0f3e17]">Clinical Telemedicine & Triage (Beta)</span>
              </div>
            </div>
            <p className="leading-relaxed">
              Remote consultations and digital prescriptions for Nigeria. Not a substitute for emergency ambulance or acute trauma resuscitation—call 112 or 767 for emergencies.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <strong className="text-[#080331] uppercase tracking-wider text-[11px] block">
              Role-Based Portal Gateways
            </strong>
            <div className="flex flex-col space-y-2 font-medium">
              <Link href={patientAuthHref} className="hover:text-[#0a3922] transition">
                Patient Login (app.mangahealthcare.com)
              </Link>
              <Link href={doctorAuthHref} className="hover:text-[#0a3922] transition">
                Doctor / Locum Portal (doctor.mangahealthcare.com)
              </Link>
              <Link href={partnerAuthHref} className="hover:text-[#0a3922] transition">
                Pharmacy & Lab Partner Login (partner.mangahealthcare.com)
              </Link>
              <Link href={adminHref} className="hover:text-[#0a3922] transition">
                Admin / Ops Command Center (admin.mangahealthcare.com)
              </Link>
            </div>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <strong className="text-[#080331] uppercase tracking-wider text-[11px] block">
              Compliance & Legal Notices
            </strong>
            <div className="flex flex-col space-y-2 font-medium">
              <button
                type="button"
                onClick={() => setActiveLegalModal('TOS')}
                className="text-left hover:text-[#0a3922] transition cursor-pointer"
              >
                Terms of Service & Emergency Disclaimer
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalModal('NDPR')}
                className="text-left hover:text-[#0a3922] transition cursor-pointer"
              >
                NDPR Privacy & Audit Log Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalModal('TELEMED')}
                className="text-left hover:text-[#0a3922] transition cursor-pointer"
              >
                MDCN Telemedicine Consent Notice
              </button>
              <Link href="/design-system" className="hover:text-[#0a3922] transition">
                Clinical Design System Tokens
              </Link>
            </div>
            <p className="pt-2 text-[11px]">© 2026 Manga Healthcare Ltd. Lagos, Nigeria.</p>
          </div>
        </div>
      </footer>

      {/* Legal Notice Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full">
                Regulatory Compliance Notice
              </span>
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="text-xs font-semibold text-[#747679] hover:text-[#080331]"
              >
                Close
              </button>
            </div>
            <h3 className="font-serif text-2xl text-[#080331] font-normal">
              {activeLegalModal === 'TOS'
                ? 'Terms of Service & Emergency Disclaimer'
                : activeLegalModal === 'NDPR'
                ? 'NDPR Data Privacy & Immutable Audit Policy'
                : 'MDCN Telemedicine Consultation Consent'}
            </h3>
            <p className="text-xs sm:text-sm text-[#747679] leading-relaxed">
              {activeLegalModal === 'TOS'
                ? 'Manga Healthcare provides remote clinical consultations exclusively for non-emergency medical complaints. Any emergency red-flag symptom requires immediate in-person hospital care via 112 or 767.'
                : activeLegalModal === 'NDPR'
                ? 'All patient intake records, consultation notes, clinical images, and prescriptions are encrypted at rest and in transit under the Nigeria Data Protection Act. Every access by clinicians or partners writes an entry to audit_log.'
                : 'Licensed physicians and therapists vetted by the Medical and Dental Council of Nigeria (MDCN) deliver care remotely. Therapy sessions are restricted to scheduled calendar appointments.'}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="bg-[#0a3922] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Emergency Bar */}
      <PersistentEmergencyBar
        position="bottom"
        message="Manga Telehealth is for non-emergencies. In crisis, trauma, or acute chest pain, tap to call emergency ambulance:"
        ambulanceNumber="112"
        lagosEmergencyNumber="767"
      />
    </div>
  );
}
