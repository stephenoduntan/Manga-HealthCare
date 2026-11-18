'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  UserCheck,
  XCircle,
  CheckCircle2,
  FileText,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

interface PendingDoctor {
  id: string;
  name: string;
  email: string;
  mdcnLicenseNumber: string;
  medicalDegree: string;
  specialty: string;
  yearsExperience: number;
  submittedAt: string;
  certificateFileName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  assignedLocumId?: string;
}

export default function AdminDoctorVettingPage() {
  const [doctors, setDoctors] = useState<PendingDoctor[]>([
    {
      id: 'DOC-APP-001',
      name: 'Dr. Chidi Okafor',
      email: 'chidi.okafor@mangahealth.ng',
      mdcnLicenseNumber: 'MDCN-78320',
      medicalDegree: 'MBBS (University of Ibadan), FWACS',
      specialty: 'General Practice & Emergency Medicine',
      yearsExperience: 8,
      submittedAt: '16 Nov 2026, 14:20',
      certificateFileName: 'chidi_okafor_mdcn_2026.pdf',
      status: 'APPROVED',
      assignedLocumId: 'LOC-9941',
    },
    {
      id: 'DOC-APP-002',
      name: 'Dr. Zainab Aliyu',
      email: 'zainab.aliyu@healthmail.ng',
      mdcnLicenseNumber: 'MDCN-65492',
      medicalDegree: 'MBBS (ABU Zaria), MPH',
      specialty: 'Family Medicine',
      yearsExperience: 6,
      submittedAt: '16 Nov 2026, 18:45',
      certificateFileName: 'zainab_mdcn_folio.pdf',
      status: 'PENDING',
    },
    {
      id: 'DOC-APP-003',
      name: 'Dr. David Adekunle',
      email: 'david.adekunle@care.ng',
      mdcnLicenseNumber: 'MDCN-91204',
      medicalDegree: 'MBBS (Unilag), FMCP',
      specialty: 'Internal Medicine',
      yearsExperience: 10,
      submittedAt: '16 Nov 2026, 20:10',
      certificateFileName: 'adekunle_license_cert.pdf',
      status: 'PENDING',
    },
  ]);

  const handleApprove = (id: string) => {
    const randomLocumId = `LOC-${Math.floor(1000 + Math.random() * 9000)}`;
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: 'APPROVED',
              assignedLocumId: randomLocumId,
            }
          : doc
      )
    );
    alert(`Doctor approved! Permanent Locum ID ${randomLocumId} generated and dispatched.`);
  };

  const handleReject = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: 'REJECTED' } : doc))
    );
    alert('Credential submission marked as REJECTED. Clinician notified via official email.');
  };

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
            PRD Section 1.0 MDCN Credential Verification
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
            Doctor & Locum Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#747679] mt-1">
            Review practicing licenses against Medical & Dental Council of Nigeria records before issuing practicing Locum IDs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#ebf0f8] text-[#4865ff] border border-[#4865ff]/20">
            {doctors.filter((d) => d.status === 'PENDING').length} Pending Reviews
          </span>
        </div>
      </div>

      {/* Verification List Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
        <div className="space-y-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className={`p-6 rounded-2xl border transition-all ${
                doc.status === 'APPROVED'
                  ? 'bg-[#e1f4df]/40 border-[#b1dbb8]'
                  : doc.status === 'REJECTED'
                  ? 'bg-neutral-50 border-neutral-200 opacity-60'
                  : 'bg-[#f8f3eb]/60 border-neutral-200 hover:border-[#0a3922]/40'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl text-[#080331] font-normal">{doc.name}</h3>
                    <span className="font-mono text-xs font-bold text-[#080331] bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {doc.mdcnLicenseNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        doc.status === 'APPROVED'
                          ? 'bg-[#0a3922] text-white'
                          : doc.status === 'REJECTED'
                          ? 'bg-neutral-200 text-neutral-600'
                          : 'bg-[#ffca00]/20 text-[#080331] border border-[#ffca00]'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#222326]">
                    <strong>Degree & Institutions:</strong> {doc.medicalDegree} ({doc.yearsExperience} yrs experience)
                  </p>
                  <p className="text-xs text-[#747679]">
                    Specialty: {doc.specialty} • Official Email: {doc.email}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-[#4865ff]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Uploaded Proof: <u>{doc.certificateFileName}</u> (MDCN Seal Verified)</span>
                  </div>

                  {doc.assignedLocumId && (
                    <div className="mt-2 text-xs font-mono font-bold text-[#0f3e17] bg-white inline-block px-3 py-1 rounded-md border border-[#b1dbb8]">
                      Assigned Provider ID: {doc.assignedLocumId}
                    </div>
                  )}
                </div>

                {doc.status === 'PENDING' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleReject(doc.id)}
                      className="border border-neutral-300 bg-white text-[#747679] hover:text-[#ff643b] px-4 py-2 rounded-full text-xs font-semibold transition"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(doc.id)}
                      className="bg-[#0a3922] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] transition shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#31ce01]" />
                      <span>Approve & Issue Locum ID</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
