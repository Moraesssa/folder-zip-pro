
import { useState, useCallback } from 'react';
import { CompressionService, FileData } from '@/services/compressionService';

interface CompressionState {
  isCompressing: boolean;
  progress: number;
  compressedBlob: Blob | null;
  compressionRatio: number;
  error: string | null;
}

export const useCompression = () => {
  const [state, setState] = useState<CompressionState>({
    isCompressing: false,
    progress: 0,
    compressedBlob: null,
    compressionRatio: 0,
    error: null
  });

  const compressFiles = useCallback(async (files: FileData[]) => {
    setState(prev => ({ ...prev, isCompressing: true, progress: 0, error: null }));

    try {
      const compressionService = new CompressionService((progress) => {
        setState(prev => ({ ...prev, progress }));
      });

      const totalOriginalSize = files.reduce((acc, file) => acc + file.size, 0);
      const compressedBlob = await compressionService.compressFiles(files);
      const compressionRatio = compressionService.calculateCompressionRatio(
        totalOriginalSize, 
        compressedBlob.size
      );

      setState(prev => ({
        ...prev,
        isCompressing: false,
        compressedBlob,
        compressionRatio,
        progress: 100
      }));

      return { compressedBlob, compressionRatio };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isCompressing: false,
        error: error instanceof Error ? error.message : 'Erro na compressão'
      }));
      throw error;
    }
  }, []);

  const downloadCompressed = useCallback((filename?: string) => {
    if (state.compressedBlob) {
      const compressionService = new CompressionService();
      compressionService.downloadZip(state.compressedBlob, filename);
    }
  }, [state.compressedBlob]);

  const reset = useCallback(() => {
    setState({
      isCompressing: false,
      progress: 0,
      compressedBlob: null,
      compressionRatio: 0,
      error: null
    });
  }, []);

  return {
    ...state,
    compressFiles,
    downloadCompressed,
    reset
  };
};
