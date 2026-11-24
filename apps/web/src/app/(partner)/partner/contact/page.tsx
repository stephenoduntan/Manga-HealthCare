import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function PartnerContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-serif text-4xl text-[#080331] font-normal">
        Partner Desk &amp; Network Support
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-2">
          <strong className="text-[#080331] block">Live Fulfillment Desk Support</strong>
          <p className="text-[#747679]">Immediate help if a staff member encounters an invalid Patient ID or needs prescriber clarification.</p>
          <Link href={getPortalUrl('help', '/partners')} className="text-[#4865ff] font-semibold hover:underline block">
            Open Partner Help Desk →
          </Link>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] space-y-2">
          <strong className="text-[#080331] block">New Facility Inquiries</strong>
          <p className="text-[#747679]">Chain pharmacy and multi-branch laboratory partnerships.</p>
          <Link href={getPortalUrl('partner', '/getting-started')} className="text-[#4865ff] font-semibold hover:underline block">
            Submit Onboarding Request →
          </Link>
        </div>
      </div>
    </div>
  );
}
