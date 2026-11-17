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

export default function DoctorHomeScreen() {
  const { user, switchRole, logout } = useAuth();
  const [isOnDuty, setIsOnDuty] = useState(true);

  const mockWaitingPatients = [
    {
      id: 'book-001',
      patientId: 'PAT-48291',
      name: 'Amaka Adeleke',
      chiefComplaint: 'Low-grade fever and nasal congestion for 2 days',
      waitMinutes: 3,
      triageStatus: 'CLEARED (0 Red Flags)',
    },
    {
      id: 'book-002',
      patientId: 'PAT-10822',
      name: 'Emeka Nwosu',
      chiefComplaint: 'Mild rash on left arm after gardening',
      waitMinutes: 6,
      triageStatus: 'CLEARED (0 Red Flags)',
    },
  ];

  const handleClaimPatient = (patient: typeof mockWaitingPatients[0]) => {
    Alert.alert(
      'Claim Consultation',
      `Accept incoming patient ${patient.name} (${patient.patientId})? This will start your consultation session and EHR documentation.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Open Room',
          onPress: () => router.push(`/(doctor-tabs)/consultation/${patient.patientId}`),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Doctor Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Practitioner Workspace</Text>
            <Text style={styles.doctorName}>{user?.name || 'Dr. Amina Bello (Locum)'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.dutyPill, isOnDuty ? styles.dutyOn : styles.dutyOff]}
            onPress={() => setIsOnDuty(!isOnDuty)}
          >
            <View style={[styles.dutyDot, { backgroundColor: isOnDuty ? '#31ce01' : '#747679' }]} />
            <Text style={[styles.dutyText, { color: isOnDuty ? '#0f3e17' : '#747679' }]}>
              {isOnDuty ? 'On Duty' : 'Off Duty'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.credentialRow}>
          <Text style={styles.credentialBadge}>MDCN: Verified (#MDCN-78320)</Text>
          <Text style={styles.idBadge}>Public ID: {user?.publicId || 'LOC-9941'}</Text>
        </View>
      </View>

      {/* Bevel-Style Earnings Bento (Cloud Card #ebf0f8) */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsTitle}>Biweekly Provider Payout Ledger</Text>
        <Text style={styles.earningsSubtitle}>Next Settlement: In 3 days (1st / 15th cycle)</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Accrued Fees</Text>
            <Text style={styles.metricAmount}>₦210,000</Text>
            <Text style={styles.metricNote}>80% provider rate (₦7,500/visit)</Text>
          </View>

          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Patients Seen</Text>
            <Text style={styles.metricAmount}>28</Text>
            <Text style={styles.metricNote}>100% note compliance</Text>
          </View>
        </View>
      </View>

      {/* Live Lobby Queue Section */}
      <View style={styles.queueSection}>
        <View style={styles.queueHeader}>
          <View>
            <Text style={styles.queueTitle}>Instant Lobby Queue</Text>
            <Text style={styles.queueSubtitle}>{mockWaitingPatients.length} patients waiting</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Lobby Active</Text>
          </View>
        </View>

        {mockWaitingPatients.map((patient) => (
          <View key={patient.id} style={styles.patientCard}>
            <View style={styles.patientCardHeader}>
              <View>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientId}>{patient.patientId} • Waiting {patient.waitMinutes}m</Text>
              </View>
              <View style={styles.triageBadge}>
                <Text style={styles.triageBadgeText}>✓ {patient.triageStatus}</Text>
              </View>
            </View>

            <Text style={styles.complaintText}>
              <Text style={{ fontWeight: '700' }}>Chief Complaint: </Text>
              {patient.chiefComplaint}
            </Text>

            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => handleClaimPatient(patient)}
            >
              <Text style={styles.claimButtonText}>Claim & Start Consultation</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Role Switcher for Evaluators */}
      <View style={styles.evaluatorSection}>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => switchRole('PATIENT')}
        >
          <Text style={styles.switchButtonText}>⇄ Switch to Patient View (Amaka)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f3eb',
    paddingBottom: 40,
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#efeeeb',
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#747679',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#080331',
    marginTop: 2,
  },
  dutyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  dutyOn: {
    backgroundColor: '#e1f4df',
  },
  dutyOff: {
    backgroundColor: '#efeeeb',
  },
  dutyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dutyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  credentialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  credentialBadge: {
    fontSize: 11,
    color: '#0f3e17',
    backgroundColor: '#e1f4df',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '600',
  },
  idBadge: {
    fontSize: 11,
    color: '#080331',
    backgroundColor: '#b6ced5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '600',
  },
  earningsCard: {
    backgroundColor: '#ebf0f8',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(72, 101, 255, 0.2)',
  },
  earningsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#080331',
  },
  earningsSubtitle: {
    fontSize: 12,
    color: '#747679',
    marginTop: 2,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricBlock: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
  },
  metricLabel: {
    fontSize: 11,
    color: '#747679',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#080331',
    marginVertical: 4,
  },
  metricNote: {
    fontSize: 10,
    color: '#31ce01',
    fontWeight: '600',
  },
  queueSection: {
    gap: 12,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#080331',
  },
  queueSubtitle: {
    fontSize: 12,
    color: '#747679',
  },
  statusPill: {
    backgroundColor: '#0a3922',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  patientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#efeeeb',
    gap: 10,
  },
  patientCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#080331',
  },
  patientId: {
    fontSize: 12,
    color: '#747679',
    marginTop: 2,
  },
  triageBadge: {
    backgroundColor: '#e1f4df',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  triageBadgeText: {
    color: '#0f3e17',
    fontSize: 10,
    fontWeight: '700',
  },
  complaintText: {
    fontSize: 13,
    color: '#222326',
    lineHeight: 18,
  },
  claimButton: {
    backgroundColor: '#0f3e17',
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  evaluatorSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 10,
  },
  switchButton: {
    backgroundColor: '#f8f3eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#efeeeb',
  },
  switchButtonText: {
    fontSize: 13,
    color: '#080331',
    fontWeight: '600',
  },
  logoutButton: {
    paddingVertical: 4,
  },
  logoutButtonText: {
    fontSize: 12,
    color: '#747679',
    textDecorationLine: 'underline',
  },
});
