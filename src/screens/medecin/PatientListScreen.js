import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar, Dimensions } from 'react-native';
import { Users, Edit, Trash2, Plus, Sparkles, UserPlus, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { getPatients, deletePatient } from '../../api/patientService';

const PatientListScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const { currentUser, logout } = useAuthStore();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const data = await getPatients();
    setPatients(data);
  };

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
            loadPatients();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.patientCard}>
      <View style={styles.patientCardLeft}>
        <View style={styles.patientIconContainer}>
          <Users size={20} color="#3B82F6" strokeWidth={2.5} />
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientDetail}>Âge: {item.age} ans</Text>
          <Text style={styles.patientDetail}>{item.adresse}</Text>
          <Text style={styles.patientDetail}>{item.telephone}</Text>
        </View>
      </View>
      <View style={styles.patientActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('PatientForm', { patient: item })}
          activeOpacity={0.8}
        >
          <Edit size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
          activeOpacity={0.8}
        >
          <Trash2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Gestion des Patients</Text>
                <Text style={styles.doctorName}>Dr. {currentUser?.name || 'Médecin'}</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>En ligne</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <LogOut size={18} color="#EF4444" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <Users size={16} color="#3B82F6" strokeWidth={2.5} />
                </View>
                <Text style={styles.statValue}>{patients.length}</Text>
                <Text style={styles.statLabel}>Patients</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.sectionHeader}>
          <Sparkles size={20} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.sectionTitle}>Liste des Patients</Text>
        </View>

        {/* Add New Patient Button */}
        <TouchableOpacity
          style={styles.addPatientCard}
          onPress={() => navigation.navigate('PatientForm')}
          activeOpacity={0.9}
        >
          <View style={styles.addPatientContent}>
            <View style={styles.addIconContainer}>
              <UserPlus size={32} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.addPatientTitle}>Nouveau Patient</Text>
              <Text style={styles.addPatientSubtitle}>Ajouter un patient au système</Text>
            </View>
          </View>
          <Text style={styles.addArrow}>+</Text>
        </TouchableOpacity>

        {/* Patients List */}
        <FlatList
          data={patients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.patientsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Users size={40} color="#94A3B8" strokeWidth={2} />
              </View>
              <Text style={styles.emptyTitle}>Aucun patient</Text>
              <Text style={styles.emptyText}>Les patients apparaîtront ici</Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Account for tab bar height
  },
  headerContainer: {
    paddingBottom: 40,
  },
  headerGradient: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  doctorName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  mainContent: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  addPatientCard: {
    backgroundColor: '#10B981',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  addPatientContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  addIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 18,
  },
  addPatientTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  addPatientSubtitle: {
    fontSize: 13,
    color: '#D1FAE5',
    fontWeight: '600',
  },
  addArrow: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700',
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: [{ translateY: -16 }],
  },
  patientsList: {
    paddingBottom: 20,
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  patientCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientIconContainer: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 14,
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  patientDetail: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  patientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
});

export default PatientListScreen;