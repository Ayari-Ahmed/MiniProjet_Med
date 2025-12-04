import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar, Platform, TextInput } from 'react-native';
import { Pill, Save, LogOut, ArrowLeft, Sparkles } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useMedicamentStore } from '../../store/medicamentStore';

const MedicamentFormScreen = ({ route, navigation }) => {
  const { medicament } = route.params || {};
  const { logout } = useAuthStore();
  const { addMedicament, updateMedicament } = useMedicamentStore();
  const [form, setForm] = useState({
    nom: '',
    dosage: '',
    forme: '',
    quantiteStock: '',
  });

  useEffect(() => {
    if (medicament) {
      setForm({
        nom: medicament.nom,
        dosage: medicament.dosage,
        forme: medicament.forme,
        quantiteStock: medicament.quantiteStock.toString(),
      });
    }
  }, [medicament]);

  const handleSave = async () => {
    if (!form.nom || !form.dosage || !form.forme || !form.quantiteStock) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const data = {
      ...form,
      quantiteStock: parseInt(form.quantiteStock),
    };

    try {
      if (medicament) {
        await updateMedicament(medicament.id, data);
        Alert.alert('Succès', 'Médicament modifié');
      } else {
        const newMedicament = {
          ...data,
          id: `m${Date.now()}`,
        };
        await addMedicament(newMedicament);
        Alert.alert('Succès', 'Médicament ajouté');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
            <Pill size={24} color="#10B981" strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.headerTitle}>
              {medicament ? 'Modifier' : 'Nouveau'}
            </Text>
            <Text style={styles.headerSubtitle}>Médicament</Text>
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
        {/* Form Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color="#10B981" strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Informations du médicament</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom du médicament</Text>
              <TextInput
                style={styles.input}
                value={form.nom}
                onChangeText={(value) => updateForm('nom', value)}
                placeholder="Ex: Doliprane"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dosage</Text>
              <TextInput
                style={styles.input}
                value={form.dosage}
                onChangeText={(value) => updateForm('dosage', value)}
                placeholder="Ex: 500 mg"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Forme pharmaceutique</Text>
              <TextInput
                style={styles.input}
                value={form.forme}
                onChangeText={(value) => updateForm('forme', value)}
                placeholder="Ex: Comprimé"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantité en stock</Text>
              <TextInput
                style={styles.input}
                value={form.quantiteStock}
                onChangeText={(value) => updateForm('quantiteStock', value)}
                placeholder="Ex: 100"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
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
            {medicament ? 'Modifier le médicament' : 'Ajouter le médicament'}
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
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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

export default MedicamentFormScreen;