'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ThumbsUp } from 'lucide-react';
import { MarketingPageShell } from '../../../../../components/ecosystem/EcosystemChrome';
import { HELP_ARTICLES } from '../../../../../components/ecosystem/ecosystemData';
import { getPortalUrl } from '../../../../../lib/domains';

export default function HelpArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const article = HELP_ARTICLES.find((a) => a.slug === slug) || HELP_ARTICLES[0]!;
  const related = HELP_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const [helpfulVoted, setHelpfulVoted] = React.useState(false);

  return (
    <MarketingPageShell activeSurface="help">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <article className="lg:col-span-8 bg-white rounded-[32px] p-8 md:p-12 border border-[#efeeeb] space-y-6">
          <Link href={getPortalUrl('help', '/')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#747679] hover:text-[#080331]">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Help Centre
          </Link>

          <div>
            <span className="text-[11px] uppercase font-semibold tracking-wider bg-[#e1f4df] text-[#0f3e17] px-3 py-1 rounded-full">
              {article.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-3">
              {article.title}
            </h1>
            <p className="text-sm text-[#747679] mt-2">{article.summary}</p>
          </div>

          <ol className="space-y-3 pt-2">
            {article.steps.map((step, idx) => (
              <li key={idx} className="p-4 rounded-2xl bg-[#f8f3eb] border border-neutral-200 flex items-start gap-3 text-sm text-[#222326]">
                <span className="w-6 h-6 rounded-full bg-[#0a3922] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-[#747679]">Was this guide helpful?</span>
            <button
              type="button"
              onClick={() => setHelpfulVoted(true)}
              className="px-4 py-2 rounded-full border border-neutral-200 hover:bg-[#e1f4df] inline-flex items-center gap-1.5 font-semibold text-[#080331]"
            >
              {helpfulVoted ? <CheckCircle2 className="w-4 h-4 text-[#31ce01]" /> : <ThumbsUp className="w-4 h-4" />}
              <span>{helpfulVoted ? 'Thank you for your feedback!' : 'Yes, Helpful'}</span>
            </button>
          </div>
        </article>

        <aside className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-4">
          <h2 className="font-serif text-xl text-[#080331] font-normal">Related Guides</h2>
          <div className="space-y-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={getPortalUrl('help', `/article/${r.slug}`)}
                className="block p-3.5 rounded-2xl bg-[#f8f3eb]/70 hover:bg-[#e1f4df]/40 border border-neutral-200 transition text-xs"
              >
                <strong className="text-[#080331] block">{r.title}</strong>
                <span className="text-[#747679]">{r.category}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </MarketingPageShell>
  );
}
