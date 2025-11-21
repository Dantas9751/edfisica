// src/screens/app/ProfileScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../services/apiClient';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { useOfflineSync } from '../../hooks/useOfflineSync'; // Para mostrar o status de sincronização

// Definição do tipo de dados esperado do Laravel para o status das refeições
interface MealStatus {
  name: string; 
  isRegistered: boolean; 
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { pendingCount, isOnline, forceSync } = useOfflineSync();
  const [mealStatus, setMealStatus] = useState<MealStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Função para buscar o status das refeições no Laravel ---
  const fetchMealStatus = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Rota Laravel esperada: GET /api/v1/meal-status
      const response = await apiClient.get('/meal-status');
      setMealStatus(response.data.mealStatus);
    } catch (error) {
      console.error("Erro ao buscar status das refeições:", error);
      // Fallback ou mensagem de erro
      if (isOnline) {
         Alert.alert('Erro', 'Não foi possível carregar o status de hoje. Verifique sua conexão.');
      }
      // Mock de exemplo para mostrar algo quando offline ou erro
      setMealStatus([ 
        { name: 'Café da Manhã', isRegistered: false },
        { name: 'Almoço', isRegistered: false },
        { name: 'Café da Tarde', isRegistered: false },
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [isOnline]);

  useEffect(() => {
    fetchMealStatus();
  }, [fetchMealStatus]);

  const registeredCount = mealStatus.filter(m => m.isRegistered).length;
  const totalMeals = mealStatus.length;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={fetchMealStatus} colors={[Colors.primary]} />
      }
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Meu Status</Text>
      </View>
      
      {/* Card de Dados do Aluno */}
      <View style={styles.card}>
        <Text style={styles.name}>{user?.name || 'Aluno Não Identificado'}</Text>
        <Text style={styles.info}>Matrícula: **{user?.registration_number || 'N/A'}**</Text>
        <Text style={styles.info}>E-mail: {user?.email || 'N/A'}</Text>
      </View>

      {/* Card de Status de Refeições */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Refeições de Hoje</Text>
        <Text style={styles.counter}>
          Refeições Pegas: 
          <Text style={styles.highlight}> {registeredCount} de {totalMeals}</Text>
        </Text>
      </View>
      
      {/* Detalhamento das Refeições */}
      {mealStatus.map((meal, index) => (
        <View key={index} style={styles.mealRow}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={[styles.mealStatus, meal.isRegistered ? styles.statusOK : styles.statusPending]}>
            {meal.isRegistered ? '✅ REGISTRADO' : '❌ PENDENTE'}
          </Text>
        </View>
      ))}

      {/* Status da Sincronização Offline */}
      {pendingCount > 0 && (
          <View style={styles.offlineBox}>
              <Text style={styles.offlineText}>
                  ⚠️ Há **{pendingCount}** registros pendentes. 
                  {!isOnline ? ' Reconecte para sincronizar.' : ' Sincronizando...'}
              </Text>
              <Button 
                title="Sincronizar Agora" 
                onPress={forceSync} 
                disabled={!isOnline}
                type="secondary" 
                style={styles.syncButton}
              />
          </View>
      )}

      <Button title="Sair do Aplicativo (Logout)" onPress={logout} type="danger" style={styles.logoutButton} />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: Colors.lightText },
  header: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  card: { backgroundColor: Colors.lightText, padding: 20, marginHorizontal: 20, marginTop: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: Colors.inputBorder },
  name: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 5 },
  info: { fontSize: 16, color: Colors.secondary, marginTop: 2 },
  statusCard: { backgroundColor: Colors.lightText, padding: 20, marginHorizontal: 20, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: Colors.primary },
  statusTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: Colors.text },
  counter: { fontSize: 16, color: Colors.text },
  highlight: { fontWeight: 'bold', color: Colors.primary },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.inputBorder, backgroundColor: Colors.lightText },
  mealName: { fontSize: 16, flex: 1, color: Colors.text },
  mealStatus: { fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'right' },
  statusOK: { color: Colors.success },
  statusPending: { color: Colors.danger },
  logoutButton: { margin: 20, marginTop: 30 },
  offlineBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.warning,
    alignItems: 'center',
  },
  offlineText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  syncButton: {
    marginTop: 5,
    minHeight: 40,
    paddingVertical: 8,
  }
});