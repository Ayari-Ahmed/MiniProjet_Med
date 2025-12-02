import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart, ChevronRight, Pill } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { getCommandes, updateCommandeStatus } from '../../api/commandeService';

const CommandeListScreen = ({ navigation }) => {
  const [commandes, setCommandes] = useState([]);
  const { currentUser, logout } = useAuthStore();

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    const data = await getCommandes();
    setCommandes(data);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return '#f39c12';
      case 'en_preparation': return '#3498db';
      case 'prete': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const updateStatus = async (id, newStatus) => {
    await updateCommandeStatus(id, newStatus);
    loadCommandes(); // Refresh list
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CommandeDetail', { commande: item, onUpdateStatus: updateStatus })}
    >
      <ShoppingCart size={24} color="#10B981" style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Commande {item.id}</Text>
        <Text style={styles.cardSubtitle}>Patient: {item.patientId}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <ChevronRight size={24} color="#10B981" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Commandes</Text>
      <FlatList
        data={commandes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucune commande</Text>}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('MedicamentList')}
        >
          <Pill size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.navButtonText}>Médicaments</Text>
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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
  },
  navButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
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

export default CommandeListScreen;