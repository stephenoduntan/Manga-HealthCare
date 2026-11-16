'use client';

import React from 'react';

export interface DoctorPayoutBentoProps {
  doctorName?: string;
  providerId?: string;
  totalPatientsSeen?: number;
  accruedFeesNgn?: number;
  daysUntilBiweeklyPayout?: number;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export function DoctorPayoutBento({
  doctorName = 'Dr. Chidi Okafor',
  providerId = 'LOC-8492',
  totalPatientsSeen = 24,
  accruedFeesNgn = 186000,
  daysUntilBiweeklyPayout = 4,
  verificationStatus = 'VERIFIED',
}: DoctorPayoutBentoProps) {
  // Calculate payout cycle completion percentage for the circular ring (14-day cycle)
  const cycleDaysTotal = 14;
  const cycleDaysCompleted = Math.max(0, cycleDaysTotal - daysUntilBiweeklyPayout);
  const cyclePercentage = Math.round((cycleDaysCompleted / cycleDaysTotal) * 100);
  const strokeDashoffset = 283 - (283 * cyclePercentage) / 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div
        style={{
          backgroundColor: '#ebf0f8',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#415eee',
                  backgroundColor: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                Provider Ledger (Beta)
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#0f3e17',
                  backgroundColor: '#e1f4df',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                MDCN: {verificationStatus}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', 'Cormorant Garamond', Georgia, serif",
                fontSize: '28px',
                fontWeight: 400,
                color: '#222326',
                margin: '8px 0 2px 0',
                letterSpacing: '-0.025em',
              }}
            >
              {doctorName}
            </h2>
            <p style={{ fontSize: '13px', color: '#747679', margin: 0 }}>
              Assigned ID: <strong style={{ color: '#222326' }}>{providerId}</strong> • Biweekly Automatic Settlement
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '12px 20px',
              borderRadius: '16px',
              border: '1px solid #efeeeb',
            }}
          >
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#747679', letterSpacing: '0.08em' }}>
              Cycle Frequency
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#222326', marginTop: '2px' }}>
              Biweekly (Every 2nd Friday)
            </div>
          </div>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Accrued Fees */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'rgba(75, 68, 57, 0.04) 0px 4px 8px 0px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#747679', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Accrued Consultation Fees
            </span>
            <div className="my-3">
              <span
                style={{
                  fontSize: '38px',
                  fontWeight: 600,
                  color: '#222326',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                ₦{accruedFeesNgn.toLocaleString()}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#31ce01', fontWeight: 500 }}>
              ✓ Locked for next payout cycle
            </span>
          </div>

          {/* Card 2: Patients Seen */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'rgba(75, 68, 57, 0.04) 0px 4px 8px 0px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#747679', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Patients Consulted
            </span>
            <div className="my-3">
              <span
                style={{
                  fontSize: '38px',
                  fontWeight: 600,
                  color: '#222326',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {totalPatientsSeen}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#415eee', fontWeight: 500 }}>
              100% structured note compliance
            </span>
          </div>

          {/* Card 3: Payout Ring & Countdown */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'rgba(75, 68, 57, 0.04) 0px 4px 8px 0px',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#747679', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Next Settlement
              </span>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: '#222326',
                  letterSpacing: '-0.03em',
                  marginTop: '4px',
                }}
              >
                {daysUntilBiweeklyPayout} days
              </div>
              <span style={{ fontSize: '12px', color: '#747679' }}>
                {cyclePercentage}% cycle completed
              </span>
            </div>

            {/* Circular Ring SVG in Recovery Green */}
            <div style={{ position: 'relative', width: '70px', height: '70px' }}>
              <svg width="70" height="70" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#ebf0f8"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#31ce01"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#080331',
                }}
              >
                {cyclePercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
