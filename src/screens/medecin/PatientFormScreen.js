import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { Users, Save, UserPlus, LogOut, Sparkles } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';

const PatientFormScreen = ({ route, navigation }) => {
   const { patient } = route.params || {};
   const { currentUser, logout } = useAuthStore();
   const { addPatient, updatePatient } = usePatientStore();
   const [loading, setLoading] = useState(false);
   const [form, setForm] = useState({
     name: '',
     age: '',
     adresse: '',
     telephone: '',
   });

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name,
        age: patient.age.toString(),
        adresse: patient.adresse,
        telephone: patient.telephone,
      });
    }
  }, [patient]);

  const handleSave = async () => {
    if (!form.name || !form.age || !form.adresse || !form.telephone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    const data = {
      ...form,
      age: parseInt(form.age),
    };

    try {
      if (patient) {
        await updatePatient(patient.id, data);
        Alert.alert('Succès', 'Patient modifié');
      } else {
        const newPatient = {
          ...data,
          id: `p${Date.now()}`,
        };
        await addPatient(newPatient);
        Alert.alert('Succès', 'Patient ajouté');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>
                  {patient ? 'Modifier Patient' : 'Nouveau Patient'}
                </Text>
                <Text style={styles.doctorName}>Dr. {currentUser?.name || 'Médecin'}</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>En ligne</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <LogOut size={18} color="#EF4444" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.sectionHeader}>
          <Sparkles size={20} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.sectionTitle}>Informations du Patient</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.formIconContainer}>
            {patient ? (
              <Users size={32} color="#3B82F6" strokeWidth={2} />
            ) : (
              <UserPlus size={32} color="#10B981" strokeWidth={2} />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(value) => updateForm('name', value)}
              placeholder="Entrez le nom du patient"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Âge</Text>
            <TextInput
              style={styles.input}
              value={form.age}
              onChangeText={(value) => updateForm('age', value)}
              placeholder="Entrez l'âge"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={styles.input}
              value={form.adresse}
              onChangeText={(value) => updateForm('adresse', value)}
              placeholder="Entrez l'adresse"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={form.telephone}
              onChangeText={(value) => updateForm('telephone', value)}
              placeholder="Entrez le numéro de téléphone"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.9}
            disabled={loading}
          >
            <View style={styles.saveButtonContent}>
              <View style={styles.saveIconContainer}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Save size={24} color="#FFFFFF" strokeWidth={2} />
                )}
              </View>
              <Text style={styles.saveButtonText}>
                {loading ? 'Enregistrement...' : (patient ? 'Enregistrer les modifications' : 'Ajouter le patient')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Sparkles size={16} color="#10B981" strokeWidth={2.5} />
          </View>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Astuce: </Text>
            Tous les champs sont obligatoires
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    paddingBottom: 40,
  },
  headerGradient: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  doctorName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  mainContent: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  formIconContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 18,
    alignSelf: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    padding: 20,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0.2,
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  saveIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tipCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  tipIcon: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#064E3B',
    fontWeight: '500',
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: '700',
  },
});

export default PatientFormScreen;