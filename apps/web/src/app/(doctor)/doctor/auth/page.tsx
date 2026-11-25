'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authorizedApiFetch, saveAuthSession } from '@/lib/api-client';

export default function DoctorAuthPage() {
  const router = useRouter();
  const [authTab, setAuthTab] = useState<'EMAIL' | 'DOCTOR_ID' | 'LOCUM_ID'>('LOCUM_ID');
  const [identifier, setIdentifier] = useState('LOC-9941');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedId, setVerifiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyMode, setIsApplyMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'apply') {
      setIsApplyMode(true);
      setAuthTab('EMAIL');
      setIdentifier('dr.applicant@clinic.ng');
    }
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const trimmed = identifier.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your Clinical Email, Doctor ID, or Locum ID.');
      return;
    }
    if (authTab === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage('Please enter a valid clinical email address.');
      return;
    }

    setIsSubmitting(true);
    const role = authTab === 'LOCUM_ID' ? 'LOCUM' : 'DOCTOR';
    const res = await authorizedApiFetch<{ message?: string; dev_otp?: string }>(
      '/api/v1/auth/otp/request',
      {
        method: 'POST',
        body: JSON.stringify({
          identifier: trimmed,
          role,
          login_mode: authTab,
        }),
      },
    );
    setIsSubmitting(false);

    if (!res.ok) {
      setErrorMessage(res.errorMessage || 'Failed to dispatch clinician OTP.');
      return;
    }

    setOtpSent(true);
    setDevOtpHint(res.data?.dev_otp || null);
    setOtpCode(res.data?.dev_otp || '');
    setStatusMessage(res.data?.message || `6-digit OTP sent for ${trimmed}.`);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!/^\d{6}$/.test(otpCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    const role = authTab === 'LOCUM_ID' ? 'LOCUM' : 'DOCTOR';
    const res = await authorizedApiFetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({
        identifier: identifier.trim(),
        otp: otpCode.trim(),
        role,
        login_mode: authTab,
        is_locum: authTab === 'LOCUM_ID',
      }),
    });
    setIsSubmitting(false);

    if (!res.ok || !res.data?.access_token) {
      setErrorMessage(res.errorMessage || 'Invalid or expired clinician OTP.');
      return;
    }

    saveAuthSession(res.data);
    setVerifiedId(res.data?.user?.public_id || identifier.trim().toUpperCase());

    setTimeout(() => {
      if (isApplyMode) {
        router.push('/doctor/onboarding/credentials');
      } else {
        router.push('/doctor/dashboard');
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-6">
      <div className="text-center space-y-2">
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          doctor.mangahealthcare.com/auth
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal">
          Clinician &amp; Locum Portal Sign In
        </h1>
        <p className="text-xs sm:text-sm text-[#747679]">
          MDCN-verified Doctors, Therapists, and Admin-vetted Locum Physicians.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_12px_28px_rgba(75,68,57,0.08)] space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-[#ffede8] border border-[#ff643b]/40 flex items-start gap-3 text-xs text-[#080331]">
            <AlertCircle className="w-4 h-4 text-[#ff643b] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 bg-[#f8f3eb] p-1 rounded-2xl border border-neutral-200">
          <button
            type="button"
            onClick={() => {
              setAuthTab('EMAIL');
              setIdentifier('chidi.okafor@mangahealth.ng');
              setOtpSent(false);
              setErrorMessage(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition ${
              authTab === 'EMAIL' ? 'bg-[#0a3922] text-white shadow-xs' : 'text-[#747679]'
            }`}
          >
            Email + OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('DOCTOR_ID');
              setIdentifier('DOC-1102');
              setOtpSent(false);
              setErrorMessage(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition ${
              authTab === 'DOCTOR_ID' ? 'bg-[#0a3922] text-white shadow-xs' : 'text-[#747679]'
            }`}
          >
            Doctor ID
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('LOCUM_ID');
              setIdentifier('LOC-9941');
              setOtpSent(false);
              setErrorMessage(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition ${
              authTab === 'LOCUM_ID' ? 'bg-[#0a3922] text-white shadow-xs' : 'text-[#747679]'
            }`}
          >
            Locum ID
          </button>
        </div>

        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                {authTab === 'EMAIL'
                  ? 'Registered Clinical Email *'
                  : authTab === 'DOCTOR_ID'
                  ? 'Doctor ID (DOC-XXXX) *'
                  : 'Admin-Issued Locum ID (LOC-XXXX) *'}
              </label>
              <input
                type={authTab === 'EMAIL' ? 'email' : 'text'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full text-sm font-mono font-bold border border-neutral-200 rounded-xl px-4 py-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0a3922] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Clinician OTP...' : 'Send 6-Digit Clinician OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] flex items-center justify-between gap-2 text-xs text-[#0f3e17]">
              <span>{statusMessage || `6-digit OTP sent for ${identifier}`}</span>
              {devOtpHint && (
                <span className="font-mono font-bold bg-white px-2.5 py-1 rounded shrink-0">
                  Sandbox OTP: {devOtpHint}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                6-Digit Verification Code *
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[0.6em] font-mono font-bold text-xl border border-[#0f3e17]/30 rounded-xl px-4 py-3 bg-white"
                required
              />
            </div>
            {verifiedId && (
              <div className="p-3.5 rounded-2xl bg-[#ebf0f8] border border-[#4865ff]/30 flex items-center gap-2 text-xs text-[#080331]">
                <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
                <span>Verified clinician session: <strong>{verifiedId}</strong></span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setOtpSent(false);
                  setErrorMessage(null);
                }}
                className="px-5 py-3.5 rounded-full border border-neutral-200 text-xs font-semibold text-[#747679]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#ff643b] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Authenticate & Enter Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-[#747679]">
            <ShieldCheck className="w-4 h-4 text-[#31ce01]" /> MDCN Vetting Required
          </span>
          <Link
            href="/doctor/onboarding/credentials"
            className="text-[#4865ff] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Submit MDCN Credentials →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
