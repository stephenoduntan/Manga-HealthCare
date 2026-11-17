'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Pill,
  Download,
  Lock,
  Calendar,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { PersistentEmergencyBar } from '@manga/design-system';

interface PatientRecordResult {
  patientId: string;
  patientName: string;
  ageGender: string;
  allergies: string[];
  prescriptions: Array<{
    id: string;
    date: string;
    doctor: string;
    mdcnLicense: string;
    status: 'ACTIVE' | 'DISPENSED';
    items: Array<{ name: string; dosage: string; frequency: string; duration: string }>;
  }>;
  labRequests: Array<{
    id: string;
    date: string;
    doctor: string;
    tests: string;
    status: 'PENDING_COLLECTION' | 'COMPLETED';
  }>;
}

export default function PartnerPortalPage() {
  const [partnerId] = useState('PRT-MEDPLUS-VI-01');
  const [partnerName] = useState('MedPlus Pharmacy & Wellness VI');
  const [searchQuery, setSearchQuery] = useState('PAT-48291');
  const [hasQueried, setHasQueried] = useState(true);

  // Mock Result
  const [result, setResult] = useState<PatientRecordResult | null>({
    patientId: 'PAT-48291',
    patientName: 'Amaka Adeleke',
    ageGender: '29 F',
    allergies: ['Penicillin (Skin Hives)'],
    prescriptions: [
      {
        id: 'RX-99120',
        date: '14 Nov 2026',
        doctor: 'Dr. Chidi Okafor (MBBS, FWACS)',
        mdcnLicense: 'MDCN-78320',
        status: 'ACTIVE',
        items: [
          {
            name: 'Paracetamol Tablets',
            dosage: '1000mg (2 tabs)',
            frequency: 'Three times daily (TDS)',
            duration: '5 days',
          },
          {
            name: 'Cetirizine Hydrochloride',
            dosage: '10mg',
            frequency: 'Once daily at night (OD)',
            duration: '7 days',
          },
        ],
      },
    ],
    labRequests: [
      {
        id: 'LAB-2026-081',
        date: '14 Nov 2026',
        doctor: 'Dr. Chidi Okafor',
        tests: 'Full Blood Count (FBC) with Differential, Malaria Parasite (MP) Slide',
        status: 'PENDING_COLLECTION',
      },
    ],
  });

  const [dispenseSuccess, setDispenseSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasQueried(true);
    if (searchQuery.trim().toUpperCase() === 'PAT-48291') {
      setResult({
        patientId: 'PAT-48291',
        patientName: 'Amaka Adeleke',
        ageGender: '29 F',
        allergies: ['Penicillin (Skin Hives)'],
        prescriptions: [
          {
            id: 'RX-99120',
            date: '14 Nov 2026',
            doctor: 'Dr. Chidi Okafor (MBBS, FWACS)',
            mdcnLicense: 'MDCN-78320',
            status: 'ACTIVE',
            items: [
              {
                name: 'Paracetamol Tablets',
                dosage: '1000mg (2 tabs)',
                frequency: 'Three times daily (TDS)',
                duration: '5 days',
              },
              {
                name: 'Cetirizine Hydrochloride',
                dosage: '10mg',
                frequency: 'Once daily at night (OD)',
                duration: '7 days',
              },
            ],
          },
        ],
        labRequests: [
          {
            id: 'LAB-2026-081',
            date: '14 Nov 2026',
            doctor: 'Dr. Chidi Okafor',
            tests: 'Full Blood Count (FBC) with Differential, Malaria Parasite (MP) Slide',
            status: 'PENDING_COLLECTION',
          },
        ],
      });
    } else {
      setResult(null);
    }
  };

  const handleDispense = (rxId: string) => {
    if (!result) return;
    setDispenseSuccess(true);
    setTimeout(() => {
      setResult({
        ...result,
        prescriptions: result.prescriptions.map((rx) =>
          rx.id === rxId ? { ...rx, status: 'DISPENSED' } : rx
        ),
      });
      setDispenseSuccess(false);
      alert(`Prescription ${rxId} marked as DISPENSED. Recorded in NDPR audit log.`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8f3eb] flex flex-col pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#efeeeb] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0a3922] text-[#e1f4df] flex items-center justify-center font-serif text-lg">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-tight text-[#080331] leading-none">
                  MANGA
                </span>
                <span className="text-[9px] uppercase tracking-[0.14em] text-[#0f3e17] font-semibold">
                  Partner Portal
                </span>
              </div>
            </Link>
            <span className="hidden sm:inline-block text-xs uppercase bg-[#b1dbb8]/60 text-[#0f3e17] font-semibold px-2.5 py-1 rounded-full">
              Pharmacy & Lab Counter
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <strong className="text-[#080331] block">{partnerName}</strong>
              <span className="font-mono text-[10px] text-[#747679]">{partnerId}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ebf0f8] text-[#4865ff] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Lookup Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
          <div>
            <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
              Section 2.0 Partner Role
            </span>
            <h1 className="font-serif text-3xl text-[#080331] font-normal mt-2">
              Prescription & Diagnostic Order Verification
            </h1>
            <p className="text-xs sm:text-sm text-[#747679] mt-1">
              Enter the patient's verified Patient ID (<code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">PAT-XXXX</code>) presented at your counter.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. PAT-48291"
                className="w-full text-sm font-mono border border-neutral-200 rounded-xl pl-11 pr-4 py-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff] font-bold"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0a3922] text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition shadow-xs"
            >
              Verify & Fetch Orders
            </button>
          </form>

          {/* NDPR Consent Audit Warning */}
          <div className="p-4 bg-[#ebf0f8] rounded-2xl border border-[#4865ff]/20 text-xs text-[#080331] flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#4865ff] shrink-0 mt-0.5" />
            <div>
              <strong>NDPR Statutory Notice:</strong> By submitting this patient query, you certify that the patient is physically present or has authorized you to dispense medications or draw diagnostic specimens. This event is recorded permanently in the centralized <code className="bg-white/80 px-1 py-0.5 rounded font-mono">audit_log</code>.
            </div>
          </div>
        </div>

        {/* Results Container */}
        {hasQueried && result && (
          <div className="space-y-6">
            {/* Patient Header Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#747679]">
                  Verified Patient Record
                </span>
                <h3 className="font-serif text-2xl text-[#080331]">{result.patientName}</h3>
                <span className="font-mono text-xs font-bold text-[#080331] bg-[#f8f3eb] px-2.5 py-1 rounded border border-neutral-200 inline-block">
                  {result.patientId} • {result.ageGender}
                </span>
              </div>

              {/* Allergy Warning */}
              <div className="p-3 bg-[#ffede8] rounded-2xl border border-[#ff643b]/30 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#ff643b] block">
                  Critical Allergy:
                </span>
                <span className="text-[#080331] font-semibold">{result.allergies.join(', ')}</span>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#0a3922]" />
                  <h4 className="font-serif text-xl text-[#080331]">Electronic Prescriptions</h4>
                </div>
                <span className="text-xs font-mono text-[#0f3e17]">
                  {result.prescriptions.length} Active Prescription
                </span>
              </div>

              {result.prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-5 rounded-2xl bg-[#f8f3eb]/70 border border-neutral-200/90 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#080331] bg-white px-2 py-0.5 rounded border border-neutral-200">
                          {rx.id}
                        </span>
                        <span className="text-xs text-[#747679]">{rx.date}</span>
                      </div>
                      <p className="text-xs text-[#080331] mt-1">
                        Prescriber: <strong>{rx.doctor}</strong> (License: {rx.mdcnLicense})
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full self-start sm:self-auto ${
                        rx.status === 'ACTIVE'
                          ? 'bg-[#e1f4df] text-[#0f3e17]'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>

                  {/* Drug Items */}
                  <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#ebf0f8] text-[#080331] font-semibold text-[11px]">
                        <tr>
                          <th className="p-2.5">Medication</th>
                          <th className="p-2.5">Dosage</th>
                          <th className="p-2.5">Frequency</th>
                          <th className="p-2.5">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {rx.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-medium">{item.name}</td>
                            <td className="p-2.5">{item.dosage}</td>
                            <td className="p-2.5">{item.frequency}</td>
                            <td className="p-2.5">{item.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {rx.status === 'ACTIVE' && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => handleDispense(rx.id)}
                        disabled={dispenseSuccess}
                        className="bg-[#0a3922] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#0f3e17] transition shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
                        <span>{dispenseSuccess ? 'Recording Dispensation...' : 'Mark as Dispensed'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Diagnostic Lab Requests */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#4865ff]" />
                  <h4 className="font-serif text-xl text-[#080331]">Diagnostic Lab Test Requisitions</h4>
                </div>
                <span className="text-xs font-mono text-[#4865ff]">
                  {result.labRequests.length} Order Active
                </span>
              </div>

              {result.labRequests.map((lab) => (
                <div
                  key={lab.id}
                  className="p-5 rounded-2xl bg-[#ebf0f8]/50 border border-[#4865ff]/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#080331]">{lab.id}</span>
                    <span className="text-[10px] bg-[#ebf0f8] text-[#4865ff] font-semibold px-2 py-0.5 rounded-full">
                      {lab.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#080331]">
                    <strong>Required Tests:</strong> {lab.tests}
                  </p>
                  <p className="text-[11px] text-[#747679]">Ordering Physician: {lab.doctor}</p>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => alert(`Specimen collection registered for ${result.patientId}!`)}
                      className="bg-[#4865ff] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition"
                    >
                      Record Specimen Collected
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasQueried && !result && (
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#ff643b] mx-auto mb-2" />
            <h3 className="font-serif text-xl text-[#080331]">No Matching Patient Found</h3>
            <p className="text-xs text-[#747679]">
              Check that the Patient ID is formatted as <code className="font-mono">PAT-XXXX</code>. Try searching <code className="font-mono font-bold text-[#080331]">PAT-48291</code> for the active demo record.
            </p>
          </div>
        )}
      </main>

      {/* Persistent Emergency Bar */}
      <PersistentEmergencyBar
        position="bottom"
        message="Partner Counter Notice: In acute medical distress, dial 112 emergency response immediately:"
        ambulanceNumber="112"
        lagosEmergencyNumber="767"
      />
    </div>
  );
}
