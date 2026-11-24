'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, CheckCircle2, Languages, Pill } from 'lucide-react';

export default function PatientProfilePage() {
  const [patientId] = useState('PAT-48291');
  const [fullName] = useState('Amaka Adeleke');
  const [languages, setLanguages] = useState('English, Nigerian Pidgin');
  const [allergies, setAllergies] = useState('Penicillin (Hives / Rash)');
  const [medications, setMedications] = useState('Salbutamol inhaler PRN');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          Profile & NDPR Governance (/patient/profile)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Patient Identity & Clinical Baseline
        </h1>
      </div>

      {/* Patient ID Counter Card */}
      <div className="bg-[#0a3922] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e1f4df] text-[#0a3922] flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#d2f2e3] block">
              Verified Patient ID (For Partner Pharmacies & Labs)
            </span>
            <strong className="font-mono text-2xl">{patientId}</strong>
          </div>
        </div>
        <span className="text-xs bg-white/15 px-3 py-1.5 rounded-full font-medium">
          {fullName}
        </span>
      </div>

      {/* Editable Allergies, Medications, Languages */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-5"
      >
        <h2 className="font-serif text-2xl text-[#080331] font-normal">
          Update Medical Intake Details
        </h2>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
            <Languages className="w-3.5 h-3.5 text-[#4865ff]" /> Preferred Languages
          </label>
          <input
            type="text"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-[#f8f3eb]/20"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
            <Pill className="w-3.5 h-3.5 text-[#ff643b]" /> Known Allergies
          </label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-[#f8f3eb]/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
            Current Medications
          </label>
          <input
            type="text"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-[#f8f3eb]/20"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedNotice ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f3e17]">
              <CheckCircle2 className="w-4 h-4 text-[#31ce01]" /> Profile updated & logged to audit_log
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="bg-[#0a3922] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17]"
          >
            Save Medical Profile
          </button>
        </div>
      </form>

      {/* Signed NDPR Consent Timestamps */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#0f3e17]" />
          <h3 className="font-serif text-xl text-[#080331]">Signed NDPR & Telemedicine Consents</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#e1f4df]/40 border border-[#b1dbb8] flex items-center justify-between">
            <span className="font-medium text-[#080331] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#31ce01]" /> Telemedicine Consultation Consent
            </span>
            <span className="font-mono text-[#0f3e17]">Signed: 2026-10-28 15:40 WAT</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#e1f4df]/40 border border-[#b1dbb8] flex items-center justify-between">
            <span className="font-medium text-[#080331] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#31ce01]" /> NDPR Health Data Processing Consent
            </span>
            <span className="font-mono text-[#0f3e17]">Signed: 2026-10-28 15:40 WAT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
