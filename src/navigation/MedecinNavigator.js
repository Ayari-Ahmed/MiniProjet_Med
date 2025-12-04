import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Users, FileText, User } from 'lucide-react-native';
import MedecinHomeScreen from '../screens/medecin/MedecinHomeScreen';
import PatientListScreen from '../screens/medecin/PatientListScreen';
import PatientFormScreen from '../screens/medecin/PatientFormScreen';
import OrdonnanceListScreenMed from '../screens/medecin/OrdonnanceListScreen';
import OrdonnanceFormScreen from '../screens/medecin/OrdonnanceFormScreen';
import MedecinProfileScreen from '../screens/medecin/MedecinProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PatientStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientList" component={PatientListScreen} />
    <Stack.Screen name="PatientForm" component={PatientFormScreen} />
  </Stack.Navigator>
);

const OrdonnanceStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrdonnanceListMed" component={OrdonnanceListScreenMed} />
    <Stack.Screen name="OrdonnanceForm" component={OrdonnanceFormScreen} />
  </Stack.Navigator>
);


const MedecinNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} />;
          } else if (route.name === 'Patients') {
            return <Users size={size} color={color} />;
          } else if (route.name === 'Ordonnances') {
            return <FileText size={size} color={color} />;
          } else if (route.name === 'Profil') {
            return <User size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={MedecinHomeScreen} />
      <Tab.Screen name="Patients" component={PatientStack} />
      <Tab.Screen name="Ordonnances" component={OrdonnanceStack} />
      <Tab.Screen name="Profil" component={MedecinProfileScreen} />
    </Tab.Navigator>
  );
};

export default MedecinNavigator;