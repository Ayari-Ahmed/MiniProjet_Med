import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import { Pill, User, Shield, Stethoscope } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { resetData } from '../../data/initData';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const login = useAuthStore((state) => state.login);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }
    const success = await login(email.trim(), '');
    if (!success) {
      Alert.alert('Error', 'Invalid email');
    }
  };

  const clearData = async () => {
    await resetData();
    Alert.alert('Success', 'Data reset to initial state. Please restart the app.');
  };

  const demoLogin = async (email) => {
    setEmail(email);
    const success = await login(email, '');
    if (!success) {
      Alert.alert('Error', 'Demo account login failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoGlow} />
              <View style={styles.logo}>
                <Pill size={32} color="#10B981" strokeWidth={2.5} />
              </View>
            </View>
            <Text style={styles.appName}>MediCare</Text>
            <Text style={styles.subtitle}>Healthcare at your fingertips</Text>
          </View>

          {/* Main Content */}
          <View style={styles.main}>
            {/* Email Input Card */}
            <View style={styles.inputCard}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </View>
              
              <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Section */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Quick Demo Access</Text>
              
              <View style={styles.demoGrid}>
                <TouchableOpacity
                  style={[styles.demoButton, styles.patientButton]}
                  onPress={() => demoLogin('test1')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.demoIconWrapper, styles.patientIconBg]}>
                    <User size={20} color="#3B82F6" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.demoLabel}>Patient</Text>
                  <Text style={styles.demoName}>Jean M.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoButton, styles.pharmacistButton]}
                  onPress={() => demoLogin('test2')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.demoIconWrapper, styles.pharmacistIconBg]}>
                    <Shield size={20} color="#10B981" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.demoLabel}>Pharmacist</Text>
                  <Text style={styles.demoName}>Marie C.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoButton, styles.doctorButton]}
                  onPress={() => demoLogin('test3')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.demoIconWrapper, styles.doctorIconBg]}>
                    <Stethoscope size={20} color="#8B5CF6" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.demoLabel}>Doctor</Text>
                  <Text style={styles.demoName}>Dr. Dupont</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <TouchableOpacity onPress={clearData} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset App Data</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  logoGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    opacity: 0.15,
    top: 0,
    left: 0,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  inputContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  inputContainerFocused: {
    borderColor: '#10B981',
    backgroundColor: '#FFFFFF',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  demoSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  demoButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  patientButton: {
    borderColor: '#BFDBFE',
  },
  pharmacistButton: {
    borderColor: '#BBF7D0',
  },
  doctorButton: {
    borderColor: '#DDD6FE',
  },
  demoIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  patientIconBg: {
    backgroundColor: '#EFF6FF',
  },
  pharmacistIconBg: {
    backgroundColor: '#ECFDF5',
  },
  doctorIconBg: {
    backgroundColor: '#F5F3FF',
  },
  demoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  demoName: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
});

export default LoginScreen;