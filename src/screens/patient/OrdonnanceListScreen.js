import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { FileText, ChevronRight, ShoppingCart, LogOut, Pill } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { getOrdonnances } from '../../api/ordonnanceService';
import { getPatients } from '../../api/patientService';

const OrdonnanceListScreen = ({ navigation }) => {
  const [ordonnances, setOrdonnances] = useState([]);
  const { currentUser, logout } = useAuthStore();

  useEffect(() => {
    const loadOrdonnances = async () => {
      const allOrdonnances = await getOrdonnances();
      const patients = await getPatients();
      const patient = patients.find(p => p.name === currentUser.name);
      if (patient) {
        const userOrdonnances = allOrdonnances.filter(o => o.patientId === patient.id);
        setOrdonnances(userOrdonnances);
      }
    };
    loadOrdonnances();
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OrdonnanceDetail', { ordonnance: item })}
      activeOpacity={0.7}
    >
      <View style={styles.iconCircle}>
        <FileText size={22} color="#10B981" strokeWidth={2.5} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Ordonnance</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.medicamentBadge}>
          <Pill size={12} color="#64748B" strokeWidth={2.5} />
          <Text style={styles.medicamentText}>{item.medicaments.length} médicament(s)</Text>
        </View>
      </View>
      <View style={styles.chevronCircle}>
        <ChevronRight size={20} color="#10B981" strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mes Ordonnances</Text>
          <Text style={styles.headerSubtitle}>{ordonnances.length} ordonnance(s)</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {currentUser?.name?.charAt(0).toUpperCase() || 'P'}
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={ordonnances}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <FileText size={40} color="#94A3B8" strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>Aucune ordonnance</Text>
            <Text style={styles.emptyText}>Vos ordonnances apparaîtront ici</Text>
          </View>
        }
      />

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.commandesButton}
          onPress={() => navigation.navigate('CommandeList')}
        >
          <View style={styles.buttonIconCircle}>
            <ShoppingCart size={20} color="#3B82F6" strokeWidth={2.5} />
          </View>
          <Text style={styles.commandesText}>Mes Commandes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={18} color="#EF4444" strokeWidth={2.5} />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
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
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  medicamentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  medicamentText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 5,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  commandesButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  buttonIconCircle: {
    marginRight: 8,
  },
  commandesText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '700',
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

export default OrdonnanceListScreen;