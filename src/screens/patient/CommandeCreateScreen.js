import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { MapPin, MessageSquare, ShoppingCart, Check, Building2, LogOut } from 'lucide-react-native';
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
  const [focusedInput, setFocusedInput] = useState(null);

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Nouvelle Commande</Text>
          <Text style={styles.headerSubtitle}>Choisissez votre pharmacie</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Pharmacy Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconCircle}>
              <Building2 size={18} color="#10B981" strokeWidth={2.5} />
            </View>
            <Text style={styles.sectionTitle}>Sélectionner une pharmacie</Text>
          </View>
          
          <View style={styles.pharmacyList}>
            {pharmacies.map(ph => (
              <TouchableOpacity
                key={ph.id}
                style={[
                  styles.pharmacyCard,
                  selectedPharmacy === ph.id && styles.pharmacyCardSelected
                ]}
                onPress={() => setSelectedPharmacy(ph.id)}
                activeOpacity={0.7}
              >
                <View style={styles.pharmacyContent}>
                  <Text style={[
                    styles.pharmacyName,
                    selectedPharmacy === ph.id && styles.pharmacyNameSelected
                  ]}>
                    {ph.nom}
                  </Text>
                  <Text style={styles.pharmacyAddress}>{ph.adresse}</Text>
                </View>
                {selectedPharmacy === ph.id && (
                  <View style={styles.checkCircle}>
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Delivery Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconCircle}>
              <MapPin size={18} color="#3B82F6" strokeWidth={2.5} />
            </View>
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          </View>
          
          <View style={[
            styles.inputCard,
            focusedInput === 'location' && styles.inputCardFocused
          ]}>
            <MapPin size={20} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="123 Rue Example, Tunis"
              placeholderTextColor="#94A3B8"
              value={lieuLivraison}
              onChangeText={setLieuLivraison}
              onFocus={() => setFocusedInput('location')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>

        {/* Remarks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconCircle}>
              <MessageSquare size={18} color="#8B5CF6" strokeWidth={2.5} />
            </View>
            <Text style={styles.sectionTitle}>Remarques (optionnel)</Text>
          </View>
          
          <View style={[
            styles.inputCard,
            styles.textAreaCard,
            focusedInput === 'remarks' && styles.inputCardFocused
          ]}>
            <MessageSquare size={20} color="#64748B" strokeWidth={2} style={[styles.inputIcon, styles.textAreaIcon]} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Instructions spéciales pour la livraison..."
              placeholderTextColor="#94A3B8"
              value={remarques}
              onChangeText={setRemarques}
              multiline
              numberOfLines={4}
              onFocus={() => setFocusedInput('remarks')}
              onBlur={() => setFocusedInput(null)}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={handleCreate}
            activeOpacity={0.8}
          >
            <View style={styles.createButtonIcon}>
              <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.createButtonText}>Créer la Commande</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={logout}
            activeOpacity={0.8}
          >
            <LogOut size={18} color="#EF4444" strokeWidth={2.5} />
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  pharmacyList: {
    gap: 10,
  },
  pharmacyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pharmacyCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  pharmacyContent: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  pharmacyNameSelected: {
    color: '#10B981',
  },
  pharmacyAddress: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputCardFocused: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  textAreaCard: {
    alignItems: 'flex-start',
    paddingTop: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  textArea: {
    minHeight: 90,
    paddingTop: 0,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  createButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  createButtonIcon: {
    marginRight: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default CommandeCreateScreen;