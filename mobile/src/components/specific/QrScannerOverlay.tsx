// src/components/specific/QrScannerOverlay.tsx

import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.7; // 70% da largura da tela

interface QrScannerOverlayProps {
  isScanning: boolean;
}

export default function QrScannerOverlay({ isScanning }: QrScannerOverlayProps) {
  return (
    <View style={styles.container}>
      
      {/* 1. Área Focada (O "Buraco" no centro) */}
      <View style={styles.maskCenter} />

      {/* 2. Sobreposição do Quadro de Escaneamento */}
      <View style={styles.finder}>
        
        {/* Ícones de canto para imitar um scanner */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {/* Status de Leitura */}
        <View style={styles.statusBox}>
          <Ionicons 
            name={isScanning ? "alert-circle" : "scan"} 
            size={30} 
            color={isScanning ? Colors.warning : Colors.lightText} 
          />
          <Text style={styles.statusText}>
            {isScanning ? 'Processando Registro...' : 'Centralize o QR Code'}
          </Text>
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Transparente para ver a câmera
  },
  // O "buraco" no centro onde o usuário deve mirar o QR Code
  maskCenter: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    backgroundColor: 'transparent', 
  },
  // O quadro que se sobrepõe ao buraco
  finder: {
    position: 'absolute',
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 5,
  },
  // Estilo dos cantos de scanner
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  topLeft: { top: -3, left: -3, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: -3, right: -3, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: -3, left: -3, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: -3, right: -3, borderLeftWidth: 0, borderTopWidth: 0 },
  
  // Caixa de status dentro do quadro
  statusBox: {
    position: 'absolute',
    bottom: -60,
    width: '100%',
    alignItems: 'center',
  },
  statusText: {
    color: Colors.lightText,
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  }
});