import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Pill, Calendar, ShoppingCart } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

const OrdonnanceDetailScreen = ({ route, navigation }) => {
  const { ordonnance } = route.params;
  const { logout } = useAuthStore();

  const renderMedicament = ({ item }) => (
    <View style={styles.medicamentCard}>
      <View style={styles.medicamentHeader}>
        <Pill size={20} color="#10B981" />
        <Text style={styles.medicamentName}>{item.nom}</Text>
      </View>
      <Text style={styles.medicamentDetail}>Dosage: {item.dosage}</Text>
      <Text style={styles.medicamentDetail}>Quantité par jour: {item.quantiteParJour}</Text>
      <Text style={styles.medicamentDetail}>Durée: {item.duree} jours</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoCard}>
        <Calendar size={20} color="#10B981" />
        <Text style={styles.infoText}>Date: {ordonnance.date}</Text>
      </View>
      <Text style={styles.sectionTitle}>Médicaments</Text>
      <FlatList
        data={ordonnance.medicaments}
        renderItem={renderMedicament}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CommandeCreate', { ordonnance })}
      >
        <ShoppingCart size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Créer une Commande</Text>
      </TouchableOpacity>
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
  infoCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medicamentCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medicamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicamentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  medicamentDetail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#10B981',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
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

export default OrdonnanceDetailScreen;