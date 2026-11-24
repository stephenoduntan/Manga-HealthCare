'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { MarketingPageShell } from '../../../../../components/ecosystem/EcosystemChrome';
import { BLOG_POSTS } from '../../../../../components/ecosystem/ecosystemData';
import { getPortalUrl } from '../../../../../lib/domains';

export default function BlogAuthorSpotlightPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const authorPost = BLOG_POSTS.find((p) => p.authorSlug === slug) || BLOG_POSTS[0]!;
  const authoredPosts = BLOG_POSTS.filter((p) => p.authorSlug === authorPost.authorSlug);

  return (
    <MarketingPageShell activeSurface="blog">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <Link href={getPortalUrl('blog', '/')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#747679]">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>

        <div className="bg-white rounded-[32px] p-8 md:p-10 border border-[#efeeeb] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#e1f4df] text-[#0a3922] flex items-center justify-center text-3xl border-2 border-[#b1dbb8]">
              👩🏾‍⚕️
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#e1f4df] text-[#0f3e17] px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-[#31ce01]" /> {authorPost.mdcn}
              </span>
              <h1 className="font-serif text-3xl text-[#080331] font-normal mt-1">
                {authorPost.authorName}
              </h1>
              <p className="text-xs text-[#747679]">{authorPost.authorRole}</p>
            </div>
          </div>

          <Link
            href={getPortalUrl('patient', '/auth?intent=schedule')}
            className="bg-[#ff643b] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            Book on Patient App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#080331] font-normal">
            Published Clinical Articles ({authoredPosts.length})
          </h2>
          {authoredPosts.map((p) => (
            <Link
              key={p.slug}
              href={getPortalUrl('blog', `/${p.slug}`)}
              className="block bg-white rounded-2xl p-6 border border-[#efeeeb] hover:border-[#0a3922]/40 transition space-y-2"
            >
              <strong className="font-serif text-xl text-[#080331] block">{p.title}</strong>
              <p className="text-xs text-[#747679]">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </MarketingPageShell>
  );
}
