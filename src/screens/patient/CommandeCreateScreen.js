import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { MapPin, MessageSquare, ShoppingCart, Check, Building2, LogOut, ArrowLeft, FileText } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { addCommande } from '../../api/commandeService';
import { getPharmacies } from '../../api/pharmacieService';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { checkStockAvailability, getStockForPharmacy } from '../../api/pharmacyStockService';
import { getMedicamentById } from '../../api/medicamentService';
import { StatusBar } from 'expo-status-bar';

const CommandeCreateScreen = ({ route, navigation }) => {
  const { ordonnance } = route.params;
  const { logout } = useAuthStore();
  const { updateOrdonnanceStatus } = useOrdonnanceStore();
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [lieuLivraison, setLieuLivraison] = useState('');
  const [remarques, setRemarques] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [pharmacyStocks, setPharmacyStocks] = useState({});

  useEffect(() => {
    const loadPharmacies = async () => {
      const loadedPharmacies = await getPharmacies();
      setPharmacies(loadedPharmacies);
    };
    loadPharmacies();
  }, []);

  useEffect(() => {
    const loadPharmacyStocks = async () => {
      if (pharmacies.length > 0 && ordonnance.medicaments) {
        const stocks = {};
        for (const pharmacy of pharmacies) {
          stocks[pharmacy.id] = {};
          for (const med of ordonnance.medicaments) {
            const stock = await getStockForPharmacy(pharmacy.id, med.idMedicament || med.id);
            stocks[pharmacy.id][med.idMedicament || med.id] = stock;
          }
        }
        setPharmacyStocks(stocks);
      }
    };
    loadPharmacyStocks();
  }, [pharmacies, ordonnance.medicaments]);

  const handleCreate = async () => {
    if (!selectedPharmacy) {
      Alert.alert('Erreur', 'Veuillez sélectionner une pharmacie');
      return;
    }

    // Check stock availability for all medicines in the ordonnance
    let stockCheckFailed = false;
    const unavailableMedicines = [];

    for (const med of ordonnance.medicaments) {
      const isAvailable = await checkStockAvailability(selectedPharmacy, med.idMedicament || med.id, med.quantiteParJour * med.duree);
      if (!isAvailable) {
        stockCheckFailed = true;
        const medicament = await getMedicamentById(med.idMedicament || med.id);
        unavailableMedicines.push(medicament?.nom || med.nom);
      }
    }

    if (stockCheckFailed) {
      Alert.alert(
        'Stock insuffisant',
        `Les médicaments suivants ne sont pas disponibles en quantité suffisante chez cette pharmacie:\n\n${unavailableMedicines.join('\n')}\n\nVeuillez choisir une autre pharmacie.`
      );
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

    // Mark ordonnance as ordered to prevent multiple orders
    await updateOrdonnanceStatus(ordonnance.id, 'ordered');

    Alert.alert('Succès', 'Commande créée avec succès', [
      {
        text: 'OK',
        onPress: () => {
          // Reset navigation to Commandes tab
          navigation.reset({
            index: 0,
            routes: [{ name: 'Commandes' }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <FileText size={20} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.headerTitle}>Nouvelle Commande</Text>
        </View>
        <View style={styles.headerSpacer} />
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
            {pharmacies.map(ph => {
              // Check if all medicines are available in this pharmacy
              const stocks = pharmacyStocks[ph.id] || {};
              const allAvailable = ordonnance.medicaments.every(med => {
                const required = med.quantiteParJour * med.duree;
                const available = stocks[med.idMedicament || med.id] || 0;
                return available >= required;
              });

              return (
                <TouchableOpacity
                  key={ph.id}
                  style={[
                    styles.pharmacyCard,
                    selectedPharmacy === ph.id && styles.pharmacyCardSelected,
                    !allAvailable && styles.pharmacyCardUnavailable
                  ]}
                  onPress={() => allAvailable && setSelectedPharmacy(ph.id)}
                  activeOpacity={allAvailable ? 0.7 : 1}
                  disabled={!allAvailable}
                >
                  <View style={styles.pharmacyContent}>
                    <View style={styles.pharmacyHeader}>
                      <Text style={[
                        styles.pharmacyName,
                        selectedPharmacy === ph.id && styles.pharmacyNameSelected,
                        !allAvailable && styles.pharmacyNameUnavailable
                      ]}>
                        {ph.nom}
                      </Text>
                      {!allAvailable && (
                        <View style={styles.unavailableBadge}>
                          <Text style={styles.unavailableText}>Stock insuffisant</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[
                      styles.pharmacyAddress,
                      !allAvailable && styles.pharmacyAddressUnavailable
                    ]}>
                      {ph.adresse}
                    </Text>

                    {/* Stock information for each medicine */}
                    <View style={styles.stockInfo}>
                      {ordonnance.medicaments.map((med, index) => {
                        const required = med.quantiteParJour * med.duree;
                        const available = stocks[med.idMedicament || med.id] || 0;
                        const isAvailable = available >= required;

                        return (
                          <View key={index} style={styles.stockItem}>
                            <Text style={[
                              styles.stockText,
                              !isAvailable && styles.stockTextUnavailable
                            ]}>
                              {med.nom || `Médicament ${index + 1}`}: {available}/{required} unités
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  {selectedPharmacy === ph.id && (
                    <View style={styles.checkCircle}>
                      <Check size={18} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 40,
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
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pharmacyCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  pharmacyCardUnavailable: {
    backgroundColor: '#FEF7F7',
    borderColor: '#FECACA',
    opacity: 0.7,
  },
  pharmacyContent: {
    flex: 1,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pharmacyName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  pharmacyNameSelected: {
    color: '#10B981',
  },
  pharmacyNameUnavailable: {
    color: '#991B1B',
  },
  unavailableBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  unavailableText: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pharmacyAddress: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  pharmacyAddressUnavailable: {
    color: '#991B1B',
  },
  stockInfo: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stockItem: {
    marginBottom: 4,
  },
  stockText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  stockTextUnavailable: {
    color: '#EF4444',
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