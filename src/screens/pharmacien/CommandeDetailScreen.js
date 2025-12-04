import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, Platform } from 'react-native';
import { Hash, User, Calendar, MapPin, MessageSquare, CheckCircle, ArrowLeft, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useCommandeStore } from '../../store/commandeStore';

const CommandeDetailScreen = ({ route, navigation }) => {
  const { commande } = route.params;
  const { logout } = useAuthStore();
  const { updateCommandeStatus } = useCommandeStore();
  const [currentStatus, setCurrentStatus] = useState(commande.status);

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return '#F59E0B';
      case 'en_preparation': return '#3B82F6';
      case 'prete': return '#10B981';
      case 'annule_stock_insuffisant': return '#EF4444';
      case 'annule': return '#6B7280';
      default: return '#64748B';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_preparation': return 'En préparation';
      case 'prete': return 'Prête';
      case 'annule_stock_insuffisant': return 'Annulée - Stock insuffisant';
      case 'annule': return 'Annulée';
      default: return status;
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await updateCommandeStatus(commande.id, newStatus);
      setCurrentStatus(newStatus);
      Alert.alert('Succès', 'Statut mis à jour');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const statusOptions = [
    { key: 'en_attente', label: 'En attente' },
    { key: 'en_preparation', label: 'En préparation' },
    { key: 'prete', label: 'Prête' },
    { key: 'annule', label: 'Annuler' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.iconBadge}>
            <Hash size={24} color="#10B981" strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Détail</Text>
            <Text style={styles.headerSubtitle}>Commande</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageSquare size={20} color="#10B981" strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Informations de la commande</Text>
          </View>

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
                <Text style={styles.statusText}>{getStatusText(currentStatus)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Status Update Section - Only show if not cancelled due to insufficient stock */}
        {currentStatus !== 'annule_stock_insuffisant' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle size={20} color="#10B981" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Mettre à jour le statut</Text>
            </View>

            <View style={styles.statusOptions}>
              {statusOptions.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.statusButton, currentStatus === option.key && styles.activeStatus]}
                  onPress={() => updateStatus(option.key)}
                  activeOpacity={0.7}
                >
                  {currentStatus === option.key && <CheckCircle size={20} color="#10B981" style={styles.statusIcon} />}
                  <Text style={[styles.statusButtonText, currentStatus === option.key && styles.activeText]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Message for cancelled orders due to insufficient stock */}
        {currentStatus === 'annule_stock_insuffisant' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle size={20} color="#EF4444" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Commande annulée</Text>
            </View>

            <View style={styles.cancelledMessage}>
              <Text style={styles.cancelledText}>
                Cette commande a été annulée automatiquement en raison d'un stock insuffisant.
                Le statut ne peut être modifié que lorsque le stock sera réapprovisionné.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  iconBadge: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginLeft: 12,
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 16,
    color: '#64748B',
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  statusOptions: {
    gap: 12,
  },
  statusButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#475569',
    textAlign: 'center',
    flex: 1,
    fontWeight: '600',
  },
  activeText: {
    color: '#10B981',
    fontWeight: '700',
  },
  bottomPadding: {
    height: 20,
  },
  cancelledMessage: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelledText: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default CommandeDetailScreen;