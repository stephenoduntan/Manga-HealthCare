import React from 'react';
import Link from 'next/link';
import { HeartPulse, Video, FileText, Pill, ClipboardList, Smartphone } from 'lucide-react';
import { getPortalUrl } from '../../../../lib/domains';

export default function DoctorFeaturesPage() {
  const items = [
    { icon: HeartPulse, title: 'Pre-Session Patient Intake Snapshot', desc: 'Automatic coral allergy alerts, existing conditions, current medications, and language preferences before the call connects.' },
    { icon: Video, title: 'Multi-Modal Consultation Room', desc: 'Video, Audio, and low-bandwidth Text Chat with auto-logged start_time / end_time and clinical rash photo inspection.' },
    { icon: FileText, title: 'Structured SOAP Documentation', desc: 'Fast charting for Chief Complaint, Body of Hx, Assessment, and Plan compliant with MDCN standards.' },
    { icon: Pill, title: '1-Click PDF E-Prescription Generator', desc: 'Add Drug, Dosage, Frequency, and Duration rows to generate a stamped PDF verifiable at partner.mangahealthcare.com.' },
    { icon: ClipboardList, title: 'Lab & Specialist Referral Issuance', desc: 'Attach structured lab requests or referral notes directly to the patient’s PAT-XXXX record.' },
    { icon: Smartphone, title: 'Unified Web & Mobile Clinician App', desc: 'Consult from desktop browser or iOS/Android mobile app using a single login.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-10">
      <div className="max-w-2xl space-y-3">
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full">
          doctor.mangahealthcare.com/features
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
          Clinical EHR &amp; consultation tools built for speed and safety.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white rounded-3xl p-7 border border-[#efeeeb] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#ebf0f8] text-[#4865ff] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl text-[#080331] font-normal">{item.title}</h2>
              <p className="text-xs sm:text-sm text-[#747679] leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div>
        <Link href={getPortalUrl('doctor', '/auth')} className="bg-[#0a3922] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
          Open Practitioner Login →
        </Link>
      </div>
    </div>
  );
}
