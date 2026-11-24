import React from 'react';
import Link from 'next/link';
import { AlertTriangle, PhoneCall, Users, Stethoscope, Building2, Scale } from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { getPortalUrl } from '../../../lib/domains';

export default function MarketingContactPage() {
  return (
    <MarketingPageShell activeSurface="marketing">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 space-y-10">
        {/* Top Emergency Redirection Notice */}
        <div className="bg-[#ffede8] rounded-3xl p-6 border border-[#ff643b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ff643b] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#080331]">
              <strong>Experiencing a medical emergency?</strong> Do not use this contact page. Call <strong>112</strong> or visit the nearest hospital emergency room immediately.
            </p>
          </div>
          <a href="tel:112" className="bg-[#ff643b] text-white px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shrink-0">
            <PhoneCall className="w-3.5 h-3.5" /> Call 112
          </a>
        </div>

        <div>
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            mangahealthcare.com/contact
          </span>
          <h1 className="font-serif text-4xl text-[#080331] font-normal mt-2">
            Departmental Routing &amp; Support
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-3">
            <Users className="w-5 h-5 text-[#4865ff]" />
            <h2 className="font-serif text-xl text-[#080331]">Patient Support &amp; Billing Disputes</h2>
            <p className="text-[#747679]">Paystack/Flutterwave reconciliation, refunds, and consultation history inquiries.</p>
            <Link href={getPortalUrl('help', '/patients')} className="text-[#4865ff] font-semibold hover:underline block">
              Open Patient Help Centre →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-3">
            <Stethoscope className="w-5 h-5 text-[#0f3e17]" />
            <h2 className="font-serif text-xl text-[#080331]">Doctor &amp; Locum Onboarding</h2>
            <p className="text-[#747679]">MDCN verification status, Locum ID (LOC-XXXX) issuance, and biweekly payout reconciliation.</p>
            <Link href={getPortalUrl('doctor', '/contact')} className="text-[#4865ff] font-semibold hover:underline block">
              Go to Clinician Desk →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-3">
            <Building2 className="w-5 h-5 text-[#0a3922]" />
            <h2 className="font-serif text-xl text-[#080331]">Pharmacy &amp; Diagnostic Lab Partnerships</h2>
            <p className="text-[#747679]">PCN-licensed pharmacies, lab networks, and referral clinics.</p>
            <Link href={getPortalUrl('partner', '/contact')} className="text-[#4865ff] font-semibold hover:underline block">
              Go to Partner Desk →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-3">
            <Scale className="w-5 h-5 text-[#ff643b]" />
            <h2 className="font-serif text-xl text-[#080331]">Media, Regulatory &amp; NDPR Data Inquiries</h2>
            <p className="text-[#747679]">Official compliance, NDPA Data Protection Officer, and MDCN queries.</p>
            <Link href={getPortalUrl('legal', '/ndpr-privacy')} className="text-[#4865ff] font-semibold hover:underline block">
              View Legal &amp; NDPR Hub →
            </Link>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
