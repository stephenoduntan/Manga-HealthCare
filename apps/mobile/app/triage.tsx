import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { RED_FLAG_SYMPTOMS, RedFlagCode, evaluateTriage, TriageStatus } from '@manga/api-contract';

export default function MobileTriageScreen() {
  const [selectedFlags, setSelectedFlags] = useState<RedFlagCode[]>([]);
  const [triageStatus, setTriageStatus] = useState<TriageStatus | null>(null);

  const toggleFlag = (code: RedFlagCode) => {
    if (selectedFlags.includes(code)) {
      setSelectedFlags(selectedFlags.filter((f) => f !== code));
    } else {
      setSelectedFlags([...selectedFlags, code]);
    }
  };

  const handleEvaluate = () => {
    const result = evaluateTriage({
      patient_id: 'PAT-48291',
      selected_red_flags: selectedFlags,
      chief_complaint: 'Routine consultation check',
    });
    setTriageStatus(result.status);
  };

  if (triageStatus === 'HALT_AND_REDIRECT') {
    return (
      <View style={styles.emergencyScreen}>
        <View style={styles.emergencyBadge}>
          <Text style={styles.emergencyBadgeText}>POTENTIAL MEDICAL EMERGENCY</Text>
        </View>

        <Text style={styles.emergencyTitle}>Immediate In-Person Care Required</Text>
        <Text style={styles.emergencyBody}>
          Based on the symptoms selected, telemedicine cannot provide safe care. Please seek immediate emergency medical care.
        </Text>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Linking.openURL('tel:112')}
        >
          <Text style={styles.callButtonText}>Call National Emergency (112)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryCallButton}
          onPress={() => Linking.openURL('tel:767')}
        >
          <Text style={styles.secondaryCallButtonText}>Call Lagos Emergency (767)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Mandatory Safety Checklist</Text>
      <Text style={styles.subtext}>
        Do you or the patient have any of the following acute symptoms right now? (Select all that apply)
      </Text>

      <View style={styles.list}>
        {RED_FLAG_SYMPTOMS.map((item) => {
          const isSelected = selectedFlags.includes(item.code as RedFlagCode);
          return (
            <TouchableOpacity
              key={item.code}
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => toggleFlag(item.code as RedFlagCode)}
            >
              <View style={[styles.checkbox, isSelected && styles.checkboxActive]} />
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleEvaluate}>
        <Text style={styles.continueButtonText}>
          {selectedFlags.length > 0 ? 'Submit Triage (Halt if Emergency)' : 'None of These Apply — Continue'}
        </Text>
      </TouchableOpacity>
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
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#080331',
  },
  subtext: {
    fontSize: 14,
    color: '#747679',
    lineHeight: 20,
  },
  list: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#08033115',
    alignItems: 'center',
    gap: 12,
  },
  itemSelected: {
    borderColor: '#ff643b',
    backgroundColor: '#ffede8',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#747679',
  },
  checkboxActive: {
    backgroundColor: '#ff643b',
    borderColor: '#ff643b',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#080331',
  },
  itemDesc: {
    fontSize: 12,
    color: '#747679',
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: '#0f3e17',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    color: '#fffefc',
    fontSize: 15,
    fontWeight: '700',
  },
  emergencyScreen: {
    flex: 1,
    backgroundColor: '#ffede8',
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  emergencyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ff643b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  emergencyBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  emergencyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#080331',
  },
  emergencyBody: {
    fontSize: 15,
    color: '#222326',
    lineHeight: 22,
  },
  callButton: {
    backgroundColor: '#ff643b',
    paddingVertical: 18,
    borderRadius: 9999,
    alignItems: 'center',
    marginTop: 12,
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryCallButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ff643b',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
  },
  secondaryCallButtonText: {
    color: '#ff643b',
    fontSize: 16,
    fontWeight: '600',
  },
});
