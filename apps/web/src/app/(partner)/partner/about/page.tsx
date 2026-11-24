import React from 'react';
import Link from 'next/link';
import { getPortalUrl } from '../../../../lib/domains';

export default function PartnerAboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-serif text-4xl text-[#080331] font-normal">
        Closing the Last Mile of Telemedicine
      </h1>
      <div className="bg-white rounded-3xl p-8 border border-[#efeeeb] text-sm text-[#222326] space-y-4 leading-relaxed">
        <p>
          Digital consultations only succeed when patients can seamlessly obtain authentic prescribed medications and diagnostic tests at trusted local pharmacies and laboratories.
        </p>
        <p>
          Our ecosystem links Patients (<Link href={getPortalUrl('marketing', '/')} className="text-[#4865ff] underline">mangahealthcare.com</Link>), Doctors (<Link href={getPortalUrl('doctor', '/')} className="text-[#4865ff] underline">doctor.mangahealthcare.com</Link>), and Fulfillment Partners seamlessly.
        </p>
      </div>
    </div>
  );
}
