import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import LoginScreen from '../screens/auth/LoginScreen';
import MedecinNavigator from './MedecinNavigator';
import OrdonnanceListScreen from '../screens/patient/OrdonnanceListScreen';
import OrdonnanceDetailScreen from '../screens/patient/OrdonnanceDetailScreen';
import CommandeCreateScreen from '../screens/patient/CommandeCreateScreen';
import CommandeListScreenP from '../screens/patient/CommandeListScreen';
import CommandeDetailScreenP from '../screens/patient/CommandeDetailScreen';
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
          <>
            <Stack.Screen name="OrdonnanceList" component={OrdonnanceListScreen} options={{ title: 'Mes Ordonnances' }} />
            <Stack.Screen name="OrdonnanceDetail" component={OrdonnanceDetailScreen} options={{ title: 'Détail Ordonnance' }} />
            <Stack.Screen name="CommandeCreate" component={CommandeCreateScreen} options={{ title: 'Créer Commande' }} />
            <Stack.Screen name="CommandeList" component={CommandeListScreenP} options={{ title: 'Mes Commandes' }} />
            <Stack.Screen name="CommandeDetail" component={CommandeDetailScreenP} options={{ title: 'Détail Commande' }} />
          </>
        ) : currentUser.role === 'pharmacien' ? (
          <>
            <Stack.Screen name="CommandeList" component={CommandeListScreenPh} options={{ title: 'Commandes' }} />
            <Stack.Screen name="CommandeDetail" component={CommandeDetailScreenPh} options={{ title: 'Détail Commande' }} />
            <Stack.Screen name="MedicamentList" component={MedicamentListScreen} options={{ title: 'Médicaments' }} />
            <Stack.Screen name="MedicamentForm" component={MedicamentFormScreen} options={{ title: 'Nouveau Médicament' }} />
          </>
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