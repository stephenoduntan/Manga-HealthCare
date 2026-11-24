'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Stethoscope } from 'lucide-react';

export default function DoctorAuthPage() {
  const router = useRouter();
  const [authTab, setAuthTab] = useState<'EMAIL' | 'DOCTOR_ID' | 'LOCUM_ID'>('LOCUM_ID');
  const [identifier, setIdentifier] = useState('LOC-9941');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setOtpSent(true);
    setOtpCode('482910');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 6) return;
    router.push('/doctor/dashboard');
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-6">
      <div className="text-center space-y-2">
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          doctor.mangahealthcare.com/auth
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal">
          Clinician & Locum Portal Sign In
        </h1>
        <p className="text-xs sm:text-sm text-[#747679]">
          MDCN-verified Doctors, Therapists, and Admin-vetted Locum Physicians.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_12px_28px_rgba(75,68,57,0.08)] space-y-6">
        <div className="grid grid-cols-3 gap-2 bg-[#f8f3eb] p-1 rounded-2xl border border-neutral-200">
          <button
            type="button"
            onClick={() => {
              setAuthTab('EMAIL');
              setIdentifier('chidi.okafor@mangahealth.ng');
              setOtpSent(false);
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
                  ? 'Registered Clinical Email'
                  : authTab === 'DOCTOR_ID'
                  ? 'Doctor ID (DOC-XXXX)'
                  : 'Admin-Issued Locum ID (LOC-XXXX)'}
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
              className="w-full bg-[#0a3922] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition"
            >
              Send 6-Digit Clinician OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] flex items-center justify-between text-xs text-[#0f3e17]">
              <span>6-digit OTP sent for <strong>{identifier}</strong></span>
              <span className="font-mono font-bold bg-white px-2.5 py-1 rounded">482910</span>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                6-Digit Verification Code
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
            <button
              type="submit"
              className="w-full bg-[#ff643b] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition flex items-center justify-center gap-2"
            >
              <span>Authenticate & Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
