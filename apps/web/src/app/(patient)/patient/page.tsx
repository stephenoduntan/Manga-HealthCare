'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Calendar,
  FileText,
  Download,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bell,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  User,
  X,
} from 'lucide-react';
import { RED_FLAG_SYMPTOMS } from '@manga/api-contract';

export default function PatientDashboardPage() {
  const [patientId] = useState('PAT-48291');
  const [followUpReminders, setFollowUpReminders] = useState(true);

  // Rating Modal State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // PDF Preview Modal
  const [previewPrescriptionId, setPreviewPrescriptionId] = useState<string | null>(null);

  const pastConsultations = [
    {
      id: 'ENC-2026-0811',
      date: '14 Nov 2026, 10:30 AM',
      doctor: 'Dr. Chidi Okafor',
      providerId: 'LOC-8492',
      diagnosis: 'Acute Viral Pharyngitis & Mild Bronchial Irritation',
      fee: '₦10,000',
      status: 'COMPLETED',
      hasPrescription: true,
      prescriptionId: 'RX-99120',
      drugs: [
        'Paracetamol 1000mg TDS (5 days)',
        'Cetirizine 10mg OD (7 days)',
        'Warm Saline Gargles',
      ],
    },
    {
      id: 'ENC-2026-0640',
      date: '28 Oct 2026, 04:15 PM',
      doctor: 'Dr. Folake Davies',
      providerId: 'DOC-1102',
      diagnosis: 'Mild Tension-Type Headache & Workplace Fatigue',
      fee: '₦10,000',
      status: 'COMPLETED',
      hasPrescription: true,
      prescriptionId: 'RX-88401',
      drugs: ['Ibuprofen 400mg BD PRN (3 days)', 'Ergonomic Review & Hydration'],
    },
  ];

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRatingSubmitted(true);
    setTimeout(() => {
      setIsRatingModalOpen(false);
      setRatingSubmitted(false);
      alert('Thank you! Your verified rating was submitted to our clinical quality board.');
    }, 1000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Banner: Quick Instant Lobby Action Card */}
      <div className="bg-[#0a3922] rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-[0_16px_36px_rgba(75,68,57,0.12)] border border-[#0f3e17]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#d2f2e3]">
              <span className="w-2 h-2 rounded-full bg-[#31ce01] animate-ping" />
              <span>Instant Lobby Active • 7 Doctors Online</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
              Need to see a doctor right now?
            </h1>

            <p className="text-sm text-[#cfe7d3] leading-relaxed">
              Complete the 60-second red-flag triage assessment and join the live consultation queue. Average wait time is under 5 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/patient/book"
              className="bg-[#ff643b] text-white px-7 py-4 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition shadow-[0_8px_20px_rgba(255,100,59,0.3)] flex items-center justify-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Talk to Doctor Now</span>
            </Link>
            <Link
              href="/patient/book"
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-4 rounded-full text-xs font-semibold uppercase tracking-wider transition text-center"
            >
              Schedule Slot
            </Link>
          </div>
        </div>
      </div>

      {/* Patient Vital Reminder & Settings Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#efeeeb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e1f4df] text-[#0f3e17] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#080331]">Follow-Up Reminders & Alerts</h3>
            <p className="text-xs text-[#747679]">
              Receive SMS & WhatsApp notifications 48 hours after medication for clinical symptom review.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={followUpReminders}
              onChange={(e) => setFollowUpReminders(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a3922]"></div>
          </label>
          <span className="text-xs font-semibold text-[#080331]">
            {followUpReminders ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Main Grid: Past Consultations + Clinical E-Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Past Consultations List (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full">
                Medical Encounters
              </span>
              <h2 className="font-serif text-2xl text-[#080331] font-normal mt-2">
                Consultation History & Clinical Notes
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsRatingModalOpen(true)}
              className="text-xs font-semibold text-[#4865ff] hover:underline flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 fill-[#4865ff]" />
              <span>Rate Doctor</span>
            </button>
          </div>

          <div className="space-y-4">
            {pastConsultations.map((enc) => (
              <div
                key={enc.id}
                className="p-5 rounded-2xl bg-[#f8f3eb]/60 border border-neutral-200/80 hover:border-[#0a3922]/30 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#080331] bg-white px-2.5 py-1 rounded-md border border-neutral-200">
                      {enc.id}
                    </span>
                    <span className="text-xs text-[#747679]">{enc.date}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#e1f4df] text-[#0f3e17] self-start sm:self-auto">
                    {enc.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-lg text-[#080331] font-normal">{enc.diagnosis}</h4>
                  <p className="text-xs text-[#747679] mt-0.5">
                    Attending Physician: <strong>{enc.doctor}</strong> ({enc.providerId})
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-neutral-200 text-xs text-[#222326] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#747679] block">
                    Prescribed Therapy:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {enc.drugs.map((drug, i) => (
                      <li key={i}>{drug}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="font-mono text-xs font-semibold text-[#080331]">
                    Fee Paid: {enc.fee}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewPrescriptionId(enc.prescriptionId)}
                      className="bg-[#0a3922] text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#0f3e17] transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download E-Prescription PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Safety & E-Prescriptions Summary (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Access Card */}
          <div className="bg-[#ebf0f8] rounded-3xl p-6 border border-[#4865ff]/20 space-y-4">
            <span className="eyebrow-label text-[#4865ff] bg-white px-3 py-1 rounded-full">
              Pharmacy & Lab Dispensation
            </span>
            <h3 className="font-serif text-xl text-[#080331] font-normal">
              Need to pick up medication?
            </h3>
            <p className="text-xs text-[#747679] leading-relaxed">
              Present your Patient ID <strong className="font-mono text-[#080331]">{patientId}</strong> at any registered partner pharmacy counter. The pharmacist can securely view your authorized electronic prescription.
            </p>
            <Link
              href="/partner"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4865ff] hover:underline"
            >
              <span>Test Partner Counter Lookup</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 8-Point Emergency Rule Summary */}
          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#31ce01]" />
              <h4 className="font-serif text-lg text-[#080331]">Triage Health Gate</h4>
            </div>
            <p className="text-xs text-[#747679] leading-relaxed">
              Every consultation on Manga is screened against the 8 red flags. Never use this service for active stroke symptoms, acute chest pain, or severe bleeding.
            </p>
            <div className="p-3 bg-[#ffede8] rounded-xl text-xs text-[#ff643b] font-medium border border-[#ff643b]/20">
              National Emergency Line: <strong>Dial 112 / 767</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Consultation Doctor Rating / Feedback Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-neutral-200">
            <button
              type="button"
              onClick={() => setIsRatingModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-3 py-1 rounded-full">
                Clinical Quality Review
              </span>
              <h3 className="font-serif text-2xl text-[#080331] font-normal mt-2">
                Rate Dr. Chidi Okafor
              </h3>
              <p className="text-xs text-[#747679] mt-1">
                Encounter: ENC-2026-0811 • Feedback is reviewed by our Medical Advisory Board.
              </p>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-2">
                  Clinical Care & Empathy Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= selectedRating
                            ? 'text-[#ffca00] fill-[#ffca00]'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#080331] ml-2">
                    {selectedRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                  Comments or Recommendations
                </label>
                <textarea
                  rows={3}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="The doctor was very clear in explaining how to take the paracetamol..."
                  className="w-full text-xs border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="text-xs font-semibold text-[#747679] px-4 py-2 hover:text-[#080331]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ratingSubmitted}
                  className="bg-[#0a3922] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition shadow-xs"
                >
                  {ratingSubmitted ? 'Submitting...' : 'Submit Verified Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF E-Prescription Preview Modal */}
      {previewPrescriptionId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-neutral-200">
            <button
              type="button"
              onClick={() => setPreviewPrescriptionId(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Simulated Official PDF Header */}
            <div className="border-b-2 border-[#0a3922] pb-4 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#080331]">MANGA HEALTHCARE</h3>
                <span className="text-[10px] uppercase font-semibold text-[#0f3e17] tracking-wider block">
                  Official Electronic Prescription (E-Rx)
                </span>
                <p className="text-[11px] text-[#747679]">Medical & Dental Council of Nigeria (MDCN) Compliant</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#080331]">{previewPrescriptionId}</span>
                <span className="block text-[10px] text-[#747679]">Date: 14 Nov 2026</span>
              </div>
            </div>

            {/* Prescribing Doctor & Patient Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#f8f3eb] p-4 rounded-xl border border-neutral-200">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#747679] block">Prescriber</span>
                <strong className="text-[#080331]">Dr. Chidi Okafor, MBBS</strong>
                <span className="block text-[#747679]">MDCN License: MDCN-78320</span>
                <span className="block text-[#747679]">Provider ID: LOC-8492</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#747679] block">Patient</span>
                <strong className="text-[#080331]">Amaka Adeleke</strong>
                <span className="block text-[#747679]">Patient ID: PAT-48291</span>
                <span className="block text-[#ff643b]">Allergies: Penicillin</span>
              </div>
            </div>

            {/* Drug Table */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#080331]">
                Prescribed Medications
              </span>
              <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
                <thead className="bg-[#ebf0f8] text-[#080331]">
                  <tr>
                    <th className="p-2.5">Drug Name</th>
                    <th className="p-2.5">Dosage</th>
                    <th className="p-2.5">Frequency</th>
                    <th className="p-2.5">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="p-2.5 font-medium">Paracetamol Tablets</td>
                    <td className="p-2.5">1000mg (2 tabs)</td>
                    <td className="p-2.5">Three times daily</td>
                    <td className="p-2.5">5 days</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Cetirizine Hydrochloride</td>
                    <td className="p-2.5">10mg</td>
                    <td className="p-2.5">Once daily at night</td>
                    <td className="p-2.5">7 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Digital Signature & QR Stamp */}
            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-serif italic text-sm text-[#0a3922]">Digitally signed by Dr. C. Okafor</div>
                <span className="text-[10px] text-[#747679] font-mono">
                  SHA-256: 8f92b4c10a39d8e7... (NDPR Verified)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert('E-Prescription PDF downloaded successfully.');
                  setPreviewPrescriptionId(null);
                }}
                className="bg-[#0a3922] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#0f3e17] transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
