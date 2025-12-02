import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Pill, Save } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { addMedicament, updateMedicament } from '../../api/medicamentService';

const MedicamentFormScreen = ({ route, navigation }) => {
  const { medicament } = route.params || {};
  const { logout } = useAuthStore();
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
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Pill size={24} color="#FFFFFF" />
        <Text style={styles.title}>
          {medicament ? 'Modifier Médicament' : 'Nouveau Médicament'}
        </Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={form.nom}
          onChangeText={(value) => updateForm('nom', value)}
          placeholder="Nom du médicament"
        />
        <Text style={styles.label}>Dosage</Text>
        <TextInput
          style={styles.input}
          value={form.dosage}
          onChangeText={(value) => updateForm('dosage', value)}
          placeholder="Ex: 500 mg"
        />
        <Text style={styles.label}>Forme</Text>
        <TextInput
          style={styles.input}
          value={form.forme}
          onChangeText={(value) => updateForm('forme', value)}
          placeholder="Ex: Comprimé"
        />
        <Text style={styles.label}>Quantité en stock</Text>
        <TextInput
          style={styles.input}
          value={form.quantiteStock}
          onChangeText={(value) => updateForm('quantiteStock', value)}
          placeholder="Quantité"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.saveButtonText}>
            {medicament ? 'Modifier' : 'Ajouter'}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#10B981',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MedicamentFormScreen;