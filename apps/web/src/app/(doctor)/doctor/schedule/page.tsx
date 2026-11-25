'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { authorizedApiFetch } from '@/lib/api-client';

interface TimeSlot {
  id: string;
  day: string;
  timeRange: string;
  slotType: 'GENERAL' | 'THERAPY_MANDATORY';
  isBooked: boolean;
}

export default function DoctorSchedulePage() {
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: 'slot-1', day: 'Tomorrow (Wed)', timeRange: '10:00 AM - 10:30 AM', slotType: 'GENERAL', isBooked: true },
    { id: 'slot-2', day: 'Tomorrow (Wed)', timeRange: '11:00 AM - 11:45 AM', slotType: 'THERAPY_MANDATORY', isBooked: true },
    { id: 'slot-3', day: 'Tomorrow (Wed)', timeRange: '02:00 PM - 02:30 PM', slotType: 'GENERAL', isBooked: false },
    { id: 'slot-4', day: 'Thursday', timeRange: '04:00 PM - 04:45 PM', slotType: 'THERAPY_MANDATORY', isBooked: false },
  ]);

  const [newDay, setNewDay] = useState('Friday');
  const [newTimeRange, setNewTimeRange] = useState('09:30 AM - 10:15 AM');
  const [newType, setNewType] = useState<'GENERAL' | 'THERAPY_MANDATORY'>('THERAPY_MANDATORY');

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDay.trim() || !newTimeRange.trim()) return;
    const res = await authorizedApiFetch('/api/v1/doctors/slots', {
      method: 'POST',
      body: JSON.stringify({
        day: newDay.trim(),
        time_range: newTimeRange.trim(),
        slot_type: newType,
      }),
    });
    const slotId = res.data?.id || `slot-${Date.now()}`;
    setSlots((prev) => [
      ...prev,
      {
        id: slotId,
        day: newDay,
        timeRange: newTimeRange,
        slotType: newType,
        isBooked: false,
      },
    ]);
  };

  const handleRemoveSlot = async (id: string) => {
    await authorizedApiFetch(`/api/v1/doctors/slots/${id}`, { method: 'DELETE' });
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <span className="eyebrow-label text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full border border-[#b1dbb8]">
          Availability Calendar Manager (/doctor/schedule)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Scheduled Slots & Mandatory Therapy Calendar
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Create time slots for general appointments and protected 45-minute therapy sessions. Booked slots lock atomically in PostgreSQL.
        </p>
      </div>

      {/* Create New Slot Card */}
      <form
        onSubmit={handleAddSlot}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-5"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#080331]">
          <Calendar className="w-4 h-4 text-[#4865ff]" />
          <span>Publish New Availability Slot</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#747679] mb-1">
              Day / Date
            </label>
            <input
              type="text"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="w-full text-sm border border-neutral-200 rounded-xl px-3.5 py-2.5 bg-[#f8f3eb]/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#747679] mb-1">
              Time Window (WAT)
            </label>
            <input
              type="text"
              value={newTimeRange}
              onChange={(e) => setNewTimeRange(e.target.value)}
              className="w-full text-sm border border-neutral-200 rounded-xl px-3.5 py-2.5 bg-[#f8f3eb]/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#747679] mb-1">
              Session Track
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as 'GENERAL' | 'THERAPY_MANDATORY')}
              className="w-full text-sm border border-neutral-200 rounded-xl px-3.5 py-2.5 bg-[#f8f3eb]/20"
            >
              <option value="THERAPY_MANDATORY">Therapy Mandatory Slot (45m)</option>
              <option value="GENERAL">General Scheduled Consult (30m)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#0a3922] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0f3e17] inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Availability Slot</span>
          </button>
        </div>
      </form>

      {/* Active Slots List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-xs space-y-4">
        <h2 className="font-serif text-2xl text-[#080331] font-normal">
          Published Calendar Slots ({slots.length})
        </h2>

        <div className="space-y-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="p-4 rounded-2xl bg-[#f8f3eb]/70 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#0a3922]" />
                <div>
                  <strong className="text-sm text-[#080331] block">
                    {slot.day} • {slot.timeRange}
                  </strong>
                  <span
                    className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                      slot.slotType === 'THERAPY_MANDATORY'
                        ? 'bg-[#ebf0f8] text-[#4865ff]'
                        : 'bg-[#e1f4df] text-[#0f3e17]'
                    }`}
                  >
                    {slot.slotType === 'THERAPY_MANDATORY'
                      ? 'Therapy Protected Slot'
                      : 'General Consultation Slot'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {slot.isBooked ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#31ce01]" /> Booked (Locked)
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-medium text-[#747679]">Open for Booking</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="text-xs text-[#ff643b] hover:underline inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
