import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Hash, User, Calendar, MapPin, MessageSquare, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

const CommandeDetailScreen = ({ route, navigation }) => {
  const { commande, onUpdateStatus } = route.params;
  const { logout } = useAuthStore();
  const [currentStatus, setCurrentStatus] = useState(commande.status);

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return '#f39c12';
      case 'en_preparation': return '#3498db';
      case 'prete': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const updateStatus = (newStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatus(commande.id, newStatus);
    Alert.alert('Succès', 'Statut mis à jour');
  };

  const statusOptions = [
    { key: 'en_attente', label: 'En attente' },
    { key: 'en_preparation', label: 'En préparation' },
    { key: 'prete', label: 'Prête' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Hash size={20} color="#10B981" />
          <Text style={styles.label}>ID Commande:</Text>
          <Text style={styles.value}>{commande.id}</Text>
        </View>
        <View style={styles.detailRow}>
          <User size={20} color="#10B981" />
          <Text style={styles.label}>Patient:</Text>
          <Text style={styles.value}>{commande.patientId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={20} color="#10B981" />
          <Text style={styles.label}>Date:</Text>
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
        <View style={styles.detailRow}>
          <CheckCircle size={20} color="#10B981" />
          <Text style={styles.label}>Statut actuel:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) }]}>
            <Text style={styles.statusText}>{currentStatus.replace('_', ' ')}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Mettre à jour le statut</Text>
      <View style={styles.statusOptions}>
        {statusOptions.map(option => (
          <TouchableOpacity
            key={option.key}
            style={[styles.statusButton, currentStatus === option.key && styles.activeStatus]}
            onPress={() => updateStatus(option.key)}
          >
            {currentStatus === option.key && <CheckCircle size={20} color="#10B981" style={styles.statusIcon} />}
            <Text style={[styles.statusButtonText, currentStatus === option.key && styles.activeText]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusOptions: {
    padding: 16,
  },
  statusButton: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeStatus: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  statusIcon: {
    marginRight: 8,
  },
  statusButtonText: {
    fontSize: 16,
    color: '#1E293B',
    textAlign: 'center',
    flex: 1,
  },
  activeText: {
    color: '#10B981',
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

export default CommandeDetailScreen;