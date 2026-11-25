'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { authorizedApiFetch, saveAuthSession } from '@/lib/api-client';

export default function PatientAuthPage() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<'PHONE' | 'EMAIL' | 'PATIENT_ID'>('PHONE');
  const [identifier, setIdentifier] = useState('+2348031234567');
  const [fullName, setFullName] = useState('Amaka Adeleke');
  const [isNewUser, setIsNewUser] = useState(true);
  const [intent, setIntent] = useState<'instant' | 'schedule' | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedPatientId, setVerifiedPatientId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qIntent = params.get('intent');
    const qMode = params.get('mode');
    if (qIntent === 'instant' || qIntent === 'schedule') {
      setIntent(qIntent);
    }
    if (qMode === 'signup') {
      setIsNewUser(true);
    }
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setErrorMessage('Please enter your phone number, email, or Patient ID.');
      return;
    }
    if (isNewUser && loginMode !== 'PATIENT_ID' && !fullName.trim()) {
      setErrorMessage('Full Legal Name is required for first-time registration.');
      return;
    }
    if (loginMode === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (loginMode === 'PHONE' && trimmedId.replace(/[^\d]/g, '').length < 7) {
      setErrorMessage('Please enter a valid Nigerian mobile number.');
      return;
    }

    setIsSubmitting(true);
    const res = await authorizedApiFetch<{
      message?: string;
      dev_otp?: string;
      delivery?: { live_delivered?: boolean; provider?: string };
    }>('/api/v1/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({
        identifier: trimmedId,
        role: 'PATIENT',
        login_mode: loginMode,
      }),
    });
    setIsSubmitting(false);

    if (!res.ok) {
      setErrorMessage(res.errorMessage || 'Failed to request verification OTP.');
      return;
    }

    setOtpSent(true);
    setDevOtpHint(res.data?.dev_otp || null);
    setOtpCode(res.data?.dev_otp || '');
    setStatusMessage(
      res.data?.message || `6-digit OTP dispatched to ${trimmedId}.`,
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedOtp = otpCode.trim();
    if (!/^\d{6}$/.test(trimmedOtp)) {
      setErrorMessage('Please enter a valid 6-digit numeric OTP code.');
      return;
    }

    setIsSubmitting(true);
    const res = await authorizedApiFetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({
        identifier: identifier.trim(),
        otp: trimmedOtp,
        role: 'PATIENT',
        login_mode: loginMode,
        name: isNewUser ? fullName.trim() : undefined,
        is_new_user: isNewUser,
        intent: intent || undefined,
      }),
    });
    setIsSubmitting(false);

    if (!res.ok || !res.data?.access_token) {
      setErrorMessage(res.errorMessage || 'Invalid or expired OTP code.');
      return;
    }

    saveAuthSession(res.data);
    const assignedId = res.data?.user?.public_id || 'PAT-48291';
    setVerifiedPatientId(assignedId);
    setStatusMessage(`Authenticated successfully as ${assignedId}.`);

    setTimeout(() => {
      if (isNewUser && loginMode !== 'PATIENT_ID') {
        router.push('/patient/onboarding/consent');
      } else if (intent) {
        router.push(`/patient/triage?intent=${intent}`);
      } else {
        router.push('/patient/home');
      }
    }, 700);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-6">
      <div className="text-center space-y-2">
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          app.mangahealthcare.com/auth
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal">
          Patient Sign In &amp; Registration
        </h1>
        <p className="text-xs sm:text-sm text-[#747679]">
          Access your care dashboard, safety triage, and signed PDF prescriptions using 6-digit OTP.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_12px_28px_rgba(75,68,57,0.08)] space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-[#ffede8] border border-[#ff643b]/40 flex items-start gap-3 text-xs text-[#080331]">
            <AlertCircle className="w-4 h-4 text-[#ff643b] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* New vs Returning Toggle */}
        <div className="flex items-center justify-between bg-[#f8f3eb] p-3 rounded-2xl border border-neutral-200 text-xs">
          <span className="font-medium text-[#080331]">Account Type:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsNewUser(true);
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 rounded-full font-semibold transition ${
                isNewUser ? 'bg-[#0a3922] text-white' : 'bg-white text-[#747679]'
              }`}
            >
              First-Time Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setIsNewUser(false);
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 rounded-full font-semibold transition ${
                !isNewUser ? 'bg-[#0a3922] text-white' : 'bg-white text-[#747679]'
              }`}
            >
              Returning Patient
            </button>
          </div>
        </div>

        {/* Tabbed OTP Entry: Phone | Email | Patient ID */}
        <div className="grid grid-cols-3 gap-2 bg-[#f8f3eb] p-1 rounded-2xl border border-neutral-200">
          <button
            type="button"
            onClick={() => {
              setLoginMode('PHONE');
              setIdentifier('+2348031234567');
              setOtpSent(false);
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition ${
              loginMode === 'PHONE' ? 'bg-[#0a3922] text-white shadow-xs' : 'text-[#747679]'
            }`}
          >
            Phone Number
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('EMAIL');
              setIdentifier('amaka.adeleke@healthmail.ng');
              setOtpSent(false);
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition ${
              loginMode === 'EMAIL' ? 'bg-[#0a3922] text-white shadow-xs' : 'text-[#747679]'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('PATIENT_ID');
              setIdentifier('PAT-48291');
              setIsNewUser(false);
              setOtpSent(false);
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition ${
              loginMode === 'PATIENT_ID' ? 'bg-[#0a3922] text-white shadow-xs' : 'text-[#747679]'
            }`}
          >
            Patient ID
          </button>
        </div>

        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            {isNewUser && loginMode !== 'PATIENT_ID' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                {loginMode === 'PHONE'
                  ? 'Nigerian Mobile Number *'
                  : loginMode === 'EMAIL'
                  ? 'Email Address *'
                  : 'Assigned Patient ID (PAT-XXXX) *'}
              </label>
              <input
                type={loginMode === 'EMAIL' ? 'email' : 'text'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full text-sm font-medium border border-neutral-200 rounded-xl px-4 py-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ff643b] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition shadow-[0_8px_20px_rgba(255,100,59,0.25)] disabled:opacity-50"
            >
              {isSubmitting ? 'Sending 6-Digit OTP...' : 'Send 6-Digit Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="p-4 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] flex items-center justify-between gap-3 text-xs text-[#0f3e17]">
              <span>{statusMessage || `6-digit OTP dispatched to ${identifier}`}</span>
              {devOtpHint && (
                <span className="font-mono font-bold bg-white px-2.5 py-1 rounded shrink-0">
                  Sandbox OTP: {devOtpHint}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                Enter 6-Digit OTP *
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[0.6em] font-mono font-bold text-xl border border-[#0f3e17]/30 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#0f3e17]"
                required
              />
            </div>

            {verifiedPatientId && (
              <div className="p-4 rounded-2xl bg-[#ebf0f8] border border-[#4865ff]/30 flex items-center gap-3 text-xs text-[#080331]">
                <CheckCircle2 className="w-5 h-5 text-[#31ce01] shrink-0" />
                <div>
                  <strong className="block">Verified! Assigned Patient ID: {verifiedPatientId}</strong>
                  <span className="text-[#747679]">
                    {isNewUser
                      ? 'Proceeding to mandatory Legal & NDPR Consent Gate...'
                      : 'Opening Patient Care Home...'}
                  </span>
                </div>
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
                className="flex-1 bg-[#0a3922] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Verifying OTP...' : 'Verify & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-[#747679]">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#0f3e17]" /> AES-256 Encrypted Session
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#31ce01]" /> NDPR Compliant
          </span>
        </div>
      </div>

      <div className="text-center text-xs text-[#747679]">
        Are you a licensed clinician or partner?{' '}
        <Link href="/doctor/auth" className="text-[#4865ff] font-semibold hover:underline">
          Doctor Portal
        </Link>{' '}
        or{' '}
        <Link href="/partner/auth" className="text-[#4865ff] font-semibold hover:underline">
          Partner Portal
        </Link>
      </div>
    </div>
  );
}
