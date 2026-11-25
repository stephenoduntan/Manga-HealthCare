'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  StructuredSOAPForm,
  EPrescriptionBuilder,
  SOAPData,
  PrescriptionItem,
} from '@manga/design-system';
import { authorizedApiFetch } from '@/lib/api-client';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  AlertTriangle,
  Pill,
  HeartPulse,
  Send,
  FileText,
  Clock,
  CheckCircle2,
  Share2,
  ExternalLink,
  ClipboardList,
} from 'lucide-react';

export default function DoctorActiveConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const encounterId = params?.id || 'enc-live-01';

  // Patient Intake Info
  const [patientInfo] = useState({
    id: 'PAT-48291',
    name: 'Amaka Adeleke',
    ageGender: '29 F',
    allergies: ['Penicillin (Hives / Rash)'],
    chronicConditions: ['Mild Asthma'],
    medications: ['Salbutamol inhaler PRN'],
    triageClearance: 'Passed (0 Red Flags)',
    chiefComplaint: 'Sore throat, fever (37.8C), and fatigue for 2 days',
  });

  // Call Controls & Telemetry
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(384); // seconds
  const [startTime] = useState('14:02:10 WAT');
  const [endTime, setEndTime] = useState<string | null>(null);

  // Patient Uploaded Photos (PRD & Flowchart: Real-time clinical photo review)
  const [patientUploadedPhotos, setPatientUploadedPhotos] = useState([
    {
      id: 'photo-01',
      url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80',
      caption: 'Skin rash with erythematous papules on right forearm',
      uploadedAt: '14:03 WAT',
    },
  ]);
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  // Active EHR Tab on Right Column: 'SOAP' | 'PRESCRIPTION' | 'REFERRAL'
  const [activeEhrTab, setActiveEhrTab] = useState<'SOAP' | 'PRESCRIPTION' | 'REFERRAL'>('SOAP');

  // Chat
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'PATIENT',
      text: 'Good afternoon doctor, my throat has been very dry and sore when swallowing.',
      timestamp: '14:02',
    },
    {
      id: '2',
      sender: 'DOCTOR',
      text: 'Good afternoon Amaka. I have reviewed your allergy to Penicillin. Have you noticed any cough with phlegm or ear pain?',
      timestamp: '14:03',
    },
    {
      id: '3',
      sender: 'PATIENT',
      text: 'No ear pain, mostly dry hacking cough especially at night.',
      timestamp: '14:04',
    },
  ]);
  const [inputText, setInputText] = useState('');

  // Referral Order Form State
  const [labTests, setLabTests] = useState('Full Blood Count (FBC), Malaria Parasite (MP) Test');
  const [imagingReferral, setImagingReferral] = useState('None required at this stage');
  const [referralCenter, setReferralCenter] = useState('St. Nicholas Hospital / Synlab VI Lagos');
  const [referralSubmitted, setReferralSubmitted] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${prev.length + 1}`,
        sender: 'DOCTOR',
        text: inputText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
  };

  const handleConcludeCall = async () => {
    const concludedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
    setEndTime(concludedAt);
    await authorizedApiFetch(`/api/v1/consultations/${encounterId}/end`, { method: 'POST' });
    alert(
      `Clinical Session Concluded!\n• auto-logged start_time: ${startTime}\n• auto-logged end_time: ${concludedAt}\n• Finalized SOAP Notes & E-Prescriptions linked to Patient Record ${patientInfo.id}.\nReturning to Doctor Workspace.`
    );
    router.push('/doctor/dashboard');
  };

  const handleSaveSOAP = async (data: SOAPData) => {
    await authorizedApiFetch(`/api/v1/clinical-docs/${encounterId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({
        notes: {
          chief_complaint: data.chiefComplaint,
          history_of_present_illness: data.historyOfPresentIllness,
          assessment: data.assessment,
          plan: data.plan,
        },
      }),
    });
    alert(
      `SOAP Note saved successfully to Patient Record ${patientInfo.id}!\nAssessment: ${data.assessment}`
    );
  };

  const handleGeneratePdf = async (items: PrescriptionItem[]) => {
    await authorizedApiFetch(`/api/v1/clinical-docs/${encounterId}/prescriptions`, {
      method: 'POST',
      body: JSON.stringify({
        items: items.map((item) => ({
          drug_name: item.drugName,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions || 'Take as directed',
        })),
      }),
    });
    alert(
      `Electronic Prescription PDF generated successfully with ${items.length} items.\nDigitally signed under MDCN-78320.`
    );
  };

  const handleSaveReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setReferralSubmitted(true);
    await authorizedApiFetch(`/api/v1/clinical-docs/${encounterId}/referrals`, {
      method: 'POST',
      body: JSON.stringify({
        lab_tests: labTests,
        imaging_referral: imagingReferral,
        referral_center: referralCenter,
      }),
    });
    setTimeout(() => {
      setReferralSubmitted(false);
      alert('Diagnostic lab order & specialist referral dispatched to Partner counter!');
    }, 800);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Clinical Header & Emergency Banner */}
      <div className="bg-white rounded-2xl p-4 border border-[#efeeeb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#31ce01] animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-[#080331]">
                Active Clinical Encounter
              </span>
              <span className="font-mono text-xs bg-[#e1f4df] text-[#0f3e17] px-2 py-0.5 rounded font-bold">
                {encounterId}
              </span>
              <span className="text-xs bg-[#ebf0f8] text-[#4865ff] px-2 py-0.5 rounded-full font-semibold">
                Patient: {patientInfo.name} ({patientInfo.id})
              </span>
            </div>
            <p className="text-xs text-[#747679]">
              Encounter Type: Instant Telehealth Consult • Payment Authorized (₦10,000)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#e1f4df] px-3 py-1.5 rounded-full border border-[#b1dbb8] text-[11px] font-mono text-[#0f3e17]">
            <Clock className="w-3.5 h-3.5" />
            <span>start_time: {startTime}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f8f3eb] px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-mono font-bold text-[#080331]">
            <Clock className="w-3.5 h-3.5 text-[#ff643b]" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 text-xs bg-[#ffede8] text-[#ff643b] px-3.5 py-1.5 rounded-full font-semibold border border-[#ff643b]/30 hover:brightness-95 transition"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Acute Decompensation: Dial 112</span>
          </a>
        </div>
      </div>

      {/* Main Split View: Left Telehealth & Intake vs Right EHR Slate Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Video Feed + Patient Clinical Intake Summary + Chat (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Patient Safety & Intake Alert Summary */}
          <div className="bg-white rounded-3xl p-5 border border-[#efeeeb] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-2.5 py-0.5 rounded-full">
                Pre-Encounter Intake Details
              </span>
              <span className="text-xs font-mono text-[#080331]">{patientInfo.ageGender}</span>
            </div>

            {/* Allergies Highlight Alert */}
            <div className="p-3 rounded-xl bg-[#ffede8] border border-[#ff643b]/30 flex items-start gap-2.5">
              <Pill className="w-4 h-4 text-[#ff643b] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff643b] block">
                  Allergy Warning (Contraindications):
                </span>
                <span className="text-xs font-semibold text-[#080331]">
                  {patientInfo.allergies.join(', ')}
                </span>
              </div>
            </div>

            {/* Chronic Conditions & Current Meds */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-[#f8f3eb] rounded-xl border border-neutral-200">
                <span className="text-[10px] uppercase font-semibold text-[#747679] block">
                  Chronic Conditions
                </span>
                <strong className="text-[#080331]">{patientInfo.chronicConditions.join(', ')}</strong>
              </div>
              <div className="p-2.5 bg-[#f8f3eb] rounded-xl border border-neutral-200">
                <span className="text-[10px] uppercase font-semibold text-[#747679] block">
                  Current Medications
                </span>
                <strong className="text-[#080331]">{patientInfo.medications.join(', ')}</strong>
              </div>
            </div>

            <div className="text-xs text-[#222326]">
              <strong>Chief Complaint:</strong> {patientInfo.chiefComplaint}
            </div>
          </div>

          {/* Patient Uploaded Photos (PRD Flowchart: In-Session Photo Review) */}
          <div className="bg-white rounded-3xl p-5 border border-[#efeeeb] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="eyebrow-label text-[#4865ff] bg-[#ebf0f8] px-2.5 py-0.5 rounded-full">
                Patient Uploaded Observations ({patientUploadedPhotos.length})
              </span>
              <span className="text-[10px] text-[#747679]">Live In-Session Clinical Review</span>
            </div>

            <div className="space-y-2">
              {patientUploadedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="p-3 rounded-2xl bg-[#f8f3eb] border border-neutral-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-300"
                    />
                    <div>
                      <strong className="text-xs text-[#080331] block">{photo.caption}</strong>
                      <span className="text-[10px] text-[#747679]">Uploaded at {photo.uploadedAt}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePhotoModal(photo.url)}
                    className="text-xs text-[#4865ff] font-semibold bg-white px-3 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-50 shadow-xs"
                  >
                    Inspect Photo
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Video/Audio Container */}
          <div className="relative aspect-4/3 bg-[#0a3922] rounded-3xl overflow-hidden shadow-md flex items-center justify-center border border-[#0f3e17]">
            {/* Patient Remote Camera Feed (Mock) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white space-y-2">
              <div className="w-20 h-20 rounded-full bg-[#e1f4df] border-4 border-[#31ce01] flex items-center justify-center text-3xl shadow-lg">
                👩🏾
              </div>
              <h3 className="font-serif text-xl text-white">{patientInfo.name}</h3>
              <span className="text-xs text-[#d2f2e3]">Patient Camera Feed (Lagos, NG)</span>
            </div>

            {/* Doctor Self-Preview (PIP) */}
            <div className="absolute top-4 right-4 w-32 aspect-4/3 bg-[#1b1463] rounded-2xl overflow-hidden border-2 border-white/40 shadow flex items-center justify-center">
              <div className="text-center p-1 text-white">
                <div className="text-xl">👨🏾‍⚕️</div>
                <span className="text-[9px] block">You (Dr. Okafor)</span>
              </div>
            </div>

            {/* Call Control Capsule */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-20">
              <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-3 shadow-lg">
                <button
                  type="button"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    isMicOn ? 'bg-white/20 text-white' : 'bg-[#ff643b] text-white'
                  }`}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    isVideoOn ? 'bg-white/20 text-white' : 'bg-[#ff643b] text-white'
                  }`}
                >
                  {isVideoOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleConcludeCall}
                  className="bg-[#ff643b] text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 hover:brightness-110 transition shadow-xs"
                >
                  <PhoneOff className="w-3 h-3" />
                  <span>Conclude Call & Lock SOAP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Consultation Chat Sidebar */}
          <div className="bg-white rounded-3xl border border-[#efeeeb] shadow-xs flex flex-col h-[280px] overflow-hidden">
            <div className="p-3 border-b border-neutral-100 bg-[#f8f3eb]/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#080331]">Live Clinical Dialogue</span>
              <span className="text-[10px] font-mono text-[#747679]">NDPR Logged</span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {chatMessages.map((msg) => {
                const isDoc = msg.sender === 'DOCTOR';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isDoc ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[9px] text-[#747679] mb-0.5">
                      {isDoc ? 'You' : 'Amaka'} • {msg.timestamp}
                    </span>
                    <div
                      className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                        isDoc
                          ? 'bg-[#0a3922] text-white rounded-tr-none'
                          : 'bg-[#f8f3eb] text-[#222326] border border-neutral-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-100 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Send message to patient..."
                className="flex-1 text-xs border border-neutral-200 rounded-xl px-3 py-1.5 bg-[#f8f3eb]/30 focus:outline-none focus:border-[#4865ff]"
              />
              <button
                type="submit"
                className="bg-[#0a3922] text-white p-2 rounded-xl hover:bg-[#0f3e17] transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: EHR Documentation & E-Prescription on Slate Hush (#b6ced5) (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* EHR Tabs Switcher */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-neutral-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveEhrTab('SOAP')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                activeEhrTab === 'SOAP'
                  ? 'bg-[#0a3922] text-white shadow-xs'
                  : 'text-[#747679] hover:bg-neutral-50'
              }`}
            >
              1. SOAP Note
            </button>

            <button
              type="button"
              onClick={() => setActiveEhrTab('PRESCRIPTION')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                activeEhrTab === 'PRESCRIPTION'
                  ? 'bg-[#0a3922] text-white shadow-xs'
                  : 'text-[#747679] hover:bg-neutral-50'
              }`}
            >
              2. E-Prescription
            </button>

            <button
              type="button"
              onClick={() => setActiveEhrTab('REFERRAL')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                activeEhrTab === 'REFERRAL'
                  ? 'bg-[#0a3922] text-white shadow-xs'
                  : 'text-[#747679] hover:bg-neutral-50'
              }`}
            >
              3. Lab & Referral
            </button>
          </div>

          {/* TAB 1: Structured SOAP Form (Design System Component) */}
          {activeEhrTab === 'SOAP' && (
            <StructuredSOAPForm
              patientId={patientInfo.id}
              patientName={patientInfo.name}
              initialData={{
                chiefComplaint: patientInfo.chiefComplaint,
                historyOfPresentIllness:
                  'Patient reports acute sore throat and swallowing discomfort for 48 hours. Associated with mild dry cough and fatigue. Denies chest pain, hemoptysis, or shortness of breath.',
                assessment: 'Acute Viral Pharyngitis / Mild Upper Respiratory Infection',
                plan: '1. Adequate oral hydration & warm saline gargles\n2. Paracetamol 1000mg TDS for 5 days\n3. Cetirizine 10mg OD for 7 days\n4. Follow-up review in 48 hours if pyrexia worsens',
              }}
              onSave={handleSaveSOAP}
            />
          )}

          {/* TAB 2: E-Prescription Builder (Design System Component) */}
          {activeEhrTab === 'PRESCRIPTION' && (
            <EPrescriptionBuilder
              patientId={patientInfo.id}
              patientName={patientInfo.name}
              doctorName="Dr. Chidi Okafor"
              mdcnNumber="MDCN-78320"
              onGeneratePdf={handleGeneratePdf}
            />
          )}

          {/* TAB 3: Diagnostic Lab & Specialist Referral Order Form */}
          {activeEhrTab === 'REFERRAL' && (
            <form
              onSubmit={handleSaveReferral}
              className="bg-[#b6ced5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_8px_24px_rgba(75,68,57,0.08)] border border-[#080331]/10"
            >
              <div className="border-b border-[#080331]/15 pb-4">
                <span className="eyebrow-label text-[#080331] bg-white/70 px-3 py-1 rounded-full">
                  Diagnostic Order & Specialist Referral
                </span>
                <h3 className="font-serif text-2xl text-[#080331] font-normal mt-2">
                  Order Diagnostic Lab Investigations
                </h3>
                <p className="text-xs text-[#080331] mt-1">
                  Orders will be dispatched to partner laboratories (Synlab, MeCure, Afriglobal) for sample collection or in-person evaluation.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                    Requested Laboratory Investigations
                  </label>
                  <textarea
                    rows={2}
                    value={labTests}
                    onChange={(e) => setLabTests(e.target.value)}
                    className="w-full text-xs border border-white/60 rounded-xl p-3 bg-white focus:outline-none focus:border-[#4865ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                    Diagnostic Imaging / Ultrasound (If indicated)
                  </label>
                  <input
                    type="text"
                    value={imagingReferral}
                    onChange={(e) => setImagingReferral(e.target.value)}
                    className="w-full text-xs border border-white/60 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#4865ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                    Recommended Referral Facility or Specialist Center
                  </label>
                  <input
                    type="text"
                    value={referralCenter}
                    onChange={(e) => setReferralCenter(e.target.value)}
                    className="w-full text-xs border border-white/60 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#4865ff]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={referralSubmitted}
                  className="bg-[#0a3922] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition shadow-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#31ce01]" />
                  <span>
                    {referralSubmitted ? 'Transmitting Order...' : 'Dispatch Referral Order'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
