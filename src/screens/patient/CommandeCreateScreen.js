import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MapPin, MessageSquare, ShoppingCart, Check } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { addCommande } from '../../api/commandeService';
import { getPharmacies } from '../../api/pharmacieService';

const CommandeCreateScreen = ({ route, navigation }) => {
  const { ordonnance } = route.params;
  const { logout } = useAuthStore();
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [lieuLivraison, setLieuLivraison] = useState('');
  const [remarques, setRemarques] = useState('');

  useEffect(() => {
    const loadPharmacies = async () => {
      const loadedPharmacies = await getPharmacies();
      setPharmacies(loadedPharmacies);
    };
    loadPharmacies();
  }, []);

  const handleCreate = async () => {
    if (!selectedPharmacy) {
      Alert.alert('Erreur', 'Veuillez sélectionner une pharmacie');
      return;
    }
    const commande = {
      id: `c${Date.now()}`,
      ordonnanceId: ordonnance.id,
      patientId: ordonnance.patientId,
      pharmacienId: '',
      status: 'en_attente',
      dateCreation: new Date().toISOString().split('T')[0],
      lieuLivraison,
      remarques,
      pharmacieId: selectedPharmacy,
    };
    await addCommande(commande);
    Alert.alert('Succès', 'Commande créée avec succès');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Créer une Commande</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Sélectionner Pharmacie</Text>
        <View style={styles.pickerContainer}>
          {pharmacies.map(ph => (
            <TouchableOpacity
              key={ph.id}
              style={[styles.pharmacyOption, selectedPharmacy === ph.id && styles.selected]}
              onPress={() => setSelectedPharmacy(ph.id)}
            >
              <View style={styles.pharmacyContent}>
                <Text style={[styles.pharmacyText, selectedPharmacy === ph.id && styles.selectedText]}>
                  {ph.nom}
                </Text>
                <Text style={styles.addressText}>{ph.adresse}</Text>
              </View>
              {selectedPharmacy === ph.id && <Check size={20} color="#10B981" />}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Lieu de livraison</Text>
        <View style={styles.inputContainer}>
          <MapPin size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Entrez l'adresse de livraison"
            value={lieuLivraison}
            onChangeText={setLieuLivraison}
          />
        </View>
        <Text style={styles.label}>Remarques</Text>
        <View style={styles.inputContainer}>
          <MessageSquare size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Remarques supplémentaires"
            value={remarques}
            onChangeText={setRemarques}
            multiline
            numberOfLines={3}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <ShoppingCart size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Créer la Commande</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#10B981',
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
  pickerContainer: {
    marginBottom: 20,
  },
  pharmacyOption: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  pharmacyContent: {
    flex: 1,
  },
  pharmacyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  selectedText: {
    color: '#10B981',
  },
  addressText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 20,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
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

export default CommandeCreateScreen;