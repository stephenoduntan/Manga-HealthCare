import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  slotType: 'SCHEDULED' | 'THERAPY_MANDATORY_SLOT';
  isBooked: boolean;
  bookedPatient?: {
    patientId: string;
    name: string;
    notes: string;
  };
}

export default function DoctorScheduleScreen() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow' | 'later'>('today');
  const [isSurgeOptedIn, setIsSurgeOptedIn] = useState(true);

  const [slots, setSlots] = useState<AvailabilitySlot[]>([
    {
      id: 'slot-1',
      startTime: '09:00 AM',
      endTime: '09:45 AM',
      date: 'Today, Nov 17',
      slotType: 'THERAPY_MANDATORY_SLOT',
      isBooked: true,
      bookedPatient: {
        patientId: 'PAT-78192',
        name: 'Funke Akindele',
        notes: 'Cognitive Behavioral Therapy - 4th Session (Scheduled)',
      },
    },
    {
      id: 'slot-2',
      startTime: '10:30 AM',
      endTime: '11:00 AM',
      date: 'Today, Nov 17',
      slotType: 'SCHEDULED',
      isBooked: true,
      bookedPatient: {
        patientId: 'PAT-40912',
        name: 'Babatunde Fashola',
        notes: 'Post-malaria checkup & hypertension review',
      },
    },
    {
      id: 'slot-3',
      startTime: '02:00 PM',
      endTime: '02:45 PM',
      date: 'Today, Nov 17',
      slotType: 'THERAPY_MANDATORY_SLOT',
      isBooked: false,
    },
    {
      id: 'slot-4',
      startTime: '03:30 PM',
      endTime: '04:00 PM',
      date: 'Today, Nov 17',
      slotType: 'SCHEDULED',
      isBooked: false,
    },
    {
      id: 'slot-5',
      startTime: '05:00 PM',
      endTime: '05:45 PM',
      date: 'Today, Nov 17',
      slotType: 'THERAPY_MANDATORY_SLOT',
      isBooked: false,
    },
  ]);

  const handleAddSlot = (type: 'SCHEDULED' | 'THERAPY_MANDATORY_SLOT') => {
    const newId = `slot-${Date.now()}`;
    const newSlot: AvailabilitySlot = {
      id: newId,
      startTime: '06:00 PM',
      endTime: type === 'THERAPY_MANDATORY_SLOT' ? '06:45 PM' : '06:30 PM',
      date: selectedDay === 'today' ? 'Today, Nov 17' : selectedDay === 'tomorrow' ? 'Tomorrow, Nov 18' : 'Nov 19',
      slotType: type,
      isBooked: false,
    };
    setSlots((prev) => [...prev, newSlot]);
    Alert.alert('Slot Added', `Added open ${type === 'THERAPY_MANDATORY_SLOT' ? 'Therapy (45m)' : 'General (30m)'} slot for booking.`);
  };

  const handleRemoveSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleJoinCall = (patientId: string) => {
    router.push(`/(doctor-tabs)/consultation/${patientId}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Calendar & Availability</Text>
        <Text style={styles.subtitle}>
          Manage booked appointments, open consultation windows, and mandatory therapy sessions.
        </Text>
      </View>

      {/* PRD Mandatory Therapy Rule Callout */}
      <View style={styles.ruleCard}>
        <View style={styles.ruleHeader}>
          <Text style={styles.ruleIcon}>📋</Text>
          <Text style={styles.ruleTitle}>PRD Rule: Mandatory Therapy Scheduling</Text>
        </View>
        <Text style={styles.ruleDescription}>
          Per MANGA PRD Section 6, mental health & therapy sessions <Text style={styles.boldText}>CANNOT</Text> use the instant lobby queue. All therapy consultations require scheduled calendar slots to protect clinical continuity and therapist preparation.
        </Text>
      </View>

      {/* Locum Surge Shift Opt-In Bento */}
      <View style={styles.surgeCard}>
        <View style={styles.surgeTextGroup}>
          <Text style={styles.surgeTitle}>Locum Surge Alert Response</Text>
          <Text style={styles.surgeSubtitle}>
            Opt in to receive high-priority push notifications when instant queue wait exceeds 5 minutes.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.surgeToggle, isSurgeOptedIn ? styles.surgeActive : styles.surgeInactive]}
          onPress={() => setIsSurgeOptedIn(!isSurgeOptedIn)}
        >
          <Text style={[styles.surgeToggleText, { color: isSurgeOptedIn ? '#ffffff' : '#080331' }]}>
            {isSurgeOptedIn ? 'ACTIVE (Surge Opt-In)' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Switcher */}
      <View style={styles.dateSelectorRow}>
        <TouchableOpacity
          style={[styles.dateTab, selectedDay === 'today' && styles.dateTabActive]}
          onPress={() => setSelectedDay('today')}
        >
          <Text style={[styles.dateTabText, selectedDay === 'today' && styles.dateTabTextActive]}>
            Today (Nov 17)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dateTab, selectedDay === 'tomorrow' && styles.dateTabActive]}
          onPress={() => setSelectedDay('tomorrow')}
        >
          <Text style={[styles.dateTabText, selectedDay === 'tomorrow' && styles.dateTabTextActive]}>
            Tomorrow (Nov 18)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dateTab, selectedDay === 'later' && styles.dateTabActive]}
          onPress={() => setSelectedDay('later')}
        >
          <Text style={[styles.dateTabText, selectedDay === 'later' && styles.dateTabTextActive]}>
            Upcoming (Nov 19+)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Add Slot Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.addSlotBtn, styles.generalBtn]}
          onPress={() => handleAddSlot('SCHEDULED')}
        >
          <Text style={styles.generalBtnText}>+ Add 30m General Slot</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addSlotBtn, styles.therapyBtn]}
          onPress={() => handleAddSlot('THERAPY_MANDATORY_SLOT')}
        >
          <Text style={styles.therapyBtnText}>+ Add 45m Therapy Slot</Text>
        </TouchableOpacity>
      </View>

      {/* Slots List */}
      <View style={styles.slotListSection}>
        <Text style={styles.sectionHeader}>Configured Slots for {selectedDay.toUpperCase()}</Text>

        {slots.map((slot) => {
          const isTherapy = slot.slotType === 'THERAPY_MANDATORY_SLOT';
          return (
            <View
              key={slot.id}
              style={[
                styles.slotCard,
                slot.isBooked ? styles.slotCardBooked : styles.slotCardAvailable,
              ]}
            >
              <View style={styles.slotTopRow}>
                <View style={styles.timeGroup}>
                  <Text style={styles.timeText}>{slot.startTime} – {slot.endTime}</Text>
                  <View
                    style={[
                      styles.typeBadge,
                      isTherapy ? styles.typeTherapy : styles.typeGeneral,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        isTherapy ? styles.therapyBadgeColor : styles.generalBadgeColor,
                      ]}
                    >
                      {isTherapy ? '🧠 Therapy (Mandatory Slot)' : '🩺 General Medicine'}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    slot.isBooked ? styles.statusPillBooked : styles.statusPillOpen,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      slot.isBooked ? styles.statusTextBooked : styles.statusTextOpen,
                    ]}
                  >
                    {slot.isBooked ? '● BOOKED' : '○ OPEN'}
                  </Text>
                </View>
              </View>

              {slot.isBooked && slot.bookedPatient ? (
                <View style={styles.patientInfoBox}>
                  <Text style={styles.patientNameText}>{slot.bookedPatient.name}</Text>
                  <Text style={styles.patientIdText}>ID: {slot.bookedPatient.patientId}</Text>
                  <Text style={styles.patientNotesText}>{slot.bookedPatient.notes}</Text>

                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => handleJoinCall(slot.bookedPatient!.patientId)}
                  >
                    <Text style={styles.joinButtonText}>Open EHR & Video Room →</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.availableBox}>
                  <Text style={styles.availableText}>Available for patient self-booking</Text>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemoveSlot(slot.id)}
                  >
                    <Text style={styles.removeBtnText}>Remove Slot</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f3eb',
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#080331',
  },
  subtitle: {
    fontSize: 13,
    color: '#747679',
    marginTop: 4,
    lineHeight: 18,
  },
  ruleCard: {
    backgroundColor: '#e1f4df',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#b1dbb8',
    marginBottom: 16,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ruleIcon: {
    fontSize: 16,
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0a3922',
  },
  ruleDescription: {
    fontSize: 12,
    color: '#0f3e17',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
  surgeCard: {
    backgroundColor: '#ebf0f8',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#b6ced5',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surgeTextGroup: {
    flex: 1,
    marginRight: 10,
  },
  surgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#080331',
  },
  surgeSubtitle: {
    fontSize: 11,
    color: '#747679',
    marginTop: 2,
    lineHeight: 15,
  },
  surgeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  surgeActive: {
    backgroundColor: '#0a3922',
  },
  surgeInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#efeeeb',
  },
  surgeToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dateTab: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#efeeeb',
  },
  dateTabActive: {
    backgroundColor: '#080331',
    borderColor: '#080331',
  },
  dateTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#747679',
  },
  dateTabTextActive: {
    color: '#ffffff',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  addSlotBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  generalBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#4865ff',
  },
  generalBtnText: {
    color: '#4865ff',
    fontWeight: '600',
    fontSize: 12,
  },
  therapyBtn: {
    backgroundColor: '#0a3922',
  },
  therapyBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  slotListSection: {
    gap: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#080331',
    marginBottom: 4,
  },
  slotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  slotCardBooked: {
    borderColor: 'rgba(72, 101, 255, 0.3)',
    shadowColor: 'rgba(75, 68, 57, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  slotCardAvailable: {
    borderColor: '#efeeeb',
  },
  slotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  timeGroup: {
    gap: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#080331',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeTherapy: {
    backgroundColor: '#e1f4df',
  },
  typeGeneral: {
    backgroundColor: '#ebf0f8',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  therapyBadgeColor: {
    color: '#0a3922',
  },
  generalBadgeColor: {
    color: '#4865ff',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusPillBooked: {
    backgroundColor: 'rgba(72, 101, 255, 0.1)',
  },
  statusPillOpen: {
    backgroundColor: 'rgba(49, 206, 1, 0.15)',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextBooked: {
    color: '#4865ff',
  },
  statusTextOpen: {
    color: '#0f3e17',
  },
  patientInfoBox: {
    backgroundColor: '#f8f3eb',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  patientNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#080331',
  },
  patientIdText: {
    fontSize: 11,
    color: '#747679',
    marginTop: 1,
  },
  patientNotesText: {
    fontSize: 12,
    color: '#080331',
    marginTop: 4,
    lineHeight: 16,
  },
  joinButton: {
    backgroundColor: '#0a3922',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  joinButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  availableBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#efeeeb',
  },
  availableText: {
    fontSize: 11,
    color: '#747679',
  },
  removeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeBtnText: {
    color: '#ff643b',
    fontSize: 11,
    fontWeight: '600',
  },
});
