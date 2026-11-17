import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function MobileDoctorConsultationScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'CALL_INTAKE' | 'SOAP_NOTE' | 'PRESCRIPTION'>('SOAP_NOTE');

  // Structured SOAP State
  const [chiefComplaint, setChiefComplaint] = useState('Low-grade fever and nasal congestion for 2 days');
  const [hpi, setHpi] = useState('Patient reports gradual onset rhinitis, clear nasal discharge. Denies dyspnea, chest pain, or hemoptysis.');
  const [assessment, setAssessment] = useState('Acute viral upper respiratory tract infection (URTI)');
  const [plan, setPlan] = useState('1. Hydration & warm saline fluids\n2. Paracetamol for fever\n3. Review if pyrexia exceeds 38.5C');

  // E-Prescription State
  const [rxList, setRxList] = useState<Array<{ drug: string; dose: string; freq: string; dur: string }>>([
    { drug: 'Paracetamol Tablets', dose: '1000mg', freq: 'TDS (3x daily)', dur: '5 days' },
    { drug: 'Cetirizine 10mg', dose: '1 tablet', freq: 'OD (nightly)', dur: '5 days' },
  ]);
  const [newDrug, setNewDrug] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newFreq, setNewFreq] = useState('');
  const [newDur, setNewDur] = useState('');

  const handleAddDrug = () => {
    if (!newDrug.trim()) return;
    setRxList((prev) => [
      ...prev,
      { drug: newDrug, dose: newDose || '500mg', freq: newFreq || 'TDS', dur: newDur || '5 days' },
    ]);
    setNewDrug('');
    setNewDose('');
    setNewFreq('');
    setNewDur('');
  };

  const handleSaveAndSign = () => {
    Alert.alert(
      'Sign & Lock Encounter',
      'This will save the structured SOAP note, cryptographically sign the E-Prescription with your MDCN license (MDCN-78320), and credit your biweekly ledger with ₦7,500.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign & Finalize',
          onPress: () => {
            Alert.alert('Consultation Completed', 'E-Prescription PDF generated and patient record locked.');
            router.replace('/(doctor-tabs)');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Patient Header Banner */}
      <View style={styles.patientBanner}>
        <View>
          <Text style={styles.patientName}>Patient: Amaka Adeleke (PAT-48291)</Text>
          <Text style={styles.patientMeta}>Female • 28 yrs • General Practice</Text>
        </View>
        <TouchableOpacity style={styles.finalizeBtn} onPress={handleSaveAndSign}>
          <Text style={styles.finalizeBtnText}>Save & Sign</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'CALL_INTAKE' && styles.tabItemActive]}
          onPress={() => setActiveTab('CALL_INTAKE')}
        >
          <Text style={[styles.tabItemText, activeTab === 'CALL_INTAKE' && styles.tabItemTextActive]}>
            📹 Video & Intake
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'SOAP_NOTE' && styles.tabItemActive]}
          onPress={() => setActiveTab('SOAP_NOTE')}
        >
          <Text style={[styles.tabItemText, activeTab === 'SOAP_NOTE' && styles.tabItemTextActive]}>
            📝 SOAP Notes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'PRESCRIPTION' && styles.tabItemActive]}
          onPress={() => setActiveTab('PRESCRIPTION')}
        >
          <Text style={[styles.tabItemText, activeTab === 'PRESCRIPTION' && styles.tabItemTextActive]}>
            💊 Prescription Rx
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.tabContent}>
        {activeTab === 'CALL_INTAKE' && (
          <View style={styles.sectionGap}>
            {/* Live Video Preview Box */}
            <View style={styles.videoBox}>
              <Text style={{ fontSize: 36 }}>👩‍💼</Text>
              <Text style={styles.videoPatientName}>Amaka Adeleke (Patient Feed)</Text>
              <Text style={styles.videoStatus}>HD Telemedicine Stream Active</Text>
            </View>

            {/* Critical Clinical Alerts */}
            <View style={styles.allergyAlertBox}>
              <Text style={styles.allergyTitle}>⚠️ PATIENT ALLERGIES & WARNINGS</Text>
              <Text style={styles.allergyText}>• Penicillin (Severe Urticaria / Anaphylaxis risk)</Text>
              <Text style={styles.allergyText}>• NSAIDs (Mild gastric erosion)</Text>
            </View>

            {/* Medical History */}
            <View style={styles.intakeCard}>
              <Text style={styles.cardHeader}>Chronic Conditions & Medications</Text>
              <Text style={styles.intakeRow}>
                <Text style={{ fontWeight: '700' }}>Pre-existing: </Text>Asthma (Mild intermittent)
              </Text>
              <Text style={styles.intakeRow}>
                <Text style={{ fontWeight: '700' }}>Current Drugs: </Text>Salbutamol Inhaler (PRN)
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'SOAP_NOTE' && (
          <View style={styles.sectionGap}>
            <View style={styles.noteFormCard}>
              <Text style={styles.fieldLabel}>S • Chief Complaint</Text>
              <TextInput
                style={styles.inputField}
                value={chiefComplaint}
                onChangeText={setChiefComplaint}
              />

              <Text style={styles.fieldLabel}>O • History of Present Illness (HPI)</Text>
              <TextInput
                style={[styles.inputField, styles.textArea]}
                multiline
                numberOfLines={3}
                value={hpi}
                onChangeText={setHpi}
              />

              <Text style={styles.fieldLabel}>A • Assessment & Diagnosis</Text>
              <TextInput
                style={styles.inputField}
                value={assessment}
                onChangeText={setAssessment}
              />

              <Text style={styles.fieldLabel}>P • Care Plan & Instructions</Text>
              <TextInput
                style={[styles.inputField, styles.textArea]}
                multiline
                numberOfLines={3}
                value={plan}
                onChangeText={setPlan}
              />
            </View>
          </View>
        )}

        {activeTab === 'PRESCRIPTION' && (
          <View style={styles.sectionGap}>
            <View style={styles.rxBuilderCard}>
              <Text style={styles.rxCardTitle}>Prescribed Medications ({rxList.length})</Text>

              {rxList.map((item, idx) => (
                <View key={idx} style={styles.rxListItem}>
                  <View>
                    <Text style={styles.rxDrugName}>
                      {idx + 1}. {item.drug} ({item.dose})
                    </Text>
                    <Text style={styles.rxDetails}>
                      {item.freq} for {item.dur}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setRxList(rxList.filter((_, i) => i !== idx))}
                  >
                    <Text style={{ color: '#ff643b', fontSize: 12 }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.addDrugForm}>
                <Text style={styles.addDrugTitle}>+ Add Another Medication</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Drug / Generic Name (e.g. Amoxicillin)"
                  value={newDrug}
                  onChangeText={setNewDrug}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    style={[styles.inputField, { flex: 1 }]}
                    placeholder="Dosage (500mg)"
                    value={newDose}
                    onChangeText={setNewDose}
                  />
                  <TextInput
                    style={[styles.inputField, { flex: 1 }]}
                    placeholder="Frequency (TDS)"
                    value={newFreq}
                    onChangeText={setNewFreq}
                  />
                  <TextInput
                    style={[styles.inputField, { flex: 1 }]}
                    placeholder="Duration (5d)"
                    value={newDur}
                    onChangeText={setNewDur}
                  />
                </View>

                <TouchableOpacity style={styles.addDrugBtn} onPress={handleAddDrug}>
                  <Text style={styles.addDrugBtnText}>Add Drug Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6ced5', // Slate Hush EHR workspace background
  },
  patientBanner: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#efeeeb',
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#080331',
  },
  patientMeta: {
    fontSize: 11,
    color: '#747679',
    marginTop: 2,
  },
  finalizeBtn: {
    backgroundColor: '#0f3e17',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  finalizeBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#efeeeb',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0f3e17',
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#747679',
  },
  tabItemTextActive: {
    color: '#0f3e17',
  },
  tabContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionGap: {
    gap: 14,
  },
  videoBox: {
    backgroundColor: '#0a3922',
    height: 180,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPatientName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  videoStatus: {
    color: '#31ce01',
    fontSize: 11,
    marginTop: 2,
  },
  allergyAlertBox: {
    backgroundColor: '#ffede8',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#ff643b',
    gap: 4,
  },
  allergyTitle: {
    color: '#ff643b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  allergyText: {
    color: '#080331',
    fontSize: 13,
    fontWeight: '600',
  },
  intakeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#080331',
    marginBottom: 4,
  },
  intakeRow: {
    fontSize: 13,
    color: '#222326',
  },
  noteFormCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#0f3e17',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  inputField: {
    backgroundColor: '#f8f3eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#080331',
    borderWidth: 1,
    borderColor: '#efeeeb',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  rxBuilderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  rxCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#080331',
  },
  rxListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#efeeeb',
  },
  rxDrugName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#080331',
  },
  rxDetails: {
    fontSize: 11,
    color: '#747679',
    marginTop: 2,
  },
  addDrugForm: {
    marginTop: 8,
    backgroundColor: '#f8f3eb',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  addDrugTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f3e17',
  },
  addDrugBtn: {
    backgroundColor: '#0f3e17',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addDrugBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
