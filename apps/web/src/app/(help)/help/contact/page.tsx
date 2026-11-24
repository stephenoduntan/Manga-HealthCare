'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { MarketingPageShell } from '../../../../components/ecosystem/EcosystemChrome';

export default function HelpContactPage() {
  const [roleTag, setRoleTag] = useState('Patient — Booking / Payment Dispute');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <MarketingPageShell activeSurface="help">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <div>
          <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3 py-1 rounded-full">
            Admin/Ops Support Escalation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
            Submit a Support Ticket
          </h1>
          <p className="text-xs sm:text-sm text-[#747679] mt-1">
            Role-tagged tickets route directly to Manga Clinical Governance and Operations staff.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-xs space-y-4"
        >
          {submitted && (
            <div className="p-4 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] text-xs text-[#0f3e17] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
              <span>Ticket dispatched to Admin/Ops Support Queue!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-[#080331] mb-1">
              Support Category
            </label>
            <select
              value={roleTag}
              onChange={(e) => setRoleTag(e.target.value)}
              className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-[#f8f3eb]/20"
            >
              <option>Patient — Booking / Payment Dispute</option>
              <option>Patient — Technical / Video Issue</option>
              <option>Doctor — MDCN Verification / Biweekly Ledger</option>
              <option>Partner — Patient ID Lookup Support</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#080331] mb-1">
              Your Email or Public ID (PAT-XXXX / DOC-XXXX)
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. PAT-48291 or name@example.com"
              className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-[#f8f3eb]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#080331] mb-1">
              Issue Summary
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Include your Booking ID or Paystack reference if applicable..."
              className="w-full text-sm border border-neutral-200 rounded-xl p-3 bg-[#f8f3eb]/20"
            />
          </div>

          <button
            type="submit"
            className="bg-[#0a3922] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#0f3e17]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit to Ops Queue</span>
          </button>
        </form>
      </div>
    </MarketingPageShell>
  );
}
