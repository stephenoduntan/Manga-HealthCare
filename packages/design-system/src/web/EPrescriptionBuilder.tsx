'use client';

import React, { useState } from 'react';

export interface PrescriptionItem {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface EPrescriptionBuilderProps {
  patientId?: string;
  patientName?: string;
  doctorName?: string;
  mdcnNumber?: string;
  onGeneratePdf?: (items: PrescriptionItem[]) => void;
}

export function EPrescriptionBuilder({
  patientId = 'PAT-48291',
  patientName = 'Amaka Adeleke',
  doctorName = 'Dr. Chidi Okafor',
  mdcnNumber = 'MDCN-78320',
  onGeneratePdf,
}: EPrescriptionBuilderProps) {
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      id: 'rx-item-1',
      drugName: 'Paracetamol Tablets',
      dosage: '1000mg (2 tabs)',
      frequency: 'Three times daily (TDS)',
      duration: '5 days',
      instructions: 'Take after meals with water',
    },
    {
      id: 'rx-item-2',
      drugName: 'Cetirizine Hydrochloride',
      dosage: '10mg',
      frequency: 'Once daily at night (OD)',
      duration: '7 days',
      instructions: 'May cause mild sedation',
    },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `rx-item-${Date.now()}-${prev.length + 1}`,
        drugName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof PrescriptionItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleGenerate = () => {
    onGeneratePdf?.(items);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Slate Hush outer panel */}
      <div className="bg-[#b6ced5] rounded-3xl p-8 shadow-[0_8px_24px_rgba(75,68,57,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#4865ff] bg-white py-1 px-2.5 rounded-full">
                E-Prescription Module (PRD Section 4.6)
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0f3e17] bg-[#e1f4df] py-1 px-2.5 rounded-full">
                Signed by {doctorName} ({mdcnNumber})
              </span>
            </div>

            <h2 className="font-serif text-3xl font-normal text-[#080331] mt-2 mb-0.5 tracking-tight">
              Digital Prescription & Pharmacy Order
            </h2>
            <p className="text-[13px] text-[#080331]/80 m-0">
              Rx for <strong className="text-[#080331]">{patientName}</strong> • Patient ID: <strong>{patientId}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="bg-white text-[#080331] border border-[#080331]/15 py-2.5 px-5 rounded-full text-sm font-medium cursor-pointer inline-flex items-center gap-1.5 hover:bg-neutral-50 transition"
          >
            <span>+ Add Medication</span>
          </button>
        </div>

        {/* Medication Rows */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 shadow-[0_2px_6px_rgba(75,68,57,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#0f3e17] uppercase tracking-wider">
                  Rx #{index + 1}
                </span>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="bg-transparent border-0 text-[#ff643b] text-xs cursor-pointer font-medium hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-[#747679] mb-1">
                    Drug / Generic Name
                  </label>
                  <input
                    type="text"
                    value={item.drugName}
                    onChange={(e) => updateItem(item.id, 'drugName', e.target.value)}
                    placeholder="e.g. Amoxicillin"
                    className="w-full py-2 px-3 rounded-lg border border-[#efeeeb] text-[13px] outline-hidden focus:border-[#4865ff] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#747679] mb-1">
                    Dosage & Strength
                  </label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) => updateItem(item.id, 'dosage', e.target.value)}
                    placeholder="e.g. 500mg"
                    className="w-full py-2 px-3 rounded-lg border border-[#efeeeb] text-[13px] outline-hidden focus:border-[#4865ff] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#747679] mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) => updateItem(item.id, 'frequency', e.target.value)}
                    placeholder="e.g. TDS (3x daily)"
                    className="w-full py-2 px-3 rounded-lg border border-[#efeeeb] text-[13px] outline-hidden focus:border-[#4865ff] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#747679] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) => updateItem(item.id, 'duration', e.target.value)}
                    placeholder="e.g. 5 days"
                    className="w-full py-2 px-3 rounded-lg border border-[#efeeeb] text-[13px] outline-hidden focus:border-[#4865ff] transition"
                  />
                </div>
              </div>

              <div className="mt-2.5">
                <input
                  type="text"
                  value={item.instructions}
                  onChange={(e) => updateItem(item.id, 'instructions', e.target.value)}
                  placeholder="Specific patient instructions (e.g. take with a glass of warm water after food)"
                  className="w-full py-2 px-3 rounded-lg border border-[#efeeeb] text-xs text-[#747679] outline-hidden focus:border-[#4865ff] transition"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Generate Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-black/10">
          <span className="text-xs text-[#080331]/80">
            Generates verifiable, encrypted-at-rest PDF e-prescription with QR security key for partner pharmacies.
          </span>

          <button
            type="button"
            onClick={handleGenerate}
            className="bg-[#4865ff] text-white border-0 rounded-full py-3.5 px-7 text-[15px] font-semibold cursor-pointer shadow-[0_12px_24px_rgba(75,68,57,0.1)] whitespace-nowrap hover:brightness-105 active:scale-95 transition"
          >
            Generate & Sign PDF E-Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
