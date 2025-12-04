import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { FileText, ChevronRight, Plus, Home, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { getOrdonnances } from '../../api/ordonnanceService';

const OrdonnanceListScreenMed = ({ navigation }) => {
  const [ordonnances, setOrdonnances] = useState([]);
  const { currentUser, logout } = useAuthStore();

  useEffect(() => {
    const loadOrdonnances = async () => {
      const allOrdonnances = await getOrdonnances();
      const userOrdonnances = allOrdonnances.filter(o => o.medecinId === currentUser.id);
      setOrdonnances(userOrdonnances);
    };
    loadOrdonnances();
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OrdonnanceForm', { ordonnance: item })}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FileText size={28} color="#10B981" strokeWidth={2.5} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Ordonnance</Text>
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>Patient: {item.patientId}</Text>
          </View>
          <View style={[styles.infoBadge, styles.medBadge]}>
            <Text style={styles.medBadgeText}>{item.medicaments.length} médicament(s)</Text>
          </View>
        </View>
      </View>
      <ChevronRight size={24} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mes Ordonnances</Text>
          <Text style={styles.headerSubtitle}>Dr. {currentUser?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color="#FFFFFF" />
        </TouchableOpacity>
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
            <FileText size={64} color="#E2E8F0" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Aucune ordonnance</Text>
            <Text style={styles.emptySubtitle}>Créez votre première ordonnance</Text>
          </View>
        }
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('MedecinHome')}
          activeOpacity={0.7}
        >
          <Home size={22} color="#64748B" strokeWidth={2} />
          <Text style={styles.homeButtonText}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('OrdonnanceForm')}
          activeOpacity={0.8}
        >
          <View style={styles.addButtonInner}>
            <Plus size={28} color="#FFFFFF" strokeWidth={3} />
          </View>
        </TouchableOpacity>

        <View style={styles.placeholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 4,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    backgroundColor: '#D1FAE5',
    padding: 14,
    borderRadius: 14,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 10,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  infoBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  medBadge: {
    backgroundColor: '#DBEAFE',
  },
  medBadgeText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  homeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  homeButtonText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  addButton: {
    marginTop: -32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonInner: {
    backgroundColor: '#10B981',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  placeholder: {
    flex: 1,
  },
});

export default OrdonnanceListScreenMed;