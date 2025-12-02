import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommandeListScreen from '../screens/pharmacien/CommandeListScreen';
import CommandeDetailScreen from '../screens/pharmacien/CommandeDetailScreen';
import MedicamentListScreen from '../screens/pharmacien/MedicamentListScreen';
import MedicamentFormScreen from '../screens/pharmacien/MedicamentFormScreen';

const Stack = createNativeStackNavigator();

const PharmacienNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CommandeList">
      <Stack.Screen name="CommandeList" component={CommandeListScreen} options={{ title: 'Commandes' }} />
      <Stack.Screen name="CommandeDetail" component={CommandeDetailScreen} options={{ title: 'Détail Commande' }} />
      <Stack.Screen name="MedicamentList" component={MedicamentListScreen} options={{ title: 'Médicaments' }} />
      <Stack.Screen name="MedicamentForm" component={MedicamentFormScreen} options={{ title: 'Nouveau Médicament' }} />
    </Stack.Navigator>
  );
};

export default PharmacienNavigator;