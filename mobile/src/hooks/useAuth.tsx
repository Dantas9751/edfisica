// src/hooks/useAuth.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../services/apiClient';

// 1. Definições de Tipos
interface User {
  id: number;
  name: string;
  registration_number: string;
  email: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (regNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Criação do Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provedor de Contexto (O Wrapper)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // Carrega o usuário/token ao iniciar o app
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          // Opcional: Validar o token e buscar dados do usuário no Laravel
          // Ex: const response = await apiClient.get('/user'); 
          //     setUser(response.data.user);
          // Por enquanto, apenas consideramos o token como um indicativo de login.
          setUser({ id: 1, name: 'Aluno Teste', registration_number: '12345', email: 'test@uni.com', role: 'student' }); // Mock para teste
        }
      } catch (e) {
        console.error("Erro ao carregar token:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (regNumber: string, password: string) => {
    // 1. Chama a API de login do Laravel
    const response = await apiClient.post('/auth/login', {
      registration_number: regNumber, // ou 'email'
      password: password,
    });
    
    // 2. Assumindo que a API retorna o token e os dados do usuário
    const { token, user: userData } = response.data;

    // 3. Salva o token de forma segura
    await SecureStore.setItemAsync('userToken', token);
    
    // 4. Define o usuário no estado
    setUser(userData);
  };

  const logout = async () => {
    // 1. (Opcional) Notifica o Laravel sobre o logout
    try {
        await apiClient.post('/auth/logout');
    } catch (e) {
        // Ignora erros no logout do backend
    }
    
    // 2. Remove o token e limpa o estado
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
  };

  const value = { user, isAuthenticated, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Hook Customizado para Consumo
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}