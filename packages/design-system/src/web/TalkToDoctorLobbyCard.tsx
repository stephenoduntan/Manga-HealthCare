'use client';

import React from 'react';

export interface TalkToDoctorLobbyCardProps {
  queuePosition?: number;
  estimatedWaitMinutes?: number;
  doctorsOnline?: number;
  onJoinQueue?: () => void;
  onScheduleSlot?: () => void;
}

export function TalkToDoctorLobbyCard({
  queuePosition = 2,
  estimatedWaitMinutes = 4,
  doctorsOnline = 7,
  onJoinQueue,
  onScheduleSlot,
}: TalkToDoctorLobbyCardProps) {
  return (
    <div className="bg-[#0a3922] rounded-3xl p-6 sm:p-9 text-white relative overflow-hidden shadow-[0_16px_32px_rgba(75,68,57,0.12)] w-full max-w-3xl mx-auto">
      {/* Background Subtle Wave Accent */}
      <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(29,191,115,0.15)_0%,rgba(10,57,34,0)_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
        <div className="max-w-xl">
          {/* Status Eyebrow with Pulsing Beacon */}
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#d2f2e3] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#31ce01] shadow-[0_0_8px_#31ce01] inline-block" />
            <span>Instant Lobby Active</span>
            <span className="opacity-60">•</span>
            <span>{doctorsOnline} Doctors On Duty</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight tracking-[-0.025em] mb-2 text-white">
            Talk to a Licensed Doctor Now
          </h2>

          <p className="text-sm text-[#d2f2e3] leading-relaxed mb-6 max-w-md">
            Connect immediately via encrypted video, voice, or low-bandwidth chat. Certified MDCN physicians ready for triage-cleared consultations.
          </p>

          {/* Real-Time Queue Telemetry Bento */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-[#d2f2e3] block">
                Queue Position
              </span>
              <span className="text-xl font-bold font-mono tracking-tight text-white">
                #{queuePosition} in Line
              </span>
            </div>

            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-[#d2f2e3] block">
                Estimated Wait
              </span>
              <span className="text-xl font-bold font-mono tracking-tight text-[#ffca00]">
                ~{estimatedWaitMinutes} mins
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={onJoinQueue}
            className="w-full md:w-auto bg-[#ff643b] hover:bg-[#e0532c] text-white px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide uppercase transition-all shadow-[0_12px_24px_rgba(255,100,59,0.35)] cursor-pointer text-center"
          >
            Enter Queue (₦10,000)
          </button>

          <button
            type="button"
            onClick={onScheduleSlot}
            className="w-full md:w-auto bg-transparent hover:bg-white/10 text-white border border-white/30 px-7 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer text-center"
          >
            Book Scheduled Slot
          </button>
        </div>
      </div>
    </div>
  );
}
