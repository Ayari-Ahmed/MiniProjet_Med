import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { ShoppingCart, Eye, Check, X, LogOut, Search, Filter } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useCommandeStore } from '../../store/commandeStore';
import { checkStockAvailability } from '../../api/pharmacyStockService';
import { getOrdonnances } from '../../api/ordonnanceService';

const CommandeListScreen = ({ navigation }) => {
  const { currentUser, logout } = useAuthStore();
  const { commandes: allCommandes, loadCommandes, updateCommandeStatus } = useCommandeStore();

  const commandes = useMemo(() =>
    allCommandes.filter(c => c.pharmacieId === currentUser?.id),
    [allCommandes, currentUser?.id]
  );

  useFocusEffect(
    useCallback(() => {
      loadCommandes();
    }, [loadCommandes])
  );

  const handleStatusUpdate = async (id, newStatus) => {
    // If changing to an active status, check stock availability first
    if (newStatus === 'en_attente' || newStatus === 'en_preparation') {
      const commande = commandes.find(c => c.id === id);
      if (commande) {
        const ordonnances = await getOrdonnances();
        const ordonnance = ordonnances.find(o => o.id === commande.ordonnanceId);

        if (ordonnance) {
          // Check if all medicines are available
          let stockSufficient = true;
          for (const med of ordonnance.medicaments) {
            const requiredQuantity = med.quantiteParJour * med.duree;
            const isAvailable = await checkStockAvailability(currentUser.id, med.idMedicament || med.id, requiredQuantity);
            if (!isAvailable) {
              stockSufficient = false;
              break;
            }
          }

          if (!stockSufficient) {
            // Cancel the order due to insufficient stock
            await updateCommandeStatus(id, 'annule_stock_insuffisant');
            return;
          }
        }
      }
    }

    await updateCommandeStatus(id, newStatus);
  };

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

  const renderItem = ({ item }) => (
    <View style={styles.commandeCard}>
      <View style={styles.commandeCardLeft}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>C{item.id.slice(-2)}</Text>
        </View>
        <View style={styles.commandeInfo}>
          <Text style={styles.commandeName}>Commande #{item.id.slice(-4)}</Text>
          <View style={styles.commandeMeta}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{item.dateCreation}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
          <Text style={styles.commandePatient}>Patient: {item.patientId}</Text>
        </View>
      </View>
      <View style={styles.commandeActions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('CommandeDetail', { commande: item })}
          activeOpacity={0.7}
        >
          <Eye size={18} color="#10B981" strokeWidth={2.5} />
        </TouchableOpacity>
        {item.status === 'en_attente' && (
          <>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleStatusUpdate(item.id, 'en_preparation')}
              activeOpacity={0.7}
            >
              <Check size={16} color="#10B981" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleStatusUpdate(item.id, 'annule')}
              activeOpacity={0.7}
            >
              <X size={16} color="#EF4444" strokeWidth={2.5} />
            </TouchableOpacity>
          </>
        )}
        {item.status === 'en_preparation' && (
          <TouchableOpacity
            style={styles.readyButton}
            onPress={() => handleStatusUpdate(item.id, 'prete')}
            activeOpacity={0.7}
          >
            <Check size={16} color="#10B981" strokeWidth={2.5} />
          </TouchableOpacity>
        )}
        {(item.status === 'annule_stock_insuffisant' || item.status === 'annule' || item.status === 'prete') && (
          <View style={styles.lockedStatus}>
            <Text style={styles.lockedText}>🔒</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Commandes</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{commandes.length}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
            <Search size={20} color="#64748B" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
            <Filter size={20} color="#64748B" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.7}>
            <LogOut size={18} color="#EF4444" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Commandes List */}
      <FlatList
        data={commandes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <ShoppingCart size={48} color="#CBD5E1" strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyText}>Les nouvelles commandes apparaîtront ici</Text>
          </View>
        }
      />
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
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
  },
  commandeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  commandeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  commandeInfo: {
    flex: 1,
  },
  commandeName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  commandeMeta: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  metaBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  commandePatient: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  commandeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  acceptButton: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  rejectButton: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  readyButton: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 24,
  },
  lockedStatus: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  lockedText: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default CommandeListScreen;