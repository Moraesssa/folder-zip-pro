import { useState, useEffect, useCallback } from 'react';
import { useOracleAuth, oracleClient } from '@/contexts/OracleAuthContext';
import { useToast } from '@/hooks/use-toast';
import { CompressionRecord, CompressionStats } from '@/types/oracleCompression';

const isValidCompressionRecord = (item: any): item is CompressionRecord => {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.filename === 'string' &&
    typeof item.original_size === 'number' &&
    typeof item.compressed_size === 'number' &&
    typeof item.compression_ratio === 'number' &&
    typeof item.file_count === 'number' &&
    typeof item.created_at === 'string'
  );
};

export const useOracleCompressionHistory = () => {
  const [history, setHistory] = useState<CompressionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useOracleAuth();
  const { toast } = useToast();

  const loadHistory = useCallback(async () => {
    if (!oracleClient || !user) return;
    
    setIsLoading(true);
    try {
      const response = await oracleClient.getCompressionHistory(user.id, 50);
      console.log('Oracle response:', response);

      if (response.success) {
        // Access response.data instead of response.items to match Oracle client
        const historyData = response.data || [];
        console.log('History data received:', historyData);
        
        // Ensure we have a valid array and validate each item
        const dataArray = Array.isArray(historyData) ? historyData : [];
        const validHistory = dataArray.filter((item: any) => {
          const isValid = isValidCompressionRecord(item);
          if (!isValid) {
            console.warn('Invalid compression record:', item);
          }
          return isValid;
        });
        
        console.log('Valid history records:', validHistory);
        setHistory(validHistory);
      } else {
        console.error('Oracle response not successful:', response);
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de compressões.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const deleteRecord = useCallback(async (id: string) => {
    if (!oracleClient || !user) return;
    
    try {
      const response = await oracleClient.deleteCompressionRecord(user.id, id);

      if (response.success) {
        setHistory(prev => prev.filter(record => record.id !== id));
        toast({
          title: "Registro removido",
          description: "O registro foi removido do histórico.",
        });
      } else {
        throw new Error(response.message || 'Erro ao remover registro');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o registro.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const clearAllHistory = useCallback(async () => {
    if (!oracleClient || !user) return;
    
    try {
      const response = await oracleClient.clearCompressionHistory(user.id);

      if (response.success) {
        setHistory([]);
        toast({
          title: "Histórico limpo",
          description: "Todo o histórico foi removido.",
        });
      } else {
        throw new Error(response.message || 'Erro ao limpar histórico');
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Erro ao limpar",
        description: "Não foi possível limpar o histórico.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const getTotalStats = useCallback((): CompressionStats => {
    const totalCompressions = history.length;
    const totalSavings = history.reduce((acc, record) => {
      return acc + (record.original_size - record.compressed_size);
    }, 0);
    const totalFiles = history.reduce((acc, record) => acc + record.file_count, 0);
    
    return { totalCompressions, totalSavings, totalFiles };
  }, [history]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  return {
    history,
    isLoading,
    loadHistory,
    deleteRecord,
    clearAllHistory,
    getTotalStats
  };
};
