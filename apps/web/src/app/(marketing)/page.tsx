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
  CreditCard,
  CheckCircle2,
  PhoneCall,
  Activity,
  HeartHandshake,
  Lock,
  ArrowRight,
  Users,
  Plus,
  Minus,
} from 'lucide-react';
import { PersistentEmergencyBar } from '@manga/design-system';

export default function MarketingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does Manga Healthcare verify participating doctors?',
      a: 'Every physician and therapist on Manga Healthcare must hold a valid, active license with the Medical and Dental Council of Nigeria (MDCN). Our clinical operations team verifies licenses directly against official MDCN registry records and conducts credential checks before issuing Doctor or Locum IDs (e.g. LOC-XXXX).',
    },
    {
      q: 'What happens if my symptoms trigger the Emergency Triage gate?',
      a: 'Under PRD Section 6.0 safety rules, if you report any of the 8 red-flag emergency symptoms (such as acute chest pressure, respiratory distress, or severe bleeding), the system immediately halts telehealth booking and displays our calm Ambulance Redirect screen with direct tap-to-call for 112 (National Emergency) and 767 (Lagos Emergency). Telemedicine cannot replace emergency stabilization.',
    },
    {
      q: 'How are clinical notes and E-Prescriptions issued?',
      a: 'During every encounter, doctors document structured notes adhering to the SOAP format (Chief Complaint, History of Present Illness, Assessment, Plan). When medications are clinically indicated, doctors generate a digitally signed E-Prescription PDF complete with MDCN license registration and verifiable QR code that can be dispensed at verified partner pharmacies.',
    },
    {
      q: 'Is my health data protected under Nigerian Data Protection Regulation (NDPR)?',
      a: 'Yes. Manga Healthcare complies strictly with NDPR standards. All patient intake data, encounter records, and uploaded clinical photos are encrypted at rest. Furthermore, every access to patient data by doctors, admin, or external partner pharmacies generates an auditable, immutable entry in our NDPR audit_log.',
    },
    {
      q: 'What are the consultation fees and payment options?',
      a: 'Transparent pricing with zero hidden surcharges: General Physician consultations are ₦10,000, specialized Mental Health Therapy sessions are ₦15,000, and follow-up consultations within 7 days are discounted to ₦5,000. We accept Paystack, Flutterwave, Debit/Credit Cards, Direct Bank Transfer, and USSD (*737#, *919#, etc.).',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f3eb] text-[#222326] selection:bg-[#b1dbb8] selection:text-[#0a3922] pb-16">
      {/* Top Persistent Emergency Disclaimer */}
      <div className="bg-[#0a3922] text-[#fffefc] px-4 py-2 text-center text-xs tracking-wide font-medium flex items-center justify-center gap-2 border-b border-[#ff643b]/20">
        <span className="inline-block w-2 h-2 rounded-full bg-[#ff643b] animate-pulse" />
        <span>
          <strong>Clinical Emergency Notice:</strong> Telemedicine is exclusively for non-emergency conditions. In life-threatening emergencies, call <strong className="text-[#ff643b]">112</strong> or <strong className="text-[#ff643b]">767</strong> immediately.
        </span>
      </div>

      {/* Floating Capsule Nav on Warm Cream */}
      <header className="sticky top-4 z-40 px-4 md:px-8 py-2">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-[#efeeeb] rounded-full px-5 py-3 shadow-[0_8px_24px_rgba(75,68,57,0.08)] flex items-center justify-between transition-all">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#0a3922] flex items-center justify-center text-[#e1f4df] font-serif text-xl shadow-xs group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <span className="font-serif text-2xl tracking-tight text-[#080331] leading-none block">
                MANGA
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#0f3e17] font-semibold block mt-0.5">
                Healthcare
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#747679]">
            <Link
              href="/patient"
              className="hover:text-[#0a3922] transition-colors py-1 hover:border-b-2 hover:border-[#0a3922]"
            >
              Patient Portal
            </Link>
            <Link
              href="/doctor"
              className="hover:text-[#0a3922] transition-colors py-1 hover:border-b-2 hover:border-[#0a3922]"
            >
              Doctor Workspace
            </Link>
            <Link
              href="/partner"
              className="hover:text-[#0a3922] transition-colors py-1 hover:border-b-2 hover:border-[#0a3922]"
            >
              Partner Lookup
            </Link>
            <Link
              href="/admin"
              className="hover:text-[#0a3922] transition-colors py-1 hover:border-b-2 hover:border-[#0a3922]"
            >
              Admin Command
            </Link>
            <Link
              href="/design-system"
              className="hover:text-[#0a3922] transition-colors py-1 hover:border-b-2 hover:border-[#0a3922]"
            >
              Tokens & System
            </Link>
          </nav>

          {/* Quick CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/patient/onboarding"
              className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-[#0a3922] px-4 py-2 hover:bg-[#e1f4df]/50 rounded-full transition"
            >
              Sign In / Register
            </Link>
            <Link
              href="/patient/book"
              className="bg-[#ff643b] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase hover:brightness-105 transition shadow-[0_8px_20px_rgba(255,100,59,0.3)] flex items-center gap-2 active:scale-95"
            >
              <span>Talk to Doctor Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Canopy Green (#0a3922) & Keylime Wash (#e1f4df) Split Layout */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 w-full">
        <div className="rounded-[32px] overflow-hidden shadow-[0_16px_36px_rgba(75,68,57,0.1)] border border-[#0f3e17]/15 grid grid-cols-1 lg:grid-cols-12">
          {/* Left Canopy Green Panel (#0a3922) */}
          <div className="lg:col-span-7 bg-[#0a3922] text-[#fffefc] p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
            {/* Background Ambient Radial Gradient */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none opacity-20 bg-[radial-gradient(circle,#31ce01_0%,transparent_70%)]" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#d2f2e3] border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#31ce01] animate-ping" />
                <span>MDCN Verified Doctors Online • Lagos, Abuja & Nationwide</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#fffefc] font-normal leading-[1.08] tracking-[-0.03em]">
                Remote clinical care, anchored by uncompromising safety.
              </h1>

              <p className="text-[#cfe7d3] text-base md:text-lg leading-relaxed max-w-xl">
                Immediate video, audio, and chat consultations with licensed Nigerian physicians. Every encounter starts with mandatory 8-symptom red-flag triage, followed by structured SOAP documentation and verifiable PDF e-prescriptions.
              </p>

              {/* Transparent NGN Pricing Pill Banner */}
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-[#d2f2e3] font-semibold flex items-center justify-between">
                  <span>Transparent NGN Consultation Fees</span>
                  <span className="text-white/80">No Surprise Subscriptions</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-white/10 rounded-xl p-2.5">
                    <div className="text-lg md:text-xl font-serif text-[#ffffff]">₦10,000</div>
                    <div className="text-[10px] text-[#cfe7d3] uppercase font-medium">General GP</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 border border-[#31ce01]/30">
                    <div className="text-lg md:text-xl font-serif text-[#31ce01]">₦5,000</div>
                    <div className="text-[10px] text-[#cfe7d3] uppercase font-medium">Follow-Up (7d)</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5">
                    <div className="text-lg md:text-xl font-serif text-[#ffffff]">₦15,000</div>
                    <div className="text-[10px] text-[#cfe7d3] uppercase font-medium">Therapy Slot</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/patient/book"
                  className="bg-[#ff643b] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase hover:brightness-110 transition shadow-[0_8px_24px_rgba(255,100,59,0.35)] flex items-center gap-2 active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Talk to a Doctor Now</span>
                </Link>
                <Link
                  href="/patient/onboarding"
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-4 rounded-full text-sm font-medium transition flex items-center gap-2"
                >
                  <span>Patient Intake Portal</span>
                  <ChevronRight className="w-4 h-4 text-[#cfe7d3]" />
                </Link>
              </div>
            </div>

            {/* Bottom trust indicators */}
            <div className="relative z-10 pt-10 mt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-xs">
              <div>
                <strong className="block text-base font-serif text-white">8-Symptom</strong>
                <span className="text-[#cfe7d3]">Emergency Gate</span>
              </div>
              <div>
                <strong className="block text-base font-serif text-white">100% MDCN</strong>
                <span className="text-[#cfe7d3]">Credential Vetted</span>
              </div>
              <div>
                <strong className="block text-base font-serif text-white">NDPR Tier 1</strong>
                <span className="text-[#cfe7d3]">Audit Trail Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Keylime Wash Panel (#e1f4df) */}
          <div className="lg:col-span-5 bg-[#e1f4df] p-8 md:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#b1dbb8]">
            <div>
              <div className="inline-block uppercase text-[11px] font-semibold tracking-[0.08em] text-[#0f3e17] bg-[#b1dbb8]/60 px-3 py-1 rounded-full mb-6">
                Clinical Workflow Preview
              </div>

              <h2 className="font-serif text-2xl md:text-3xl text-[#080331] font-normal leading-snug mb-4">
                Structured clinical encounters in four guarded steps.
              </h2>
              <p className="text-sm text-[#222326] leading-relaxed mb-6">
                Designed for clinical safety first. Patients cannot join a consultation lobby without clearing safety triage.
              </p>

              {/* Flow Steps Mini Bento */}
              <div className="space-y-3">
                <div className="bg-white/90 p-4 rounded-2xl border border-[#b1dbb8] shadow-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0a3922] text-[#fffefc] flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#080331]">Patient Intake & NDPR Consent</h3>
                    <p className="text-xs text-[#747679] mt-0.5">
                      Phone/Email OTP, language preference, chronic conditions, and allergy logging.
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 p-4 rounded-2xl border border-[#ff643b]/40 shadow-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ff643b] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#080331]">Red-Flag Safety Triage</h3>
                      <span className="text-[10px] bg-[#ffede8] text-[#ff643b] font-semibold px-2 py-0.5 rounded-full">
                        Mandatory
                      </span>
                    </div>
                    <p className="text-xs text-[#747679] mt-0.5">
                      8 emergency red-flags evaluated instantly. Flagged patients are calmly redirected to 112.
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 p-4 rounded-2xl border border-[#b1dbb8] shadow-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4865ff] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#080331]">Instant Paystack Checkout</h3>
                    <p className="text-xs text-[#747679] mt-0.5">
                      Fixed ₦10,000 standard or ₦5,000 follow-up. Card, Bank Transfer, or USSD.
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 p-4 rounded-2xl border border-[#b1dbb8] shadow-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0f3e17] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#080331]">Encounter & E-Prescription PDF</h3>
                    <p className="text-xs text-[#747679] mt-0.5">
                      Video/Audio/Chat + rash photos, SOAP clinical notes, and downloadable PDF prescription.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#b1dbb8]">
              <Link
                href="/doctor"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#080331] border border-[#080331]/20 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#fffefc] transition shadow-xs"
              >
                <span>Physicians & Locums: Open Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Safety First Section: Sage Mist (#b1dbb8) & Slate Hush (#b6ced5) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            Clinical Safety Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal">
            Telemedicine built with an ER safety gate.
          </h2>
          <p className="text-sm md:text-base text-[#747679] leading-relaxed">
            Most digital health apps treat emergencies as an afterthought. Manga Healthcare embeds strict red-flag screening at every clinical entry point.
          </p>
        </div>

        {/* Dual Panels: Sage Mist (#b1dbb8) & Slate Hush (#b6ced5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sage Mist Panel */}
          <div className="bg-[#b1dbb8] p-8 md:p-10 rounded-[28px] border border-[#0f3e17]/15 shadow-[0_12px_28px_rgba(75,68,57,0.08)] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-[#0a3922] bg-white/70 px-3 py-1 rounded-full">
                  Section 6.0 Rules-Based Gate
                </span>
                <AlertTriangle className="w-6 h-6 text-[#ff643b]" />
              </div>

              <h3 className="font-serif text-2xl md:text-3xl text-[#080331] font-normal">
                The 8-Symptom Emergency Filter
              </h3>

              <p className="text-sm text-[#0f3e17] leading-relaxed">
                Before any payment or queue entry, patients check against 8 acute red flags. If chest pain, gasping for breath, stroke symptoms, or severe hemorrhage are selected:
              </p>

              <ul className="space-y-2.5 pt-2 text-xs md:text-sm text-[#080331]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0a3922] shrink-0 mt-0.5" />
                  <span><strong>Instant Booking Halt:</strong> Consultation queue is locked to prevent dangerous delays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0a3922] shrink-0 mt-0.5" />
                  <span><strong>Ambulance Redirect:</strong> Direct one-tap dialers for 112 and 767 emergency services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0a3922] shrink-0 mt-0.5" />
                  <span><strong>Auditable Compliance Log:</strong> Flagged events log immediately into <code className="text-[11px] font-mono bg-white/80 px-1 py-0.5 rounded">emergency_redirect_log</code> for admin oversight.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#0f3e17]/15">
              <Link
                href="/patient/book"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0a3922] hover:underline"
              >
                <span>Experience the triage checklist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Slate Hush Panel */}
          <div className="bg-[#b6ced5] p-8 md:p-10 rounded-[28px] border border-[#080331]/15 shadow-[0_12px_28px_rgba(75,68,57,0.08)] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-[#080331] bg-white/70 px-3 py-1 rounded-full">
                  Clinical Workspace Standards
                </span>
                <FileText className="w-6 h-6 text-[#080331]" />
              </div>

              <h3 className="font-serif text-2xl md:text-3xl text-[#080331] font-normal">
                Structured SOAP Notes & E-Prescriptions
              </h3>

              <p className="text-sm text-[#080331] leading-relaxed">
                Manga Healthcare eliminates unstructured doctor scribble. Every encounter outputs rigorous clinical artifacts:
              </p>

              <ul className="space-y-2.5 pt-2 text-xs md:text-sm text-[#080331]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#080331] shrink-0 mt-0.5" />
                  <span><strong>SOAP Standardization:</strong> Chief Complaint, History of Present Illness, Clinical Assessment, and Action Plan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#080331] shrink-0 mt-0.5" />
                  <span><strong>Multi-Drug E-Prescription:</strong> Dosage, frequency, duration, precautions, and auto-generated PDF download.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#080331] shrink-0 mt-0.5" />
                  <span><strong>Partner Verification:</strong> Pharmacies & diagnostic labs verify prescription validity via Patient ID counter lookup.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#080331]/15">
              <Link
                href="/partner"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#080331] hover:underline"
              >
                <span>View Partner Lookup Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Regulatory Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 w-full">
        <div className="bg-white rounded-[32px] p-8 md:p-14 border border-[#efeeeb] shadow-[0_16px_32px_rgba(75,68,57,0.06)] space-y-10">
          <div className="max-w-2xl">
            <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3.5 py-1 rounded-full">
              Trust & Compliance
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-3">
              Licensed in Nigeria, compliant with global digital health benchmarks.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#f8f3eb] border border-[#0f3e17]/10 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#0a3922] text-[#fffefc] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#31ce01]" />
              </div>
              <h3 className="font-serif text-xl text-[#080331]">MDCN License Validation</h3>
              <p className="text-xs text-[#747679] leading-relaxed">
                Only physicians with verified Medical and Dental Council of Nigeria practicing licenses are permitted to take appointments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f8f3eb] border border-[#0f3e17]/10 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#4865ff] text-[#fffefc] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#080331]">NDPR Patient Privacy</h3>
              <p className="text-xs text-[#747679] leading-relaxed">
                Explicit patient consent gates, zero third-party telemetry, and tamper-evident audit logging for all consultations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f8f3eb] border border-[#0f3e17]/10 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#ff643b] text-[#fffefc] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#080331]">On-Demand Locum Network</h3>
              <p className="text-xs text-[#747679] leading-relaxed">
                When instant patient queue times exceed 7 minutes, admin triggers urgent locum dispatch to keep wait times under control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full">
            Clinical Telemedicine FAQ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal">
            Everything you need to know before consultation.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#efeeeb] shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-medium text-sm md:text-base text-[#080331]">
                    {faq.q}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-[#f8f3eb] flex items-center justify-center text-[#080331] shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 md:px-6 pt-1 text-xs md:text-sm text-[#747679] leading-relaxed border-t border-neutral-100 bg-[#f8f3eb]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 w-full">
        <div className="bg-[#0a3922] rounded-[32px] p-8 md:p-14 text-center text-[#fffefc] space-y-6 relative overflow-hidden shadow-[0_16px_36px_rgba(75,68,57,0.15)]">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="eyebrow-label text-[#d2f2e3] bg-white/10 px-3.5 py-1.5 rounded-full inline-block">
              Available 24/7 Across Nigeria
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white">
              Ready to speak with an MDCN verified doctor?
            </h2>
            <p className="text-sm md:text-base text-[#cfe7d3] leading-relaxed">
              Complete your 60-second safety triage, enter the instant lobby queue, and connect with a compassionate physician.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/patient/book"
              className="bg-[#ff643b] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase hover:brightness-110 transition shadow-[0_8px_24px_rgba(255,100,59,0.4)] flex items-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Enter Instant Lobby</span>
            </Link>
            <Link
              href="/doctor"
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-4 rounded-full text-sm font-medium transition"
            >
              Are you a doctor? Join as Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0f3e17]/10 bg-white/70 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#747679]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0a3922] flex items-center justify-center text-white font-serif">
              M
            </div>
            <div>
              <span className="font-serif text-lg text-[#080331]">MANGA Healthcare</span>
              <p className="text-[11px] text-[#747679]">Clinical Telemedicine & Emergency Safety System (Beta)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <Link href="/patient" className="hover:text-[#0a3922]">Patient Portal</Link>
            <Link href="/doctor" className="hover:text-[#0a3922]">Doctor Workspace</Link>
            <Link href="/partner" className="hover:text-[#0a3922]">Partner Pharmacy/Lab</Link>
            <Link href="/admin" className="hover:text-[#0a3922]">Admin & Ops</Link>
            <Link href="/design-system" className="hover:text-[#0a3922]">Design System</Link>
          </div>

          <div className="text-center md:text-right">
            <p>© 2026 Manga Healthcare Ltd. Lagos, Nigeria.</p>
            <p className="text-[10px] text-[#747679] mt-0.5">Compliant with NDPR & MDCN Telemedicine Directives</p>
          </div>
        </div>
      </footer>

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
