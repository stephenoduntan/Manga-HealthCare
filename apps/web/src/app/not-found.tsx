import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../lib/domains';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f8f3eb] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-14 h-14 rounded-full bg-[#0a3922] text-[#e1f4df] flex items-center justify-center font-serif text-2xl">
        M
      </div>
      <div className="space-y-2 max-w-md">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full">
          404 • Page Not Found
        </span>
        <h1 className="font-serif text-4xl text-[#080331] font-normal">
          We couldn&apos;t find that Manga Healthcare page.
        </h1>
        <p className="text-xs sm:text-sm text-[#747679]">
          Select your role portal below to return to the Patient App, Doctor Portal, Partner Counter, or Help Centre.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
        <Link
          href={getPortalUrl('marketing', '/')}
          className="bg-[#0a3922] text-white px-5 py-3 rounded-full hover:bg-[#0f3e17] transition"
        >
          Patient Website
        </Link>
        <Link
          href={getPortalUrl('doctor', '/')}
          className="bg-white text-[#080331] border border-neutral-300 px-5 py-3 rounded-full hover:bg-neutral-50 transition"
        >
          Doctor Portal
        </Link>
        <Link
          href={getPortalUrl('partner', '/')}
          className="bg-white text-[#080331] border border-neutral-300 px-5 py-3 rounded-full hover:bg-neutral-50 transition"
        >
          Partner Portal
        </Link>
        <Link
          href={getPortalUrl('help', '/')}
          className="bg-white text-[#4865ff] border border-[#4865ff]/30 px-5 py-3 rounded-full hover:bg-[#ebf0f8] transition"
        >
          Help Centre
        </Link>
      </div>
    </div>
  );
}
