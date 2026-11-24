'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Star,
  Bell,
  Image as ImageIcon,
  X,
  Share2,
  Pill,
  CheckCircle2,
} from 'lucide-react';

export default function PatientRecordsPage() {
  const [activeTab, setActiveTab] = useState<'CONSULTATIONS' | 'PRESCRIPTIONS' | 'DOCUMENTS'>('CONSULTATIONS');
  const [followUpReminders, setFollowUpReminders] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [previewPrescriptionId, setPreviewPrescriptionId] = useState<string | null>(null);

  const consultations = [
    {
      id: 'ENC-2026-0811',
      date: '14 Nov 2026, 10:30 AM',
      doctor: 'Dr. Chidi Okafor',
      providerId: 'LOC-9941',
      chiefComplaint: 'Sore throat, fever (37.8C), and fatigue for 2 days',
      assessment: 'Acute Viral Pharyngitis & Mild Bronchial Irritation',
      plan: 'Symptomatic analgesia, antihistamine for nocturnal cough, warm saline gargles, follow up in 5 days if fever persists.',
      fee: '₦10,000',
    },
    {
      id: 'ENC-2026-0640',
      date: '28 Oct 2026, 04:15 PM',
      doctor: 'Dr. Folake Davies',
      providerId: 'DOC-1102',
      chiefComplaint: 'Bilateral temporal tension headaches during work hours',
      assessment: 'Mild Tension-Type Headache & Screen Fatigue',
      plan: 'PRN Ibuprofen, hydration 2.5L/day, screen ergonomics adjustment.',
      fee: '₦10,000',
    },
  ];

  const prescriptions = [
    {
      id: 'RX-99120',
      date: '14 Nov 2026',
      doctor: 'Dr. Chidi Okafor (MDCN-78320)',
      status: 'ACTIVE',
      items: [
        { drug: 'Paracetamol Tablets', dosage: '1000mg', frequency: 'Three times daily (TDS)', duration: '5 days' },
        { drug: 'Cetirizine Hydrochloride', dosage: '10mg', frequency: 'Once daily at night (OD)', duration: '7 days' },
      ],
    },
    {
      id: 'RX-88401',
      date: '28 Oct 2026',
      doctor: 'Dr. Folake Davies (MDCN-65110)',
      status: 'DISPENSED',
      items: [
        { drug: 'Ibuprofen Tablets', dosage: '400mg', frequency: 'Twice daily PRN (BD)', duration: '3 days' },
      ],
    },
  ];

  const uploadedDocs = [
    {
      id: 'DOC-01',
      title: 'Throat & Tonsillar Photo (ENC-2026-0811)',
      uploadedAt: '14 Nov 2026, 10:34 AM',
      type: 'Clinical Photo',
    },
    {
      id: 'DOC-02',
      title: 'Prior FBC Laboratory Report (Synlab VI)',
      uploadedAt: '27 Oct 2026, 02:15 PM',
      type: 'Lab PDF',
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          Medical Records & History (/patient/records)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Consultations, E-Prescriptions & Documents
        </h1>
      </div>

      {/* 3-Tab Switcher (Sitemap Section 3.2.5) */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-neutral-200 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('CONSULTATIONS')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition ${
            activeTab === 'CONSULTATIONS' ? 'bg-[#0a3922] text-white' : 'text-[#747679]'
          }`}
        >
          Past Consultations ({consultations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PRESCRIPTIONS')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition ${
            activeTab === 'PRESCRIPTIONS' ? 'bg-[#0a3922] text-white' : 'text-[#747679]'
          }`}
        >
          E-Prescriptions ({prescriptions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition ${
            activeTab === 'DOCUMENTS' ? 'bg-[#0a3922] text-white' : 'text-[#747679]'
          }`}
        >
          Uploaded Docs & Reminders
        </button>
      </div>

      {/* Tab 1: Past Consultations */}
      {activeTab === 'CONSULTATIONS' && (
        <div className="space-y-4">
          {consultations.map((enc) => (
            <div
              key={enc.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#f8f3eb] text-[#080331] px-2.5 py-1 rounded border border-neutral-200">
                    {enc.id}
                  </span>
                  <span className="text-xs text-[#747679]">{enc.date}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(true)}
                  className="text-xs font-semibold text-[#4865ff] hover:underline inline-flex items-center gap-1 self-start"
                >
                  <Star className="w-3.5 h-3.5 fill-[#4865ff]" />
                  <span>Rate Doctor & Feedback</span>
                </button>
              </div>

              <div className="text-xs text-[#747679]">
                Attending Clinician: <strong className="text-[#080331]">{enc.doctor}</strong> ({enc.providerId}) • Fee: <strong>{enc.fee}</strong>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#f8f3eb]/70 border border-neutral-200">
                  <strong className="uppercase text-[10px] tracking-wider text-[#0f3e17] block mb-1">
                    Chief Complaint
                  </strong>
                  <span>{enc.chiefComplaint}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f8f3eb]/70 border border-neutral-200">
                  <strong className="uppercase text-[10px] tracking-wider text-[#0f3e17] block mb-1">
                    Clinical Assessment
                  </strong>
                  <span>{enc.assessment}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f8f3eb]/70 border border-neutral-200">
                  <strong className="uppercase text-[10px] tracking-wider text-[#0f3e17] block mb-1">
                    Treatment Plan
                  </strong>
                  <span>{enc.plan}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: E-Prescriptions */}
      {activeTab === 'PRESCRIPTIONS' && (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-[#4865ff]" />
                    <span className="font-mono text-sm font-bold text-[#080331]">{rx.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        rx.status === 'ACTIVE'
                          ? 'bg-[#e1f4df] text-[#0f3e17]'
                          : 'bg-neutral-100 text-[#747679]'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#747679] mt-1">
                    {rx.doctor} • Issued {rx.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewPrescriptionId(rx.id)}
                    className="bg-[#0a3922] text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-[#0f3e17]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download / Share PDF</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rx.items.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#f8f3eb] border border-neutral-200 text-xs space-y-1">
                    <strong className="text-sm text-[#080331] block">{item.drug}</strong>
                    <div className="text-[#747679]">
                      Dosage: <strong className="text-[#080331]">{item.dosage}</strong> • {item.frequency}
                    </div>
                    <div className="text-[#0f3e17] font-medium">Duration: {item.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Uploaded Documents & Reminders */}
      {activeTab === 'DOCUMENTS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e1f4df] text-[#0f3e17] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#080331]">
                  Follow-Up Push & SMS Reminders
                </h3>
                <p className="text-xs text-[#747679]">
                  FCM alerts 48h post-consultation and medication adherence nudges.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFollowUpReminders(!followUpReminders)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                followUpReminders
                  ? 'bg-[#0a3922] text-white'
                  : 'bg-neutral-200 text-[#747679]'
              }`}
            >
              {followUpReminders ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-xs space-y-3">
            <h3 className="font-serif text-xl text-[#080331]">Uploaded Clinical Files</h3>
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-[#f8f3eb]/60 border border-neutral-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-4 h-4 text-[#4865ff]" />
                  <div>
                    <strong className="text-[#080331] block">{doc.title}</strong>
                    <span className="text-[#747679]">{doc.type} • {doc.uploadedAt}</span>
                  </div>
                </div>
                <span className="text-[#0f3e17] font-semibold">Encrypted</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsRatingModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl text-[#080331]">Rate Dr. Chidi Okafor</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setSelectedRating(star)}>
                  <Star
                    className={`w-7 h-7 ${
                      star <= selectedRating ? 'text-[#ffca00] fill-[#ffca00]' : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="Share feedback on clinical clarity and bedside manner..."
              className="w-full text-xs border border-neutral-200 rounded-xl p-3"
            />
            <button
              type="button"
              onClick={() => {
                alert(`Rated ${selectedRating}/5 stars. Submitted to Clinical Quality Board.`);
                setIsRatingModalOpen(false);
              }}
              className="w-full bg-[#0a3922] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {previewPrescriptionId && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setPreviewPrescriptionId(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0f3e17]">
              <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
              <span>Digitally Signed MDCN Prescription PDF Ready</span>
            </div>
            <h3 className="font-serif text-2xl text-[#080331]">{previewPrescriptionId}</h3>
            <p className="text-xs text-[#747679]">
              Present Patient ID <strong className="font-mono text-[#080331]">PAT-48291</strong> at any Partner Pharmacy or share this PDF.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  alert('PDF downloaded.');
                  setPreviewPrescriptionId(null);
                }}
                className="flex-1 bg-[#0a3922] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Shareable prescription link copied.');
                  setPreviewPrescriptionId(null);
                }}
                className="px-5 py-3 rounded-full border border-neutral-300 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
