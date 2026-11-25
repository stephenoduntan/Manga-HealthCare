'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authorizedApiFetch, saveAuthSession } from '@/lib/api-client';

export default function PartnerAuthPage() {
  const router = useRouter();
  const [partnerIdentifier, setPartnerIdentifier] = useState('PRT-MEDPLUS-VI-01');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedId, setVerifiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const trimmed = partnerIdentifier.trim();
    if (!trimmed) {
      setErrorMessage('Partner Organization ID or official email is required.');
      return;
    }

    setIsSubmitting(true);
    const res = await authorizedApiFetch<{ message?: string; dev_otp?: string }>(
      '/api/v1/auth/otp/request',
      {
        method: 'POST',
        body: JSON.stringify({
          identifier: trimmed,
          role: 'PARTNER',
          login_mode: 'PARTNER_ID',
        }),
      },
    );
    setIsSubmitting(false);

    if (!res.ok) {
      setErrorMessage(res.errorMessage || 'Failed to send Partner OTP.');
      return;
    }

    setOtpSent(true);
    setDevOtpHint(res.data?.dev_otp || null);
    setOtpCode(res.data?.dev_otp || '');
    setStatusMessage(res.data?.message || `OTP sent to ${trimmed}.`);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!/^\d{6}$/.test(otpCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    const res = await authorizedApiFetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({
        identifier: partnerIdentifier.trim(),
        otp: otpCode.trim(),
        role: 'PARTNER',
        login_mode: 'PARTNER_ID',
      }),
    });
    setIsSubmitting(false);

    if (!res.ok || !res.data?.access_token) {
      setErrorMessage(res.errorMessage || 'Invalid or expired Partner OTP.');
      return;
    }

    saveAuthSession(res.data);
    setVerifiedId(res.data?.user?.public_id || partnerIdentifier.trim().toUpperCase());
    setTimeout(() => router.push('/partner/lookup'), 500);
  };

  return (
    <div className="min-h-screen bg-[#f8f3eb] flex flex-col justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#0a3922] text-[#e1f4df] flex items-center justify-center font-serif text-xl mx-auto">
            M
          </div>
          <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
            partner.mangahealthcare.com/auth
          </span>
          <h1 className="font-serif text-3xl text-[#080331] font-normal">
            Pharmacy &amp; Lab Partner Login
          </h1>
          <p className="text-xs text-[#747679]">
            Sign in with your verified Partner Organization ID or official email + 6-digit OTP.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_12px_28px_rgba(75,68,57,0.08)] space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#ffede8] border border-[#ff643b]/40 flex items-start gap-2.5 text-xs text-[#080331]">
              <AlertCircle className="w-4 h-4 text-[#ff643b] shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                  Partner Organization ID or Email *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#747679] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={partnerIdentifier}
                    onChange={(e) => setPartnerIdentifier(e.target.value)}
                    required
                    className="w-full text-sm font-mono font-bold border border-neutral-200 rounded-xl pl-10 pr-4 py-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0a3922] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Sending Partner OTP...' : 'Send 6-Digit Partner OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] flex items-center justify-between gap-2 text-xs text-[#0f3e17]">
                <span>{statusMessage || `OTP sent to ${partnerIdentifier}`}</span>
                {devOtpHint && (
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded shrink-0">
                    Sandbox OTP: {devOtpHint}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                  6-Digit Verification OTP *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg border border-neutral-300 rounded-xl px-4 py-2.5"
                  required
                />
              </div>
              {verifiedId && (
                <div className="p-3 rounded-2xl bg-[#ebf0f8] border border-[#4865ff]/30 flex items-center gap-2 text-xs text-[#080331]">
                  <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
                  <span>Partner session active: <strong>{verifiedId}</strong></span>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setOtpSent(false);
                    setErrorMessage(null);
                  }}
                  className="px-4 py-3.5 rounded-full border border-neutral-200 text-xs font-semibold text-[#747679]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#ff643b] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Verifying...' : 'Open Order Lookup Counter'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#747679]">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#0f3e17]" /> NDPR Scoped Access
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#31ce01]" /> Every Lookup Audited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
