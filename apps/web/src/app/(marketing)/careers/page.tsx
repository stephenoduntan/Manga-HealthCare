import React from 'react';
import Link from 'next/link';
import { Code2, Stethoscope, ArrowRight } from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { getPortalUrl } from '../../../lib/domains';

export default function MarketingCareersPage() {
  return (
    <MarketingPageShell activeSurface="marketing">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 space-y-10">
        <div className="max-w-2xl space-y-3">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            mangahealthcare.com/careers
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
            Building clinical infrastructure for modern African healthcare.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-[#efeeeb] space-y-4">
            <Code2 className="w-6 h-6 text-[#4865ff]" />
            <h2 className="font-serif text-2xl text-[#080331] font-normal">Engineering &amp; Product</h2>
            <p className="text-xs sm:text-sm text-[#747679] leading-relaxed">
              Full-Stack TypeScript (Next.js / NestJS / Prisma), React Native Mobile Engineers, and Clinical Safety Systems Architects.
            </p>
            <Link href={getPortalUrl('marketing', '/contact')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4865ff] hover:underline">
              Submit Role Inquiry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#ebf0f8] rounded-3xl p-8 border border-[#4865ff]/20 space-y-4">
            <Stethoscope className="w-6 h-6 text-[#0a3922]" />
            <h2 className="font-serif text-2xl text-[#080331] font-normal">Clinical Operations &amp; Advisory</h2>
            <p className="text-xs sm:text-sm text-[#222326] leading-relaxed">
              Clinical Governance Leads, Triage Protocol Reviewers, and Locum Network Operations Coordinators.
            </p>
            <p className="text-xs text-[#0f3e17] font-medium">
              Are you a practicing doctor or therapist looking to consult?{' '}
              <Link href={getPortalUrl('doctor', '/getting-started')} className="underline font-semibold">
                Apply on doctor.mangahealthcare.com →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
