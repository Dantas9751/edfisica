// src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

// Define as propriedades que o componente Button pode receber
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  type?: 'primary' | 'danger' | 'secondary'; // Define tipos visuais
}

export default function Button({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false, 
  style, 
  textStyle, 
  type = 'primary' 
}: ButtonProps) {

  // Define as cores de fundo com base no tipo
  const buttonTypeStyle = type === 'primary' 
    ? styles.primary 
    : type === 'danger' 
    ? styles.danger 
    : styles.secondary;
    
  // Estilo para quando o botão estiver desativado
  const disabledStyle = disabled || loading ? styles.disabled : {};

  return (
    <TouchableOpacity
      style={[styles.button, buttonTypeStyle, disabledStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={Colors.lightText} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  text: {
    color: Colors.lightText,
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});