'use client';

import React, { useState } from 'react';

export interface EmergencySymptomItem {
  code: string;
  label: string;
  description: string;
}

export const PRD_RED_FLAGS: EmergencySymptomItem[] = [
  {
    code: 'CHEST_PAIN_PRESSURE',
    label: 'Chest pain / pressure',
    description: 'Any heavy pressure, tightness, squeezing, or pain radiating to arm or jaw.',
  },
  {
    code: 'DIFFICULTY_BREATHING',
    label: 'Difficulty breathing',
    description: 'Severe shortness of breath, gasping, choking, or inability to speak full sentences.',
  },
  {
    code: 'SEVERE_UNCONTROLLED_BLEEDING',
    label: 'Severe / uncontrolled bleeding',
    description: 'Continuous heavy bleeding that does not stop with direct pressure.',
  },
  {
    code: 'STROKE_SIGNS',
    label: 'Sudden weakness, facial drooping, slurred speech',
    description: 'Acute facial droop, arm or leg weakness on one side, or speech difficulty.',
  },
  {
    code: 'LOSS_OF_CONSCIOUSNESS_SEIZURE',
    label: 'Loss of consciousness or seizure',
    description: 'Fainting, collapse, unresponsive episode, active convulsion, or seizure.',
  },
  {
    code: 'SEVERE_ALLERGIC_REACTION',
    label: 'Severe allergic reaction',
    description: 'Swelling of throat, lips, tongue, acute wheezing, or difficulty swallowing.',
  },
  {
    code: 'SUICIDAL_IDEATION_SELF_HARM',
    label: 'Suicidal ideation or intent to self-harm',
    description: 'Thoughts of ending life, immediate intent to self-harm, or severe crisis.',
  },
  {
    code: 'PREGNANCY_ABDOMINAL_PAIN_BLEEDING',
    label: 'Severe abdominal pain or bleeding in pregnancy',
    description: 'Any acute sharp abdominal pain or vaginal bleeding during pregnancy.',
  },
];

export interface EmergencyTriageChecklistProps {
  onTriagePass?: () => void;
  onTriageHalt?: (flaggedSymptoms: string[]) => void;
}

export function EmergencyTriageChecklist({
  onTriagePass,
  onTriageHalt,
}: EmergencyTriageChecklistProps) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [isRedirectOpen, setIsRedirectOpen] = useState(false);

  const toggleSymptom = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleEvaluate = () => {
    if (selectedCodes.length > 0) {
      setIsRedirectOpen(true);
      onTriageHalt?.(selectedCodes);
    } else {
      setIsRedirectOpen(false);
      onTriagePass?.();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Main Checklist Card on Paper White */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_16px_rgba(75,68,57,0.08)] border border-[#efeeeb]">
        <div className="mb-6">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0f3e17] bg-[#e1f4df] px-2.5 py-1 rounded-full inline-block border border-[#b1dbb8]">
            Clinical Safety Protocol — PRD Section 6.0
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#080331] my-3 tracking-[-0.025em]">
            Pre-Consultation Emergency Screening
          </h2>
          <p className="text-sm text-[#747679] leading-relaxed">
            To ensure patient safety, telemedicine consultations cannot proceed if acute emergency signs are present. Please check any symptoms you or the patient are currently experiencing:
          </p>
        </div>

        {/* 8 Red-Flag Checkable Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {PRD_RED_FLAGS.map((symptom, idx) => {
            const isSelected = selectedCodes.includes(symptom.code);
            return (
              <button
                key={symptom.code}
                type="button"
                onClick={() => toggleSymptom(symptom.code)}
                className={`text-left p-3.5 sm:p-4 rounded-xl flex items-start gap-3 transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-[#ff643b] bg-[#ffede8]'
                    : 'border-[#efeeeb] bg-white hover:border-neutral-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border text-xs font-bold transition-colors ${
                    isSelected
                      ? 'border-[#ff643b] bg-[#ff643b] text-white'
                      : 'border-[#747679] bg-white'
                  }`}
                >
                  {isSelected && <span>✓</span>}
                </div>
                <div>
                  <div
                    className={`text-sm font-medium ${
                      isSelected ? 'text-[#ff643b]' : 'text-[#080331]'
                    }`}
                  >
                    <span className="opacity-60 mr-1.5 text-xs">
                      0{idx + 1}.
                    </span>
                    {symptom.label}
                  </div>
                  <div className="text-xs text-[#747679] mt-1 leading-normal">
                    {symptom.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Triage Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#efeeeb]">
          <span className="text-xs sm:text-sm text-[#747679]">
            {selectedCodes.length > 0 ? (
              <strong className="text-[#ff643b]">
                {selectedCodes.length} red-flag symptom{selectedCodes.length > 1 ? 's' : ''} selected
              </strong>
            ) : (
              'No red flags selected. You are safe to continue.'
            )}
          </span>

          <button
            type="button"
            onClick={handleEvaluate}
            className={`px-7 py-3 rounded-full text-sm font-medium text-white transition-colors shadow-[0_8px_20px_rgba(75,68,57,0.1)] ${
              selectedCodes.length > 0
                ? 'bg-[#ff643b] hover:bg-[#e0532c]'
                : 'bg-[#0f3e17] hover:bg-[#0a3922]'
            }`}
          >
            {selectedCodes.length > 0
              ? 'Evaluate Symptoms (Emergency Halt)'
              : 'I Confirm No Red Flags — Proceed'}
          </button>
        </div>
      </div>

      {/* Non-Dismissive Emergency Ambulance Redirect Modal / Banner */}
      {isRedirectOpen && (
        <div className="bg-[#ffede8] rounded-2xl p-6 sm:p-7 border border-[#ff643b]/40 shadow-[0_12px_24px_rgba(75,68,57,0.1)]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-[#ff643b] text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                EMERGENCY TRIAGE HALT
              </span>
              <span className="text-xs sm:text-sm text-[#ff643b] font-semibold">
                Immediate In-Person Care Required
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsRedirectOpen(false)}
              className="text-xs text-[#747679] hover:text-[#222326] underline cursor-pointer"
            >
              Dismiss Banner
            </button>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#080331] mb-2.5 tracking-[-0.025em]">
            Your Safety is Paramount — Please Seek Emergency Services
          </h3>

          <p className="text-xs sm:text-sm text-[#080331] leading-relaxed mb-5 max-w-2xl">
            You reported acute symptoms that require immediate clinical stabilization at a hospital.
            Manga Healthcare is a remote telemedicine provider and cannot administer emergency acute resuscitation.
            Please use the persistent tap-to-call options below or proceed to the nearest emergency room immediately.
          </p>

          {/* Emergency Ambulance Hotlines */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="tel:112"
              className="bg-[#ff643b] hover:bg-[#e0532c] text-white px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold inline-flex items-center gap-2 shadow-[0_8px_16px_rgba(75,68,57,0.15)] transition-colors"
            >
              <span>🚨 Tap to Call National Emergency (112)</span>
            </a>

            <a
              href="tel:767"
              className="bg-white hover:bg-neutral-50 text-[#ff643b] border border-[#ff643b] px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <span>🚑 Lagos Ambulance Hotline (767)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
