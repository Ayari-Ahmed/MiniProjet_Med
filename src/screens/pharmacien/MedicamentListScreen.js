import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Pill, Edit, Trash2, Plus, ShoppingCart } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { getMedicaments, deleteMedicament } from '../../api/medicamentService';

const MedicamentListScreen = ({ navigation }) => {
  const [medicaments, setMedicaments] = useState([]);
  const { logout } = useAuthStore();

  useEffect(() => {
    loadMedicaments();
  }, []);

  const loadMedicaments = async () => {
    const data = await getMedicaments();
    setMedicaments(data);
  };

  const handleDelete = (id, nom) => {
    Alert.alert(
      'Confirmation',
      `Supprimer ${nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteMedicament(id);
            loadMedicaments();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Pill size={24} color="#10B981" style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nom}</Text>
        <Text style={styles.cardDetail}>Dosage: {item.dosage}</Text>
        <Text style={styles.cardDetail}>Forme: {item.forme}</Text>
        <Text style={styles.cardDetail}>Stock: {item.quantiteStock}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('MedicamentForm', { medicament: item })}
        >
          <Edit size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.nom)}
        >
          <Trash2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Médicaments</Text>
      <FlatList
        data={medicaments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucun médicament</Text>}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('MedicamentForm')}
        >
          <Plus size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.addButtonText}>Nouveau</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('CommandeList')}
        >
          <ShoppingCart size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.navButtonText}>Commandes</Text>
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
    minWidth: 120,
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

export default MedicamentListScreen;