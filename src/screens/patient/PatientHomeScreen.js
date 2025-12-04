import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, ScrollView, Platform } from 'react-native';
import { FileText, ShoppingCart, LogOut, Sparkles, TrendingUp } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { useCommandeStore } from '../../store/commandeStore';
import { usePatientStore } from '../../store/patientStore';

const { width } = Dimensions.get('window');

const PatientHomeScreen = ({ navigation }) => {
    const { currentUser, logout } = useAuthStore();
    const { ordonnances: allOrdonnances, loadOrdonnances } = useOrdonnanceStore();
    const { commandes: allCommandes, loadCommandes } = useCommandeStore();
    const { patients, loadPatients } = usePatientStore();

    const patient = useMemo(() =>
      patients.find(p => p.name === currentUser?.name),
      [patients, currentUser?.name]
    );

    const ordonnances = useMemo(() =>
      patient ? allOrdonnances.filter(o => o.patientId === patient.id) : [],
      [allOrdonnances, patient]
    );

    const commandes = useMemo(() =>
      patient ? allCommandes.filter(c => c.patientId === patient.id) : [],
      [allCommandes, patient]
    );

    const [stats, setStats] = useState([
      { label: 'Ordonnances', value: '0', icon: FileText, color: '#10B981' },
      { label: 'Commandes', value: '0', icon: ShoppingCart, color: '#3B82F6' },
    ]);

  useFocusEffect(
    useCallback(() => {
      loadPatients();
      loadOrdonnances();
      loadCommandes();
    }, [loadPatients, loadOrdonnances, loadCommandes])
  );

  useEffect(() => {
    setStats([
      { label: 'Ordonnances', value: ordonnances.length.toString(), icon: FileText, color: '#10B981' },
      { label: 'Commandes', value: commandes.length.toString(), icon: ShoppingCart, color: '#3B82F6' },
    ]);
  }, [ordonnances, commandes]);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Glassmorphic Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Bienvenue</Text>
                <Text style={styles.patientName}>{currentUser?.name || 'Patient'}</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Connecté</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <LogOut size={18} color="#EF4444" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <View key={index} style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                      <Icon size={16} color={stat.color} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* Main Actions */}
      <View style={styles.mainContent}>
        <View style={styles.sectionHeader}>
          <Sparkles size={20} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.sectionTitle}>Actions Rapides</Text>
        </View>

        {/* Primary Action - Ordonnances */}
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={() => navigation.navigate('Ordonnances')}
          activeOpacity={0.9}
        >
          <View style={styles.primaryCardGlow} />
          <View style={styles.primaryCardContent}>
            <View style={styles.primaryLeft}>
              <View style={styles.primaryIconContainer}>
                <FileText size={32} color="#FFFFFF" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.primaryTitle}>Mes Ordonnances</Text>
                <Text style={styles.primarySubtitle}>Consulter vos prescriptions</Text>
              </View>
            </View>
            <View style={styles.primaryArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Secondary Action - Commandes */}
        <TouchableOpacity
          style={[styles.secondaryCard, styles.blueCard]}
          onPress={() => navigation.navigate('Commandes')}
          activeOpacity={0.9}
        >
          <View style={styles.secondaryTop}>
            <View style={styles.secondaryIcon}>
              <ShoppingCart size={24} color="#3B82F6" strokeWidth={2.5} />
            </View>
            <TrendingUp size={16} color="#3B82F680" strokeWidth={2} />
          </View>
          <Text style={styles.secondaryTitle}>Mes Commandes</Text>
          <Text style={styles.secondarySubtitle}>Suivre vos achats</Text>
          <View style={styles.secondaryFooter}>
            <Text style={styles.secondaryAction}>Voir →</Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Sparkles size={16} color="#10B981" strokeWidth={2.5} />
          </View>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Astuce: </Text>
            Utilisez la barre de navigation pour accéder rapidement à vos sections
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Account for tab bar height
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
  patientName: {
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
  primaryCard: {
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
  primaryCardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    backgroundColor: '#FFFFFF',
    opacity: 0.1,
    borderRadius: 75,
  },
  primaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  primaryIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 18,
  },
  primaryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  primarySubtitle: {
    fontSize: 13,
    color: '#D1FAE5',
    fontWeight: '600',
  },
  primaryArrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },
  blueCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  secondaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryIcon: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
  },
  secondaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  secondarySubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 12,
  },
  secondaryFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  secondaryAction: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '700',
  },
  tipCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  tipIcon: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#064E3B',
    fontWeight: '500',
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: '700',
  },
});

export default PatientHomeScreen;