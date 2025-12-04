import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, StatusBar, Platform } from 'react-native';
import { Users, Edit, Trash2, UserPlus, LogOut, Search, Filter } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';

const PatientListScreen = ({ navigation }) => {
   const { currentUser, logout } = useAuthStore();
   const { patients, loadPatients, deletePatient } = usePatientStore();

   useEffect(() => {
     loadPatients();
   }, [loadPatients]);

  const handleDelete = (id, name) => {
    Alert.alert(
      'Confirmation',
      `Supprimer ${name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deletePatient(id);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.patientCard}>
      <View style={styles.patientCardLeft}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <View style={styles.patientMeta}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{item.age} ans</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{item.telephone}</Text>
            </View>
          </View>
          <Text style={styles.patientAddress}>{item.adresse}</Text>
        </View>
      </View>
      <View style={styles.patientActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('PatientForm', { patient: item })}
          activeOpacity={0.7}
        >
          <Edit size={18} color="#F59E0B" strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
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
          <Text style={styles.headerTitle}>Patients</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{patients.length}</Text>
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
          onPress={() => navigation.navigate('PatientForm')}
          activeOpacity={0.9}
        >
          <View style={styles.quickAddIcon}>
            <UserPlus size={20} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.quickAddText}>Nouveau Patient</Text>
          <View style={styles.quickAddArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Patients List */}
      <FlatList
        data={patients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Users size={48} color="#CBD5E1" strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>Aucun patient</Text>
            <Text style={styles.emptyText}>Ajoutez votre premier patient</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('PatientForm')}
              activeOpacity={0.8}
            >
              <UserPlus size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.emptyButtonText}>Ajouter un patient</Text>
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
  patientCard: {
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
  patientCardLeft: {
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
    fontSize: 22,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  patientMeta: {
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
  patientAddress: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  patientActions: {
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

export default PatientListScreen