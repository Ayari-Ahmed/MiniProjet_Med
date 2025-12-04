import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Calendar, MapPin, MessageSquare, Hash, Building2, ArrowLeft, ShoppingCart } from 'lucide-react-native';

const CommandeDetailScreen = ({ route, navigation }) => {
  const { commande } = route.params;

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return '#F59E0B';
      case 'en_preparation': return '#3B82F6';
      case 'prete': return '#10B981';
      case 'annule_stock_insuffisant': return '#EF4444';
      case 'annule': return '#6B7280';
      default: return '#64748B';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_preparation': return 'En préparation';
      case 'prete': return 'Prête';
      case 'annule_stock_insuffisant': return 'Annulée - Stock insuffisant';
      case 'annule': return 'Annulée';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <ShoppingCart size={20} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.headerTitle}>Détail Commande</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Details Card */}
        <View style={styles.orderContainer}>
          <View style={styles.orderHeader}>
            <View style={styles.orderIconCircle}>
              <ShoppingCart size={24} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.orderTitle}>Commande #{commande.id.slice(-4)}</Text>
              <Text style={styles.orderSubtitle}>Détails de la commande</Text>
            </View>
          </View>

          <View style={styles.orderPaper}>
            {/* Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusIconCircle}>
                <Text style={styles.statusIcon}>📋</Text>
              </View>
              <View style={styles.statusContent}>
                <Text style={styles.statusLabel}>Statut actuel</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(commande.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(commande.status)}</Text>
                </View>
              </View>
            </View>

            {/* Message for cancelled orders due to insufficient stock */}
            {commande.status === 'annule_stock_insuffisant' && (
              <View style={styles.cancelledSection}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconCircle, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={styles.cancelledIcon}>⚠️</Text>
                  </View>
                  <Text style={styles.sectionTitle}>Commande annulée automatiquement</Text>
                </View>

                <View style={styles.cancelledCard}>
                  <Text style={styles.cancelledText}>
                    Cette commande a été annulée automatiquement en raison d'un stock insuffisant.
                    Elle sera automatiquement réactivée lorsque le stock sera réapprovisionné.
                  </Text>
                </View>
              </View>
            )}

            {/* Order Information */}
            <View style={styles.infoSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconCircle}>
                  <Hash size={16} color="#3B82F6" strokeWidth={2.5} />
                </View>
                <Text style={styles.sectionTitle}>Informations de la commande</Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Hash size={18} color="#10B981" />
                  <Text style={styles.infoLabel}>ID Commande:</Text>
                  <Text style={styles.infoValue}>{commande.id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Calendar size={18} color="#10B981" />
                  <Text style={styles.infoLabel}>Date de création:</Text>
                  <Text style={styles.infoValue}>{commande.dateCreation}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Building2 size={18} color="#10B981" />
                  <Text style={styles.infoLabel}>Pharmacie:</Text>
                  <Text style={styles.infoValue}>{commande.pharmacieId}</Text>
                </View>
              </View>
            </View>

            {/* Delivery Information */}
            <View style={styles.deliverySection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconCircle}>
                  <MapPin size={16} color="#8B5CF6" strokeWidth={2.5} />
                </View>
                <Text style={styles.sectionTitle}>Informations de livraison</Text>
              </View>

              <View style={styles.deliveryCard}>
                <View style={styles.deliveryRow}>
                  <MapPin size={18} color="#8B5CF6" />
                  <View style={styles.deliveryContent}>
                    <Text style={styles.deliveryLabel}>Adresse de livraison</Text>
                    <Text style={styles.deliveryValue}>
                      {commande.lieuLivraison || 'Non spécifiée'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Remarks */}
            {commande.remarques && (
              <View style={styles.remarksSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconCircle}>
                    <MessageSquare size={16} color="#F59E0B" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.sectionTitle}>Remarques</Text>
                </View>

                <View style={styles.remarksCard}>
                  <MessageSquare size={18} color="#F59E0B" />
                  <Text style={styles.remarksText}>{commande.remarques}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  orderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  orderHeader: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  orderIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  orderSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 2,
  },
  orderPaper: {
    padding: 24,
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  statusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusIcon: {
    fontSize: 24,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginLeft: 12,
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: 14,
    color: '#64748B',
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  deliverySection: {
    marginBottom: 20,
  },
  deliveryCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryContent: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  deliveryValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    lineHeight: 20,
  },
  remarksSection: {
    marginBottom: 20,
  },
  remarksCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    gap: 12,
  },
  remarksText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    lineHeight: 20,
  },
  cancelledSection: {
    marginBottom: 20,
  },
  cancelledCard: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelledIcon: {
    fontSize: 16,
  },
  cancelledText: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '500',
    lineHeight: 20,
  },
});

export default CommandeDetailScreen;