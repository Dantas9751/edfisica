// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '../../components/ui/Button'; 
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/Colors';

export default function LoginScreen() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Função de login vinda do contexto

  const handleLogin = async () => {
    if (!registrationNumber || !password) {
      Alert.alert('Erro', 'Por favor, preencha o número de matrícula/e-mail e a senha.', [{ text: 'OK' }]);
      return;
    }

    setIsLoading(true);
    try {
      // Chama a função de login. O hook trata a comunicação com o Laravel
      await login(registrationNumber, password);
      // Se for bem-sucedido, o AppNavigator redireciona automaticamente
    } catch (error: any) {
      console.error('Login Error:', error);
      
      // Exibe uma mensagem de erro genérica ou a mensagem de erro do Laravel
      const errorMessage = error.data?.message || 'Credenciais inválidas. Tente novamente.';
      Alert.alert('Falha no Acesso', errorMessage, [{ text: 'OK' }]);
      
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Intercampi Refeição Digital</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nº de Matrícula ou E-mail"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          keyboardType="default" // Pode ser 'email-address' se usar email
          autoCapitalize="none"
          placeholderTextColor={Colors.secondary}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={Colors.secondary}
        />
        
        <Button 
          title={"Acessar Sistema"} 
          onPress={handleLogin}
          loading={isLoading}
          disabled={!registrationNumber || !password || isLoading}
        />
        
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: Colors.background 
  },
  formContainer: {
    padding: 30,
    backgroundColor: Colors.lightText,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 35, 
    textAlign: 'center', 
    color: Colors.primary 
  },
  input: { 
    height: 50, 
    borderColor: Colors.inputBorder, 
    borderWidth: 1, 
    paddingHorizontal: 15, 
    marginBottom: 20, 
    borderRadius: 8, 
    fontSize: 16,
    color: Colors.text
  },
});