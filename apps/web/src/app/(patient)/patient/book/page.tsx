'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  EmergencyTriageChecklist,
  TalkToDoctorLobbyCard,
  PersistentEmergencyBar,
} from '@manga/design-system';
import {
  evaluateTriage,
  RedFlagCode,
  TriageStatus,
  RED_FLAG_SYMPTOMS,
} from '@manga/api-contract';
import {
  ShieldAlert,
  PhoneCall,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  ArrowRight,
  HelpCircle,
  Building2,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function PatientBookPage() {
  const router = useRouter();

  // Booking Stage:
  // 1 = Emergency Triage Checklist & Ambiguity Check
  // 1.5 = Ambulance Redirect Screen (if triage halted)
  // 2 = Consultation Mode (Talk to Doctor Now vs Scheduled Slot)
  // 3 = Paystack / Flutterwave Checkout Modal / Screen
  const [step, setStep] = useState<1 | 1.5 | 2 | 3>(1);

  // Patient Info
  const [patientId] = useState('PAT-48291');
  const [chiefComplaint, setChiefComplaint] = useState(
    'Fever, sore throat and mild headaches for 2 days'
  );
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);
  const [clarificationAnswer, setClarificationAnswer] = useState('');
  const [flaggedSymptoms, setFlaggedSymptoms] = useState<string[]>([]);

  // Specialty & Mode
  const [specialty, setSpecialty] = useState<'GENERAL' | 'THERAPY'>('GENERAL');
  const [consultationMode, setConsultationMode] = useState<'INSTANT' | 'SCHEDULED'>('INSTANT');
  const [selectedSlot, setSelectedSlot] = useState<string>('Tomorrow, 10:00 AM - 10:30 AM');
  const [isFollowUp, setIsFollowUp] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER' | 'USSD'>('CARD');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Pricing calculation
  const getFee = () => {
    if (isFollowUp) return 5000;
    if (specialty === 'THERAPY') return 15000;
    return 10000;
  };

  const formatNgn = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Evaluate Chief Complaint for Ambiguity
  const runEvaluation = (selectedCodes: string[]) => {
    const result = evaluateTriage({
      patient_id: patientId,
      selected_red_flags: selectedCodes as RedFlagCode[],
      chief_complaint: chiefComplaint,
      clarification_response: clarificationAnswer,
    });

    if (result.status === 'HALT_AND_REDIRECT') {
      setFlaggedSymptoms(result.symptoms_flagged);
      setStep(1.5);
    } else if (result.status === 'ASK_CLARIFYING_QUESTION') {
      setClarificationQuestion(result.clarifying_question || 'Please provide more details on your pain.');
    } else {
      setClarificationQuestion(null);
      setStep(2);
    }
  };

  const handleTriagePass = () => {
    // When 0 checkboxes selected, evaluate complaint text
    runEvaluation([]);
  };

  const handleTriageHalt = (flagged: string[]) => {
    setFlaggedSymptoms(flagged);
    setStep(1.5);
  };

  const handleClarificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runEvaluation([]);
  };

  // Switch specialty & enforce mandatory scheduling rule
  const handleSelectSpecialty = (type: 'GENERAL' | 'THERAPY') => {
    setSpecialty(type);
    if (type === 'THERAPY') {
      // PRD RULE: Therapy requires mandatory calendar slot booking!
      setConsultationMode('SCHEDULED');
    }
  };

  const handlePay = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        router.push('/patient/consultation/enc-live-01');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
            Clinical Triage & Scheduling
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
            {step === 1.5
              ? 'Emergency Clinical Redirect'
              : step === 1
              ? 'Step 1: Emergency Red-Flag Triage'
              : step === 2
              ? 'Step 2: Choose Consultation Mode'
              : 'Step 3: Paystack Secure Checkout'}
          </h1>
        </div>

        {step !== 1.5 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#747679] bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-xs">
            <span className={step === 1 ? 'text-[#ff643b]' : 'text-[#31ce01]'}>1. Triage</span>
            <span>→</span>
            <span className={step === 2 ? 'text-[#ff643b]' : step > 2 ? 'text-[#31ce01]' : ''}>
              2. Slot
            </span>
            <span>→</span>
            <span className={step === 3 ? 'text-[#ff643b]' : ''}>3. Pay</span>
          </div>
        )}
      </div>

      {/* STEP 1: Interactive 8-Symptom Emergency Triage Checklist */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Reason for visit input */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331]">
              Primary Reason for Consultation / Chief Complaint
            </label>
            <textarea
              rows={2}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Mild throat pain and fatigue since yesterday"
              className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
            />
            <p className="text-[11px] text-[#747679]">
              Be specific about duration, location, and severity so the clinical evaluator can rule out emergencies.
            </p>
          </div>

          {/* Ambiguity Prompt if triggered */}
          {clarificationQuestion && (
            <form
              onSubmit={handleClarificationSubmit}
              className="bg-[#ebf0f8] rounded-3xl p-6 sm:p-8 border border-[#4865ff]/30 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4865ff] uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Single Clarifying Question Prompt (Clinical Safety)</span>
              </div>
              <p className="text-sm font-medium text-[#080331]">{clarificationQuestion}</p>
              <input
                type="text"
                value={clarificationAnswer}
                onChange={(e) => setClarificationAnswer(e.target.value)}
                placeholder="Type your response here (e.g. pain is in lower throat, no chest tightness, started this morning)"
                className="w-full text-sm border border-neutral-300 rounded-xl p-3 bg-white focus:outline-none focus:border-[#4865ff]"
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#4865ff] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase hover:brightness-105 transition"
                >
                  Submit Clarification
                </button>
              </div>
            </form>
          )}

          {/* Interactive Checklist Component from @manga/design-system */}
          <EmergencyTriageChecklist
            onTriagePass={handleTriagePass}
            onTriageHalt={handleTriageHalt}
          />
        </div>
      )}

      {/* STEP 1.5: Calm Ambulance Redirect Screen */}
      {step === 1.5 && (
        <div className="bg-[#ffede8] rounded-[32px] p-8 md:p-12 border border-[#ff643b]/30 shadow-[0_16px_36px_rgba(255,100,59,0.15)] space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ff643b] text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="eyebrow-label text-[#ff643b] bg-white px-3 py-1 rounded-full">
                Clinical Safety Rule Enforced
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
                Booking Halted: Immediate Emergency In-Person Care Required
              </h2>
              <p className="text-sm text-[#222326] mt-2 max-w-2xl leading-relaxed">
                You reported symptoms indicating a potential acute medical crisis. Manga Healthcare is a remote consultation platform and cannot provide emergency stabilization or surgical resuscitation.
              </p>
            </div>
          </div>

          {/* Flagged Symptoms Display */}
          <div className="bg-white/80 p-5 rounded-2xl border border-[#ff643b]/20 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#ff643b]">
              Red Flags Detected:
            </span>
            <div className="flex flex-wrap gap-2">
              {flaggedSymptoms.length > 0 ? (
                flaggedSymptoms.map((code) => {
                  const item = RED_FLAG_SYMPTOMS.find((s) => s.code === code);
                  return (
                    <span
                      key={code}
                      className="bg-[#ffede8] text-[#ff643b] font-medium text-xs px-3 py-1.5 rounded-full border border-[#ff643b]/30"
                    >
                      {item ? item.label : code}
                    </span>
                  );
                })
              ) : (
                <span className="bg-[#ffede8] text-[#ff643b] font-medium text-xs px-3 py-1 rounded-full">
                  Acute pain requiring immediate emergency triage
                </span>
              )}
            </div>
            <p className="text-xs text-[#747679] mt-2">
              Logged to <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">emergency_redirect_log</code> with Patient ID <strong>{patientId}</strong>.
            </p>
          </div>

          {/* Tap-to-Call Emergency Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="tel:112"
              className="bg-[#ff643b] text-white p-5 rounded-2xl flex items-center justify-between shadow-[0_8px_20px_rgba(255,100,59,0.3)] hover:brightness-105 transition active:scale-95 group"
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-white/80 block">
                  National Emergency Services
                </span>
                <span className="text-2xl font-bold font-mono">Dial 112 (Toll-Free)</span>
              </div>
              <PhoneCall className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </a>

            <a
              href="tel:767"
              className="bg-[#0a3922] text-white p-5 rounded-2xl flex items-center justify-between shadow-sm hover:bg-[#0f3e17] transition active:scale-95 group"
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#d2f2e3] block">
                  Lagos Emergency Toll-Free
                </span>
                <span className="text-2xl font-bold font-mono">Dial 767</span>
              </div>
              <PhoneCall className="w-8 h-8 text-[#31ce01] group-hover:rotate-12 transition-transform" />
            </a>
          </div>

          {/* Reset / Return to Safe Triage */}
          <div className="pt-4 border-t border-[#ff643b]/20 flex items-center justify-between text-xs">
            <span className="text-[#747679]">Made a mistake in symptoms selection?</span>
            <button
              type="button"
              onClick={() => {
                setFlaggedSymptoms([]);
                setStep(1);
              }}
              className="font-semibold text-[#080331] hover:underline bg-white px-4 py-2 rounded-full border border-neutral-300"
            >
              Re-take Triage Screening
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Choose Consultation Mode & Specialty */}
      {step === 2 && (
        <div className="space-y-8">
          {/* Triage Passed Cleared Card */}
          <div className="bg-[#e1f4df] p-4 rounded-2xl border border-[#b1dbb8] flex items-center justify-between text-xs text-[#0f3e17]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#31ce01]" />
              <span>
                <strong>Triage Cleared:</strong> 0 Red-Flag symptoms detected. You are safe for remote consultation.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-[#0a3922] underline"
            >
              Edit Triage
            </button>
          </div>

          {/* Specialty Picker */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-4">
            <h2 className="font-serif text-2xl text-[#080331] font-normal">Choose Clinical Specialty</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSelectSpecialty('GENERAL')}
                className={`p-5 rounded-2xl text-left border transition ${
                  specialty === 'GENERAL'
                    ? 'border-[#0a3922] bg-[#e1f4df]/30 ring-2 ring-[#0a3922]/20'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0f3e17]">
                    General Physician
                  </span>
                  <span className="font-mono text-xs font-bold text-[#080331]">₦10,000</span>
                </div>
                <h3 className="font-serif text-lg text-[#080331]">General Medical Consultation</h3>
                <p className="text-xs text-[#747679] mt-1">
                  Cough, malaria, infections, skin rashes, fever, medication refills.
                </p>
                <span className="inline-block mt-3 text-[10px] uppercase font-semibold text-[#31ce01] bg-white px-2 py-0.5 rounded-full border border-neutral-200">
                  Instant Lobby Queue Available
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSpecialty('THERAPY')}
                className={`p-5 rounded-2xl text-left border transition ${
                  specialty === 'THERAPY'
                    ? 'border-[#0a3922] bg-[#ebf0f8]/50 ring-2 ring-[#0a3922]/20'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4865ff]">
                    Mental Health & Therapy
                  </span>
                  <span className="font-mono text-xs font-bold text-[#080331]">₦15,000</span>
                </div>
                <h3 className="font-serif text-lg text-[#080331]">Clinical Psychologist / Counselor</h3>
                <p className="text-xs text-[#747679] mt-1">
                  Anxiety, depression, grief counseling, stress management.
                </p>
                <span className="inline-block mt-3 text-[10px] uppercase font-semibold text-[#4865ff] bg-white px-2 py-0.5 rounded-full border border-neutral-200">
                  Mandatory Calendar Slot Booking
                </span>
              </button>
            </div>
          </div>

          {/* Mode Selector: Talk to Doctor Now vs Scheduled Slot */}
          {specialty === 'GENERAL' ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-neutral-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setConsultationMode('INSTANT')}
                  className={`flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    consultationMode === 'INSTANT'
                      ? 'bg-[#0a3922] text-white shadow-xs'
                      : 'text-[#747679] hover:bg-neutral-50'
                  }`}
                >
                  ⚡ Talk to Doctor Now (Instant Queue)
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationMode('SCHEDULED')}
                  className={`flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    consultationMode === 'SCHEDULED'
                      ? 'bg-[#0a3922] text-white shadow-xs'
                      : 'text-[#747679] hover:bg-neutral-50'
                  }`}
                >
                  📅 Schedule a Future Slot
                </button>
              </div>

              {consultationMode === 'INSTANT' ? (
                <TalkToDoctorLobbyCard
                  queuePosition={2}
                  estimatedWaitMinutes={4}
                  doctorsOnline={7}
                  onJoinQueue={() => setStep(3)}
                  onScheduleSlot={() => setConsultationMode('SCHEDULED')}
                />
              ) : (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] space-y-4">
                  <h3 className="font-serif text-xl text-[#080331]">Select Doctor Slot</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      'Today, 3:30 PM - 4:00 PM',
                      'Today, 5:00 PM - 5:30 PM',
                      'Tomorrow, 10:00 AM - 10:30 AM',
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3.5 rounded-xl text-xs font-medium border text-left transition ${
                          selectedSlot === slot
                            ? 'border-[#0a3922] bg-[#e1f4df] text-[#0a3922] font-semibold'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-[#0a3922] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition"
                    >
                      Confirm Slot & Proceed to Pay
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Therapy: Mandatory Scheduled Slot */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4865ff] uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Therapy Specialty Rule: 45-Minute Protected Slot</span>
              </div>
              <h3 className="font-serif text-xl text-[#080331]">Select Dedicated Therapy Appointment</h3>
              <p className="text-xs text-[#747679]">
                To ensure uninterrupted mental health consultation, therapy sessions are scheduled in dedicated slots rather than instant queue.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  'Tomorrow, 11:00 AM (Dr. Folake)',
                  'Tomorrow, 2:00 PM (Dr. Folake)',
                  'Wednesday, 4:00 PM (Dr. Emeka)',
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-xl text-xs font-medium border text-left transition ${
                      selectedSlot === slot
                        ? 'border-[#4865ff] bg-[#ebf0f8] text-[#4865ff] font-semibold'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#4865ff] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition"
                >
                  Confirm Therapy Slot & Pay
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Paystack / Flutterwave Checkout Modal / Screen */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#efeeeb] shadow-[0_16px_36px_rgba(75,68,57,0.08)] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
            <div>
              <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3 py-1 rounded-full">
                Step 3: Secure Settlement
              </span>
              <h2 className="font-serif text-3xl text-[#080331] font-normal mt-2">
                Paystack / Flutterwave Payment Gateway
              </h2>
              <p className="text-xs text-[#747679] mt-1">
                Encrypted with 256-bit TLS. Funds held in escrow until consultation commences.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#747679] block">Total Amount Due</span>
              <span className="text-3xl font-serif text-[#080331] font-normal">
                ₦{formatNgn(getFee())}
              </span>
            </div>
          </div>

          {/* Follow-up discount toggle */}
          <div className="bg-[#f8f3eb] p-4 rounded-2xl border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#080331] block">
                7-Day Follow-Up Consultation?
              </span>
              <p className="text-[11px] text-[#747679]">
                If this encounter is a review for the same diagnosis within 7 days, discounted rate is ₦5,000.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFollowUp}
                onChange={(e) => setIsFollowUp(e.target.checked)}
                className="w-4 h-4 text-[#0a3922] rounded focus:ring-[#0a3922]"
              />
              <span className="text-xs font-semibold text-[#0a3922]">Apply Follow-up</span>
            </label>
          </div>

          {/* Payment Method Switcher */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331]">
              Select Payment Channel
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-2xl border text-center transition ${
                  paymentMethod === 'CARD'
                    ? 'border-[#0a3922] bg-[#e1f4df]/40 font-semibold'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#080331]" />
                <span className="text-xs block">Debit / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('TRANSFER')}
                className={`p-4 rounded-2xl border text-center transition ${
                  paymentMethod === 'TRANSFER'
                    ? 'border-[#0a3922] bg-[#e1f4df]/40 font-semibold'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-1 text-[#080331]" />
                <span className="text-xs block">Bank Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('USSD')}
                className={`p-4 rounded-2xl border text-center transition ${
                  paymentMethod === 'USSD'
                    ? 'border-[#0a3922] bg-[#e1f4df]/40 font-semibold'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <PhoneCall className="w-5 h-5 mx-auto mb-1 text-[#080331]" />
                <span className="text-xs block">USSD (*737#)</span>
              </button>
            </div>
          </div>

          {/* Card Mock inputs */}
          {paymentMethod === 'CARD' && (
            <div className="space-y-3 p-4 bg-[#f8f3eb]/40 rounded-2xl border border-neutral-200">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#747679] mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  readOnly
                  value="5399 8320 **** 4829 (Mastercard)"
                  className="w-full text-xs font-mono border border-neutral-300 rounded-xl p-2.5 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#747679] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="08 / 28"
                    className="w-full text-xs font-mono border border-neutral-300 rounded-xl p-2.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#747679] mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    readOnly
                    value="***"
                    className="w-full text-xs font-mono border border-neutral-300 rounded-xl p-2.5 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'TRANSFER' && (
            <div className="p-4 bg-[#ebf0f8] rounded-2xl border border-[#4865ff]/20 text-xs space-y-1">
              <span className="font-semibold text-[#4865ff]">Paystack Dedicated Dynamic Account</span>
              <p className="text-[#080331]">Bank: <strong>Wema Bank / Paystack Titan</strong></p>
              <p className="text-[#080331]">Account Number: <strong className="font-mono text-sm">9920194829</strong></p>
              <p className="text-[#747679]">Expires in 30 minutes. Auto-confirms upon transfer.</p>
            </div>
          )}

          {paymentMethod === 'USSD' && (
            <div className="p-4 bg-[#e1f4df] rounded-2xl border border-[#b1dbb8] text-xs space-y-1">
              <span className="font-semibold text-[#0f3e17]">USSD Quick Dial</span>
              <p className="font-mono text-sm font-bold text-[#0a3922]">*737*50*10000*8492#</p>
              <p className="text-[#0f3e17]">Dial on your registered GTBank, Zenith (*966#), or Access (*901#) phone line.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-[#747679] hover:text-[#080331]"
            >
              Back to Slot Selection
            </button>

            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessingPayment || paymentSuccess}
              className={`px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition shadow-sm ${
                paymentSuccess
                  ? 'bg-[#31ce01] text-white'
                  : 'bg-[#ff643b] text-white hover:brightness-105 active:scale-95'
              }`}
            >
              {isProcessingPayment ? (
                <span>Authorizing Paystack Gateway...</span>
              ) : paymentSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment Authorized! Launching Lobby...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize ₦{formatNgn(getFee())} & Enter Room</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
