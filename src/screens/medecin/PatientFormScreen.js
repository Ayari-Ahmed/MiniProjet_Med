import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Users, Save } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { addPatient, updatePatient } from '../../api/patientService';

const PatientFormScreen = ({ route, navigation }) => {
  const { patient } = route.params || {};
  const { logout } = useAuthStore();
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
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Users size={24} color="#FFFFFF" />
        <Text style={styles.title}>
          {patient ? 'Modifier Patient' : 'Nouveau Patient'}
        </Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(value) => updateForm('name', value)}
          placeholder="Nom du patient"
        />
        <Text style={styles.label}>Âge</Text>
        <TextInput
          style={styles.input}
          value={form.age}
          onChangeText={(value) => updateForm('age', value)}
          placeholder="Âge"
          keyboardType="numeric"
        />
        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          value={form.adresse}
          onChangeText={(value) => updateForm('adresse', value)}
          placeholder="Adresse"
        />
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={form.telephone}
          onChangeText={(value) => updateForm('telephone', value)}
          placeholder="Téléphone"
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.saveButtonText}>
            {patient ? 'Modifier' : 'Ajouter'}
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

export default PatientFormScreen;