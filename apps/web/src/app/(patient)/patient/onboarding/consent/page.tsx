'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { authorizedApiFetch, getAuthSession, saveAuthSession } from '@/lib/api-client';

export default function PatientConsentPage() {
  const router = useRouter();
  const [telemedConsent, setTelemedConsent] = useState(false);
  const [ndprConsent, setNdprConsent] = useState(false);
  const [tosConsent, setTosConsent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = telemedConsent && ndprConsent && tosConsent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!canProceed) {
      setErrorMessage('All 3 mandatory consents (Telemedicine, NDPR, and Terms) must be checked.');
      return;
    }
    setIsSubmitting(true);
    const res = await authorizedApiFetch('/api/v1/auth/consent', {
      method: 'POST',
      body: JSON.stringify({
        telemedicine_consent: telemedConsent,
        ndpr_consent: ndprConsent,
        terms_accepted: tosConsent,
      }),
    });
    setIsSubmitting(false);
    if (!res.ok) {
      setErrorMessage(res.errorMessage || 'Failed to record NDPR consent. Please ensure you are signed in.');
      return;
    }
    const session = getAuthSession();
    if (session) {
      saveAuthSession({
        ...session,
        user: {
          ...session.user,
          telemedicine_consent: telemedConsent,
          ndpr_consent: ndprConsent,
        },
      });
    }
    router.push('/patient/onboarding/intake');
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 space-y-6">
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          Onboarding Step 1 of 2 • Mandatory Legal Gate
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Telemedicine & NDPR Consent
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Required under Nigerian Data Protection Act (NDPA) and MDCN Telemedicine Rules before medical intake or booking.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-4"
      >
        <label
          className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
            telemedConsent ? 'bg-[#e1f4df]/40 border-[#b1dbb8]' : 'bg-[#f8f3eb] border-neutral-200'
          }`}
        >
          <input
            type="checkbox"
            checked={telemedConsent}
            onChange={(e) => setTelemedConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-[#0a3922]"
          />
          <div className="space-y-1">
            <strong className="text-xs text-[#080331] block">
              1. Telemedicine Consultation Consent
            </strong>
            <p className="text-xs text-[#747679] leading-relaxed">
              I consent to remote consultation via Video, Audio, or Chat with an MDCN-licensed practitioner and understand that physical examination limitations apply.
            </p>
          </div>
        </label>

        <label
          className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
            ndprConsent ? 'bg-[#e1f4df]/40 border-[#b1dbb8]' : 'bg-[#f8f3eb] border-neutral-200'
          }`}
        >
          <input
            type="checkbox"
            checked={ndprConsent}
            onChange={(e) => setNdprConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-[#0a3922]"
          />
          <div className="space-y-1">
            <strong className="text-xs text-[#080331] block">
              2. NDPR Health Data Processing Consent
            </strong>
            <p className="text-xs text-[#747679] leading-relaxed">
              I authorize encrypted storage and clinical sharing of my allergies, conditions, photos, and prescriptions with treating doctors and Partner pharmacies/labs I authorize via Patient ID, logged in <code className="font-mono bg-white px-1 rounded">audit_log</code>.
            </p>
          </div>
        </label>

        <label
          className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
            tosConsent ? 'bg-[#e1f4df]/40 border-[#b1dbb8]' : 'bg-[#f8f3eb] border-neutral-200'
          }`}
        >
          <input
            type="checkbox"
            checked={tosConsent}
            onChange={(e) => setTosConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-[#0a3922]"
          />
          <div className="space-y-1">
            <strong className="text-xs text-[#080331] block">
              3. Emergency-Use Disclaimer & Terms of Service
            </strong>
            <p className="text-xs text-[#747679] leading-relaxed">
              I acknowledge Manga Healthcare is strictly for non-emergency care. If I experience chest pain, breathing distress, stroke signs, or severe bleeding, I will call 112 / 767 or visit the nearest ER immediately.
            </p>
          </div>
        </label>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-[#ffede8] border border-[#ff643b]/40 flex items-start gap-2.5 text-xs text-[#080331]">
            <AlertCircle className="w-4 h-4 text-[#ff643b] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="pt-4 flex items-center justify-between">
          <Link href="/patient/auth" className="text-xs font-semibold text-[#747679] hover:text-[#080331]">
            ← Back to Auth
          </Link>
          <button
            type="submit"
            disabled={!canProceed || isSubmitting}
            className={`px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition ${
              canProceed && !isSubmitting
                ? 'bg-[#0a3922] text-white hover:bg-[#0f3e17] shadow-xs'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <span>{isSubmitting ? 'Saving Consents...' : 'Accept & Continue to Medical Intake'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
