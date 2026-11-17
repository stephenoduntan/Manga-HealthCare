import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function PatientHomeScreen() {
  const { user, switchRole, logout } = useAuth();

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Identity Header */}
        <View style={styles.topProfileBar}>
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userNameText}>{user?.name || 'Amaka Adeleke'}</Text>
          </View>
          <View style={styles.idChip}>
            <Text style={styles.idChipText}>{user?.publicId || 'PAT-48291'}</Text>
          </View>
        </View>

        {/* Talk to Doctor Now Urgent Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.liveBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveBadgeText}>7 Verified Doctors On-Duty</Text>
          </View>

          <Text style={styles.heroTitle}>Need to speak with a doctor right now?</Text>
          <Text style={styles.heroSubtitle}>
            Complete our mandatory 1-minute safety triage to enter the instant lobby queue.
          </Text>

          <TouchableOpacity
            style={styles.urgentCtaButton}
            onPress={() => router.push('/(patient-tabs)/triage')}
          >
            <Text style={styles.urgentCtaText}>Talk to Doctor Now</Text>
          </TouchableOpacity>
        </View>

        {/* Services & Scheduling Bento */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Consultation Options</Text>
        </View>

        <View style={styles.bentoGrid}>
          {/* General Practitioner */}
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => router.push('/(patient-tabs)/triage')}
          >
            <View style={styles.serviceIconContainer}>
              <Text style={{ fontSize: 24 }}>👨‍⚕️</Text>
            </View>
            <Text style={styles.serviceCardTitle}>General Physician</Text>
            <Text style={styles.serviceCardPrice}>₦10,000 / consult</Text>
            <Text style={styles.serviceCardDescription}>
              Fever, cough, malaria, infections, routine prescriptions.
            </Text>
          </TouchableOpacity>

          {/* Mental Health / Therapy */}
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => router.push('/(patient-tabs)/triage')}
          >
            <View style={styles.serviceIconContainer}>
              <Text style={{ fontSize: 24 }}>🧠</Text>
            </View>
            <Text style={styles.serviceCardTitle}>Therapy & Mental Health</Text>
            <Text style={styles.serviceCardPrice}>₦15,000 / session</Text>
            <Text style={styles.serviceCardDescription}>
              Strict scheduled slots only per PRD clinical protocol.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Role Switcher for Evaluators */}
        <View style={styles.evaluatorSection}>
          <Text style={styles.evaluatorTitle}>Role Testing Switcher</Text>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => switchRole('LOCUM')}
          >
            <Text style={styles.switchButtonText}>⇄ Switch to Locum Doctor View (Dr. Amina)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Persistent Emergency Ambulance Bar */}
      <View style={styles.persistentEmergencyBar}>
        <View style={styles.emergencyTextContainer}>
          <View style={styles.redAlertDot} />
          <Text style={styles.emergencyBarNotice} numberOfLines={1}>
            Non-emergency app. In acute crisis:
          </Text>
        </View>

        <View style={styles.emergencyButtonsRow}>
          <TouchableOpacity
            style={styles.tapToCallEmergency}
            onPress={() => Linking.openURL('tel:112')}
          >
            <Text style={styles.tapToCallText}>🚨 Call 112</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tapToCallLagos}
            onPress={() => Linking.openURL('tel:767')}
          >
            <Text style={styles.tapToCallLagosText}>Ambulance 767</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f8f3eb',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90, // Space for persistent bottom emergency bar
  },
  topProfileBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 13,
    color: '#747679',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#080331',
  },
  idChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#efeeeb',
  },
  idChipText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    color: '#080331',
  },
  heroCard: {
    backgroundColor: '#0a3922',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(29, 191, 115, 0.3)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#31ce01',
  },
  liveBadgeText: {
    color: '#b1dbb8',
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '600',
    lineHeight: 30,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#b1dbb8',
    lineHeight: 18,
    marginBottom: 20,
  },
  urgentCtaButton: {
    backgroundColor: '#ff643b',
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: '#4b4439',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  urgentCtaText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#080331',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#efeeeb',
    justifyContent: 'space-between',
  },
  serviceIconContainer: {
    marginBottom: 8,
  },
  serviceCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#080331',
    marginBottom: 4,
  },
  serviceCardPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f3e17',
    marginBottom: 6,
  },
  serviceCardDescription: {
    fontSize: 11,
    color: '#747679',
    lineHeight: 15,
  },
  evaluatorSection: {
    backgroundColor: '#ebf0f8',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 10,
  },
  evaluatorTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#4865ff',
    letterSpacing: 0.5,
  },
  switchButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#4865ff44',
  },
  switchButtonText: {
    fontSize: 13,
    color: '#080331',
    fontWeight: '600',
  },
  logoutButton: {
    paddingVertical: 6,
  },
  logoutButtonText: {
    fontSize: 12,
    color: '#747679',
    textDecorationLine: 'underline',
  },
  persistentEmergencyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a3922',
    borderTopWidth: 1,
    borderTopColor: '#ff643b44',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
  },
  emergencyTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  redAlertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff643b',
  },
  emergencyBarNotice: {
    color: '#f8f3eb',
    fontSize: 11,
    fontWeight: '500',
  },
  emergencyButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tapToCallEmergency: {
    backgroundColor: '#ff643b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  tapToCallText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  tapToCallLagos: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9999,
  },
  tapToCallLagosText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});
