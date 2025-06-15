
import { useState, useCallback } from 'react';
import { CompressionService, FileData } from '@/services/compressionService';
import { useOracleAuth, oracleClient } from '@/contexts/OracleAuthContext';
import { useToast } from '@/hooks/use-toast';

interface CompressionState {
  isCompressing: boolean;
  progress: number;
  compressedBlob: Blob | null;
  compressionRatio: number;
  error: string | null;
}

interface CompressionRecord {
  filename: string;
  original_size: number;
  compressed_size: number;
  compression_ratio: number;
  file_count: number;
}

export const useOracleCompression = () => {
  const [state, setState] = useState<CompressionState>({
    isCompressing: false,
    progress: 0,
    compressedBlob: null,
    compressionRatio: 0,
    error: null
  });

  const { user, consumeCredits, refreshUserData } = useOracleAuth();
  const { toast } = useToast();

  const checkUserLimits = useCallback((files: FileData[]): { canCompress: boolean; reason?: string } => {
    if (!user) {
      return { canCompress: false, reason: 'Login necessário' };
    }

    if (user.credits < 1) {
      return { canCompress: false, reason: 'Créditos insuficientes' };
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > user.maxFileSize) {
      const maxSizeMB = Math.round(user.maxFileSize / 1024 / 1024);
      return { 
        canCompress: false, 
        reason: `Tamanho total excede o limite de ${maxSizeMB}MB para seu plano` 
      };
    }

    return { canCompress: true };
  }, [user]);

  const saveCompressionRecord = useCallback(async (record: CompressionRecord) => {
    if (!oracleClient || !user) return;

    try {
      const response = await oracleClient.saveCompressionRecord(user.id, {
        filename: record.filename,
        original_size: record.original_size,
        compressed_size: record.compressed_size,
        compression_ratio: record.compression_ratio,
        file_count: record.file_count
      });

      if (!response.success) {
        console.error('Error saving compression record:', response.message);
      }
    } catch (error) {
      console.error('Error saving compression record:', error);
    }
  }, [user]);

  const compressFiles = useCallback(async (files: FileData[]) => {
    const limitCheck = checkUserLimits(files);
    if (!limitCheck.canCompress) {
      setState(prev => ({ 
        ...prev, 
        error: limitCheck.reason || 'Não é possível comprimir' 
      }));
      throw new Error(limitCheck.reason);
    }

    setState(prev => ({ ...prev, isCompressing: true, progress: 0, error: null }));

    try {
      // Consume credits first
      const creditsConsumed = await consumeCredits(1);
      if (!creditsConsumed) {
        throw new Error('Não foi possível consumir créditos');
      }

      const compressionService = new CompressionService((progress) => {
        setState(prev => ({ ...prev, progress }));
      });

      const totalOriginalSize = files.reduce((acc, file) => acc + file.size, 0);
      const compressedBlob = await compressionService.compressFiles(files);
      const compressionRatio = compressionService.calculateCompressionRatio(
        totalOriginalSize, 
        compressedBlob.size
      );

      // Save to Oracle database
      const filename = `zipfast_${Date.now()}.zip`;
      await saveCompressionRecord({
        filename,
        original_size: totalOriginalSize,
        compressed_size: compressedBlob.size,
        compression_ratio: compressionRatio,
        file_count: files.length
      });

      setState(prev => ({
        ...prev,
        isCompressing: false,
        compressedBlob,
        compressionRatio,
        progress: 100
      }));

      // Refresh user data to get updated credits
      await refreshUserData();

      // Show success notification with credit warning if needed
      const updatedCredits = user!.credits - 1;
      let description = `${files.length} arquivo(s) comprimidos. Economia: ${compressionRatio}%`;
      
      if (updatedCredits <= 3 && user!.plan === 'free') {
        description += ` | Restam apenas ${updatedCredits} créditos!`;
      }

      toast({
        title: "✅ Compressão concluída!",
        description,
      });

      return { compressedBlob, compressionRatio };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isCompressing: false,
        error: error instanceof Error ? error.message : 'Erro na compressão'
      }));
      
      // Refresh user data even on error to ensure accurate credit count
      await refreshUserData();
      
      throw error;
    }
  }, [user, consumeCredits, refreshUserData, checkUserLimits, saveCompressionRecord, toast]);

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
    reset,
    checkUserLimits
  };
};
