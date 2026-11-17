import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { RED_FLAG_SYMPTOMS, RedFlagCode, evaluateTriage } from '@manga/api-contract';

export default function MobileTriageScreen() {
  const [selectedFlags, setSelectedFlags] = useState<RedFlagCode[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [isHalted, setIsHalted] = useState(false);
  const [clarifyingQuestion, setClarifyingQuestion] = useState<string | null>(null);
  const [clarificationResponse, setClarificationResponse] = useState('');

  const toggleFlag = (code: RedFlagCode) => {
    if (selectedFlags.includes(code)) {
      setSelectedFlags(selectedFlags.filter((c) => c !== code));
    } else {
      setSelectedFlags([...selectedFlags, code]);
    }
  };

  const handleRunEvaluation = () => {
    const outcome = evaluateTriage({
      patient_id: 'PAT-48291',
      selected_red_flags: selectedFlags,
      chief_complaint: chiefComplaint.trim() || 'General health consultation',
      clarification_response: clarificationResponse.trim() || undefined,
    });

    if (outcome.status === 'HALT_AND_REDIRECT') {
      setIsHalted(true);
      setClarifyingQuestion(null);
    } else if (outcome.status === 'ASK_CLARIFYING_QUESTION') {
      setClarifyingQuestion(outcome.clarifying_question || 'Where exactly is this pain located?');
    } else {
      // Clear to proceed to payment and room matching
      router.push('/(patient-tabs)/checkout');
    }
  };

  if (isHalted) {
    return (
      <ScrollView contentContainerStyle={styles.redirectContainer}>
        <View style={styles.alertHeaderBadge}>
          <Text style={styles.alertHeaderBadgeText}>EMERGENCY PROTOCOL HALT</Text>
        </View>

        <Text style={styles.redirectTitle}>Immediate Hospital Care Required</Text>
        <Text style={styles.redirectBody}>
          Based on the symptoms selected, telemedicine cannot provide safe clinical stabilization.
          Manga Healthcare is for non-emergency clinical telemedicine only.
        </Text>

        <View style={styles.callButtonsSection}>
          <TouchableOpacity
            style={styles.directDialAmbulance}
            onPress={() => Linking.openURL('tel:112')}
          >
            <Text style={styles.directDialAmbulanceText}>🚨 Tap to Call National Emergency (112)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.directDialLagos}
            onPress={() => Linking.openURL('tel:767')}
          >
            <Text style={styles.directDialLagosText}>🚑 Call Lagos Ambulance LASAMBUS (767)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.facilitiesCard}>
          <Text style={styles.facilitiesTitle}>Nearest Trauma & Emergency Centers:</Text>
          <Text style={styles.facilityItem}>• LASUTH Emergency Center (Ikeja, Lagos) — 08000000000</Text>
          <Text style={styles.facilityItem}>• LUTH Accident & Emergency (Idi-Araba) — 018320491</Text>
          <Text style={styles.facilityItem}>• National Hospital Trauma Centre (Abuja) — 08031230000</Text>
        </View>

        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => {
            setIsHalted(false);
            setSelectedFlags([]);
          }}
        >
          <Text style={styles.dismissButtonText}>← Re-evaluate Symptoms</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>PRD Section 6.0 Mandatory Protocol</Text>
        <Text style={styles.title}>Emergency Symptom Screening</Text>
        <Text style={styles.subtitle}>
          Do you or the patient have any of the following acute red-flag symptoms right now?
        </Text>
      </View>

      {/* Chief Complaint Input */}
      <View style={styles.complaintBlock}>
        <Text style={styles.inputLabel}>Reason for Consultation / Chief Complaint:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Mild headache, fever, runny nose for 2 days"
          placeholderTextColor="#747679"
          value={chiefComplaint}
          onChangeText={setChiefComplaint}
        />
      </View>

      {/* Clarifying Question Block if ambiguous */}
      {clarifyingQuestion && (
        <View style={styles.clarificationBlock}>
          <Text style={styles.clarificationTitle}>⚠️ Clinical Clarification Needed:</Text>
          <Text style={styles.clarificationQuestion}>{clarifyingQuestion}</Text>
          <TextInput
            style={styles.clarificationInput}
            placeholder="Describe location, radiation, and if dizziness is present"
            placeholderTextColor="#747679"
            value={clarificationResponse}
            onChangeText={setClarificationResponse}
          />
        </View>
      )}

      {/* 8 Red Flag Symptoms List */}
      <View style={styles.symptomsList}>
        {RED_FLAG_SYMPTOMS.map((item, index) => {
          const isSelected = selectedFlags.includes(item.code as RedFlagCode);
          return (
            <TouchableOpacity
              key={item.code}
              style={[styles.symptomCard, isSelected && styles.symptomCardSelected]}
              onPress={() => toggleFlag(item.code as RedFlagCode)}
            >
              <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.symptomTextContainer}>
                <Text style={[styles.symptomLabel, isSelected && styles.symptomLabelSelected]}>
                  {index + 1}. {item.label}
                </Text>
                <Text style={styles.symptomDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submission CTA */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedFlags.length > 0 && styles.submitButtonHalt,
        ]}
        onPress={handleRunEvaluation}
      >
        <Text style={styles.submitButtonText}>
          {selectedFlags.length > 0
            ? `Report Emergency (${selectedFlags.length} flagged)`
            : 'I Confirm No Red Flags — Proceed'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f3eb',
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f3e17',
    backgroundColor: '#e1f4df',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#080331',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#747679',
    lineHeight: 18,
  },
  complaintBlock: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#080331',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#efeeeb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#080331',
  },
  clarificationBlock: {
    backgroundColor: '#fff3cd',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffeeba',
    marginBottom: 16,
    gap: 6,
  },
  clarificationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#856404',
  },
  clarificationQuestion: {
    fontSize: 13,
    color: '#856404',
  },
  clarificationInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffeeba',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
  },
  symptomsList: {
    gap: 10,
    marginBottom: 20,
  },
  symptomCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#efeeeb',
    alignItems: 'flex-start',
    gap: 12,
  },
  symptomCardSelected: {
    backgroundColor: '#ffede8',
    borderColor: '#ff643b',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#747679',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#ff643b',
    borderColor: '#ff643b',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  symptomTextContainer: {
    flex: 1,
  },
  symptomLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#080331',
  },
  symptomLabelSelected: {
    color: '#ff643b',
  },
  symptomDescription: {
    fontSize: 12,
    color: '#747679',
    marginTop: 2,
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#0f3e17',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: '#4b4439',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonHalt: {
    backgroundColor: '#ff643b',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  redirectContainer: {
    flexGrow: 1,
    backgroundColor: '#ffede8',
    padding: 24,
    justifyContent: 'center',
  },
  alertHeaderBadge: {
    backgroundColor: '#ff643b',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    marginBottom: 16,
  },
  alertHeaderBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  redirectTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#080331',
    lineHeight: 32,
    marginBottom: 12,
  },
  redirectBody: {
    fontSize: 14,
    color: '#222326',
    lineHeight: 20,
    marginBottom: 24,
  },
  callButtonsSection: {
    gap: 12,
    marginBottom: 24,
  },
  directDialAmbulance: {
    backgroundColor: '#ff643b',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  directDialAmbulanceText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  directDialLagos: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#ff643b',
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: 'center',
  },
  directDialLagosText: {
    color: '#ff643b',
    fontSize: 15,
    fontWeight: '700',
  },
  facilitiesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 59, 0.2)',
  },
  facilitiesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#080331',
    marginBottom: 8,
  },
  facilityItem: {
    fontSize: 12,
    color: '#747679',
    lineHeight: 18,
    marginBottom: 4,
  },
  dismissButton: {
    alignItems: 'center',
    padding: 8,
  },
  dismissButtonText: {
    color: '#747679',
    fontSize: 13,
    fontWeight: '600',
  },
});
