import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import { FileText, Save } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { addOrdonnance, updateOrdonnance } from '../../api/ordonnanceService';
import { getPatients } from '../../api/patientService';
import { getMedicaments } from '../../api/medicamentService';

const OrdonnanceFormScreen = ({ route, navigation }) => {
  const { ordonnance } = route.params || {};
  const { currentUser, logout } = useAuthStore();
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

  const renderSelectedMedicament = ({ item }) => {
    const med = medicaments.find(m => m.id === item.idMedicament);
    return (
      <View style={styles.selectedMed}>
        <Text>{med?.nom}</Text>
        <TouchableOpacity onPress={() => removeMedicament(item.idMedicament)}>
          <Text style={styles.removeText}>Retirer</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMedicament = ({ item }) => (
    <TouchableOpacity style={styles.medOption} onPress={() => addMedicament(item)}>
      <Text>{item.nom} - {item.dosage}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <FileText size={24} color="#FFFFFF" />
        <Text style={styles.title}>
          {ordonnance ? 'Modifier Ordonnance' : 'Nouvelle Ordonnance'}
        </Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Patient</Text>
        <View style={styles.picker}>
          {patients.map(pat => (
            <TouchableOpacity
              key={pat.id}
              style={[styles.patientOption, selectedPatient === pat.id && styles.selected]}
              onPress={() => setSelectedPatient(pat.id)}
            >
              <Text style={[styles.patientText, selectedPatient === pat.id && styles.selectedText]}>
                {pat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Médicaments sélectionnés</Text>
        <FlatList
          data={selectedMedicaments}
          renderItem={renderSelectedMedicament}
          keyExtractor={(item) => item.idMedicament}
          scrollEnabled={false}
        />

        <Text style={styles.label}>Ajouter un médicament</Text>
        <FlatList
          data={medicaments}
          renderItem={renderMedicament}
          keyExtractor={(item) => item.id}
          style={styles.medList}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.saveButtonText}>
            {ordonnance ? 'Modifier' : 'Créer'}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
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
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    marginTop: 20,
  },
  picker: {
    marginBottom: 20,
  },
  patientOption: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  selected: {
    backgroundColor: '#3498db',
  },
  patientText: {
    color: '#2c3e50',
  },
  selectedText: {
    color: '#fff',
  },
  selectedMed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  removeText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  medList: {
    maxHeight: 200,
  },
  medOption: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
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
    backgroundColor: '#e74c3c',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdonnanceFormScreen;