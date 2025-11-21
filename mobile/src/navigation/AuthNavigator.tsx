// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';

// 1. Definição do Tipo de Parâmetros
export type AuthStackParamList = {
  Login: undefined; // A tela de Login não recebe parâmetros
};

// 2. Criação do Navigator
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Navigator para o fluxo de autenticação (antes do login).
 */
export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false, // Não mostra o cabeçalho no fluxo de autenticação
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      {/* Se fosse necessário, telas como 'ForgotPassword' ou 'Register' iriam aqui. */}
    </AuthStack.Navigator>
  );
}