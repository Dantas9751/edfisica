// mobile/App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';
import { OfflineSyncProvider } from './src/hooks/useOfflineSync';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <OfflineSyncProvider>
          
          <AppNavigator />
          
          <StatusBar style="auto" /> 
        </OfflineSyncProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}