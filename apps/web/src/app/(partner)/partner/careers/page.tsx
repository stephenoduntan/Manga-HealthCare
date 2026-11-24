import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function PartnerCareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-serif text-4xl text-[#080331] font-normal">
        Partner Network Operations Roles
      </h1>
      <div className="bg-white rounded-3xl p-8 border border-[#efeeeb] text-sm text-[#222326] space-y-3">
        <p>
          Open tracks: Pharmacy Network Onboarding Leads, Diagnostic Lab Partnership Managers, and Field Operations Coordinators across Lagos &amp; Abuja.
        </p>
        <Link href={getPortalUrl('marketing', '/careers')} className="text-xs font-semibold text-[#4865ff] hover:underline inline-block">
          View All Open Roles →
        </Link>
      </div>
    </div>
  );
}
