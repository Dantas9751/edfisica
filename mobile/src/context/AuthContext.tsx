import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient';

interface User {
  id: number;
  name: string;
  matricula: string;
  tipo: 'admin' | 'aluno';
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (matricula: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const [storedUser, storedToken] = await AsyncStorage.multiGet([
        'user_data',
        'user_token',
      ]);

      if (storedToken[1] && storedUser[1]) {
        apiClient.defaults.headers.Authorization = `Bearer ${storedToken[1]}`;
        setUser(JSON.parse(storedUser[1]));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(matricula: string, password: string) {
    // Chama a rota de login que criamos no Laravel
    const response = await apiClient.post('/auth/login', {
      matricula,
      password,
    });

    const { access_token, user } = response.data;

    await AsyncStorage.setItem('user_token', access_token);
    await AsyncStorage.setItem('user_data', JSON.stringify(user));

    apiClient.defaults.headers.Authorization = `Bearer ${access_token}`;
    setUser(user);
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}