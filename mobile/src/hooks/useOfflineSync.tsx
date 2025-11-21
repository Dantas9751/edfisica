// src/hooks/useOfflineSync.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos locais. Instalar: npm install uuid @types/uuid
import { useAuth } from './useAuth';
import apiClient from '../services/apiClient';
import { 
  saveOfflineRegistration, 
  getPendingRegistrations, 
  clearPendingRegistrations,
  OfflineRegistration
} from '../services/storage';

// 1. Tipos de Resultado para o registro
interface RegistrationResult {
  status: 'success' | 'offline' | 'duplicate' | 'error';
  message?: string;
}

interface OfflineSyncContextType {
  isOnline: boolean;
  pendingCount: number;
  syncing: boolean;
  registerOfflineOrOnline: (qrCodeKey: string) => Promise<RegistrationResult>;
  forceSync: () => Promise<void>;
}

// 2. Criação do Contexto
const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

// 3. Provedor de Contexto (O Wrapper)
export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth(); // Precisa do user.id

  // --- Funções de Sincronização ---
  
  const fetchPendingCount = useCallback(async () => {
    const pending = await getPendingRegistrations();
    setPendingCount(pending.length);
  }, []);

  const syncRegistrations = useCallback(async () => {
    if (syncing || pendingCount === 0 || !user) return; // Não sincroniza se já estiver sincronizando ou não houver dados/usuário

    setSyncing(true);
    const pending = await getPendingRegistrations();
    console.log(`📡 Tentando sincronizar ${pending.length} registros...`);

    try {
      // 1. Enviar os registros em lote para uma rota específica no Laravel
      // Rota Laravel esperada: POST /api/v1/sync-registrations
      const response = await apiClient.post('/sync-registrations', {
        registrations: pending,
        userId: user.id, // Envia o ID do aluno
      });

      if (response.status === 200 || response.status === 201) {
        // Se o Laravel retornar sucesso (indicando que processou e validou o lote)
        await clearPendingRegistrations(); // Limpa o storage local
        await fetchPendingCount(); // Atualiza a contagem
        console.log('✅ Sincronização completa.');
      }
    } catch (error) {
      console.error('❌ Erro durante a sincronização:', error);
      // Se falhar, os dados permanecem no AsyncStorage para a próxima tentativa
    } finally {
      setSyncing(false);
    }
  }, [syncing, pendingCount, user, fetchPendingCount]);


  // --- Efeitos Colaterais ---

  // 1. Monitora o status da rede
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      // Considera online se há conexão com a internet
      const online = !!state.isInternetReachable; 
      setIsOnline(online);
      
      // Se acabou de ficar online E há registros pendentes, dispara a sincronização
      if (online) {
        syncRegistrations();
      }
    });

    fetchPendingCount(); // Carrega contagem inicial
    return () => unsubscribe(); // Limpeza do listener
  }, [fetchPendingCount, syncRegistrations]);


  // --- Função Principal de Registro ---

  const registerOfflineOrOnline = async (qrCodeKey: string): Promise<RegistrationResult> => {
    if (!user) {
      return { status: 'error', message: 'Usuário não autenticado.' };
    }

    // 1. Prepara o objeto de registro
    const registration: OfflineRegistration = {
      id: uuidv4(),
      qr_code_key: qrCodeKey,
      timestamp: Date.now(),
      user_id: user.id,
    };
    
    // 2. Tenta Online Primeiro (para verificação de duplicidade imediata)
    if (isOnline) {
      try {
        // Rota: POST /api/v1/register-meal
        await apiClient.post('/register-meal', { qr_code_key: qrCodeKey });
        fetchPendingCount(); // Atualiza a contagem
        return { status: 'success', message: 'Registro online OK.' };
        
      } catch (error: any) {
        if (error.status === 422 || error.status === 409) {
          // Captura a falha de duplicidade do Laravel
          return { status: 'duplicate', message: 'Refeição já registrada hoje.' };
        }
        // Se a requisição falhar por outro motivo (ex: erro no servidor 500 ou timeout)
        console.warn('Falha na tentativa online. Salvando offline.', error.message);
        await saveOfflineRegistration(registration);
        await fetchPendingCount();
        return { status: 'offline', message: 'Falha no servidor. Salvo offline.' };
      }
    } else {
      // 3. Salva Offline
      await saveOfflineRegistration(registration);
      await fetchPendingCount();
      return { status: 'offline', message: 'Sem conexão. Salvo localmente.' };
    }
  };

  const value = { isOnline, pendingCount, syncing, registerOfflineOrOnline, forceSync: syncRegistrations };

  return <OfflineSyncContext.Provider value={value}>{children}</OfflineSyncContext.Provider>;
}

// 4. Hook Customizado para Consumo
export function useOfflineSync() {
  const context = useContext(OfflineSyncContext);
  if (context === undefined) {
    throw new Error('useOfflineSync deve ser usado dentro de um OfflineSyncProvider');
  }
  return context;
}