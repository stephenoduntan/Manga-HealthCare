'use client';

import React from 'react';

export interface PersistentEmergencyBarProps {
  position?: 'top' | 'bottom';
  message?: string;
  ambulanceNumber?: string;
  lagosEmergencyNumber?: string;
}

export function PersistentEmergencyBar({
  position = 'bottom',
  message = 'Telemedicine is for non-emergencies. In crisis or acute chest pain, tap to call emergency ambulance:',
  ambulanceNumber = '112',
  lagosEmergencyNumber = '767',
}: PersistentEmergencyBarProps) {
  const isTop = position === 'top';

  return (
    <aside
      aria-label="Emergency Ambulance Hotlines"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        [isTop ? 'top' : 'bottom']: 0,
        zIndex: 50,
        backgroundColor: '#0a3922',
        color: '#ffffff',
        borderTop: isTop ? 'none' : '1px solid rgba(255, 100, 59, 0.3)',
        borderBottom: isTop ? '1px solid rgba(255, 100, 59, 0.3)' : 'none',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px -4px 16px 0px',
        padding: '12px 24px',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#ff643b',
              boxShadow: '0 0 10px #ff643b',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <p style={{ fontSize: '13px', color: '#f8f3eb', margin: 0, fontWeight: 400 }}>
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${ambulanceNumber}`}
            style={{
              backgroundColor: '#ff643b',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'rgba(75, 68, 57, 0.2) 0px 4px 8px 0px',
            }}
          >
            <span>🚨 Call {ambulanceNumber}</span>
          </a>

          <a
            href={`tel:${lagosEmergencyNumber}`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Ambulance ({lagosEmergencyNumber})</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
