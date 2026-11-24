'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Clock, ShieldCheck } from 'lucide-react';
import { MarketingPageShell } from './EcosystemChrome';
import { LEGAL_DOCS, LegalSectionDoc } from './ecosystemData';
import { getPortalUrl } from '../../lib/domains';

export function LegalSheet({ doc }: { doc: LegalSectionDoc }) {
  const pathname = usePathname();
  const navItems: Array<{ slug: LegalSectionDoc['slug']; label: string }> = [
    { slug: 'terms', label: 'Terms of Service' },
    { slug: 'ndpr-privacy', label: 'NDPR Data & Privacy Policy' },
    { slug: 'telemedicine-consent', label: 'Telemedicine Informed Consent' },
    { slug: 'emergency-disclaimer', label: 'Emergency-Use Disclaimer' },
    { slug: 'clinician-compliance', label: 'MDCN Clinician Compliance' },
  ];

  return (
    <MarketingPageShell activeSurface="legal">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Left Table of Contents */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0f3e17]">
            <Scale className="w-4 h-4" />
            <span>legal.mangahealthcare.com</span>
          </div>

          <nav className="space-y-1.5 text-xs">
            <Link
              href={getPortalUrl('legal', '/')}
              className={`block px-3.5 py-2.5 rounded-xl font-medium transition ${
                pathname === '/legal' ? 'bg-[#0a3922] text-white' : 'text-[#747679] hover:bg-[#f8f3eb]'
              }`}
            >
              Regulatory Overview
            </Link>
            {navItems.map((item) => {
              const targetHref = getPortalUrl('legal', `/${item.slug}`);
              const active = pathname?.includes(item.slug);
              return (
                <Link
                  key={item.slug}
                  href={targetHref}
                  className={`block px-3.5 py-2.5 rounded-xl font-medium transition ${
                    active ? 'bg-[#0a3922] text-white' : 'text-[#747679] hover:bg-[#f8f3eb]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-neutral-100 text-[11px] text-[#747679] space-y-1">
            <div className="inline-flex items-center gap-1.5 font-semibold text-[#080331]">
              <Clock className="w-3.5 h-3.5 text-[#4865ff]" />
              <span>Version: {doc.version}</span>
            </div>
            <div>Effective: {doc.effectiveDate}</div>
          </div>
        </aside>

        {/* High-Contrast Paper White Reading Sheet */}
        <article className="lg:col-span-8 bg-white rounded-[32px] p-8 md:p-12 border border-[#efeeeb] shadow-[0_8px_24px_rgba(75,68,57,0.06)] space-y-8">
          <div className="border-b border-[#efeeeb] pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#e1f4df] text-[#0f3e17] px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#31ce01]" />
              <span>{doc.version} • Effective {doc.effectiveDate}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#080331] font-normal">
              {doc.title}
            </h1>
            <p className="text-sm sm:text-base text-[#747679] leading-relaxed">{doc.summary}</p>
          </div>

          <div className="space-y-6">
            {doc.clauses.map((clause, i) => (
              <section key={i} className="space-y-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[#0f3e17] font-normal">
                  {clause.heading}
                </h2>
                <p className="text-sm text-[#222326] leading-relaxed">{clause.body}</p>
              </section>
            ))}
          </div>

          <div className="pt-6 border-t border-[#efeeeb] flex flex-wrap items-center justify-between gap-4 text-xs text-[#747679]">
            <span>Document Identifier: {LEGAL_DOCS[doc.slug].slug.toUpperCase()}-{doc.version}</span>
            <Link href={getPortalUrl('help', '/contact')} className="text-[#4865ff] font-semibold hover:underline">
              Contact Data Protection Officer →
            </Link>
          </div>
        </article>
      </div>
    </MarketingPageShell>
  );
}
