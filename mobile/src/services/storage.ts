// src/services/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a estrutura do registro de refeição offline
export interface OfflineRegistration {
  id: string; // ID local único (Timestamp + UUID) para rastreamento
  qr_code_key: string; // Ex: 'AL2025'
  timestamp: number; // Quando a leitura foi feita (usado para ordenação)
  user_id: number; // ID do usuário (obtido via useAuth no momento da leitura)
}

const OFFLINE_REGISTRATIONS_KEY = '@Intercampi:offline_regs';

/**
 * Salva um registro de refeição no armazenamento local.
 * @param registration O objeto de registro a ser salvo.
 */
export async function saveOfflineRegistration(registration: OfflineRegistration): Promise<void> {
  try {
    const existingRegistrationsJson = await AsyncStorage.getItem(OFFLINE_REGISTRATIONS_KEY);
    let registrations: OfflineRegistration[] = existingRegistrationsJson ? JSON.parse(existingRegistrationsJson) : [];
    
    // Adiciona o novo registro
    registrations.push(registration);
    
    await AsyncStorage.setItem(OFFLINE_REGISTRATIONS_KEY, JSON.stringify(registrations));
    console.log('✅ Registro salvo localmente com sucesso:', registration.qr_code_key);
  } catch (error) {
    console.error('❌ Erro ao salvar registro offline:', error);
    throw new Error('Não foi possível salvar os dados localmente.');
  }
}

/**
 * Obtém todos os registros de refeição pendentes de sincronização.
 */
export async function getPendingRegistrations(): Promise<OfflineRegistration[]> {
  try {
    const registrationsJson = await AsyncStorage.getItem(OFFLINE_REGISTRATIONS_KEY);
    return registrationsJson ? JSON.parse(registrationsJson) : [];
  } catch (error) {
    console.error('❌ Erro ao obter registros pendentes:', error);
    return [];
  }
}

/**
 * Remove os registros pendentes do armazenamento local (após sincronização bem-sucedida).
 */
export async function clearPendingRegistrations(): Promise<void> {
  try {
    await AsyncStorage.removeItem(OFFLINE_REGISTRATIONS_KEY);
    console.log('🧹 Registros pendentes limpos do armazenamento local.');
  } catch (error) {
    console.error('❌ Erro ao limpar registros pendentes:', error);
  }
}