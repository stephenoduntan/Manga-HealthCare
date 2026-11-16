import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function MobileHomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.emergencyNotice}>
        <Text style={styles.emergencyNoticeText}>
          Non-emergency telemedicine. If experiencing severe chest pain or bleeding, call 112 immediately.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>CLINICAL TELEMEDICINE (BETA)</Text>
        <Text style={styles.title}>Licensed Doctors & Therapists in Minutes</Text>
        <Text style={styles.subtitle}>
          Connect for instant consultations or scheduled appointments with MDCN-verified practitioners.
        </Text>

        <Link href="/triage" asChild>
          <TouchableOpacity style={styles.urgentButton}>
            <Text style={styles.urgentButtonText}>Talk to Doctor Now</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule Appointment</Text>
          <Text style={styles.cardText}>Book a convenient calendar slot with a specialist or therapist.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Medical Records & Rx</Text>
          <Text style={styles.cardText}>Access clinical consultation notes and download verifiable PDF prescriptions.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f3eb',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  emergencyNotice: {
    backgroundColor: '#ffede8',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff643b33',
  },
  emergencyNoticeText: {
    color: '#ff643b',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: '#e1f4df',
    borderRadius: 24,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#b1dbb8',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f3e17',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    color: '#080331',
    fontWeight: '600',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#222326',
    lineHeight: 20,
  },
  urgentButton: {
    backgroundColor: '#ff643b',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 9999,
    alignItems: 'center',
    marginTop: 8,
  },
  urgentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    gap: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#080331',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#08033110',
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#080331',
  },
  cardText: {
    fontSize: 13,
    color: '#747679',
    lineHeight: 18,
  },
});
