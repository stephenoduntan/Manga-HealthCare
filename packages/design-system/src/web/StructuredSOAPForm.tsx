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
      <div className="bg-[#b6ced5] rounded-3xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(75,68,57,0.08)] border border-[#a2bcc3]">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#080331] bg-white px-2.5 py-0.5 rounded-full border border-neutral-200">
                EHR Clinical Workspace (Ease + August EHR)
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0f3e17] bg-[#e1f4df] px-2.5 py-0.5 rounded-full border border-[#b1dbb8]">
                Telemedicine Encounter
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#080331] mt-2 mb-0.5 tracking-[-0.025em]">
              Structured Clinical Encounter Note
            </h2>
            <p className="text-xs text-[#080331]/80 m-0">
              Patient: <strong className="text-[#080331]">{patientName}</strong> ({patientId}) • Mandatory MDCN Documentation
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-full text-xs font-semibold text-[#080331] shadow-xs self-start sm:self-auto flex items-center gap-1.5 border border-[#efeeeb]">
            <span className="w-2 h-2 rounded-full bg-[#31ce01] animate-pulse" />
            <span>Live Encounter In Progress</span>
          </div>
        </div>

        {/* Paper White Inner Cards (14px radius per Ease style) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: Chief Complaint */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_6px_rgba(75,68,57,0.04)] border border-[#efeeeb]">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0f3e17] mb-1.5">
              S • Chief Complaint (Reason for Encounter)
            </label>
            <input
              type="text"
              value={formData.chiefComplaint}
              onChange={(e) => handleChange('chiefComplaint', e.target.value)}
              placeholder="Primary symptom or stated reason for visit"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#efeeeb] text-sm text-[#222326] focus:outline-none focus:border-[#4865ff] bg-neutral-50/50"
              required
            />
          </div>

          {/* Card 2: History of Present Illness */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_6px_rgba(75,68,57,0.04)] border border-[#efeeeb]">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0f3e17] mb-1.5">
              O • History of Present Illness (HPI & Clinical Observations)
            </label>
            <textarea
              rows={3}
              value={formData.historyOfPresentIllness}
              onChange={(e) => handleChange('historyOfPresentIllness', e.target.value)}
              placeholder="Chronology, severity, aggravating/relieving factors, remote exam findings"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#efeeeb] text-sm text-[#222326] focus:outline-none focus:border-[#4865ff] bg-neutral-50/50 resize-y"
              required
            />
          </div>

          {/* Card 3: Assessment */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_6px_rgba(75,68,57,0.04)] border border-[#efeeeb]">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0f3e17] mb-1.5">
              A • Clinical Assessment & Provisional Diagnosis
            </label>
            <input
              type="text"
              value={formData.assessment}
              onChange={(e) => handleChange('assessment', e.target.value)}
              placeholder="Differential diagnosis or primary working assessment"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#efeeeb] text-sm text-[#222326] focus:outline-none focus:border-[#4865ff] bg-neutral-50/50"
              required
            />
          </div>

          {/* Card 4: Plan */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_6px_rgba(75,68,57,0.04)] border border-[#efeeeb]">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0f3e17] mb-1.5">
              P • Care Plan, Lifestyle Advice & Red-Flag Warnings
            </label>
            <textarea
              rows={3}
              value={formData.plan}
              onChange={(e) => handleChange('plan', e.target.value)}
              placeholder="Clinical instructions, follow-up scheduling, warning precautions"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#efeeeb] text-sm text-[#222326] focus:outline-none focus:border-[#4865ff] bg-neutral-50/50 resize-y"
              required
            />
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#0f3e17] hover:bg-[#0a3922] text-white px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-colors shadow-[0_8px_16px_rgba(75,68,57,0.1)] cursor-pointer"
            >
              Lock & Save Structured Encounter Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
