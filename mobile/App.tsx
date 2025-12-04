import 'react-native-gesture-handler'; // ⚠️ MANTENHA ESTA LINHA NO TOPO!
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

// --- Importação das Telas ---
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Alunos from './src/screens/Alunos'; // Certifique-se de ter criado este arquivo

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// --- 1. Componente da Sidebar Personalizada ---
function CustomDrawerContent(props: any) {
  const { signOut, user } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      {/* Cabeçalho do Menu (Dados do Usuário) */}
      <View style={{ padding: 20, backgroundColor: '#f4f4f4', marginBottom: 10 }}>
         <View style={{ 
            width: 60, height: 60, borderRadius: 30, 
            backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 
         }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
         </View>
         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{user?.name}</Text>
         <Text style={{ fontSize: 14, color: '#666' }}>{user?.matricula}</Text>
         
         {/* Badge de Admin para facilitar identificação */}
         {user?.tipo === 'admin' && (
             <View style={{ marginTop: 5, backgroundColor: '#ff9800', alignSelf: 'flex-start', paddingHorizontal: 8, borderRadius: 4 }}>
                 <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>ADMIN</Text>
             </View>
         )}
      </View>

      {/* Lista de Telas (Home, Perfil, etc.) */}
      <DrawerItemList {...props} />

      {/* Botão Sair */}
      <TouchableOpacity onPress={signOut} style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 20 }}>
        <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>🚪 Sair da Conta</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

// --- 2. Rotas Autenticadas (Menu Lateral / Drawer) ---
function AuthenticatedRoutes() {
  const { user } = useAuth(); // Precisamos do usuário para verificar se é admin

  return (
    <Drawer.Navigator 
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            headerShown: true, // Mostra a barra azul no topo
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff', // Cor do texto e do ícone do menu
            headerTitleStyle: { fontWeight: 'bold' },
            drawerActiveTintColor: '#007AFF', // Cor do item selecionado no menu
            drawerInactiveTintColor: '#333',
        }}
    >
      <Drawer.Screen 
        name="Home" 
        component={Home} 
        options={{ title: 'Escanear Refeição' }} 
      />
      
      <Drawer.Screen 
        name="Profile" 
        component={Profile} 
        options={{ title: 'Meus Tickets' }} 
      />

      {/* 👇 Lógica de Proteção: Só exibe se for ADMIN */}
      {user?.tipo === 'admin' && (
        <Drawer.Screen 
          name="Alunos" 
          component={Alunos} 
          options={{ title: 'Gerenciar Alunos' }} 
        />
      )}
    </Drawer.Navigator>
  );
}

// --- 3. Controlador Principal de Navegação (Login vs App) ---
function Routes() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <Stack.Screen name="AuthRoutes" component={AuthenticatedRoutes} />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

// --- 4. Componente Raiz ---
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        {/* StatusBar light deixa os ícones de bateria/hora brancos para combinar com o header azul */}
        <StatusBar style="light" backgroundColor="#007AFF" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}