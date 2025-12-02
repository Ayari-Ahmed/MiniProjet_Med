import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, MapPin, MessageSquare } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

const CommandeDetailScreen = ({ route }) => {
  const { commande } = route.params;
  const { logout } = useAuthStore();

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return '#f39c12';
      case 'en_preparation': return '#3498db';
      case 'prete': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(commande.status) }]}>
            <Text style={styles.statusText}>{commande.status.replace('_', ' ')}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={20} color="#10B981" />
          <Text style={styles.label}>Date de création:</Text>
          <Text style={styles.value}>{commande.dateCreation}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={20} color="#10B981" />
          <Text style={styles.label}>Lieu de livraison:</Text>
          <Text style={styles.value}>{commande.lieuLivraison || 'Non spécifié'}</Text>
        </View>
        <View style={styles.detailRow}>
          <MessageSquare size={20} color="#10B981" />
          <Text style={styles.label}>Remarques:</Text>
          <Text style={styles.value}>{commande.remarques || 'Aucune'}</Text>
        </View>
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
  detailCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginLeft: 12,
  },
  value: {
    fontSize: 16,
    color: '#64748B',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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

export default CommandeDetailScreen;