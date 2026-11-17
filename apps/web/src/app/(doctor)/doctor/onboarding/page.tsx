'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Upload,
  Calendar,
  CheckCircle2,
  FileCheck,
  Stethoscope,
  GraduationCap,
  Clock,
  ArrowRight,
  Languages,
} from 'lucide-react';

export default function DoctorOnboardingPage() {
  const router = useRouter();

  // Form State
  const [doctorName, setDoctorName] = useState('Dr. Chidi Okafor');
  const [email, setEmail] = useState('chidi.okafor@mangahealth.ng');
  const [mdcnNumber, setMdcnNumber] = useState('MDCN-78320');
  const [qualifications, setQualifications] = useState('MBBS (University of Ibadan), FWACS');
  const [yearsExperience, setYearsExperience] = useState('8');
  const [primarySpecialty, setPrimarySpecialty] = useState('General Practice & Emergency Medicine');
  const [bio, setBio] = useState(
    'Experienced general physician passionate about acute telemedicine triage, primary care interventions, and patient-centered chronic disease prevention.'
  );

  // Selected Languages
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'English',
    'Igbo',
    'Nigerian Pidgin',
  ]);

  // Availability schedule
  const [activeDays, setActiveDays] = useState<string[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ]);
  const [shiftHours, setShiftHours] = useState('09:00 AM - 05:00 PM (WAT)');

  const [licenseUploaded, setLicenseUploaded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('MDCN credentials submitted for verification! Temporary Locum ID LOC-9941 is active.');
      router.push('/doctor');
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          Provider Credentialing & Onboarding
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Doctor & Locum Clinical Profile Setup
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Every clinician must be registered with the Medical and Dental Council of Nigeria (MDCN). All credentials are confirmed with administrative audit checks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Professional Identity & MDCN Vetting */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#31ce01]" />
              <h2 className="font-serif text-2xl text-[#080331] font-normal">
                1. MDCN Practicing License Verification
              </h2>
            </div>
            <span className="text-[10px] bg-[#e1f4df] text-[#0f3e17] font-semibold px-2.5 py-1 rounded-full">
              Mandatory PRD Section 1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                Full Registered Medical Name
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                Official Clinical Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                MDCN Folio / License Number
              </label>
              <input
                type="text"
                value={mdcnNumber}
                onChange={(e) => setMdcnNumber(e.target.value)}
                placeholder="e.g. MDCN-78320"
                className="w-full text-sm font-mono border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                Primary Specialty
              </label>
              <select
                value={primarySpecialty}
                onChange={(e) => setPrimarySpecialty(e.target.value)}
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
              >
                <option value="General Practice & Emergency Medicine">General Practice & Emergency Medicine</option>
                <option value="Family Medicine">Family Medicine</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Clinical Psychology / Therapy">Clinical Psychology / Therapy</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>

          {/* License Certificate Document Upload Card */}
          <div className="p-4 rounded-2xl bg-[#f8f3eb] border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e1f4df] text-[#0f3e17] flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-[#31ce01]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#080331] block">
                  Annual Practicing License Certificate (PDF/Image)
                </span>
                <span className="text-[11px] text-[#747679]">
                  mdcn_practicing_license_2026.pdf (Verified Authentic)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLicenseUploaded(true)}
              className="bg-white text-[#0a3922] border border-[#0a3922]/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#fffefc] transition shadow-xs"
            >
              Replace Certificate
            </button>
          </div>
        </div>

        {/* Section 2: Medical Degree & Bio */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-100">
            <GraduationCap className="w-5 h-5 text-[#4865ff]" />
            <h2 className="font-serif text-2xl text-[#080331] font-normal">
              2. Medical Degrees & Background
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                Medical Degrees & Fellowships
              </label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="e.g. MBBS (Ibadan), FWACS"
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                Years of Post-Qualification Clinical Practice
              </label>
              <input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
              Clinician Public Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-2">
              Spoken Languages (for Patient Matching)
            </label>
            <div className="flex flex-wrap gap-2">
              {['English', 'Yorùbá', 'Hausa', 'Igbo', 'Nigerian Pidgin', 'French'].map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-[#0a3922] text-white border-[#0a3922] font-semibold'
                        : 'bg-white text-[#222326] border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Availability Calendar Builder */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-100">
            <Clock className="w-5 h-5 text-[#0a3922]" />
            <h2 className="font-serif text-2xl text-[#080331] font-normal">
              3. Telemedicine Availability Schedule
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-2">
              Active Shift Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                (day) => {
                  const isDayActive = activeDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition ${
                        isDayActive
                          ? 'bg-[#e1f4df] text-[#0f3e17] border-[#b1dbb8] font-semibold'
                          : 'bg-white text-[#747679] border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
              Active Consultation Shift Hours
            </label>
            <input
              type="text"
              value={shiftHours}
              onChange={(e) => setShiftHours(e.target.value)}
              className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
            />
            <p className="text-[11px] text-[#747679] mt-1">
              You will automatically appear in the instant triage lobby queue during these registered hours.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-between items-center pt-2">
          <Link
            href="/doctor"
            className="text-xs font-semibold text-[#747679] hover:text-[#080331] px-4 py-2"
          >
            Cancel & Return to Dashboard
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#0a3922] text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#0f3e17] transition shadow-xs"
          >
            <span>{isSubmitting ? 'Submitting...' : 'Save Profile & Enter Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
