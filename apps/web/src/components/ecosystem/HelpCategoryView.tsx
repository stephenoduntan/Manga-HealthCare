'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MarketingPageShell } from './EcosystemChrome';
import { HELP_ARTICLES, HelpArticle } from './ecosystemData';
import { getPortalUrl } from '../../lib/domains';

export function HelpCategoryView({
  category,
  title,
  subtitle,
  faqs,
}: {
  category: HelpArticle['category'];
  title: string;
  subtitle: string;
  faqs: Array<{ q: string; a: string }>;
}) {
  const articles = HELP_ARTICLES.filter((a) => a.category === category);

  return (
    <MarketingPageShell activeSurface="help">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-10">
        <div>
          <Link href={getPortalUrl('help', '/')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#747679] hover:text-[#080331] mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Help Centre
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#080331] font-normal">{title}</h1>
          <p className="text-sm text-[#747679] mt-2">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <Link
              key={art.slug}
              href={getPortalUrl('help', `/article/${art.slug}`)}
              className="bg-white rounded-3xl p-6 border border-[#efeeeb] hover:border-[#0a3922]/40 transition space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h2 className="font-serif text-xl text-[#080331] font-normal">{art.title}</h2>
                <p className="text-xs text-[#747679] leading-relaxed">{art.summary}</p>
              </div>
              <span className="text-xs font-semibold text-[#0a3922] inline-flex items-center gap-1 pt-3">
                Read Step-by-Step Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* Ease Health 2-Column Editorial FAQ */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 border border-[#efeeeb] divide-y divide-[#efeeeb]">
          <h2 className="font-serif text-2xl text-[#080331] font-normal pb-6">
            Frequently Asked Questions
          </h2>
          {faqs.map((f, i) => (
            <div key={i} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-5">
                <h3 className="font-serif text-xl sm:text-2xl text-[#0f3e17] font-normal">{f.q}</h3>
              </div>
              <div className="md:col-span-7">
                <p className="text-sm text-[#222326] leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MarketingPageShell>
  );
}
