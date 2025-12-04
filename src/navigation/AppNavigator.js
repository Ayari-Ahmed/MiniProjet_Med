import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import LoginScreen from '../screens/auth/LoginScreen';
import MedecinNavigator from './MedecinNavigator';
import PatientNavigator from './PatientNavigator';
import PharmacienNavigator from './PharmacienNavigator';
import CommandeListScreenPh from '../screens/pharmacien/CommandeListScreen';
import CommandeDetailScreenPh from '../screens/pharmacien/CommandeDetailScreen';
import MedicamentListScreen from '../screens/pharmacien/MedicamentListScreen';
import MedicamentFormScreen from '../screens/pharmacien/MedicamentFormScreen';

const Stack = createNativeStackNavigator();

const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
    <Text>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const AppNavigator = () => {
  const { currentUser, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#10B981',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        {!currentUser ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : currentUser.role === 'patient' ? (
          <Stack.Screen name="PatientTabs" component={PatientNavigator} options={{ headerShown: false }} />
        ) : currentUser.role === 'pharmacien' ? (
          <Stack.Screen name="PharmacienTabs" component={PharmacienNavigator} options={{ headerShown: false }} />
        ) : currentUser.role === 'medecin' ? (
          <Stack.Screen name="MedecinTabs" component={MedecinNavigator} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;