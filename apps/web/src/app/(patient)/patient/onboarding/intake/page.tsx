'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Languages, Pill, HeartPulse, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PatientIntakePage() {
  const router = useRouter();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Nigerian Pidgin']);
  const [allergies, setAllergies] = useState<string[]>(['Penicillin']);
  const [conditions, setConditions] = useState<string[]>(['Mild Asthma']);
  const [currentMedications, setCurrentMedications] = useState('Salbutamol inhaler PRN');

  const languageOptions = ['English', 'Nigerian Pidgin', 'Yorùbá', 'Igbo', 'Hausa'];
  const allergyOptions = ['Penicillin', 'Sulfa Drugs', 'NSAIDs / Aspirin', 'Latex', 'No Known Allergies'];
  const conditionOptions = ['Hypertension', 'Type 2 Diabetes', 'Mild Asthma', 'Sickle Cell Trait', 'None'];

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string, exclusive?: string) => {
    if (exclusive && item === exclusive) {
      setList([exclusive]);
      return;
    }
    const cleaned = exclusive ? list.filter((i) => i !== exclusive) : list;
    setList(cleaned.includes(item) ? cleaned.filter((i) => i !== item) : [...cleaned, item]);
  };

  const handleSaveIntake = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/patient/home');
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 space-y-6">
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          Onboarding Step 2 of 2 • Medical Baseline
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Medical Intake Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Automatically surfaced to your treating physician during consultations so critical allergies are never missed.
        </p>
      </div>

      <form
        onSubmit={handleSaveIntake}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6"
      >
        {/* Preferred Consultation Languages */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#080331]">
            <Languages className="w-4 h-4 text-[#4865ff]" />
            <span>Preferred Consultation Language(s)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => {
              const active = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleItem(selectedLanguages, setSelectedLanguages, lang)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-[#0a3922] text-white border-[#0a3922]'
                      : 'bg-[#f8f3eb] text-[#222326] border-neutral-200'
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#080331]">
            <Pill className="w-4 h-4 text-[#ff643b]" />
            <span>Known Drug or Food Allergies</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {allergyOptions.map((item) => {
              const active = allergies.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem(allergies, setAllergies, item, 'No Known Allergies')}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-[#ffede8] text-[#ff643b] border-[#ff643b] font-semibold'
                      : 'bg-white text-[#222326] border-neutral-200'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Existing Conditions */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#080331]">
            <HeartPulse className="w-4 h-4 text-[#0f3e17]" />
            <span>Existing Medical Conditions</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {conditionOptions.map((item) => {
              const active = conditions.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem(conditions, setConditions, item, 'None')}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-[#e1f4df] text-[#0f3e17] border-[#0f3e17] font-semibold'
                      : 'bg-white text-[#222326] border-neutral-200'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Medications */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331]">
            Current Medications & Supplements
          </label>
          <textarea
            rows={2}
            value={currentMedications}
            onChange={(e) => setCurrentMedications(e.target.value)}
            placeholder="List active prescriptions, OTC drugs, or herbal supplements..."
            className="w-full text-xs sm:text-sm border border-neutral-200 rounded-xl p-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Link href="/patient/onboarding/consent" className="text-xs font-semibold text-[#747679]">
            ← Back to Consents
          </Link>
          <button
            type="submit"
            className="bg-[#0a3922] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
            <span>Save Intake & Open Patient Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
