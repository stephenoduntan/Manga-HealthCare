'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  UserCheck,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';

export default function AdminOpsPage() {
  // Live Queue Data
  const [waitingQueue, setWaitingQueue] = useState([
    {
      patientId: 'PAT-48291',
      patientName: 'Amaka Adeleke',
      queueType: 'INSTANT_LOBBY',
      waitTime: '04:12',
      waitTimeSec: 252,
      triageCheck: 'CLEARED (0 Red Flags)',
      assignedSpecialty: 'General Practice',
    },
    {
      patientId: 'PAT-39102',
      patientName: 'Babatunde Ojo',
      queueType: 'INSTANT_LOBBY',
      waitTime: '07:38',
      waitTimeSec: 458,
      triageCheck: 'CLEARED (0 Red Flags)',
      assignedSpecialty: 'General Practice',
    },
    {
      patientId: 'PAT-66120',
      patientName: 'Halima Yusuf',
      queueType: 'INSTANT_LOBBY',
      waitTime: '02:05',
      waitTimeSec: 125,
      triageCheck: 'CLEARED (0 Red Flags)',
      assignedSpecialty: 'General Practice',
    },
  ]);

  // Active Consultations
  const activeConsultations = [
    {
      encounterId: 'ENC-2026-0819',
      patientId: 'PAT-88120',
      patientName: 'Ngozi Okeke',
      doctor: 'Dr. Chidi Okafor',
      doctorId: 'LOC-9941',
      duration: '11:40',
      status: 'VIDEO_IN_PROGRESS',
    },
    {
      encounterId: 'ENC-2026-0820',
      patientId: 'PAT-12093',
      patientName: 'Tunde Bakare',
      doctor: 'Dr. Folake Davies',
      doctorId: 'DOC-1102',
      duration: '06:15',
      status: 'EHR_DOCUMENTING',
    },
  ];

  // Urgent Locum Dispatch Modal
  const [isLocumModalOpen, setIsLocumModalOpen] = useState(false);
  const [locumName, setLocumName] = useState('Dr. Ikenna Madu');
  const [locumMdcn, setLocumMdcn] = useState('MDCN-84910');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const handleDispatchLocum = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setIsLocumModalOpen(false);
      alert(`Locum ID LOC-7740 issued to ${locumName} (${locumMdcn})! On-call alert sent.`);
    }, 1000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Banner & Surge Notification */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
            PRD Section 4.8 Live Operations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
            Instant Lobby & Clinical Queue Monitor
          </h1>
          <p className="text-xs sm:text-sm text-[#747679] mt-1">
            Real-time telemetry on waiting times, active video channels, and automated locum surge thresholds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLocumModalOpen(true)}
          className="bg-[#ff643b] text-white px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition shadow-[0_8px_20px_rgba(255,100,59,0.3)] flex items-center justify-center gap-2 active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Urgent Locum Dispatch / Issue Locum ID</span>
        </button>
      </div>

      {/* Operations Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#ebf0f8] p-6 rounded-3xl border border-[#4865ff]/20 space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4865ff]">
            Waiting Queue Depth
          </span>
          <div className="text-3xl font-serif text-[#080331]">{waitingQueue.length} Patients</div>
          <p className="text-[11px] text-[#747679]">Triage-cleared and paid</p>
        </div>

        <div className="bg-[#e1f4df] p-6 rounded-3xl border border-[#b1dbb8] space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0f3e17]">
            Active Consultations
          </span>
          <div className="text-3xl font-serif text-[#080331]">
            {activeConsultations.length} Live Calls
          </div>
          <p className="text-[11px] text-[#747679]">Doctors currently in session</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#ff643b]">
            Average Lobby Wait
          </span>
          <div className="text-3xl font-serif text-[#080331]">4m 38s</div>
          <p className="text-[11px] text-[#747679]">Target threshold: &lt; 7 mins</p>
        </div>

        <div className="bg-[#ffede8] p-6 rounded-3xl border border-[#ff643b]/20 space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#ff643b]">
            Emergency Diverts
          </span>
          <div className="text-3xl font-serif text-[#080331]">1 Patient Today</div>
          <p className="text-[11px] text-[#747679]">Halted & routed to 112</p>
        </div>
      </div>

      {/* Live Lobby Waiting Queue Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="font-serif text-2xl text-[#080331] font-normal">
              Waiting Patients (Instant Queue)
            </h2>
            <p className="text-xs text-[#747679] mt-0.5">
              Patients waiting for the next available MDCN general practitioner or locum doctor.
            </p>
          </div>
          <span className="text-xs bg-[#e1f4df] text-[#0f3e17] px-3 py-1 rounded-full font-semibold">
            {waitingQueue.length} In Queue
          </span>
        </div>

        <div className="border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f3eb] text-[#747679] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Patient ID</th>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Time in Queue</th>
                <th className="p-3.5">Triage Safety Status</th>
                <th className="p-3.5">Specialty</th>
                <th className="p-3.5 text-right">Ops Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-[#222326]">
              {waitingQueue.map((item) => {
                const isOverThreshold = item.waitTimeSec > 420; // 7 minutes
                return (
                  <tr key={item.patientId} className="hover:bg-[#f8f3eb]/40 transition">
                    <td className="p-3.5 font-mono font-bold text-[#080331]">{item.patientId}</td>
                    <td className="p-3.5 font-medium">{item.patientName}</td>
                    <td className="p-3.5">
                      <span
                        className={`font-mono font-bold ${
                          isOverThreshold ? 'text-[#ff643b]' : 'text-[#080331]'
                        }`}
                      >
                        {item.waitTime}
                      </span>
                      {isOverThreshold && (
                        <span className="ml-2 text-[10px] bg-[#ffede8] text-[#ff643b] px-2 py-0.5 rounded-full font-semibold">
                          Surge Alert (&gt;7m)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0f3e17] bg-[#e1f4df] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-[#31ce01]" />
                        <span>{item.triageCheck}</span>
                      </span>
                    </td>
                    <td className="p-3.5">{item.assignedSpecialty}</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Priority ping sent to available locums for ${item.patientId}`)}
                        className="text-xs text-[#4865ff] font-semibold hover:underline"
                      >
                        Priority Reassign
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Consultations Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="font-serif text-2xl text-[#080331] font-normal">
              Active Video Consultations
            </h3>
            <p className="text-xs text-[#747679] mt-0.5">
              Live WebRTC rooms currently connected between patient and physician.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0f3e17]">
            {activeConsultations.length} Active Encounters
          </span>
        </div>

        <div className="border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ebf0f8] text-[#080331] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Encounter ID</th>
                <th className="p-3.5">Patient</th>
                <th className="p-3.5">Attending Physician</th>
                <th className="p-3.5">Call Duration</th>
                <th className="p-3.5">Encounter Phase</th>
                <th className="p-3.5 text-right">Security Monitor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-[#222326]">
              {activeConsultations.map((call) => (
                <tr key={call.encounterId} className="hover:bg-[#f8f3eb]/40 transition">
                  <td className="p-3.5 font-mono font-bold text-[#080331]">{call.encounterId}</td>
                  <td className="p-3.5">
                    <strong>{call.patientName}</strong>
                    <span className="block font-mono text-[10px] text-[#747679]">{call.patientId}</span>
                  </td>
                  <td className="p-3.5">
                    <strong>{call.doctor}</strong>
                    <span className="block font-mono text-[10px] text-[#747679]">{call.doctorId}</span>
                  </td>
                  <td className="p-3.5 font-mono">{call.duration}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] bg-[#e1f4df] text-[#0f3e17] px-2 py-0.5 rounded-full font-semibold">
                      {call.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-[10px] text-[#31ce01]">
                    ● Encrypted TLS
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Urgent Locum Dispatch Modal */}
      {isLocumModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-neutral-200">
            <button
              type="button"
              onClick={() => setIsLocumModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="eyebrow-label text-[#ff643b] bg-[#ffede8] px-3 py-1 rounded-full">
                Surge Protection
              </span>
              <h3 className="font-serif text-2xl text-[#080331] font-normal mt-2">
                Urgent Locum Dispatch & ID Issuance
              </h3>
              <p className="text-xs text-[#747679] mt-1">
                PRD Section 4.8: Instantly activate verified backup locum physicians to reduce lobby wait times below 7 minutes.
              </p>
            </div>

            <form onSubmit={handleDispatchLocum} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                  Locum Physician Name
                </label>
                <input
                  type="text"
                  value={locumName}
                  onChange={(e) => setLocumName(e.target.value)}
                  className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331] mb-1">
                  MDCN License Folio
                </label>
                <input
                  type="text"
                  value={locumMdcn}
                  onChange={(e) => setLocumMdcn(e.target.value)}
                  className="w-full text-sm font-mono border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff] bg-[#f8f3eb]/20 font-bold"
                  required
                />
              </div>

              <div className="p-3 bg-[#e1f4df] rounded-xl border border-[#b1dbb8] text-xs text-[#0f3e17]">
                <strong>Assigned Temporary Locum ID:</strong> <span className="font-mono font-bold">LOC-7740</span>
                <p className="text-[11px] mt-0.5">Authorizes instant access to patient lobby queue for 12 hours.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLocumModalOpen(false)}
                  className="text-xs font-semibold text-[#747679] px-4 py-2 hover:text-[#080331]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatchSuccess}
                  className="bg-[#ff643b] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition shadow-xs"
                >
                  {dispatchSuccess ? 'Dispatching...' : 'Authorize & Dispatch Locum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
