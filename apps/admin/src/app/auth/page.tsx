'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminApiFetch, saveAdminSession } from '@/lib/api-client';

type AdminRbacRole = 'SUPER_ADMIN' | 'CLINICAL_VERIFIER' | 'OPS_DISPATCH' | 'SUPPORT_AGENT';

export default function AdminAuthPage() {
  const router = useRouter();
  const [staffEmail, setStaffEmail] = useState('ops@mangahealthcare.com');
  const [rbacRole, setRbacRole] = useState<AdminRbacRole>('SUPER_ADMIN');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [totp2fa, setTotp2fa] = useState('819204');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedId, setVerifiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const webBase = process.env.NEXT_PUBLIC_MARKETING_ORIGIN || 'http://localhost:3000';

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const trimmedEmail = staffEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.endsWith('@mangahealthcare.com')) {
      setErrorMessage('Whitelisted @mangahealthcare.com staff email is required.');
      return;
    }

    setIsSubmitting(true);
    const res = await adminApiFetch<{ message?: string; dev_otp?: string }>(
      '/api/v1/auth/otp/request',
      {
        method: 'POST',
        body: JSON.stringify({
          identifier: trimmedEmail,
          role: 'ADMIN',
          login_mode: 'ADMIN_EMAIL',
          rbac_role: rbacRole,
        }),
      },
    );
    setIsSubmitting(false);

    if (!res.ok) {
      setErrorMessage(res.errorMessage || 'Failed to dispatch staff OTP.');
      return;
    }

    setOtpSent(true);
    setDevOtpHint(res.data?.dev_otp || null);
    setOtpCode(res.data?.dev_otp || '');
    setStatusMessage(res.data?.message || `OTP sent for ${trimmedEmail} (${rbacRole}).`);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!/^\d{6}$/.test(otpCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit staff OTP code.');
      return;
    }
    if (!/^\d{6}$/.test(totp2fa.trim())) {
      setErrorMessage('Please enter a valid 6-digit 2FA authenticator code.');
      return;
    }

    setIsSubmitting(true);
    const res = await adminApiFetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({
        identifier: staffEmail.trim().toLowerCase(),
        otp: otpCode.trim(),
        role: 'ADMIN',
        login_mode: 'ADMIN_EMAIL',
        rbac_role: rbacRole,
        totp_code: totp2fa.trim(),
      }),
    });
    setIsSubmitting(false);

    if (!res.ok || !res.data?.access_token) {
      setErrorMessage(res.errorMessage || 'Staff authentication failed.');
      return;
    }

    saveAdminSession(res.data);
    setVerifiedId(res.data?.user?.public_id || 'ADM-001');
    setTimeout(() => router.push('/admin/live-ops'), 500);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 space-y-6">
      <div className="bg-[#ffede8] rounded-2xl p-4 border border-[#ff643b]/35 flex items-start gap-3 text-xs text-[#080331]">
        <AlertTriangle className="w-4 h-4 text-[#ff643b] shrink-0 mt-0.5" />
        <div>
          <strong>Authorized Personnel Only:</strong> Internal Operations Portal. All administrative sessions and patient record views are permanently recorded in the immutable NDPR <code className="font-mono bg-white px-1 rounded">audit_log</code>.
        </div>
      </div>

      <div className="text-center space-y-2">
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          admin.mangahealthcare.com/auth
        </span>
        <h1 className="font-serif text-3xl text-[#080331] font-normal">
          Admin / Ops Command Login
        </h1>
        <p className="text-xs text-[#747679]">
          Whitelisted <code className="font-mono">@mangahealthcare.com</code> staff email + 6-digit OTP + RBAC.
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
                Whitelisted Staff Email (@mangahealthcare.com) *
              </label>
              <input
                type="email"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                required
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                RBAC Permission Role *
              </label>
              <select
                value={rbacRole}
                onChange={(e) => setRbacRole(e.target.value as AdminRbacRole)}
                className="w-full text-sm font-mono border border-neutral-200 rounded-xl px-4 py-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Governance &amp; Ops)</option>
                <option value="CLINICAL_VERIFIER">CLINICAL_VERIFIER (MDCN Vetting &amp; Locum IDs)</option>
                <option value="OPS_DISPATCH">OPS_DISPATCH (Live Queue &amp; Surge Dispatch)</option>
                <option value="SUPPORT_AGENT">SUPPORT_AGENT (Bookings &amp; Dispute Resolution)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0a3922] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Staff OTP...' : 'Send 6-Digit Staff OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] flex items-center justify-between gap-2 text-xs text-[#0f3e17]">
              <span>{statusMessage || `OTP sent for ${staffEmail} (${rbacRole})`}</span>
              {devOtpHint && (
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded shrink-0">
                  Sandbox OTP: {devOtpHint}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                6-Digit Staff OTP *
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
                2FA Authenticator Code *
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

            {verifiedId && (
              <div className="p-3 rounded-2xl bg-[#ebf0f8] border border-[#4865ff]/30 flex items-center gap-2 text-xs text-[#080331]">
                <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
                <span>Command session authorized: <strong>{verifiedId}</strong></span>
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
                <span>{isSubmitting ? 'Authenticating...' : 'Authenticate & Enter Command Center'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#747679]">
          <span className="inline-flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#0f3e17]" /> RBAC: {rbacRole}
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#31ce01]" /> NDPR Logged
          </span>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#747679] space-x-3">
        <span>Not internal staff? Go to:</span>
        <a href={webBase} className="text-[#4865ff] hover:underline">Patients (mangahealthcare.com)</a>
        <span>•</span>
        <a href={`${webBase}/doctor`} className="text-[#4865ff] hover:underline">Doctors</a>
        <span>•</span>
        <a href={`${webBase}/partner`} className="text-[#4865ff] hover:underline">Partners</a>
      </div>
    </div>
  );
}
