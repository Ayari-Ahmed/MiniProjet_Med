import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Pill, Calendar, ShoppingCart, LogOut, Clock, Package } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { getMedicamentById } from '../../api/medicamentService';

const OrdonnanceDetailScreen = ({ route, navigation }) => {
  const { ordonnance } = route.params;
  const { logout } = useAuthStore();
  const [medicaments, setMedicaments] = useState([]);

  useEffect(() => {
    const loadMedicaments = async () => {
      const loadedMedicaments = [];
      for (const med of ordonnance.medicaments) {
        if (med.idMedicament) {
          // Reference to medicament, fetch full data
          const fullMed = await getMedicamentById(med.idMedicament);
          if (fullMed) {
            loadedMedicaments.push({ ...fullMed, ...med });
          }
        } else {
          // Full medicament data already in ordonnance
          loadedMedicaments.push(med);
        }
      }
      setMedicaments(loadedMedicaments);
    };
    loadMedicaments();
  }, [ordonnance.medicaments]);

  const renderMedicament = ({ item }) => (
    <View style={styles.medicamentCard}>
      <View style={styles.medicamentIconCircle}>
        <Pill size={20} color="#10B981" strokeWidth={2.5} />
      </View>
      <View style={styles.medicamentContent}>
        <Text style={styles.medicamentName}>{item.nom}</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <View style={styles.detailDot} />
            <Text style={styles.detailLabel}>Dosage:</Text>
            <Text style={styles.detailValue}>{item.dosage}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailDot} />
            <Text style={styles.detailLabel}>Forme:</Text>
            <Text style={styles.detailValue}>{item.forme}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailDot} />
            <Text style={styles.detailLabel}>Par jour:</Text>
            <Text style={styles.detailValue}>{item.quantiteParJour}x</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailDot} />
            <Text style={styles.detailLabel}>Durée:</Text>
            <Text style={styles.detailValue}>{item.duree} jours</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Ordonnance</Text>
          <Text style={styles.headerSubtitle}>Détails et médicaments</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Date Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconCircle}>
            <Calendar size={20} color="#3B82F6" strokeWidth={2.5} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Date de prescription</Text>
            <Text style={styles.infoValue}>{ordonnance.date}</Text>
          </View>
        </View>

        {/* Medications Count Badge */}
        <View style={styles.countBadge}>
          <Package size={16} color="#64748B" strokeWidth={2.5} />
          <Text style={styles.countText}>
            {medicaments.length} médicament(s) prescrit(s)
          </Text>
        </View>

        {/* Medications Section */}
        <Text style={styles.sectionTitle}>Médicaments prescrits</Text>
        
        <FlatList
          data={medicaments}
          renderItem={renderMedicament}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.medicamentList}
        />

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CommandeCreate', { ordonnance })}
            activeOpacity={0.8}
          >
            <View style={styles.createButtonIconCircle}>
              <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.createButtonText}>Créer une Commande</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '700',
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  countText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    letterSpacing: -0.3,
  },
  medicamentList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  medicamentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  medicamentIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  medicamentContent: {
    flex: 1,
  },
  medicamentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  detailsGrid: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginRight: 6,
  },
  detailValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  bottomButtons: {
    paddingHorizontal: 16,
    paddingTop: 8,
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
  createButtonIconCircle: {
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

export default OrdonnanceDetailScreen;