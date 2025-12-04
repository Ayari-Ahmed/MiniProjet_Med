import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar, Platform, TextInput } from 'react-native';
import { FileText, Save, X, Plus, User, Pill, LogOut, ArrowLeft, Sparkles } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { getPatients } from '../../api/patientService';
import { getMedicaments } from '../../api/medicamentService';

const OrdonnanceFormScreen = ({ route, navigation }) => {
  const { ordonnance } = route.params || {};
  const { currentUser, logout } = useAuthStore();
  const { addOrdonnance, updateOrdonnance } = useOrdonnanceStore();
  const [patients, setPatients] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedMedicaments, setSelectedMedicaments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const pats = await getPatients();
      setPatients(pats);
      const meds = await getMedicaments();
      setMedicaments(meds);
    };
    loadData();

    if (ordonnance) {
      setSelectedPatient(ordonnance.patientId);
      setSelectedMedicaments(ordonnance.medicaments);
    }
  }, [ordonnance]);

  const addMedicament = (medicament) => {
    const exists = selectedMedicaments.find(m => m.idMedicament === medicament.id);
    if (!exists) {
      setSelectedMedicaments([...selectedMedicaments, {
        idMedicament: medicament.id,
        quantiteParJour: 1,
        duree: 7,
      }]);
    }
  };

  const removeMedicament = (id) => {
    setSelectedMedicaments(selectedMedicaments.filter(m => m.idMedicament !== id));
  };

  const updateMedicamentDetails = (id, field, value) => {
    setSelectedMedicaments(selectedMedicaments.map(m =>
      m.idMedicament === id ? { ...m, [field]: field === 'quantiteParJour' ? parseInt(value) || 1 : parseInt(value) || 7 } : m
    ));
  };

  const handleSave = async () => {
    if (!selectedPatient || selectedMedicaments.length === 0) {
      Alert.alert('Erreur', 'Sélectionnez un patient et au moins un médicament');
      return;
    }

    const data = {
      patientId: selectedPatient,
      medecinId: currentUser.id,
      medicaments: selectedMedicaments,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      if (ordonnance) {
        await updateOrdonnance(ordonnance.id, data);
        Alert.alert('Succès', 'Ordonnance modifiée');
      } else {
        const newOrdonnance = {
          ...data,
          id: `o${Date.now()}`,
        };
        await addOrdonnance(newOrdonnance);
        Alert.alert('Succès', 'Ordonnance créée');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.iconBadge}>
            <FileText size={24} color="#10B981" strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.headerTitle}>
              {ordonnance ? 'Modifier' : 'Nouvelle'}
            </Text>
            <Text style={styles.headerSubtitle}>Ordonnance</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Patient Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#10B981" strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Sélectionner un patient</Text>
          </View>
          <View style={styles.optionsContainer}>
            {patients.map(pat => (
              <TouchableOpacity
                key={pat.id}
                style={[
                  styles.optionCard,
                  selectedPatient === pat.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedPatient(pat.id)}
                activeOpacity={0.7}
              >
                <View style={styles.radioOuter}>
                  {selectedPatient === pat.id && <View style={styles.radioInner} />}
                </View>
                <Text style={[
                  styles.optionText,
                  selectedPatient === pat.id && styles.optionTextSelected
                ]}>
                  {pat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Medications */}
        {selectedMedicaments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Pill size={20} color="#10B981" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Médicaments prescrits ({selectedMedicaments.length})</Text>
            </View>
            <View style={styles.selectedMedsContainer}>
              {selectedMedicaments.map(item => {
                const med = medicaments.find(m => m.id === item.idMedicament);
                return (
                  <View key={item.idMedicament} style={styles.selectedMedCard}>
                    <View style={styles.medInfo}>
                      <Text style={styles.medName}>{med?.nom}</Text>
                      <Text style={styles.medDosage}>{med?.dosage}</Text>
                      <View style={styles.detailsRow}>
                        <View style={styles.detailInput}>
                          <Text style={styles.detailLabel}>Quantité/jour</Text>
                          <TextInput
                            style={styles.detailTextInput}
                            value={item.quantiteParJour.toString()}
                            onChangeText={(value) => updateMedicamentDetails(item.idMedicament, 'quantiteParJour', value)}
                            keyboardType="numeric"
                            placeholder="1"
                          />
                        </View>
                        <View style={styles.detailInput}>
                          <Text style={styles.detailLabel}>Durée (jours)</Text>
                          <TextInput
                            style={styles.detailTextInput}
                            value={item.duree.toString()}
                            onChangeText={(value) => updateMedicamentDetails(item.idMedicament, 'duree', value)}
                            keyboardType="numeric"
                            placeholder="7"
                          />
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeMedicament(item.idMedicament)}
                      activeOpacity={0.7}
                    >
                      <X size={18} color="#EF4444" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Available Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Plus size={20} color="#10B981" strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Ajouter des médicaments</Text>
          </View>
          <View style={styles.medsGrid}>
            {medicaments.map(item => {
              const isSelected = selectedMedicaments.some(m => m.idMedicament === item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.medCard,
                    isSelected && styles.medCardDisabled
                  ]}
                  onPress={() => !isSelected && addMedicament(item)}
                  activeOpacity={isSelected ? 1 : 0.7}
                  disabled={isSelected}
                >
                  <View style={styles.medCardContent}>
                    <Text style={[
                      styles.medCardName,
                      isSelected && styles.medCardTextDisabled
                    ]}>
                      {item.nom}
                    </Text>
                    <Text style={[
                      styles.medCardDosage,
                      isSelected && styles.medCardTextDisabled
                    ]}>
                      {item.dosage}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>Ajouté</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Save size={22} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.saveButtonText}>
            {ordonnance ? 'Modifier l\'ordonnance' : 'Créer l\'ordonnance'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#10B981',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  iconBadge: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  optionTextSelected: {
    color: '#059669',
  },
  selectedMedsContainer: {
    gap: 10,
  },
  selectedMedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  medDosage: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailInput: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  detailTextInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 8,
  },
  medsGrid: {
    gap: 10,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medCardDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  medCardContent: {
    flex: 1,
  },
  medCardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  medCardDosage: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  medCardTextDisabled: {
    color: '#94A3B8',
  },
  selectedBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
  },
  bottomPadding: {
    height: 100,
  },
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default OrdonnanceFormScreen;