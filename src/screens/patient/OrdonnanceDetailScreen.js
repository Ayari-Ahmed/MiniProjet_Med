import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { Pill, Calendar, User, MapPin, Phone, Stethoscope, ClipboardList, Clock, ArrowLeft, FileText, Shield, ShoppingCart } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import { getMedicamentById } from '../../api/medicamentService';

const { width } = Dimensions.get('window');

const OrdonnanceDetailScreen = ({ route, navigation }) => {
  const { ordonnance } = route.params;
  const { currentUser } = useAuthStore();
  const { patients } = usePatientStore();
  const [medicaments, setMedicaments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const loadMedicaments = async () => {
      const loadedMedicaments = [];
      for (const med of ordonnance.medicaments) {
        if (med.idMedicament) {
          const fullMed = await getMedicamentById(med.idMedicament);
          if (fullMed) {
            loadedMedicaments.push({ ...fullMed, ...med });
          }
        } else {
          loadedMedicaments.push(med);
        }
      }
      setMedicaments(loadedMedicaments);
    };
    loadMedicaments();
  }, [ordonnance.medicaments]);

  useEffect(() => {
    const currentPatient = patients.find(p => p.name === currentUser?.name);
    setPatient(currentPatient);

    setDoctor({
      name: 'Dr. Mohamed Ben Ali',
      specialty: 'Médecine Générale',
      address: 'Avenue Habib Bourguiba, Tunis',
      phone: '+216 50 123 456',
      license: '12345'
    });
  }, [currentUser, patients]);

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
          <Text style={styles.headerTitle}>Ordonnance</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Prescription Paper with Modern Design */}
        <View style={styles.prescriptionContainer}>
          {/* Green Header Band */}
          <View style={styles.paperHeaderBand}>
            <View style={styles.headerBandLeft}>
              <View style={styles.caduceusCircle}>
                <Text style={styles.caduceusSymbol}>⚕️</Text>
              </View>
              <View>
                <Text style={styles.headerBandTitle}>ORDONNANCE MÉDICALE</Text>
                <Text style={styles.headerBandSubtitle}>République Tunisienne</Text>
              </View>
            </View>
            <View style={styles.prescriptionNumberBadge}>
              <Text style={styles.prescriptionNumberLabel}>N°</Text>
              <Text style={styles.prescriptionNumberValue}>
                {ordonnance.id.slice(-6).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.prescriptionPaper}>
            {/* Doctor Information Card */}
            <View style={styles.doctorCard}>
              <View style={styles.doctorIconContainer}>
                <Stethoscope size={24} color="#10B981" strokeWidth={2.5} />
              </View>
              <View style={styles.doctorContent}>
                <Text style={styles.doctorName}>{doctor?.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor?.specialty}</Text>
                <View style={styles.doctorContactRow}>
                  <MapPin size={14} color="#64748B" strokeWidth={2} />
                  <Text style={styles.doctorContactText}>{doctor?.address}</Text>
                </View>
                <View style={styles.doctorContactRow}>
                  <Phone size={14} color="#64748B" strokeWidth={2} />
                  <Text style={styles.doctorContactText}>{doctor?.phone}</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Patient Information Card */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconCircle}>
                  <User size={16} color="#3B82F6" strokeWidth={2.5} />
                </View>
                <Text style={styles.sectionTitle}>Informations du Patient</Text>
              </View>
              <View style={styles.patientInfoBox}>
                <Text style={styles.patientName}>{patient?.name}</Text>
                <View style={styles.patientDetailRow}>
                  <Text style={styles.patientDetailLabel}>Âge:</Text>
                  <Text style={styles.patientDetailValue}>{patient?.age} ans</Text>
                </View>
                <View style={styles.patientDetailRow}>
                  <Text style={styles.patientDetailLabel}>Adresse:</Text>
                  <Text style={styles.patientDetailValue}>{patient?.adresse}</Text>
                </View>
                <View style={styles.patientDetailRow}>
                  <Text style={styles.patientDetailLabel}>Téléphone:</Text>
                  <Text style={styles.patientDetailValue}>{patient?.telephone}</Text>
                </View>
              </View>
            </View>

            {/* Date Card */}
            <View style={styles.dateCard}>
              <Calendar size={16} color="#10B981" strokeWidth={2.5} />
              <Text style={styles.dateLabel}>Date de prescription</Text>
              <View style={styles.dateBadge}>
                <Text style={styles.dateValue}>{ordonnance.date}</Text>
              </View>
            </View>

            {/* Medications Section */}
            <View style={styles.medicationsSection}>
              <View style={styles.medicationsHeader}>
                <View style={styles.medicationsIconCircle}>
                  <Pill size={18} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={styles.medicationsTitle}>Médicaments Prescrits</Text>
                <View style={styles.medicationsCountBadge}>
                  <Text style={styles.medicationsCountText}>{medicaments.length}</Text>
                </View>
              </View>

              {medicaments.map((item, index) => (
                <View key={index} style={styles.medicationCard}>
                  <View style={styles.medicationHeader}>
                    <View style={styles.medicationNumberBadge}>
                      <Text style={styles.medicationNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.rxSymbolContainer}>
                      <Text style={styles.rxSymbol}>℞</Text>
                    </View>
                  </View>

                  <View style={styles.medicationBody}>
                    <Text style={styles.medicationName}>{item.nom}</Text>
                    
                    <View style={styles.medicationMetaRow}>
                      <View style={styles.medicationMetaBadge}>
                        <Text style={styles.medicationMetaText}>{item.forme}</Text>
                      </View>
                      <View style={styles.medicationMetaBadge}>
                        <Text style={styles.medicationMetaText}>{item.dosage}</Text>
                      </View>
                    </View>

                    <View style={styles.posologyBox}>
                      <View style={styles.posologyHeader}>
                        <ClipboardList size={14} color="#10B981" strokeWidth={2.5} />
                        <Text style={styles.posologyTitle}>Posologie</Text>
                      </View>
                      <View style={styles.posologyDetails}>
                        <View style={styles.posologyItem}>
                          <View style={styles.posologyDot} />
                          <Text style={styles.posologyText}>
                            <Text style={styles.posologyValue}>{item.quantiteParJour}×</Text> par jour
                          </Text>
                        </View>
                        <View style={styles.posologyItem}>
                          <View style={styles.posologyDot} />
                          <Text style={styles.posologyText}>
                            Durée: <Text style={styles.posologyValue}>{item.duree} jours</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Signature Section */}
            <View style={styles.signatureSection}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Signature et Cachet du Médecin</Text>
              <Text style={styles.doctorSignatureName}>{doctor?.name}</Text>
              <Text style={styles.licenseNumber}>N° Ordre: {doctor?.license}</Text>
            </View>

            {/* Footer Disclaimer */}
            <View style={styles.disclaimerBox}>
              <Shield size={16} color="#92400E" strokeWidth={2.5} />
              <Text style={styles.disclaimerText}>
                Ordonnance strictement personnelle - Ne peut être utilisée que par le patient désigné
              </Text>
            </View>
          </View>
        </View>

        {/* Order Button */}
        <View style={styles.orderButtonContainer}>
          {ordonnance.status === 'ordered' ? (
            <View style={styles.orderedBadge}>
              <ShoppingCart size={20} color="#64748B" strokeWidth={2.5} />
              <Text style={styles.orderedText}>Commande déjà passée</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => navigation.navigate('Commandes', { screen: 'CommandeCreate', params: { ordonnance } })}
              activeOpacity={0.9}
            >
              <View style={styles.orderButtonIcon}>
                <ShoppingCart size={24} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <Text style={styles.orderButtonText}>Commander ces médicaments</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: StatusBar.currentHeight || 0,
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
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  prescriptionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  paperHeaderBand: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerBandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  caduceusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caduceusSymbol: {
    fontSize: 24,
  },
  headerBandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerBandSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 2,
  },
  prescriptionNumberBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  prescriptionNumberLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  prescriptionNumberValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  prescriptionPaper: {
    padding: 24,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  doctorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorContent: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
    marginBottom: 8,
  },
  doctorContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorContactText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  patientInfoBox: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  patientDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  patientDetailLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    width: 80,
  },
  patientDetailValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  dateLabel: {
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 'auto',
  },
  dateBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  medicationsSection: {
    marginBottom: 24,
  },
  medicationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
  },
  medicationsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  medicationsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    letterSpacing: -0.3,
  },
  medicationsCountBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  medicationsCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
  },
  medicationCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rxSymbolContainer: {
    flex: 1,
  },
  rxSymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
    fontStyle: 'italic',
  },
  medicationBody: {
    paddingLeft: 44,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  medicationMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  medicationMetaBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  medicationMetaText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  posologyBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  posologyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  posologyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  posologyDetails: {
    gap: 6,
  },
  posologyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posologyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  posologyText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  posologyValue: {
    fontWeight: '800',
    color: '#0F172A',
  },
  signatureSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  signatureLine: {
    width: 200,
    height: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 12,
  },
  signatureLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  doctorSignatureName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  licenseNumber: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCD34D',
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 16,
  },
  orderButtonContainer: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  orderButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  orderButtonIcon: {
    marginRight: 10,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  orderedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderedText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default OrdonnanceDetailScreen;