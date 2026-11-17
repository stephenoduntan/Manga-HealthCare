import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import { sendLocalNotification } from '../../src/services/notifications';

interface ConsultationRecord {
  id: string;
  date: string;
  doctorName: string;
  specialty: string;
  assessment: string;
  prescription: {
    id: string;
    items: Array<{
      drug: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
  };
}

export default function MobileRecordsScreen() {
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null);

  const mockRecords: ConsultationRecord[] = [
    {
      id: 'cons-001',
      date: 'Today, 10:15 AM',
      doctorName: 'Dr. Amina Bello (Locum)',
      specialty: 'General Practice',
      assessment: 'Acute viral pharyngitis with mild pyrexia',
      prescription: {
        id: 'RX-99120',
        items: [
          { drug: 'Paracetamol Tablets', dosage: '1000mg', frequency: 'TDS (3x daily)', duration: '5 days' },
          { drug: 'Cetirizine Syrup', dosage: '10ml', frequency: 'OD (nightly)', duration: '5 days' },
          { drug: 'Vitamin C 1000mg', dosage: '1 tablet', frequency: 'OD (morning)', duration: '10 days' },
        ],
      },
    },
    {
      id: 'cons-002',
      date: '12 Nov 2026',
      doctorName: 'Dr. Chidi Okafor',
      specialty: 'General Practice',
      assessment: 'Seasonal allergic rhinitis',
      prescription: {
        id: 'RX-88421',
        items: [
          { drug: 'Loratadine Tablets', dosage: '10mg', frequency: 'OD (daily)', duration: '7 days' },
        ],
      },
    },
  ];

  const handleSharePrescription = async (record: ConsultationRecord) => {
    try {
      const rxSummary =
        `MANGA HEALTHCARE — Electronic Prescription (${record.prescription.id})\n` +
        `Patient: Amaka Adeleke (PAT-48291)\n` +
        `Prescribing Doctor: ${record.doctorName}\n` +
        `Date: ${record.date}\n` +
        `Diagnosis: ${record.assessment}\n\n` +
        `Prescribed Medications:\n` +
        record.prescription.items
          .map((item, idx) => `${idx + 1}. ${item.drug} — ${item.dosage} | ${item.frequency} for ${item.duration}`)
          .join('\n') +
        `\n\nOfficial MDCN License Verified. Partner Pharmacies may dispense upon verifying Patient ID.`;

      // Use native share
      await Share.share({
        title: `Manga Healthcare Rx ${record.prescription.id}`,
        message: rxSummary,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleSetFollowupReminder = async (record: ConsultationRecord) => {
    await sendLocalNotification(
      'Follow-up Reminder Set',
      `Reminder scheduled for your consultation with ${record.doctorName} in 7 days.`
    );
    Alert.alert('Reminder Set', 'You will receive a notification in 7 days to review your symptoms.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Medical Records & Rx</Text>
      <Text style={styles.subtitle}>NDPR Encrypted Clinical Continuity</Text>

      <View style={styles.recordsList}>
        {mockRecords.map((record) => (
          <View key={record.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.doctorName}>{record.doctorName}</Text>
                <Text style={styles.specialtyText}>{record.specialty} • {record.date}</Text>
              </View>
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedText}>MDCN Verified</Text>
              </View>
            </View>

            <View style={styles.assessmentBox}>
              <Text style={styles.assessmentLabel}>Clinical Diagnosis / Assessment:</Text>
              <Text style={styles.assessmentText}>{record.assessment}</Text>
            </View>

            {/* Prescriptions Box */}
            <View style={styles.rxBox}>
              <View style={styles.rxHeader}>
                <Text style={styles.rxTitle}>E-Prescription ({record.prescription.id})</Text>
                <Text style={styles.rxItemCount}>{record.prescription.items.length} items</Text>
              </View>

              {record.prescription.items.map((item, idx) => (
                <View key={idx} style={styles.rxItemRow}>
                  <Text style={styles.rxDrugName}>• {item.drug} ({item.dosage})</Text>
                  <Text style={styles.rxDosage}>{item.frequency} x {item.duration}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.shareRxButton}
                onPress={() => handleSharePrescription(record)}
              >
                <Text style={styles.shareRxButtonText}>📤 Share / Print Rx PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reminderButton}
                onPress={() => handleSetFollowupReminder(record)}
              >
                <Text style={styles.reminderButtonText}>🔔 Set Follow-up</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f3eb',
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#080331',
  },
  subtitle: {
    fontSize: 13,
    color: '#747679',
    marginTop: 2,
    marginBottom: 20,
  },
  recordsList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#efeeeb',
    gap: 12,
    shadowColor: '#4b4439',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#080331',
  },
  specialtyText: {
    fontSize: 12,
    color: '#747679',
    marginTop: 2,
  },
  verifiedPill: {
    backgroundColor: '#e1f4df',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  verifiedText: {
    color: '#0f3e17',
    fontSize: 10,
    fontWeight: '700',
  },
  assessmentBox: {
    backgroundColor: '#f8f3eb',
    padding: 12,
    borderRadius: 10,
  },
  assessmentLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#747679',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  assessmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#080331',
  },
  rxBox: {
    borderWidth: 1,
    borderColor: '#e1f4df',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  rxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f3e17',
  },
  rxItemCount: {
    fontSize: 11,
    color: '#747679',
  },
  rxItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rxDrugName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#080331',
    flex: 1,
  },
  rxDosage: {
    fontSize: 11,
    color: '#747679',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  shareRxButton: {
    flex: 1,
    backgroundColor: '#0f3e17',
    paddingVertical: 10,
    borderRadius: 9999,
    alignItems: 'center',
  },
  shareRxButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  reminderButton: {
    backgroundColor: '#ebf0f8',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 9999,
    alignItems: 'center',
  },
  reminderButtonText: {
    color: '#4865ff',
    fontSize: 12,
    fontWeight: '600',
  },
});
