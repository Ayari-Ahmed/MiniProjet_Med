import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdonnanceListScreen from '../screens/patient/OrdonnanceListScreen';
import OrdonnanceDetailScreen from '../screens/patient/OrdonnanceDetailScreen';
import CommandeCreateScreen from '../screens/patient/CommandeCreateScreen';
import CommandeListScreen from '../screens/patient/CommandeListScreen';
import CommandeDetailScreen from '../screens/patient/CommandeDetailScreen';

const Stack = createNativeStackNavigator();

const PatientNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrdonnanceList">
      <Stack.Screen name="OrdonnanceList" component={OrdonnanceListScreen} options={{ title: 'Mes Ordonnances' }} />
      <Stack.Screen name="OrdonnanceDetail" component={OrdonnanceDetailScreen} options={{ title: 'Détail Ordonnance' }} />
      <Stack.Screen name="CommandeCreate" component={CommandeCreateScreen} options={{ title: 'Créer Commande' }} />
      <Stack.Screen name="CommandeList" component={CommandeListScreen} options={{ title: 'Mes Commandes' }} />
      <Stack.Screen name="CommandeDetail" component={CommandeDetailScreen} options={{ title: 'Détail Commande' }} />
    </Stack.Navigator>
  );
};

export default PatientNavigator;