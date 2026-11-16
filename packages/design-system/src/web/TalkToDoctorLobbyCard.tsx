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
    <div
      style={{
        backgroundColor: '#0a3922',
        borderRadius: '24px',
        padding: '36px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'rgba(75, 68, 57, 0.12) 0px 16px 32px 0px',
      }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Background Subtle Wave Accent */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29, 191, 115, 0.15) 0%, rgba(10, 57, 34, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-xl">
          {/* Status Eyebrow with Pulsing Beacon */}
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#d2f2e3] mb-4">
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#31ce01',
                boxShadow: '0 0 8px #31ce01',
                display: 'inline-block',
              }}
            />
            <span>Instant Lobby Active • {doctorsOnline} MDCN Doctors On Duty</span>
          </div>

          <h2
            style={{
              fontFamily: "'DM Serif Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: '34px',
              fontWeight: 400,
              lineHeight: '1.2',
              color: '#ffffff',
              margin: '0 0 10px 0',
              letterSpacing: '-0.025em',
            }}
          >
            Talk to a Licensed Doctor Now
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: '#b1dbb8',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            Skip the waiting room. Enter our digital lobby queue to consult an MDCN-certified general physician or locum in minutes via high-definition video, audio, or secure chat.
          </p>

          {/* Real-time queue metrics */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/10">
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#b1dbb8', letterSpacing: '0.08em' }}>
                Current Queue Position
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '2px' }}>
                #{queuePosition} in line
              </div>
            </div>

            <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#b1dbb8', letterSpacing: '0.08em' }}>
                Est. Connection Time
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#31ce01', letterSpacing: '-0.02em', marginTop: '2px' }}>
                ~{estimatedWaitMinutes} mins
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Coral Filled Button + Ghost Outline Button */}
        <div className="flex flex-col gap-3.5 sm:min-w-[200px]">
          <button
            type="button"
            onClick={onJoinQueue}
            style={{
              backgroundColor: '#ff643b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '16px 28px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: 'rgba(75, 68, 57, 0.2) 0px 8px 16px 0px',
              transition: 'transform 0.15s ease, filter 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.filter = 'brightness(1.0)')}
          >
            Enter Lobby Queue
          </button>

          <button
            type="button"
            onClick={onScheduleSlot}
            style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '9999px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
          >
            Schedule for Later
          </button>
        </div>
      </div>
    </div>
  );
}
