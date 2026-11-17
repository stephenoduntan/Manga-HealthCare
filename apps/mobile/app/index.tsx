import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth, UserRole } from '../src/context/AuthContext';
import { nativeColors, nativeRadii } from '@manga/design-system/native';

export default function MobileAuthScreen() {
  const { loginWithOtp, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'IDENTIFIER' | 'OTP'>('IDENTIFIER');
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');
  const [telemedConsent, setTelemedConsent] = useState(true);
  const [ndprConsent, setNdprConsent] = useState(true);

  const handleRequestOtp = () => {
    if (!identifier.trim()) return;
    setStep('OTP');
    setOtp('1234'); // Pre-fill mock OTP for smooth evaluation
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return;
    await loginWithOtp(identifier, otp, selectedRole);
  };

  const handleQuickLogin = async (role: UserRole, id: string) => {
    await loginWithOtp(id, '1234', role);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.brandTitle}>MANGA HEALTHCARE</Text>
          <Text style={styles.brandSubtitle}>Clinical Telemedicine & Emergency Triage</Text>
        </View>

        {/* Auth Card */}
        <View style={styles.card}>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[styles.roleTab, selectedRole === 'PATIENT' && styles.roleTabActive]}
              onPress={() => {
                setSelectedRole('PATIENT');
                setIdentifier('08031234567');
              }}
            >
              <Text
                style={[styles.roleTabText, selectedRole === 'PATIENT' && styles.roleTabTextActive]}
              >
                Patient Portal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleTab,
                (selectedRole === 'DOCTOR' || selectedRole === 'LOCUM') && styles.roleTabActive,
              ]}
              onPress={() => {
                setSelectedRole('LOCUM');
                setIdentifier('LOC-9941');
              }}
            >
              <Text
                style={[
                  styles.roleTabText,
                  (selectedRole === 'DOCTOR' || selectedRole === 'LOCUM') &&
                    styles.roleTabTextActive,
                ]}
              >
                Doctor / Locum
              </Text>
            </TouchableOpacity>
          </View>

          {step === 'IDENTIFIER' ? (
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {selectedRole === 'PATIENT'
                  ? 'Phone Number, Email, or Patient ID'
                  : 'Email, Doctor ID, or Locum ID'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  selectedRole === 'PATIENT'
                    ? 'e.g. 08031234567 or PAT-48291'
                    : 'e.g. LOC-9941 or doctor@mangahealth.ng'
                }
                placeholderTextColor="#747679"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
              />

              {/* Consent Checkboxes */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setTelemedConsent(!telemedConsent)}
              >
                <View style={[styles.checkbox, telemedConsent && styles.checkboxChecked]}>
                  {telemedConsent && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  I consent to Telemedicine limitations & Emergency Protocols
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setNdprConsent(!ndprConsent)}
              >
                <View style={[styles.checkbox, ndprConsent && styles.checkboxChecked]}>
                  {ndprConsent && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to NDPR Data Processing & statutory health audit logs
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (!identifier.trim() || !telemedConsent || !ndprConsent) && styles.buttonDisabled,
                ]}
                disabled={!identifier.trim() || !telemedConsent || !ndprConsent}
                onPress={handleRequestOtp}
              >
                <Text style={styles.primaryButtonText}>Send 4-Digit Login OTP</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Enter 4-Digit Security OTP</Text>
              <Text style={styles.helperText}>Sent to {identifier} (Dev OTP: 1234)</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="1234"
                placeholderTextColor="#747679"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Enter Workspace</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.textButton} onPress={() => setStep('IDENTIFIER')}>
                <Text style={styles.textButtonLabel}>← Change Mobile / ID</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Pilot Testing Bypass */}
        <View style={styles.pilotSection}>
          <Text style={styles.pilotHeading}>One-Tap Pilot Demo Access</Text>
          <View style={styles.pilotRow}>
            <TouchableOpacity
              style={styles.pilotButtonPatient}
              onPress={() => handleQuickLogin('PATIENT', 'PAT-48291')}
            >
              <Text style={styles.pilotButtonTextPatient}>👤 Enter as Patient</Text>
              <Text style={styles.pilotSubtext}>Amaka (PAT-48291)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pilotButtonDoctor}
              onPress={() => handleQuickLogin('LOCUM', 'LOC-9941')}
            >
              <Text style={styles.pilotButtonTextDoctor}>🩺 Enter as Locum Doctor</Text>
              <Text style={styles.pilotSubtext}>Dr. Amina (LOC-9941)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f3eb',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0f3e17',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#080331',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#747679',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#efeeeb',
    shadowColor: '#4b4439',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#f8f3eb',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#747679',
  },
  roleTabTextActive: {
    color: '#080331',
    fontWeight: '600',
  },
  formGroup: {
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#080331',
  },
  helperText: {
    fontSize: 12,
    color: '#747679',
    marginTop: -4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#efeeeb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#080331',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
    paddingVertical: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#747679',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0f3e17',
    borderColor: '#0f3e17',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#222326',
    flex: 1,
    lineHeight: 16,
  },
  primaryButton: {
    backgroundColor: '#0f3e17',
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  textButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  textButtonLabel: {
    fontSize: 13,
    color: '#4865ff',
    fontWeight: '500',
  },
  pilotSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  pilotHeading: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#747679',
    fontWeight: '600',
    marginBottom: 10,
  },
  pilotRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  pilotButtonPatient: {
    flex: 1,
    backgroundColor: '#e1f4df',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#b1dbb8',
    alignItems: 'center',
  },
  pilotButtonTextPatient: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f3e17',
  },
  pilotButtonDoctor: {
    flex: 1,
    backgroundColor: '#b6ced5',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#b6ced5',
    alignItems: 'center',
  },
  pilotButtonTextDoctor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#080331',
  },
  pilotSubtext: {
    fontSize: 11,
    color: '#747679',
    marginTop: 2,
  },
});
