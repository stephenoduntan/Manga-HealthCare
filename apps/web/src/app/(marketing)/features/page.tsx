import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Video,
  FileText,
  HeartPulse,
  Bell,
  Smartphone,
  ArrowRight,
  QrCode,
} from 'lucide-react';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';
import { getPortalUrl } from '../../../lib/domains';

export default function PatientFeaturesPage() {
  const features = [
    {
      icon: ShieldAlert,
      badge: 'Safety Gate',
      title: 'Mandatory Emergency-Symptom Triage',
      desc: 'Evaluates 8 acute red-flag symptoms and clarifying free-text before payment, immediately presenting 112 / 767 ambulance dialers if any emergency sign is present.',
    },
    {
      icon: Video,
      badge: 'Low-Data Resilient',
      title: 'Multi-Modal Consultations (Video, Audio & Chat)',
      desc: 'Start with HD video or switch to voice-only audio or text chat at any moment—plus upload clinical photos of skin rashes or paper labs directly into the consultation stream.',
    },
    {
      icon: FileText,
      badge: 'Verifiable PDF',
      title: 'Structured Summaries & PDF E-Prescriptions',
      desc: 'Receive clear SOAP summaries (Chief Complaint, Assessment, Plan) and digitally signed PDF e-prescriptions accepted at partner.mangahealthcare.com pharmacies.',
    },
    {
      icon: HeartPulse,
      badge: 'Continuity',
      title: 'Continuous Medical Record & Intake Profile',
      desc: 'Your allergies, existing chronic conditions, current medications, and language preferences stay saved across every visit so doctors immediately see contraindications.',
    },
    {
      icon: Bell,
      badge: 'Smart Nudges',
      title: 'Follow-Up Reminders & Discounted Rebooking',
      desc: 'Receive timely FCM push notifications for follow-up reviews and automatically unlock discounted follow-up consultation fees.',
    },
  ];

  return (
    <MarketingPageShell activeSurface="marketing">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3.5 py-1 rounded-full border border-[#b1dbb8]">
            mangahealthcare.com/features
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080331] font-normal">
            Clinical capabilities built for safety, clarity, and low-bandwidth access.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-[28px] p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-full bg-[#e1f4df] text-[#0f3e17] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#f8f3eb] text-[#080331] px-3 py-1 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-[#080331] font-normal">{f.title}</h2>
                <p className="text-sm text-[#747679] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Cross-Platform Charcoal Download Pill (#1f2025) */}
        <div className="bg-[#1f2025] text-white rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#31ce01]">
              <Smartphone className="w-4 h-4" /> Web Portal + iOS &amp; Android App
            </div>
            <h2 className="font-serif text-3xl text-white font-normal">
              Take Manga Healthcare wherever you go.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Access the full experience on app.mangahealthcare.com or install our unified iOS and Android React Native mobile app with native push notifications and camera uploads.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href={getPortalUrl('patient', '/auth')}
                className="bg-[#ff643b] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                Launch Web App <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="border border-white/25 px-5 py-3 rounded-full text-xs font-medium text-neutral-200">
                iOS App Store &amp; Google Play (Beta)
              </span>
            </div>
          </div>
          <div className="bg-white text-[#080331] p-5 rounded-3xl text-center space-y-2 shrink-0 self-start md:self-auto">
            <QrCode className="w-20 h-20 mx-auto text-[#0a3922]" />
            <span className="text-[10px] font-mono font-bold block">app.mangahealthcare.com</span>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
