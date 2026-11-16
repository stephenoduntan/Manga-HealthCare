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
      id: '1',
      drugName: 'Paracetamol Tablets',
      dosage: '1000mg (2 tabs)',
      frequency: 'Three times daily (TDS)',
      duration: '5 days',
      instructions: 'Take after meals with water',
    },
    {
      id: '2',
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
        id: Math.random().toString(),
        drugName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const removeItem = (id: string) => {
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
      <div
        style={{
          backgroundColor: '#b6ced5',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: 'rgba(75, 68, 57, 0.08) 0px 8px 24px 0px',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#4865ff',
                  backgroundColor: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                E-Prescription Module (PRD Section 4.6)
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
                Signed by {doctorName} ({mdcnNumber})
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
              Digital Prescription & Pharmacy Order
            </h2>
            <p style={{ fontSize: '13px', color: '#080331', opacity: 0.8, margin: 0 }}>
              Rx for <strong style={{ color: '#080331' }}>{patientName}</strong> • Patient ID: <strong>{patientId}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            style={{
              backgroundColor: '#ffffff',
              color: '#080331',
              border: '1px solid rgba(8, 3, 49, 0.15)',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>+ Add Medication</span>
          </button>
        </div>

        {/* Medication Rows */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '18px 22px',
                boxShadow: 'rgba(75, 68, 57, 0.04) 0px 2px 6px 0px',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0f3e17',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Rx #{index + 1}
                </span>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff643b',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#747679', marginBottom: '4px' }}>
                    Drug / Generic Name
                  </label>
                  <input
                    type="text"
                    value={item.drugName}
                    onChange={(e) => updateItem(item.id, 'drugName', e.target.value)}
                    placeholder="e.g. Amoxicillin"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #efeeeb',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#747679', marginBottom: '4px' }}>
                    Dosage & Strength
                  </label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) => updateItem(item.id, 'dosage', e.target.value)}
                    placeholder="e.g. 500mg"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #efeeeb',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#747679', marginBottom: '4px' }}>
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) => updateItem(item.id, 'frequency', e.target.value)}
                    placeholder="e.g. TDS (3x daily)"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #efeeeb',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#747679', marginBottom: '4px' }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) => updateItem(item.id, 'duration', e.target.value)}
                    placeholder="e.g. 5 days"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #efeeeb',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div className="mt-2.5">
                <input
                  type="text"
                  value={item.instructions}
                  onChange={(e) => updateItem(item.id, 'instructions', e.target.value)}
                  placeholder="Specific patient instructions (e.g. take with a glass of warm water after food)"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #efeeeb',
                    fontSize: '12px',
                    color: '#747679',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Generate Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-black/10">
          <span style={{ fontSize: '12px', color: '#080331', opacity: 0.8 }}>
            Generates verifiable, encrypted-at-rest PDF e-prescription with QR security key for partner pharmacies.
          </span>

          <button
            type="button"
            onClick={handleGenerate}
            style={{
              backgroundColor: '#4865ff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'rgba(75, 68, 57, 0.1) 0px 12px 24px 0px',
              whiteSpace: 'nowrap',
            }}
          >
            Generate & Sign PDF E-Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
