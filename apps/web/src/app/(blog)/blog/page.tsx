'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { BLOG_POSTS } from '../../../components/ecosystem/ecosystemData';
import { getPortalUrl } from '../../../lib/domains';

export default function BlogHomePage() {
  const categories = [
    'All Articles',
    'Patient Health Guides',
    'Mental Health & Therapy',
    'Clinical Practice & Telemedicine',
    'Product & Safety Updates',
  ] as const;

  const [selectedCat, setSelectedCat] = useState<string>('All Articles');

  const featured = BLOG_POSTS[0]!;
  const filtered = BLOG_POSTS.filter(
    (p) => selectedCat === 'All Articles' || p.category === selectedCat
  );

  return (
    <MarketingPageShell activeSurface="blog">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-4 max-w-2xl">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            blog.mangahealthcare.com • Clinical Journal
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
            Clinical perspectives on safe digital healthcare in Nigeria.
          </h1>
        </div>

        {/* Featured Cover Story */}
        <Link
          href={getPortalUrl('blog', `/${featured.slug}`)}
          className="block bg-white rounded-[32px] p-8 md:p-12 border border-[#efeeeb] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-[#0a3922]/40 transition"
        >
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff643b] bg-[#ffede8] px-3 py-1 rounded-full">
              Featured Cover Story • {featured.category}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal leading-tight">
              {featured.title}
            </h2>
            <p className="text-sm sm:text-base text-[#747679] leading-relaxed">{featured.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-[#080331] pt-2">
              <strong className="font-medium">{featured.authorName}</strong>
              <span className="text-[#747679]">• {featured.publishedAt}</span>
              <span className="inline-flex items-center gap-1 text-[#0f3e17]">
                <Clock className="w-3.5 h-3.5" /> {featured.readTime}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#e1f4df] rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 border border-[#b1dbb8]">
            <div className="w-24 h-24 rounded-full bg-[#0a3922] text-white flex items-center justify-center text-4xl border-4 border-white">
              👩🏾‍⚕️
            </div>
            <div>
              <strong className="font-serif text-lg text-[#080331] block">{featured.authorName}</strong>
              <span className="text-xs text-[#0f3e17] block">{featured.authorRole}</span>
              <span className="font-mono text-[10px] text-[#747679] mt-1 block">{featured.mdcn}</span>
            </div>
          </div>
        </Link>

        {/* Category Filter Pills (9999px radius) */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition border ${
                selectedCat === cat
                  ? 'bg-[#0a3922] text-white border-[#0a3922]'
                  : 'bg-white text-[#747679] border-neutral-200 hover:text-[#080331]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Alternating Paper White & Sage Mist Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, idx) => {
            const isSage = idx % 2 === 1;
            return (
              <Link
                key={post.slug}
                href={getPortalUrl('blog', `/${post.slug}`)}
                className={`rounded-[28px] p-8 border transition flex flex-col justify-between space-y-6 ${
                  isSage
                    ? 'bg-[#b1dbb8] border-[#0f3e17]/15'
                    : 'bg-white border-[#efeeeb]'
                }`}
              >
                <div className="space-y-3">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-white/85 text-[#0f3e17] px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#080331] font-normal leading-snug">
                    {post.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isSage ? 'text-[#0f3e17]' : 'text-[#747679]'}`}>
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#080331] block">{post.authorName}</strong>
                    <span className={isSage ? 'text-[#0f3e17]' : 'text-[#747679]'}>
                      {post.publishedAt} • {post.readTime}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0a3922]">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </MarketingPageShell>
  );
}
