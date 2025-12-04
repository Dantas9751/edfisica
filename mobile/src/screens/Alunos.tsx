import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity,
  Alert 
} from 'react-native';
import apiClient from '../services/apiClient';
import { Ionicons } from '@expo/vector-icons'; // Para ícones

// Bibliotecas para o Offline
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface Aluno {
  id: number;
  name: string;
  matricula: string;
  // Adicionei isso para a lógica das refeições (ajuste conforme seu JSON de retorno)
  refeicoes_info?: {
    consumidas: number; // Quantas ele já comeu hoje
    total: number;      // Total disponível (ex: 3 - Café, Almoço, Janta)
  };
}

export default function Alunos() {
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isOffline, setIsOffline] = useState(false); // Estado para controlar o aviso offline
  
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Função Principal: Busca API (Online) ou Cache (Offline)
  async function fetchAlunos(termo = '') {
    setLoading(true);

    // 1. Checa conexão
    const netState = await NetInfo.fetch();
    const online = !!netState.isConnected;
    setIsOffline(!online);

    try {
      if (online) {
        // --- ONLINE: Pega da API e salva no celular ---
        const response = await apiClient.get(`/alunos?search=${termo}`);
        setAlunos(response.data);

        // Se não for uma busca específica, salva a lista completa no cache
        if (termo === '') {
          await AsyncStorage.setItem('@alunos_cache', JSON.stringify(response.data));
        }
      } else {
        // --- OFFLINE: Pega do Async Storage ---
        const cachedData = await AsyncStorage.getItem('@alunos_cache');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          
          // Filtra localmente se tiver busca
          if (termo) {
            const filtered = parsedData.filter((a: Aluno) => 
                a.name.toLowerCase().includes(termo.toLowerCase()) || 
                a.matricula.includes(termo)
            );
            setAlunos(filtered);
          } else {
            setAlunos(parsedData);
          }
        }
      }
    } catch (error) {
      console.log('Erro ao buscar alunos', error);
      // Fallback: Se der erro na API, tenta ler o cache também
      const cachedData = await AsyncStorage.getItem('@alunos_cache');
      if (cachedData) setAlunos(JSON.parse(cachedData));
    }
    
    setLoading(false);
  }

  // Listener para monitorar queda de internet em tempo real
  useEffect(() => {
    fetchAlunos();
    
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  function handleSearch(text: string) {
    setSearchText(text);
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(setTimeout(() => {
      fetchAlunos(text);
    }, 500));
  }

  // Função para ver detalhes da refeição (Pode abrir um modal ou navegar)
  const handleVerRefeicoes = (aluno: Aluno) => {
    // AQUI: Navegue para uma tela de detalhes ou abra um modal
    Alert.alert(
        `Refeições de ${aluno.name}`, 
        `Consumidas: ${aluno.refeicoes_info?.consumidas || 0} de ${aluno.refeicoes_info?.total || 0}`
    );
  };

  const renderItem = ({ item }: { item: Aluno }) => (
    <View style={styles.card}>
      {/* Avatar e Infos Básicas */}
      <View style={styles.leftContent}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.matricula}>{item.matricula}</Text>
        </View>
      </View>

      {/* Botão/Info de Refeições */}
      <TouchableOpacity 
        style={styles.mealButton} 
        onPress={() => handleVerRefeicoes(item)}
      >
        <View style={styles.badgeContainer}>
             <Ionicons name="restaurant-outline" size={16} color="#fff" />
             <Text style={styles.mealText}>
                {item.refeicoes_info ? `${item.refeicoes_info.consumidas}/${item.refeicoes_info.total}` : '-'}
             </Text>
        </View>
        <Text style={styles.detailsText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Banner Offline */}
      {isOffline && (
        <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>Sem internet. Exibindo dados locais.</Text>
        </View>
      )}

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou matrícula..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista */}
      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchAlunos(searchText)} />}
        ListEmptyComponent={
            !loading ? <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text> : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
      {loading && alunos.length === 0 && (
          <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007AFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  
  // Estilo do Banner Offline
  offlineBanner: {
    backgroundColor: '#ffcc00',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    color: '#665500',
    fontSize: 12,
    fontWeight: 'bold',
  },

  searchContainer: { padding: 15, backgroundColor: '#fff', elevation: 2 },
  searchInput: { 
    backgroundColor: '#f0f0f0', borderRadius: 8, padding: 10, fontSize: 16,
    borderWidth: 1, borderColor: '#ddd' 
  },

  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', // Separa info do botão
    backgroundColor: '#fff', 
    marginHorizontal: 15, 
    marginTop: 10, 
    padding: 15, 
    borderRadius: 10,
    elevation: 1 
  },
  
  leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
  },

  avatar: { 
    width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#e3f2fd', 
    justifyContent: 'center', alignItems: 'center', marginRight: 12 
  },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  info: { flex: 1 }, // Ocupa o espaço disponível
  name: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  matricula: { fontSize: 13, color: '#666', marginTop: 2 },
  
  // Estilos do Botão de Refeição
  mealButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
  },
  badgeContainer: {
      flexDirection: 'row',
      backgroundColor: '#007AFF', // Azul ou verde dependendo do status
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignItems: 'center',
      gap: 4,
      marginBottom: 2
  },
  mealText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12
  },
  detailsText: {
      fontSize: 10,
      color: '#007AFF'
  },

  emptyText: { textAlign: 'center', marginTop: 30, color: '#999', fontSize: 16 }
});