import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Users, Edit, Trash2, Plus, Home } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { getPatients, deletePatient } from '../../api/patientService';

const PatientListScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const { logout } = useAuthStore();

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
    <View style={styles.card}>
      <Users size={24} color="#10B981" style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDetail}>Âge: {item.age}</Text>
        <Text style={styles.cardDetail}>Adresse: {item.adresse}</Text>
        <Text style={styles.cardDetail}>Téléphone: {item.telephone}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('PatientForm', { patient: item })}
        >
          <Edit size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Trash2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Patients</Text>
      <FlatList
        data={patients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucun patient</Text>}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('PatientForm')}
        >
          <Plus size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.addButtonText}>Nouveau Patient</Text>
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
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  cardDetail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#F59E0B',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
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
    minWidth: 140,
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

export default PatientListScreen;