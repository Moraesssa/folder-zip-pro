
import { useState, useCallback } from 'react';
import { cloudService, CloudProvider, CloudUploadOptions, CloudUploadProgress } from '@/services/cloudService';
import { useAuth } from '@/contexts/AuthContext';

interface CloudUploadState {
  isUploading: boolean;
  uploadProgress: CloudUploadProgress[];
  connectedProviders: CloudProvider[];
  error: string | null;
}

export const useCloudUpload = () => {
  const [state, setState] = useState<CloudUploadState>({
    isUploading: false,
    uploadProgress: [],
    connectedProviders: cloudService.getConnectedProviders(),
    error: null
  });

  const { user } = useAuth();

  const updateProgress = useCallback((progress: CloudUploadProgress[]) => {
    setState(prev => ({ ...prev, uploadProgress: progress }));
  }, []);

  // Configurar callback de progresso
  useState(() => {
    cloudService.onProgressCallback = updateProgress;
  });

  const connectProvider = useCallback(async (providerId: CloudProvider['id'], email: string) => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'Login necessário para conectar serviços de nuvem' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, error: null }));
      await cloudService.connectProvider(providerId, email);
      setState(prev => ({ 
        ...prev, 
        connectedProviders: cloudService.getConnectedProviders() 
      }));
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao conectar provedor' 
      }));
      return false;
    }
  }, [user]);

  const disconnectProvider = useCallback((providerId: CloudProvider['id']) => {
    cloudService.disconnectProvider(providerId);
    setState(prev => ({ 
      ...prev, 
      connectedProviders: cloudService.getConnectedProviders() 
    }));
  }, []);

  const uploadToCloud = useCallback(async (file: Blob, options: CloudUploadOptions): Promise<string | null> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'Login necessário para upload na nuvem' }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, isUploading: true, error: null }));
      const shareUrl = await cloudService.uploadFile(file, options);
      setState(prev => ({ ...prev, isUploading: false }));
      return shareUrl;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : 'Erro no upload'
      }));
      return null;
    }
  }, [user]);

  const clearHistory = useCallback(() => {
    cloudService.clearUploadHistory();
    setState(prev => ({ ...prev, uploadProgress: [] }));
  }, []);

  const getProviders = useCallback(() => {
    return cloudService.getProviders();
  }, []);

  return {
    ...state,
    connectProvider,
    disconnectProvider,
    uploadToCloud,
    clearHistory,
    getProviders
  };
};
