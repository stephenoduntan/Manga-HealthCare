'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DoctorPayoutBento } from '@manga/design-system';
import {
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Activity,
} from 'lucide-react';

export default function DoctorWorkspacePage() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'VERIFIED' | 'PENDING'>('VERIFIED');

  const formatNgn = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const [incomingQueue, setIncomingQueue] = useState([
    {
      id: 'PAT-48291',
      name: 'Amaka Adeleke',
      ageGender: '29 F',
      complaint: 'Sore throat, fever (37.8C), cough for 2 days. Denies chest pain.',
      triageStatus: 'CLEARED (0 Red Flags)',
      language: 'English / Pidgin',
      waitTime: '3 mins 20s',
      specialty: 'General Practice',
    },
    {
      id: 'PAT-39102',
      name: 'Babatunde Ojo',
      ageGender: '42 M',
      complaint: 'Skin rash with itchy papules on both forearms after garden work.',
      triageStatus: 'CLEARED (0 Red Flags)',
      language: 'Yorùbá / English',
      waitTime: '1 min 45s',
      specialty: 'General Practice',
    },
  ]);

  const completedEncounters = [
    {
      id: 'ENC-2026-0811',
      patientId: 'PAT-48291',
      patientName: 'Amaka Adeleke',
      date: '14 Nov 2026, 10:30 AM',
      diagnosis: 'Acute Viral Pharyngitis',
      soapStatus: 'COMPLETED & SIGNED',
      rxStatus: 'E-Prescription Issued (RX-99120)',
      shareNgn: 7500,
    },
    {
      id: 'ENC-2026-0792',
      patientId: 'PAT-19302',
      patientName: 'Emeka Nwosu',
      date: '14 Nov 2026, 09:15 AM',
      diagnosis: 'Uncomplicated Malaria',
      soapStatus: 'COMPLETED & SIGNED',
      rxStatus: 'E-Prescription Issued (RX-99088)',
      shareNgn: 7500,
    },
  ];

  const handleClaimEncounter = (patientId: string) => {
    setIncomingQueue((prev) => prev.filter((p) => p.id !== patientId));
    router.push('/doctor/consultation/enc-live-01');
  };

  return (
    <div className="w-full space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
            MDCN Clinical Practice Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
            Physician &amp; Locum Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#747679] mt-1">
            Dr. Chidi Okafor (LOC-9941 • MDCN-78320) • Duty: Instant Lobby Telemedicine &amp; Follow-ups
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setVerificationStatus(verificationStatus === 'VERIFIED' ? 'PENDING' : 'VERIFIED')}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
              verificationStatus === 'VERIFIED'
                ? 'bg-[#e1f4df] text-[#0f3e17] border-[#b1dbb8]'
                : 'bg-[#ffede8] text-[#ff643b] border-[#ff643b]/40'
            }`}
          >
            MDCN Status: {verificationStatus === 'VERIFIED' ? '✓ Verified (Live)' : '⏳ Pending Approval (Hold)'}
          </button>
          <Link
            href="/doctor/consultation/enc-live-01"
            className="bg-[#0a3922] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition shadow-xs flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-[#31ce01]" />
            <span>Open EHR Active Room</span>
          </Link>
        </div>
      </div>

      {verificationStatus === 'PENDING' && (
        <div className="bg-[#ffede8] p-5 rounded-3xl border border-[#ff643b]/40 shadow-xs flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#ff643b] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-serif text-lg text-[#080331]">
              Profile Inactive: Pending Admin MDCN Verification
            </h3>
            <p className="text-xs text-[#747679] leading-relaxed">
              Under Section 1.0 MDCN Telemedicine Regulations, doctors cannot go live or claim patients until an Admin reviews and approves your practicing license certificate.
            </p>
          </div>
        </div>
      )}

      <DoctorPayoutBento
        doctorName="Dr. Chidi Okafor"
        providerId="LOC-9941"
        totalPatientsSeen={28}
        accruedFeesNgn={210000}
        daysUntilBiweeklyPayout={3}
        verificationStatus={verificationStatus}
      />

      {/* Live Incoming Patient Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#31ce01] animate-ping" />
              <h2 className="font-serif text-2xl text-[#080331] font-normal">
                Live Incoming Triage Queue
              </h2>
            </div>
            <p className="text-xs text-[#747679] mt-1">
              Patients who have cleared 8-symptom red flag triage and completed payment authorization.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold bg-[#e1f4df] text-[#0f3e17] px-3 py-1 rounded-full">
              {incomingQueue.length} Patient{incomingQueue.length !== 1 ? 's' : ''} Ready to Claim
            </span>
            {incomingQueue[0] && (
              <button
                type="button"
                disabled={verificationStatus === 'PENDING'}
                onClick={() => {
                  const first = incomingQueue[0];
                  if (first) handleClaimEncounter(first.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                  verificationStatus === 'PENDING'
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-[#0a3922] text-white hover:bg-[#0f3e17]'
                }`}
              >
                Claim Next Patient →
              </button>
            )}
          </div>
        </div>

        {incomingQueue.length > 0 ? (
          <div className="space-y-4">
            {incomingQueue.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#f8f3eb]/70 border border-neutral-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#080331] bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {item.id}
                    </span>
                    <strong className="text-sm text-[#080331]">{item.name}</strong>
                    <span className="text-xs text-[#747679]">({item.ageGender})</span>
                    <span className="text-[10px] font-semibold text-[#0f3e17] bg-[#e1f4df] px-2 py-0.5 rounded-full">
                      {item.triageStatus}
                    </span>
                    <span className="text-[10px] text-[#747679] bg-white px-2 py-0.5 rounded border border-neutral-200">
                      Wait: <strong className="text-[#ff643b]">{item.waitTime}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-[#222326]">
                    <strong>Chief Complaint:</strong> {item.complaint}
                  </p>
                  <p className="text-[11px] text-[#747679]">
                    Language: {item.language} • Track: {item.specialty}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={verificationStatus === 'PENDING'}
                  onClick={() => handleClaimEncounter(item.id)}
                  className={`px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2 shrink-0 ${
                    verificationStatus === 'PENDING'
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      : 'bg-[#ff643b] text-white hover:brightness-105'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{verificationStatus === 'PENDING' ? 'Verification Pending' : 'Claim Consultation'}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#f8f3eb]/40 rounded-2xl border border-dashed border-neutral-300">
            <CheckCircle2 className="w-8 h-8 text-[#31ce01] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#080331]">All queue patients have been claimed!</p>
          </div>
        )}
      </div>

      {/* Upcoming Scheduled Slots */}
      <div className="bg-[#ebf0f8] rounded-3xl p-6 sm:p-8 border border-[#4865ff]/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow-label text-[#4865ff] bg-white px-3 py-1 rounded-full">
              Scheduled Appointments
            </span>
            <h3 className="font-serif text-2xl text-[#080331] font-normal mt-2">
              Upcoming Booked Calendar Slots
            </h3>
          </div>
          <Link href="/doctor/schedule" className="text-xs font-semibold text-[#4865ff] hover:underline">
            Manage Availability Calendar →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center justify-between">
            <div>
              <strong className="text-sm text-[#080331] block">Tomorrow, 10:00 AM - 10:30 AM</strong>
              <span className="text-[#747679]">Patient: Ngozi Okeke (PAT-88120) • General GP</span>
            </div>
            <Link href="/doctor/consultation/enc-sched-01" className="bg-[#0a3922] text-white px-3.5 py-2 rounded-full font-semibold">
              Open EHR
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center justify-between">
            <div>
              <strong className="text-sm text-[#080331] block">Tomorrow, 11:00 AM - 11:45 AM</strong>
              <span className="text-[#747679]">Patient: Tunde Bakare (PAT-12093) • Protected Therapy Slot</span>
            </div>
            <Link href="/doctor/consultation/enc-ther-02" className="bg-[#4865ff] text-white px-3.5 py-2 rounded-full font-semibold">
              Open EHR
            </Link>
          </div>
        </div>
      </div>

      {/* Completed Clinical Encounters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <h3 className="font-serif text-2xl text-[#080331] font-normal">
            Completed Clinical Encounters (Audit Trail)
          </h3>
          <Link href="/doctor/ledger" className="text-xs font-semibold text-[#4865ff] hover:underline">
            Full Payout Ledger →
          </Link>
        </div>

        <div className="border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ebf0f8] text-[#080331] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Encounter ID</th>
                <th className="p-3.5">Patient</th>
                <th className="p-3.5">Diagnosis</th>
                <th className="p-3.5">SOAP Status</th>
                <th className="p-3.5 text-right">Provider Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-[#222326]">
              {completedEncounters.map((enc) => (
                <tr key={enc.id}>
                  <td className="p-3.5 font-mono font-semibold text-[#080331]">{enc.id}</td>
                  <td className="p-3.5">{enc.patientName} ({enc.patientId})</td>
                  <td className="p-3.5">{enc.diagnosis}</td>
                  <td className="p-3.5 text-[#0f3e17] font-semibold">{enc.soapStatus}</td>
                  <td className="p-3.5 text-right font-mono font-bold">₦{formatNgn(enc.shareNgn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
