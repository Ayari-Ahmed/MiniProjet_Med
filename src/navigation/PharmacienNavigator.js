import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, ShoppingCart, Pill } from 'lucide-react-native';
import PharmacienHomeScreen from '../screens/pharmacien/PharmacienHomeScreen';
import CommandeListScreen from '../screens/pharmacien/CommandeListScreen';
import CommandeDetailScreen from '../screens/pharmacien/CommandeDetailScreen';
import MedicamentListScreen from '../screens/pharmacien/MedicamentListScreen';
import MedicamentFormScreen from '../screens/pharmacien/MedicamentFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CommandeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CommandeList" component={CommandeListScreen} />
    <Stack.Screen name="CommandeDetail" component={CommandeDetailScreen} />
  </Stack.Navigator>
);

const MedicamentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MedicamentList" component={MedicamentListScreen} />
    <Stack.Screen name="MedicamentForm" component={MedicamentFormScreen} />
  </Stack.Navigator>
);

const PharmacienNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} />;
          } else if (route.name === 'Commandes') {
            return <ShoppingCart size={size} color={color} />;
          } else if (route.name === 'Medicaments') {
            return <Pill size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={PharmacienHomeScreen} />
      <Tab.Screen name="Commandes" component={CommandeStack} />
      <Tab.Screen name="Medicaments" component={MedicamentStack} />
    </Tab.Navigator>
  );
};

export default PharmacienNavigator;