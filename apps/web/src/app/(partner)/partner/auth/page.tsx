'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PartnerAuthPage() {
  const router = useRouter();
  const [partnerIdentifier, setPartnerIdentifier] = useState('PRT-MEDPLUS-VI-01');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerIdentifier.trim()) return;
    setOtpSent(true);
    setOtpCode('482910');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 6) return;
    router.push('/partner/lookup');
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
            Pharmacy & Lab Partner Login
          </h1>
          <p className="text-xs text-[#747679]">
            Sign in with your verified Partner Organization ID or official email + 6-digit OTP.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_12px_28px_rgba(75,68,57,0.08)] space-y-5">
          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                  Partner Organization ID or Email
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
                className="w-full bg-[#0a3922] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition"
              >
                Send 6-Digit Partner OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] flex items-center justify-between text-xs text-[#0f3e17]">
                <span>OTP sent to <strong>{partnerIdentifier}</strong></span>
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded">482910</span>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                  6-Digit Verification OTP
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
              <button
                type="submit"
                className="w-full bg-[#ff643b] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition flex items-center justify-center gap-2"
              >
                <span>Open Order Lookup Counter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
