import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { FileText, Eye, LogOut, Search, Filter } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { usePatientStore } from '../../store/patientStore';
import { getUsers } from '../../api/userService';

const OrdonnanceListScreen = ({ navigation }) => {
  const { currentUser, logout } = useAuthStore();
  const { ordonnances: allOrdonnances, loadOrdonnances } = useOrdonnanceStore();
  const { patients, loadPatients } = usePatientStore();
  const [users, setUsers] = useState([]);

  const patient = useMemo(() =>
    patients.find(p => p.name === currentUser?.name),
    [patients, currentUser?.name]
  );

  const ordonnances = useMemo(() =>
    patient ? allOrdonnances.filter(o => o.patientId === patient.id) : [],
    [allOrdonnances, patient]
  );

  const loadUsers = async () => {
    const allUsers = await getUsers();
    setUsers(allUsers);
  };

  useFocusEffect(
    useCallback(() => {
      loadOrdonnances();
      loadPatients();
      loadUsers();
    }, [loadOrdonnances, loadPatients])
  );

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
            <View style={[styles.statusBadge, item.status === 'ordered' && styles.statusBadgeOrdered]}>
              <Text style={[styles.statusText, item.status === 'ordered' && styles.statusTextOrdered]}>
                {item.status === 'ordered' ? 'Commandé' : 'Actif'}
              </Text>
            </View>
          </View>
          <Text style={styles.ordonnanceDoctor}>Médecin: {users.find(u => u.id === item.medecinId)?.name || item.medecinId}</Text>
        </View>
      </View>
      <View style={styles.ordonnanceActions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('OrdonnanceDetail', { ordonnance: item })}
          activeOpacity={0.7}
        >
          <Eye size={18} color="#10B981" strokeWidth={2.5} />
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
          <Text style={styles.headerTitle}>Mes Ordonnances</Text>
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
            <Text style={styles.emptyText}>Vos ordonnances apparaîtront ici</Text>
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
  ordonnanceDoctor: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  ordonnanceActions: {
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
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeOrdered: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusTextOrdered: {
    color: '#F59E0B',
  },
});

export default OrdonnanceListScreen;