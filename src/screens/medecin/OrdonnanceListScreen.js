import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, ChevronRight, Plus, Home } from 'lucide-react-native';
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
    >
      <FileText size={24} color="#10B981" style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Ordonnance du {item.date}</Text>
        <Text style={styles.cardSubtitle}>Patient: {item.patientId}</Text>
        <Text style={styles.cardSubtitle}>{item.medicaments.length} médicament(s)</Text>
      </View>
      <ChevronRight size={24} color="#10B981" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Ordonnances</Text>
      <FlatList
        data={ordonnances}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucune ordonnance</Text>}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('OrdonnanceForm')}
        >
          <Plus size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.addButtonText}>Nouvelle Ordonnance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('MedecinHome')}
        >
          <Home size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.navButtonText}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 16,
    flexWrap: 'wrap',
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 160,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  navButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrdonnanceListScreenMed;