import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

// Tipagem para ajudar no intellisense
interface Meal {
  id: number;
  nome: string;
  tipo: string;
  data: string;
  horario_inicio: string;
}

interface MealRecord {
  id: number;
  meal_id: number;
  scanned_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Dados brutos
  const [meals, setMeals] = useState<Meal[]>([]);
  const [myRecords, setMyRecords] = useState<MealRecord[]>([]);

  async function loadData() {
    setLoading(true);
    try {
      // Pega tudo do servidor
      const response = await apiClient.get('/sync/down');
      setMeals(response.data.meals || []);
      setMyRecords(response.data.my_records || []);
    } catch (error) {
      console.log('Erro ao carregar dados do perfil');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Função que verifica o status de cada refeição
  const renderItem = ({ item }: { item: Meal }) => {
    // Verifica se existe um registro para esta refeição
    const record = myRecords.find(r => r.meal_id === item.id);
    const isConsumed = !!record;

    return (
      <View style={[styles.row, isConsumed ? styles.rowConsumed : styles.rowPending]}>
        <View style={styles.rowInfo}>
            <Text style={styles.mealName}>{item.nome}</Text>
            <Text style={styles.mealDate}>
                {/* Formatação simples da data e hora */}
                {item.data.split('-').reverse().join('/')} às {item.horario_inicio.substring(0, 5)}
            </Text>
        </View>
        
        <View style={styles.statusBadge}>
            <Text style={[styles.statusText, isConsumed ? styles.textConsumed : styles.textPending]}>
                {isConsumed ? '✅ RECEBIDO' : '🕑 DISPONÍVEL'}
            </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho do Aluno */}
      <View style={styles.header}>
        <View style={styles.avatar}>
           <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
        </View>
        <View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.matricula}>{user?.matricula}</Text>
        </View>
      </View>

      <View style={styles.divider} />
      
      <Text style={styles.sectionTitle}>Situação das Refeições</Text>

      {/* Lista de Refeições */}
      <FlatList
        data={meals}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma refeição cadastrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  matricula: { fontSize: 14, color: '#666' },
  
  divider: { height: 1, backgroundColor: '#ddd', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 10, textTransform: 'uppercase' },

  // Lista
  row: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderRadius: 10, marginBottom: 10,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2 
  },
  rowConsumed: { backgroundColor: '#e8f5e9', borderLeftWidth: 5, borderLeftColor: '#2ecc71' }, // Verde claro
  rowPending: { backgroundColor: '#fff', borderLeftWidth: 5, borderLeftColor: '#ccc' }, // Branco/Cinza

  rowInfo: { flex: 1 },
  mealName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  mealDate: { fontSize: 12, color: '#666', marginTop: 2 },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  textConsumed: { color: '#27ae60' },
  textPending: { color: '#7f8c8d' },

  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});