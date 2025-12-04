import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, Platform, Alert } from 'react-native';
import { FileText, Edit, Trash2, UserPlus, LogOut, Search, Filter } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { usePatientStore } from '../../store/patientStore';

const OrdonnanceListScreenMed = ({ navigation }) => {
  const { currentUser, logout } = useAuthStore();
  const { ordonnances: allOrdonnances, loadOrdonnances, deleteOrdonnance } = useOrdonnanceStore();
  const { patients, loadPatients } = usePatientStore();

  const ordonnances = useMemo(() =>
    allOrdonnances.filter(o => o.medecinId === currentUser?.id),
    [allOrdonnances, currentUser?.id]
  );

  useFocusEffect(
    useCallback(() => {
      loadOrdonnances();
      loadPatients();
    }, [loadOrdonnances, loadPatients])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmation',
      'Supprimer cette ordonnance ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteOrdonnance(id);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.ordonnanceCard}>
      <View style={styles.ordonnanceCardLeft}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>Rx</Text>
        </View>
        <View style={styles.ordonnanceInfo}>
          <Text style={styles.ordonnanceName}>Ordonnance #{item.id.slice(-4)}</Text>
          <View style={styles.ordonnanceMeta}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{item.medicaments.length} méd.</Text>
            </View>
          </View>
          <Text style={styles.ordonnancePatient}>Patient: {patients.find(p => p.id === item.patientId)?.name || item.patientId}</Text>
        </View>
      </View>
      <View style={styles.ordonnanceActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('OrdonnanceForm', { ordonnance: item })}
          activeOpacity={0.7}
        >
          <Edit size={18} color="#F59E0B" strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color="#EF4444" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Ordonnances</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{ordonnances.length}</Text>
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

      {/* Quick Add Button */}
      <View style={styles.quickAddContainer}>
        <TouchableOpacity
          style={styles.quickAddButton}
          onPress={() => navigation.navigate('OrdonnanceForm')}
          activeOpacity={0.9}
        >
          <View style={styles.quickAddIcon}>
            <UserPlus size={20} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.quickAddText}>Nouvelle Ordonnance</Text>
          <View style={styles.quickAddArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Ordonnances List */}
      <FlatList
        data={ordonnances}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <FileText size={48} color="#CBD5E1" strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>Aucune ordonnance</Text>
            <Text style={styles.emptyText}>Ajoutez votre première ordonnance</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('OrdonnanceForm')}
              activeOpacity={0.8}
            >
              <UserPlus size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.emptyButtonText}>Ajouter une ordonnance</Text>
            </TouchableOpacity>
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
  quickAddContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  quickAddButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quickAddIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    letterSpacing: 0.3,
  },
  quickAddArrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
  },
  ordonnanceCard: {
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
  ordonnanceCardLeft: {
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
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  ordonnanceInfo: {
    flex: 1,
  },
  ordonnanceName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  ordonnanceMeta: {
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
  ordonnancePatient: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  ordonnanceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
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
  emptyButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default OrdonnanceListScreenMed;