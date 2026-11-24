'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, AlertTriangle, PhoneCall, ArrowRight, ShieldCheck, Users, Building2, Lock } from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { HELP_ARTICLES } from '../../../components/ecosystem/ecosystemData';
import { getPortalUrl } from '../../../lib/domains';

export default function HelpCentreHomePage() {
  const [query, setQuery] = useState('');

  const results = HELP_ARTICLES.filter(
    (a) =>
      !query.trim() ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.summary.toLowerCase().includes(query.toLowerCase())
  );

  const categories = [
    {
      title: 'For Patients',
      desc: 'Booking, mandatory 8-point triage, Paystack/USSD payments, downloading PDF prescriptions.',
      href: getPortalUrl('help', '/patients'),
      icon: Users,
    },
    {
      title: 'For Doctors & Therapists',
      desc: 'MDCN verification, Locum ID onboarding, structured SOAP notes, biweekly payouts.',
      href: getPortalUrl('help', '/doctors'),
      icon: ShieldCheck,
    },
    {
      title: 'For Pharmacies & Labs',
      desc: 'Verifying Patient IDs (PAT-XXXX), dispensing e-prescriptions, lab order fulfillment.',
      href: getPortalUrl('help', '/partners'),
      icon: Building2,
    },
    {
      title: 'Account, Privacy & NDPR',
      desc: '6-digit OTP login help, medical intake updates, NDPR consent & audit log rights.',
      href: getPortalUrl('help', '/article/ndpr-consent-and-audit-logs'),
      icon: Lock,
    },
  ];

  return (
    <MarketingPageShell activeSurface="help">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-12">
        {/* Emergency Triage Banner */}
        <div className="bg-[#ffede8] rounded-3xl p-5 border border-[#ff643b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ff643b] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#080331]">
              <strong>Medical Emergency?</strong> Do not wait for support replies. Call <strong>112</strong> or <strong>767</strong> (LASAMBUS) or visit the nearest hospital ER immediately.
            </p>
          </div>
          <a
            href="tel:112"
            className="bg-[#ff643b] text-white px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call 112
          </a>
        </div>

        {/* Hero Search Bar on Keylime Wash */}
        <section className="bg-[#e1f4df] rounded-[32px] p-8 md:p-14 border border-[#b1dbb8] text-center space-y-6">
          <span className="eyebrow-label text-[#0f3e17] bg-white/80 px-3.5 py-1 rounded-full">
            help.mangahealthcare.com
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
            How can we help you today?
          </h1>
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-[#747679] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search triage, Paystack, MDCN verification, PAT-XXXX..."
              className="w-full bg-white border border-[#b1dbb8] rounded-full pl-12 pr-5 py-4 text-sm shadow-xs focus:outline-none focus:border-[#0a3922]"
            />
          </div>
        </section>

        {/* 4 Cloud Card Category Bento */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="bg-[#ebf0f8] rounded-3xl p-6 border border-[#4865ff]/20 hover:border-[#4865ff] transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#4865ff] flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl text-[#080331] font-normal">{cat.title}</h2>
                  <p className="text-xs text-[#747679] leading-relaxed">{cat.desc}</p>
                </div>
                <span className="text-xs font-semibold text-[#4865ff] inline-flex items-center gap-1 pt-2">
                  Explore guides <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </section>

        {/* Search Results / Popular Articles */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#080331] font-normal">
              {query.trim() ? `Matching Guides (${results.length})` : 'Popular Knowledge Base Articles'}
            </h2>
            <Link href={getPortalUrl('help', '/contact')} className="text-xs font-semibold text-[#4865ff] hover:underline">
              Submit Support Ticket →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((art) => (
              <Link
                key={art.slug}
                href={getPortalUrl('help', `/article/${art.slug}`)}
                className="bg-white rounded-2xl p-6 border border-[#efeeeb] hover:border-[#0a3922]/40 transition space-y-2"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0f3e17] bg-[#e1f4df] px-2.5 py-0.5 rounded-full">
                  {art.category}
                </span>
                <h3 className="font-serif text-xl text-[#080331] font-normal">{art.title}</h3>
                <p className="text-xs text-[#747679]">{art.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </MarketingPageShell>
  );
}
