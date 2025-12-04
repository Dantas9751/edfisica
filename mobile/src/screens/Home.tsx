import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../services/apiClient';

export default function Home({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  
  // Controle de Feedback
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState<'success' | 'error' | 'warning'>('success');
  const [modalMessage, setModalMessage] = useState('');

  // Controle Offline
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
    checkPendingData();
  }, []);

  // Verifica pendências sempre que a tela ganha foco (ex: voltou do perfil)
  useFocusEffect(
    useCallback(() => {
      checkPendingData();
    }, [])
  );

  async function checkPendingData() {
    const queueRaw = await AsyncStorage.getItem('offline_queue');
    const queue = queueRaw ? JSON.parse(queueRaw) : [];
    setPendingCount(queue.length);
  }

  // --- O CORAÇÃO DO SYNC ---
  async function handleSyncNow() {
    if (pendingCount === 0) return;

    setIsSyncing(true);
    try {
        const queueRaw = await AsyncStorage.getItem('offline_queue');
        const queue = queueRaw ? JSON.parse(queueRaw) : [];

        // Envia tudo de uma vez
        await apiClient.post('/sync/up', { records: queue });

        // Se deu certo, limpa a fila
        await AsyncStorage.removeItem('offline_queue');
        setPendingCount(0);
        showFeedback('success', 'Tudo sincronizado! ☁️');

    } catch (error) {
        showFeedback('error', 'Falha ao sincronizar. Tente novamente com internet melhor.');
    }
    setIsSyncing(false);
  }

  async function handleBarCodeScanned({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);

    try {
        // Tenta enviar online
        await apiClient.post('/sync/up', {
            records: [{ qr_code_hash: data, scanned_at: new Date().toISOString() }]
        });
        showFeedback('success', 'Refeição Confirmada! ✅');
    } catch (error: any) {
        // Se falhar (sem net), salva offline
        if (!error.response || error.response.status >= 500) {
             await saveOffline(data);
             showFeedback('warning', 'Salvo no Celular! 💾');
        } else {
             // Erro de validação (já comeu)
             showFeedback('error', error.response?.data?.message || 'Código Inválido ❌');
        }
    }
  }

  async function saveOffline(hash: string) {
      const queueRaw = await AsyncStorage.getItem('offline_queue');
      const queue = queueRaw ? JSON.parse(queueRaw) : [];
      queue.push({ qr_code_hash: hash, scanned_at: new Date().toISOString() });
      await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
      setPendingCount(queue.length); // Atualiza contador
  }

  function showFeedback(type: any, msg: string) {
      setModalStatus(type);
      setModalMessage(msg);
      setModalVisible(true);
  }

  function resetScanner() {
      setModalVisible(false);
      setScanned(false);
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{marginBottom: 10}}>Precisamos da câmera</Text>
        <Button onPress={requestPermission} title="Permitir Câmera" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        {/* BOTÃO DE ALERTA DE PENDÊNCIAS */}
        {pendingCount > 0 && (
            <TouchableOpacity 
                style={styles.syncButton} 
                onPress={handleSyncNow}
                disabled={isSyncing}
            >
                {isSyncing ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.syncText}>
                        ⚠️ {pendingCount} registros pendentes. Clique para enviar!
                    </Text>
                )}
            </TouchableOpacity>
        )}

        <View style={styles.header}>
            <Text style={styles.title}>Leitor de Refeição</Text>
            <Text style={styles.subtitle}>Aponte para o QR Code</Text>
        </View>

        <View style={styles.cameraBox}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />
            <View style={styles.cornerTL} /><View style={styles.cornerTR} />
            <View style={styles.cornerBL} /><View style={styles.cornerBR} />
        </View>
        {scanned && <Text style={styles.processingText}>Processando...</Text>}

        {/* MODAL DE FEEDBACK */}
        <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, modalStatus === 'error' ? styles.bgError : (modalStatus === 'warning' ? styles.bgWarning : styles.bgSuccess)]}>
                    <Text style={styles.modalEmoji}>
                        {modalStatus === 'error' ? '🚫' : (modalStatus === 'warning' ? '💾' : '✅')}
                    </Text>
                    <Text style={styles.modalText}>{modalMessage}</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={resetScanner}>
                        <Text style={styles.closeText}>PRÓXIMO</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  
  // Botão Sync
  syncButton: {
      position: 'absolute', top: 10, left: 10, right: 10, zIndex: 10,
      backgroundColor: '#ff9800', padding: 15, borderRadius: 8, elevation: 5,
      alignItems: 'center'
  },
  syncText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  header: { position: 'absolute', top: 80, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666' },

  cameraBox: { 
    width: 280, height: 280, borderRadius: 20, overflow: 'hidden', 
    borderWidth: 0, backgroundColor: '#000', elevation: 10 
  },
  processingText: { marginTop: 20, fontWeight: 'bold', color: '#007AFF' },

  // Cantos
  cornerTL: { position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#00FF00' },
  cornerTR: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#00FF00' },
  cornerBL: { position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#00FF00' },
  cornerBR: { position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#00FF00' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', padding: 30, borderRadius: 20, alignItems: 'center' },
  bgSuccess: { backgroundColor: '#2ecc71' },
  bgError: { backgroundColor: '#e74c3c' },
  bgWarning: { backgroundColor: '#f39c12' },
  modalEmoji: { fontSize: 60, marginBottom: 20 },
  modalText: { fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  closeBtn: { backgroundColor: 'white', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30 },
  closeText: { fontWeight: 'bold', color: '#333' }
});