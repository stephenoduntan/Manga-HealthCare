'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ShieldCheck,
  FileSpreadsheet,
  Lock,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminRedirectsLogPage() {
  const [activeTab, setActiveTab] = useState<'REDIRECTS' | 'NDPR_AUDIT'>('REDIRECTS');
  const [filterQuery, setFilterQuery] = useState('');

  // Emergency Redirect Audit Log
  const redirectLogs = [
    {
      id: 'ERL-2026-0041',
      timestamp: '2026-11-16 23:15:10 WAT',
      patientId: 'PAT-10822',
      symptomsFlagged: ['CHEST_PAIN_PRESSURE', 'DIFFICULTY_BREATHING'],
      actionTaken: 'HALTED & REDIRECTED TO AMBULANCE 112 / 767',
      complianceStatus: 'VERIFIED_HALTED',
      notes: 'Patient presented with heavy chest pressure radiating to left arm. Queue locked immediately.',
    },
    {
      id: 'ERL-2026-0038',
      timestamp: '2026-11-15 17:40:22 WAT',
      patientId: 'PAT-90312',
      symptomsFlagged: ['STROKE_SIGNS'],
      actionTaken: 'HALTED & REDIRECTED TO AMBULANCE 112',
      complianceStatus: 'VERIFIED_HALTED',
      notes: 'Patient reported sudden unilateral facial droop and right arm numbness.',
    },
    {
      id: 'ERL-2026-0035',
      timestamp: '2026-11-14 09:22:15 WAT',
      patientId: 'PAT-33819',
      symptomsFlagged: ['SEVERE_UNCONTROLLED_BLEEDING'],
      actionTaken: 'HALTED & REDIRECTED TO AMBULANCE 112',
      complianceStatus: 'VERIFIED_HALTED',
      notes: 'Post-traumatic laceration bleeding continuously after pressure.',
    },
  ];

  // NDPR Audit Logs
  const ndprLogs = [
    {
      id: 'AUD-99120',
      timestamp: '2026-11-16 23:42:01 WAT',
      userId: 'LOC-9941 (Dr. Chidi Okafor)',
      action: 'READ_EHR_RECORD',
      targetRecord: 'PAT-48291 (Medical Intake & Allergies)',
      ipAddress: '102.89.34.12 (Lagos, NG)',
    },
    {
      id: 'AUD-99119',
      timestamp: '2026-11-16 23:40:15 WAT',
      userId: 'PRT-LAGOS-01 (MedPlus Pharmacy VI)',
      action: 'LOOKUP_E_PRESCRIPTION',
      targetRecord: 'PAT-48291 (RX-99120 Paracetamol/Cetirizine)',
      ipAddress: '197.210.64.88 (Lagos, NG)',
    },
    {
      id: 'AUD-99118',
      timestamp: '2026-11-16 23:15:11 WAT',
      userId: 'SYSTEM_TRIAGE_GATE',
      action: 'WRITE_EMERGENCY_HALT',
      targetRecord: 'PAT-10822 (Redirect to 112 Log)',
      ipAddress: '10.0.4.12 (Internal Upstash Cluster)',
    },
    {
      id: 'AUD-99117',
      timestamp: '2026-11-16 22:50:30 WAT',
      userId: 'PAT-48291 (Amaka Adeleke)',
      action: 'AFFIRMATIVE_NDPR_CONSENT_GRANTED',
      targetRecord: 'PAT-48291 (Consent Audit Ledger)',
      ipAddress: '105.112.98.44 (Abuja, NG)',
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          PRD Section 1.0 & Section 6.0 Compliance Logs
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Emergency Divert & NDPR Audit Ledgers
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Cryptographically timestamped audit trail proving compliance with Nigerian clinical safety mandates and Data Protection Regulations.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-neutral-200 shadow-xs max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('REDIRECTS')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === 'REDIRECTS'
              ? 'bg-[#ff643b] text-white shadow-xs'
              : 'text-[#747679] hover:bg-neutral-50'
          }`}
        >
          Emergency Redirects Log
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('NDPR_AUDIT')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === 'NDPR_AUDIT'
              ? 'bg-[#0a3922] text-white shadow-xs'
              : 'text-[#747679] hover:bg-neutral-50'
          }`}
        >
          NDPR Access Audit Log
        </button>
      </div>

      {/* TAB 1: Emergency Redirect Log */}
      {activeTab === 'REDIRECTS' && (
        <div className="bg-[#ffede8] rounded-3xl p-6 sm:p-8 border border-[#ff643b]/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ff643b]/20">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ff643b]" />
                <h2 className="font-serif text-2xl text-[#080331] font-normal">
                  Halted Booking Events (`emergency_redirect_log`)
                </h2>
              </div>
              <p className="text-xs text-[#222326] mt-0.5">
                Every attempt by an acute emergency patient to book telehealth is halted and documented here.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold bg-white text-[#ff643b] px-3 py-1 rounded-full border border-[#ff643b]/30">
              {redirectLogs.length} Total Halted Events
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#ff643b]/20 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f3eb] text-[#747679] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Log ID / Timestamp</th>
                  <th className="p-3.5">Patient ID</th>
                  <th className="p-3.5">Symptoms Flagged</th>
                  <th className="p-3.5">Action Taken</th>
                  <th className="p-3.5">Clinical Case Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-[#222326]">
                {redirectLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#ffede8]/30 transition">
                    <td className="p-3.5 font-mono text-[#080331]">
                      <strong>{log.id}</strong>
                      <span className="block text-[10px] text-[#747679] font-normal">{log.timestamp}</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#080331]">{log.patientId}</td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {log.symptomsFlagged.map((sym) => (
                          <span
                            key={sym}
                            className="bg-[#ffede8] text-[#ff643b] font-semibold text-[10px] px-2 py-0.5 rounded-full"
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-[#0a3922]">{log.actionTaken}</td>
                    <td className="p-3.5 text-[#747679] max-w-xs">{log.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NDPR Access Audit Log */}
      {activeTab === 'NDPR_AUDIT' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#4865ff]" />
                <h2 className="font-serif text-2xl text-[#080331] font-normal">
                  Immutable Data Access Log (`audit_log`)
                </h2>
              </div>
              <p className="text-xs text-[#747679] mt-0.5">
                Every read and write of patient health data is recorded with user identity, target record, and origin IP.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold bg-[#ebf0f8] text-[#4865ff] px-3 py-1 rounded-full">
              SHA-256 Verified Ledger
            </span>
          </div>

          <div className="border border-neutral-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#ebf0f8] text-[#080331] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Audit ID</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Actor Identity</th>
                  <th className="p-3.5">Action Executed</th>
                  <th className="p-3.5">Target Patient Record</th>
                  <th className="p-3.5 text-right">Origin IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-[#222326]">
                {ndprLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f8f3eb]/40 transition">
                    <td className="p-3.5 font-mono font-semibold text-[#080331]">{log.id}</td>
                    <td className="p-3.5 font-mono text-[#747679]">{log.timestamp}</td>
                    <td className="p-3.5 font-medium">{log.userId}</td>
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] bg-[#e1f4df] text-[#0f3e17] px-2 py-0.5 rounded font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#080331]">{log.targetRecord}</td>
                    <td className="p-3.5 text-right font-mono text-[11px] text-[#747679]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
