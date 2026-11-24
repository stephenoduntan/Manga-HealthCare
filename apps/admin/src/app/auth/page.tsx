'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminAuthPage() {
  const router = useRouter();
  const [staffEmail, setStaffEmail] = useState('ops@mangahealthcare.com');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [totp2fa, setTotp2fa] = useState('819204');

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmail.trim()) return;
    setOtpSent(true);
    setOtpCode('482910');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 6) return;
    router.push('/admin/live-ops');
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          admin.mangahealthcare.com/auth • Internal Only
        </span>
        <h1 className="font-serif text-3xl text-[#080331] font-normal">
          Admin / Ops Command Login
        </h1>
        <p className="text-xs text-[#747679]">
          IP-restricted & RBAC-enforced access for Clinical Governance and Operations staff.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_12px_28px_rgba(75,68,57,0.08)] space-y-5">
        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                Verified Manga Staff Email
              </label>
              <input
                type="email"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                required
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0a3922] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition"
            >
              Send Staff OTP & Request 2FA
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] flex items-center justify-between text-xs text-[#0f3e17]">
              <span>OTP sent to <strong>{staffEmail}</strong></span>
              <span className="font-mono font-bold bg-white px-2 py-0.5 rounded">482910</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                6-Digit Email OTP
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                Authenticator 2FA Token
              </label>
              <input
                type="text"
                maxLength={6}
                value={totp2fa}
                onChange={(e) => setTotp2fa(e.target.value)}
                className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg border border-neutral-300 rounded-xl px-4 py-2.5"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff643b] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition flex items-center justify-center gap-2"
            >
              <span>Enter Operations Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#747679]">
          <span className="inline-flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#0f3e17]" /> RBAC Protected
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#31ce01]" /> Audit Logged
          </span>
        </div>
      </div>
    </div>
  );
}
