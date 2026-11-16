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
      {/* Main Checklist Card on Paper White with Warm Cream Canvas context */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: 'rgba(75, 68, 57, 0.08) 0px 8px 16px 0px',
          border: '1px solid #efeeeb',
        }}
      >
        <div className="mb-6">
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0f3e17',
              backgroundColor: '#e1f4df',
              padding: '4px 10px',
              borderRadius: '9999px',
              display: 'inline-block',
            }}
          >
            Clinical Safety Protocol — PRD Section 6.0
          </span>
          <h2
            style={{
              fontFamily: "'DM Serif Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: '28px',
              fontWeight: 400,
              color: '#080331',
              margin: '12px 0 6px 0',
              letterSpacing: '-0.025em',
            }}
          >
            Pre-Consultation Emergency Screening
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#747679',
              lineHeight: '1.5',
            }}
          >
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
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: isSelected ? '1.5px solid #ff643b' : '1px solid #efeeeb',
                  backgroundColor: isSelected ? '#ffede8' : '#ffffff',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid #ff643b' : '1.5px solid #747679',
                    backgroundColor: isSelected ? '#ff643b' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {isSelected && (
                    <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700 }}>✓</span>
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isSelected ? '#ff643b' : '#080331',
                    }}
                  >
                    <span style={{ opacity: 0.6, marginRight: '6px', fontSize: '12px' }}>
                      0{idx + 1}.
                    </span>
                    {symptom.label}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#747679',
                      marginTop: '3px',
                      lineHeight: '1.4',
                    }}
                  >
                    {symptom.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Triage Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#efeeeb]">
          <span style={{ fontSize: '13px', color: '#747679' }}>
            {selectedCodes.length > 0 ? (
              <strong style={{ color: '#ff643b' }}>
                {selectedCodes.length} red-flag symptom{selectedCodes.length > 1 ? 's' : ''} selected
              </strong>
            ) : (
              'No red flags selected. You are safe to continue.'
            )}
          </span>

          <button
            type="button"
            onClick={handleEvaluate}
            style={{
              backgroundColor: selectedCodes.length > 0 ? '#ff643b' : '#0f3e17',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontSize: '15px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'rgba(75, 68, 57, 0.1) 0px 12px 24px 0px',
              transition: 'background-color 0.2s',
            }}
          >
            {selectedCodes.length > 0
              ? 'Evaluate Symptoms (Emergency Halt)'
              : 'I Confirm No Red Flags — Proceed'}
          </button>
        </div>
      </div>

      {/* Non-Dismissive Emergency Ambulance Redirect Modal / Banner (Peach Wash #ffede8) */}
      {isRedirectOpen && (
        <div
          style={{
            backgroundColor: '#ffede8',
            borderRadius: '16px',
            padding: '28px',
            border: '1.5px solid rgba(255, 100, 59, 0.4)',
            boxShadow: 'rgba(75, 68, 57, 0.1) 0px 12px 24px 0px',
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span
                style={{
                  backgroundColor: '#ff643b',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                }}
              >
                EMERGENCY TRIAGE HALT
              </span>
              <span style={{ fontSize: '13px', color: '#ff643b', fontWeight: 600 }}>
                Immediate In-Person Care Required
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsRedirectOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#747679',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline',
              }}
            >
              Dismiss Banner
            </button>
          </div>

          <h3
            style={{
              fontFamily: "'DM Serif Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: '24px',
              fontWeight: 400,
              color: '#080331',
              margin: '0 0 10px 0',
              letterSpacing: '-0.025em',
            }}
          >
            Your Safety is Paramount — Please Seek Emergency Services
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: '#080331',
              lineHeight: '1.6',
              marginBottom: '20px',
              maxWidth: '650px',
            }}
          >
            You reported acute symptoms that require immediate clinical stabilization at a hospital.
            Manga Healthcare is a remote telemedicine provider and cannot administer emergency acute resuscitation.
            Please use the persistent tap-to-call options below or proceed to the nearest emergency room immediately.
          </p>

          {/* Emergency Ambulance Hotlines */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="tel:112"
              style={{
                backgroundColor: '#ff643b',
                color: '#ffffff',
                padding: '14px 24px',
                borderRadius: '9999px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'rgba(75, 68, 57, 0.15) 0px 8px 16px 0px',
              }}
            >
              <span>🚨 Tap to Call National Emergency (112)</span>
            </a>

            <a
              href="tel:767"
              style={{
                backgroundColor: '#ffffff',
                color: '#ff643b',
                border: '1.5px solid #ff643b',
                padding: '14px 24px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🚑 Lagos Ambulance Hotline (767)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
