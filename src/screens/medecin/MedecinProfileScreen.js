import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, ScrollView, TextInput, Alert } from 'react-native';
import { User, Mail, Phone, MapPin, LogOut, Sparkles, Edit, Save, X } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';

const MedecinProfileScreen = ({ navigation }) => {
  const { currentUser, logout, updateUser } = useAuthStore();
  const { patients } = usePatientStore();
  const { ordonnances: allOrdonnances } = useOrdonnanceStore();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({ patients: 0, ordonnances: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    adresse: '',
  });

  const ordonnances = useMemo(() =>
    allOrdonnances.filter(o => o.medecinId === currentUser?.id),
    [allOrdonnances, currentUser?.id]
  );

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        telephone: currentUser.telephone || '+216 50 000 000',
        adresse: currentUser.adresse || 'Tunis, Tunisie',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    setStats({
      patients: patients.length,
      ordonnances: ordonnances.length,
    });
  }, [currentUser, patients, ordonnances]);

  const handleSave = async () => {
    try {
      await updateUser(currentUser.id, formData);
      setIsEditing(false);
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour');
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Mon Profil</Text>
                <Text style={styles.doctorName}>Dr. {currentUser?.name || 'Médecin'}</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>En ligne</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                {!isEditing ? (
                  <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Edit size={18} color="#10B981" strokeWidth={2} />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.editActions}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Save size={18} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                      <X size={18} color="#EF4444" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                  <LogOut size={18} color="#EF4444" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.sectionHeader}>
          <Sparkles size={20} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.sectionTitle}>Informations Personnelles</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{formData.name?.charAt(0).toUpperCase() || 'M'}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <User size={18} color="#64748B" strokeWidth={2} />
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  placeholder="Nom complet"
                />
              ) : (
                <Text style={styles.infoText}>{formData.name || 'Médecin'}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Mail size={18} color="#64748B" strokeWidth={2} />
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoText}>{formData.email || 'medecin@email.com'}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Phone size={18} color="#64748B" strokeWidth={2} />
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.telephone}
                  onChangeText={(value) => updateFormData('telephone', value)}
                  placeholder="Téléphone"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{formData.telephone || '+33 6 00 00 00 00'}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <MapPin size={18} color="#64748B" strokeWidth={2} />
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.adresse}
                  onChangeText={(value) => updateFormData('adresse', value)}
                  placeholder="Adresse"
                />
              ) : (
                <Text style={styles.infoText}>{formData.adresse || 'Tunis, Tunisie'}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.patients}</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.ordonnances}</Text>
              <Text style={styles.statLabel}>Ordonnances</Text>
            </View>
          </View>
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
    paddingBottom: 20,
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
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 10,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#BFDBFE',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  infoSection: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 12,
  },
  statsSection: {
    marginTop: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MedecinProfileScreen;