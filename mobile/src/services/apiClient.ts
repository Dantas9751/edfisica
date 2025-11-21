// src/services/api.ts

import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/API';

// 1. Cria a instância base do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Tempo limite de 15 segundos
});

// 2. Interceptor de Requisição (Injeta o Token)
apiClient.interceptors.request.use(
  async (config) => {
    // Busca o token de autenticação armazenado de forma segura
    const token = await SecureStore.getItemAsync('userToken'); 

    if (token) {
      // Adiciona o token ao cabeçalho para cada requisição ao Laravel
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Resposta (Tratamento Global de Erros)
apiClient.interceptors.response.use(
  (response) => {
    // Retorna a resposta se for bem-sucedida (2xx)
    return response;
  },
  (error) => {
    // Se o token expirar ou for inválido (HTTP 401 Unauthorized)
    if (error.response?.status === 401) {
      // TODO: Implementar lógica de logout forçado aqui (limpar token e redirecionar para Login)
      // Ex: await SecureStore.deleteItemAsync('userToken');
      //    // Redirecionamento pode ser complexo em um interceptor, melhor tratar no useAuth/AppNavigator.
    }
    
    // Passa o erro adiante para ser tratado na tela
    return Promise.reject(error.response || error);
  }
);

export default apiClient;