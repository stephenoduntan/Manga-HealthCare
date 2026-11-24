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
      className={`fixed left-0 right-0 z-50 bg-[#0a3922] text-white py-3 px-6 shadow-[0_-4px_16px_rgba(0,0,0,0.2)] ${
        isTop ? 'top-0 border-b border-[#ff643b]/30' : 'bottom-0 border-t border-[#ff643b]/30'
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff643b] shadow-[0_0_10px_#ff643b] inline-block shrink-0" />
          <p className="text-[13px] text-[#f8f3eb] m-0 font-normal">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${ambulanceNumber}`}
            className="bg-[#ff643b] text-white py-2 px-4.5 rounded-full text-[13px] font-semibold no-underline inline-flex items-center gap-1.5 shadow-[0_4px_8px_rgba(75,68,57,0.2)] hover:brightness-110 transition"
          >
            <span>🚨 Call {ambulanceNumber}</span>
          </a>

          <a
            href={`tel:${lagosEmergencyNumber}`}
            className="bg-white/12 text-white border border-white/30 py-1.5 px-4 rounded-full text-[13px] font-medium no-underline inline-flex items-center gap-1.5 hover:bg-white/20 transition"
          >
            <span>Ambulance ({lagosEmergencyNumber})</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
