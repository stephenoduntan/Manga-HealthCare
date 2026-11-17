'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Phone,
  Mail,
  Languages,
  Pill,
  HeartPulse,
  Info,
} from 'lucide-react';

export default function PatientOnboardingPage() {
  const router = useRouter();

  // Step 1: Authentication / Verification, Step 2: Clinical Intake, Step 3: NDPR Consent
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Auth fields
  const [identifier, setIdentifier] = useState('+234 803 123 4567');
  const [otpCode, setOtpCode] = useState('4829');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [patientId] = useState('PAT-48291');

  // Profile & Language
  const [fullName, setFullName] = useState('Amaka Adeleke');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Clinical Intake
  const [allergies, setAllergies] = useState<string[]>(['Penicillin']);
  const [otherAllergy, setOtherAllergy] = useState('');
  const [chronicConditions, setChronicConditions] = useState<string[]>(['Mild Asthma']);
  const [otherCondition, setOtherCondition] = useState('');
  const [currentMedications, setCurrentMedications] = useState('Salbutamol inhaler PRN');

  // Mandatory Consents
  const [telemedicineConsent, setTelemedicineConsent] = useState(false);
  const [ndprConsent, setNdprConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Common Allergies & Chronic Conditions
  const commonAllergies = ['Penicillin', 'Sulfa Drugs', 'NSAIDs / Aspirin', 'Latex', 'No Known Drug Allergies'];
  const commonConditions = ['Hypertension', 'Type 2 Diabetes', 'Mild Asthma', 'Sickle Cell Trait', 'None'];

  const toggleAllergy = (item: string) => {
    if (item === 'No Known Drug Allergies') {
      setAllergies(['No Known Drug Allergies']);
      return;
    }
    const filtered = allergies.filter((a) => a !== 'No Known Drug Allergies');
    setAllergies(
      filtered.includes(item) ? filtered.filter((a) => a !== item) : [...filtered, item]
    );
  };

  const toggleCondition = (item: string) => {
    if (item === 'None') {
      setChronicConditions(['None']);
      return;
    }
    const filtered = chronicConditions.filter((c) => c !== 'None');
    setChronicConditions(
      filtered.includes(item) ? filtered.filter((c) => c !== item) : [...filtered, item]
    );
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telemedicineConsent || !ndprConsent) {
      alert('You must provide mandatory NDPR and Telemedicine consents to proceed.');
      return;
    }
    router.push('/patient/book');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Top Breadcrumb / Progress */}
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
            Patient Portal Onboarding
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
            Clinical Intake & Consent Gate
          </h1>
          <p className="text-xs sm:text-sm text-[#747679] mt-1">
            Section 4.1 compliant verification, medical background logging, and NDPR data processing approval.
          </p>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-[#ffffff] p-1.5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
            activeStep === 1
              ? 'bg-[#0a3922] text-white shadow-xs'
              : 'text-[#747679] hover:bg-neutral-50'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
          <span>OTP Login</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
            activeStep === 2
              ? 'bg-[#0a3922] text-white shadow-xs'
              : 'text-[#747679] hover:bg-neutral-50'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
          <span>Medical Intake</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
            activeStep === 3
              ? 'bg-[#0a3922] text-white shadow-xs'
              : 'text-[#747679] hover:bg-neutral-50'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">3</span>
          <span>NDPR Consent</span>
        </button>
      </div>

      {/* Step 1: Authentication / OTP */}
      {activeStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="font-serif text-2xl text-[#080331] font-normal">Step 1: Patient Identity & Quick OTP</h2>
            <p className="text-xs text-[#747679] mt-1">
              Sign in or register with your mobile phone or email. Returning patients are assigned an instant Patient ID.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Amaka Adeleke"
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                Nigerian Mobile Number or Email
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="flex-1 text-sm border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
                />
                <button
                  type="button"
                  onClick={() => setIsOtpSent(true)}
                  className="bg-[#0f3e17] text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-wide hover:bg-[#0a3922] transition"
                >
                  {isOtpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              </div>
            </div>

            {isOtpSent && (
              <div className="p-4 rounded-2xl bg-[#e1f4df] border border-[#b1dbb8] space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-[#0f3e17]">
                  <span>Demo OTP sent to {identifier}</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded">Auto-filled: 4829</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                    4-Digit Verification OTP
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-48 text-center tracking-[0.5em] font-mono font-bold text-lg border border-[#0f3e17]/30 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#0f3e17]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                Preferred Consultation Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {['English', 'Yorùbá', 'Hausa', 'Igbo', 'Nigerian Pidgin'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-center border transition ${
                      selectedLanguage === lang
                        ? 'border-[#0a3922] bg-[#0a3922] text-white font-semibold'
                        : 'border-neutral-200 bg-white text-[#222326] hover:bg-neutral-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="bg-[#0a3922] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#0f3e17] transition shadow-xs"
            >
              <span>Continue to Medical Intake</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Clinical Intake Form */}
      {activeStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="font-serif text-2xl text-[#080331] font-normal">Step 2: Medical Background & Intake</h2>
            <p className="text-xs text-[#747679] mt-1">
              Physicians will review these details immediately before starting your consultation to avoid prescribing contraindications.
            </p>
          </div>

          <div className="space-y-6">
            {/* Allergies */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-4 h-4 text-[#ff643b]" />
                <label className="text-xs font-semibold uppercase tracking-wider text-[#080331]">
                  Known Drug & Substance Allergies
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonAllergies.map((item) => {
                  const isSelected = allergies.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAllergy(item)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-[#ffede8] text-[#ff643b] border-[#ff643b] font-semibold'
                          : 'bg-white text-[#222326] border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="w-4 h-4 text-[#4865ff]" />
                <label className="text-xs font-semibold uppercase tracking-wider text-[#080331]">
                  Existing Chronic Medical Conditions
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonConditions.map((item) => {
                  const isSelected = chronicConditions.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleCondition(item)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-[#ebf0f8] text-[#4865ff] border-[#4865ff] font-semibold'
                          : 'bg-white text-[#222326] border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1.5">
                Current Daily Medications & Supplements
              </label>
              <textarea
                rows={3}
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                placeholder="e.g. Amlodipine 5mg daily, Vitamin C 1000mg"
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
              />
              <p className="text-[11px] text-[#747679] mt-1">
                Include over-the-counter herbal teas or supplements you take regularly.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="text-xs font-semibold text-[#747679] hover:text-[#080331] px-4 py-2"
            >
              Back to Step 1
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="bg-[#0a3922] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#0f3e17] transition shadow-xs"
            >
              <span>Continue to NDPR Consent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Mandatory NDPR & Telemedicine Consent Gate */}
      {activeStep === 3 && (
        <form
          onSubmit={handleComplete}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6"
        >
          <div className="border-b border-neutral-100 pb-4">
            <div className="inline-flex items-center gap-2 bg-[#e1f4df] text-[#0f3e17] px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Section 4.1 Regulatory Compliance Gate</span>
            </div>
            <h2 className="font-serif text-2xl text-[#080331] font-normal">Step 3: Legal & Clinical Consent</h2>
            <p className="text-xs text-[#747679] mt-1">
              Federal law and Nigerian Data Protection Regulation require explicit affirmative consent before telemedicine intake.
            </p>
          </div>

          <div className="space-y-4">
            {/* Consent Box 1: Telemedicine Scope & Emergency Limitations */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                telemedicineConsent ? 'bg-[#e1f4df]/40 border-[#b1dbb8]' : 'bg-[#f8f3eb] border-neutral-200'
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={telemedicineConsent}
                  onChange={(e) => setTelemedicineConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#0a3922] focus:ring-[#0a3922]"
                />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#080331] block">
                    Mandatory Telemedicine & Clinical Scope Consent
                  </span>
                  <p className="text-xs text-[#747679] leading-relaxed">
                    I understand that Manga Healthcare provides remote clinical consultations and does NOT provide emergency resuscitation. I agree to undergo mandatory emergency triage before each consultation. In acute life-threatening situations, I agree to call 112 or visit an emergency hospital.
                  </p>
                </div>
              </label>
            </div>

            {/* Consent Box 2: NDPR Data Processing & Audit Logging */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                ndprConsent ? 'bg-[#e1f4df]/40 border-[#b1dbb8]' : 'bg-[#f8f3eb] border-neutral-200'
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ndprConsent}
                  onChange={(e) => setNdprConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#0a3922] focus:ring-[#0a3922]"
                />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#080331] block">
                    NDPR Data Processing & Health Record Privacy Consent
                  </span>
                  <p className="text-xs text-[#747679] leading-relaxed">
                    Under the Nigeria Data Protection Act (NDPA) and NDPR, I grant Manga Healthcare consent to process my health data, medical intake history, and consultation notes strictly for clinical diagnosis. I acknowledge every view of my record is permanently logged in the encrypted <code className="bg-white/80 px-1 py-0.5 rounded text-[11px]">audit_log</code>.
                  </p>
                </div>
              </label>
            </div>

            {/* Consent Box 3: Terms of Service */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                termsAccepted ? 'bg-[#e1f4df]/40 border-[#b1dbb8]' : 'bg-[#f8f3eb] border-neutral-200'
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#0a3922] focus:ring-[#0a3922]"
                />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#080331] block">
                    Terms of Service & Fee Authorization
                  </span>
                  <p className="text-xs text-[#747679] leading-relaxed">
                    I acknowledge consultation fees (₦10,000 standard GP, ₦15,000 therapy, ₦5,000 follow-up) will be processed via Paystack/Flutterwave prior to entry into doctor queues.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Patient Card Confirmation */}
          <div className="p-4 rounded-2xl bg-[#ebf0f8] border border-[#4865ff]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4865ff] text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="text-[11px] text-[#4865ff] uppercase font-semibold block">
                  Generated Patient Identity
                </span>
                <span className="font-mono text-sm font-bold text-[#080331]">{patientId}</span>
              </div>
            </div>
            <span className="text-xs text-[#747679]">Amaka Adeleke • +234 803 123 4567</span>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="text-xs font-semibold text-[#747679] hover:text-[#080331] px-4 py-2"
            >
              Back to Medical Intake
            </button>
            <button
              type="submit"
              disabled={!telemedicineConsent || !ndprConsent || !termsAccepted}
              className={`px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition shadow-sm ${
                telemedicineConsent && ndprConsent && termsAccepted
                  ? 'bg-[#ff643b] text-white hover:brightness-105 active:scale-95'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>Save & Proceed to Booking Flow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
