import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, FileText, ShoppingCart } from 'lucide-react-native';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import OrdonnanceListScreen from '../screens/patient/OrdonnanceListScreen';
import OrdonnanceDetailScreen from '../screens/patient/OrdonnanceDetailScreen';
import CommandeCreateScreen from '../screens/patient/CommandeCreateScreen';
import CommandeListScreen from '../screens/patient/CommandeListScreen';
import CommandeDetailScreen from '../screens/patient/CommandeDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const OrdonnanceStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrdonnanceList" component={OrdonnanceListScreen} />
    <Stack.Screen name="OrdonnanceDetail" component={OrdonnanceDetailScreen} />
  </Stack.Navigator>
);

const CommandeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CommandeList" component={CommandeListScreen} />
    <Stack.Screen name="CommandeCreate" component={CommandeCreateScreen} />
    <Stack.Screen name="CommandeDetail" component={CommandeDetailScreen} />
  </Stack.Navigator>
);

const PatientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} />;
          } else if (route.name === 'Ordonnances') {
            return <FileText size={size} color={color} />;
          } else if (route.name === 'Commandes') {
            return <ShoppingCart size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={PatientHomeScreen} />
      <Tab.Screen name="Ordonnances" component={OrdonnanceStack} />
      <Tab.Screen name="Commandes" component={CommandeStack} />
    </Tab.Navigator>
  );
};

export default PatientNavigator;