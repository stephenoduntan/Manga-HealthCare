'use client';

import React, { useState } from 'react';

export interface SOAPData {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  assessment: string;
  plan: string;
}

export interface StructuredSOAPFormProps {
  initialData?: Partial<SOAPData>;
  patientId?: string;
  patientName?: string;
  onSave?: (data: SOAPData) => void;
}

export function StructuredSOAPForm({
  initialData,
  patientId = 'PAT-48291',
  patientName = 'Amaka Adeleke',
  onSave,
}: StructuredSOAPFormProps) {
  const [formData, setFormData] = useState<SOAPData>({
    chiefComplaint: initialData?.chiefComplaint || 'Persistent dry cough and mild fever for 3 days',
    historyOfPresentIllness:
      initialData?.historyOfPresentIllness ||
      'Patient reports onset of dry hacking cough 3 nights ago, worse when lying down. Mild frontal headache, temperature 37.8C. Denies chest pain, hemoptysis, or shortness of breath.',
    assessment:
      initialData?.assessment || 'Acute Viral Pharyngitis / Upper Respiratory Tract Infection',
    plan:
      initialData?.plan ||
      '1. Hydration & warm saline gargles\n2. Paracetamol 1g TDS for fever/headache\n3. Honey-lemon syrup for symptomatic cough relief\n4. Red-flag precautions (return if dyspnea or high pyrexia occurs)',
  });

  const handleChange = (field: keyof SOAPData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Outer Workspace Panel in Slate Hush (#b6ced5) */}
      <div
        style={{
          backgroundColor: '#b6ced5',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: 'rgba(75, 68, 57, 0.08) 0px 8px 24px 0px',
        }}
      >
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#080331',
                  backgroundColor: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                EHR Clinical Workspace (Ease + August EHR)
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#0f3e17',
                  backgroundColor: '#e1f4df',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                Telemedicine Encounter
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', 'Cormorant Garamond', Georgia, serif",
                fontSize: '28px',
                fontWeight: 400,
                color: '#080331',
                margin: '8px 0 2px 0',
                letterSpacing: '-0.025em',
              }}
            >
              Structured Clinical Encounter Note
            </h2>
            <p style={{ fontSize: '13px', color: '#080331', opacity: 0.8, margin: 0 }}>
              Patient: <strong style={{ color: '#080331' }}>{patientName}</strong> ({patientId}) • Mandatory MDCN Documentation
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '10px 18px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#080331',
              boxShadow: 'rgba(75, 68, 57, 0.06) 0px 2px 6px 0px',
            }}
          >
            ● Live Encounter In Progress
          </div>
        </div>

        {/* Paper White Inner Cards (14px radius per Ease style) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: Chief Complaint */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px 24px',
              boxShadow: 'rgba(75, 68, 57, 0.04) 0px 2px 6px 0px',
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f3e17',
                marginBottom: '6px',
              }}
            >
              S • Chief Complaint (Reason for Encounter)
            </label>
            <input
              type="text"
              value={formData.chiefComplaint}
              onChange={(e) => handleChange('chiefComplaint', e.target.value)}
              placeholder="Primary symptom or stated reason for visit"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #efeeeb',
                fontSize: '14px',
                color: '#222326',
                outline: 'none',
              }}
              required
            />
          </div>

          {/* Card 2: History of Present Illness */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px 24px',
              boxShadow: 'rgba(75, 68, 57, 0.04) 0px 2px 6px 0px',
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f3e17',
                marginBottom: '6px',
              }}
            >
              O • History of Present Illness (HPI & Clinical Observations)
            </label>
            <textarea
              rows={3}
              value={formData.historyOfPresentIllness}
              onChange={(e) => handleChange('historyOfPresentIllness', e.target.value)}
              placeholder="Chronology, severity, aggravating/relieving factors, remote exam findings"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #efeeeb',
                fontSize: '14px',
                color: '#222326',
                outline: 'none',
                resize: 'vertical',
              }}
              required
            />
          </div>

          {/* Card 3: Assessment */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px 24px',
              boxShadow: 'rgba(75, 68, 57, 0.04) 0px 2px 6px 0px',
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f3e17',
                marginBottom: '6px',
              }}
            >
              A • Clinical Assessment & Provisional Diagnosis
            </label>
            <input
              type="text"
              value={formData.assessment}
              onChange={(e) => handleChange('assessment', e.target.value)}
              placeholder="Differential diagnosis or primary working assessment"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #efeeeb',
                fontSize: '14px',
                color: '#222326',
                outline: 'none',
              }}
              required
            />
          </div>

          {/* Card 4: Plan */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px 24px',
              boxShadow: 'rgba(75, 68, 57, 0.04) 0px 2px 6px 0px',
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f3e17',
                marginBottom: '6px',
              }}
            >
              P • Care Plan, Lifestyle Advice & Red-Flag Warnings
            </label>
            <textarea
              rows={3}
              value={formData.plan}
              onChange={(e) => handleChange('plan', e.target.value)}
              placeholder="Clinical instructions, follow-up scheduling, warning precautions"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #efeeeb',
                fontSize: '14px',
                color: '#222326',
                outline: 'none',
                resize: 'vertical',
              }}
              required
            />
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              style={{
                backgroundColor: '#0f3e17',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'rgba(75, 68, 57, 0.1) 0px 8px 16px 0px',
              }}
            >
              Lock & Save Structured Encounter Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
