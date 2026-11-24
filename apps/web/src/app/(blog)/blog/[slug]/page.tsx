'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { MarketingPageShell } from '../../../../components/ecosystem/EcosystemChrome';
import { BLOG_POSTS } from '../../../../components/ecosystem/ecosystemData';
import { getPortalUrl } from '../../../../lib/domains';

export default function BlogArticleReaderPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0]!;

  return (
    <MarketingPageShell activeSurface="blog">
      <div className="max-w-[680px] mx-auto px-4 py-12 space-y-8">
        <Link href={getPortalUrl('blog', '/')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#747679] hover:text-[#080331]">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Clinical Journal
        </Link>

        <header className="space-y-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#e1f4df] text-[#0f3e17] px-3 py-1 rounded-full">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#080331] font-normal leading-tight">
            {post.title}
          </h1>

          {/* Author Credentials Badge */}
          <Link
            href={getPortalUrl('blog', `/authors/${post.authorSlug}`)}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#efeeeb] hover:border-[#0a3922]/30 transition text-xs"
          >
            <div>
              <strong className="text-sm text-[#080331] block">{post.authorName}</strong>
              <span className="text-[#747679]">{post.authorRole}</span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#0f3e17] bg-[#e1f4df] px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#31ce01]" /> {post.mdcn}
              </span>
              <span className="block text-[10px] text-[#747679] mt-1">Medically Reviewed • {post.publishedAt}</span>
            </div>
          </Link>
        </header>

        <div className="bg-white rounded-[28px] p-8 border border-[#efeeeb] space-y-5 text-base text-[#222326] leading-relaxed">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Contextual CTA Card */}
        <div className="bg-[#0a3922] text-white rounded-3xl p-8 space-y-4">
          <h2 className="font-serif text-2xl font-normal">Need personalized clinical advice?</h2>
          <p className="text-xs sm:text-sm text-[#cfe7d3]">
            Complete our 60-second safety screen and speak with an MDCN-verified physician today.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={getPortalUrl('patient', '/auth?intent=instant')}
              className="bg-[#ff643b] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
            >
              Consult a Doctor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={getPortalUrl('doctor', '/')}
              className="bg-white/15 text-white px-5 py-3 rounded-full text-xs font-semibold"
            >
              Clinicians: Join Our Network
            </Link>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
