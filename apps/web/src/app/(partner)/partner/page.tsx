import React from 'react';
import Link from 'next/link';
import { Pill, FileText, Building2, Search, ShieldCheck } from 'lucide-react';
import { getPortalUrl } from '../../../lib/domains';

export default function PartnerHomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 space-y-14">
      {/* Split Hero: Keylime Wash #e1f4df & Slate Hush #b6ced5 */}
      <section className="rounded-[28px] overflow-hidden shadow-[0_16px_36px_rgba(75,68,57,0.1)] border border-[#0f3e17]/15 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 bg-[#e1f4df] text-[#0f3e17] p-8 md:p-11 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] bg-white/80 text-[#0f3e17] px-3.5 py-1.5 rounded-full border border-[#b1dbb8]">
              FOR PHARMACIES, DIAGNOSTIC LABS &amp; SPECIALIST CLINICS
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[64px] text-[#0f3e17] font-normal leading-[1.04] tracking-[-0.03em]">
              Verify prescriptions, lab orders, and referrals in seconds.
            </h1>
            <p className="text-[#222326]/90 text-base md:text-lg leading-relaxed max-w-xl">
              Connect your pharmacy or diagnostic centre to MANGA HEALTHCARE. Retrieve tamper-proof e-prescriptions and lab requests using a patient&apos;s unique ID—with zero paper clutter.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href={getPortalUrl('partner', '/auth')}
                className="bg-[#4865ff] text-white px-7 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:brightness-105 transition"
              >
                Partner Portal Login
              </Link>
              <Link
                href={getPortalUrl('partner', '/getting-started')}
                className="border border-[#080331]/30 text-[#080331] px-6 py-4 rounded-full text-xs sm:text-sm font-medium hover:bg-white/60 transition"
              >
                Register Your Facility
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel: Slate Hush #b6ced5 Lookup Bar Preview */}
        <div className="lg:col-span-5 bg-[#b6ced5] p-8 md:p-10 flex flex-col justify-center space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#ebf0f8] text-[#4865ff] px-2.5 py-1 rounded-full">
              Instant Patient ID Lookup
            </span>
            <div className="flex items-center gap-2 border border-neutral-200 rounded-xl px-3.5 py-2.5 bg-[#f8f3eb]/40 font-mono text-xs font-bold text-[#080331]">
              <Search className="w-4 h-4 text-[#747679]" />
              <span>PAT-48291</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#f8f3eb] border border-neutral-200 text-xs space-y-1.5">
              <div className="flex justify-between font-semibold text-[#080331]">
                <span>RX-99120 • Amaka Adeleke</span>
                <span className="text-[#0f3e17]">MDCN-78320</span>
              </div>
              <div className="text-[#747679]">Paracetamol 1000mg TDS • Cetirizine 10mg OD</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Partner Verticals Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-3">
          <Pill className="w-6 h-6 text-[#0a3922]" />
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Pharmacies</h2>
          <p className="text-xs sm:text-sm text-[#747679]">
            Verify structured drug orders (Drug Name, Dosage, Frequency, Duration) and dispense with confidence.
          </p>
        </div>

        <div className="bg-[#ebf0f8] rounded-3xl p-7 border border-[#4865ff]/20 space-y-3">
          <FileText className="w-6 h-6 text-[#4865ff]" />
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Diagnostic Laboratories</h2>
          <p className="text-xs sm:text-sm text-[#222326]">
            Access clear lab test requisitions ordered during remote teleconsultations.
          </p>
        </div>

        <div className="bg-[#b1dbb8] rounded-3xl p-7 border border-[#0f3e17]/20 space-y-3">
          <Building2 className="w-6 h-6 text-[#0a3922]" />
          <h2 className="font-serif text-2xl text-[#080331] font-normal">Referral Clinics &amp; Specialists</h2>
          <p className="text-xs sm:text-sm text-[#0f3e17]">
            Receive structured clinical referral summaries when patients require in-person examination.
          </p>
        </div>
      </section>

      {/* 3-Step Strip */}
      <section className="bg-white rounded-[28px] p-8 border border-[#efeeeb] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="p-4 rounded-2xl bg-[#f8f3eb]">
          <strong className="font-serif text-lg text-[#080331] block">1. Patient Presents PAT-XXXX</strong>
          <span className="text-[#747679]">Patient shares their unique Patient ID at your pharmacy or lab desk.</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#ebf0f8]">
          <strong className="font-serif text-lg text-[#080331] block">2. Partner Queries Portal</strong>
          <span className="text-[#222326]">Staff log into partner.mangahealthcare.com/auth and enter PAT-XXXX.</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#e1f4df]">
          <strong className="font-serif text-lg text-[#080331] block">3. Fulfill with NDPR Audit</strong>
          <span className="text-[#0f3e17]">Every lookup records NDPR consent verification in audit_log.</span>
        </div>
      </section>

      {/* Trust & NDPR Band */}
      <section className="bg-[#0a3922] text-white rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-2xl">
          <ShieldCheck className="w-6 h-6 text-[#31ce01] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#cfe7d3]">
            Every prescription originates from an MDCN-verified doctor and private therapy notes remain strictly concealed under NDPR need-to-know access.
          </p>
        </div>
        <Link href={getPortalUrl('legal', '/ndpr-privacy')} className="text-xs font-semibold text-white underline shrink-0">
          Read NDPR Policy →
        </Link>
      </section>
    </div>
  );
}
