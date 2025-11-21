import { useCameraPermissions } from 'expo-camera';

interface CameraPermission {
  isGranted: boolean | null;
  requestPermission: () => Promise<boolean>;
}

/**
 * Hook customizado para verificar e solicitar permissão de câmera.
 */
export default function useCameraPermission(): CameraPermission {
  const [permission, requestPermission] = useCameraPermissions();

  const handleRequestPermission = async (): Promise<boolean> => {
    const response = await requestPermission();
    return response.granted;
  };

  return {
    isGranted: permission?.granted ?? null,
    requestPermission: handleRequestPermission
  };
}