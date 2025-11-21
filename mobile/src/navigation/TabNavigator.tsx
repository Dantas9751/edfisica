// src/navigation/TabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Usaremos ícones do Expo
import { Colors } from '../constants/Colors';
import ScannerScreen from '../screens/app/ScannerScreen';
import ProfileScreen from '../screens/app/ProfileScreen';

// 1. Definição do Tipo de Parâmetros
export type AppTabParamList = {
  Scanner: undefined;
  Profile: undefined;
};

// 2. Criação do Navigator
const Tab = createBottomTabNavigator<AppTabParamList>();

/**
 * Navigator para o fluxo principal (Scanner e Perfil), exibido após o login.
 */
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Estilos da aba
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarStyle: { paddingBottom: 5, height: 60 },
        
        // Configuração dos Ícones
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Scanner') {
            iconName = 'qr-code-outline'; // Ícone de QR Code
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline'; // Ícone de Perfil/Pessoa
          }
          
          // @ts-ignore: O nome do ícone será definido acima
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ title: 'Escanear Refeição', headerShown: false }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Meu Status', headerShown: true }} 
      />
    </Tab.Navigator>
  );
}