import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Users, FileText, ShoppingCart } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

const MedecinHomeScreen = ({ navigation }) => {
  const { logout } = useAuthStore();

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Espace Médecin</Text>
      <Text style={styles.subtitle}>Choisissez une action :</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PatientList')}
      >
        <Users size={24} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Gérer les Patients</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OrdonnanceListMed')}
      >
        <FileText size={24} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Gérer les Ordonnances</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CommandeListMed')}
      >
        <ShoppingCart size={24} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Suivre les Commandes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#10B981',
    padding: 20,
    width: '100%',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MedecinHomeScreen;