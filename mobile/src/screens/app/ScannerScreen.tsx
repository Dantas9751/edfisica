import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import useCameraPermission from '../../hooks/useCameraPermission';

export default function ScannerScreen() {
  const { isGranted, requestPermission } = useCameraPermission();
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      
      // Vibração de sucesso
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      const { data } = scanningResult;
      Alert.alert('Código Escaneado', `Dados: ${data}`);
      
      // Reset after 2 seconds to allow scanning again
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const handleRequestPermission = async () => {
    // Vibração leve ao solicitar permissão
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await requestPermission();
  };

  // Show loading while checking permission
  if (isGranted === null) {
    return (
      <View style={styles.centerContainer}>
        <Text>Verificando permissão da câmera...</Text>
      </View>
    );
  }

  // Show permission request if not granted
  if (isGranted === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.message}>Permissão da câmera não concedida</Text>
        <Text style={styles.subMessage}>Precisamos da sua permissão para usar a câmera para escanear códigos QR</Text>
        <Button title="Permitir Câmera" onPress={handleRequestPermission} />
      </View>
    );
  }

  // Show camera when permission is granted
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr',
            'pdf417',
            'code128',
            'code39',
            'ean13',
            'upc_a',
            'datamatrix'
          ]
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          <Text style={styles.scanText}>Posicione o código QR dentro do quadro</Text>
          {scanned && (
            <Text style={styles.scanningText}>Escaneado! Preparando para próximo scan...</Text>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  scanningText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
});