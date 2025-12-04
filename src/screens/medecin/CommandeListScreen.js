import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { ShoppingCart, Home, LogOut, Package } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { getCommandes } from '../../api/commandeService';
import { getOrdonnances } from '../../api/ordonnanceService';

const CommandeListScreenMed = ({ navigation }) => {
  const [commandes, setCommandes] = useState([]);
  const { currentUser, logout } = useAuthStore();

  useEffect(() => {
    const loadCommandes = async () => {
      const allCommandes = await getCommandes();
      const allOrdonnances = await getOrdonnances();
      const doctorOrdonnances = allOrdonnances.filter(o => o.medecinId === currentUser.id);
      const doctorCommandes = allCommandes.filter(c =>
        doctorOrdonnances.some(o => o.id === c.ordonnanceId)
      );
      setCommandes(doctorCommandes);
    };
    loadCommandes();
  }, [currentUser]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'en_attente':
        return { color: '#F59E0B', bg: '#FEF3C7', text: 'En attente' };
      case 'en_preparation':
        return { color: '#3B82F6', bg: '#DBEAFE', text: 'En préparation' };
      case 'prete':
        return { color: '#10B981', bg: '#D1FAE5', text: 'Prête' };
      default:
        return { color: '#6B7280', bg: '#F3F4F6', text: status };
    }
  };

  const renderItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    return (
      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: statusInfo.bg }]}>
          <Package size={22} color={statusInfo.color} strokeWidth={2.5} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Commande #{item.id}</Text>
          <Text style={styles.cardSubtitle}>Patient: {item.patientId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mes Commandes</Text>
          <Text style={styles.headerSubtitle}>{commandes.length} commande(s)</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {currentUser?.name?.charAt(0).toUpperCase() || 'D'}
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={commandes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <ShoppingCart size={40} color="#94A3B8" strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyText}>Les commandes apparaîtront ici</Text>
          </View>
        }
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('MedecinHome')}
        >
          <View style={styles.navIconCircle}>
            <Home size={20} color="#10B981" strokeWidth={2.5} />
          </View>
          <Text style={styles.navButtonText}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={18} color="#EF4444" strokeWidth={2.5} />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 10,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  navIconCircle: {
    marginRight: 8,
  },
  navButtonText: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default CommandeListScreenMed;
