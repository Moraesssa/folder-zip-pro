
import { useState, useEffect, useCallback } from 'react';
import { useOracleAuth, oracleClient } from '@/contexts/OracleAuthContext';
import { useToast } from '@/hooks/use-toast';
import { CompressionRecord, CompressionStats } from '@/types/oracleCompression';

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

      if (response.success) {
        // Handle Oracle ORDS response format - ensure we have a valid array
        const historyData = response.items || [];
        const validHistory = historyData.filter((item: any): item is CompressionRecord => {
          return item && typeof item === 'object' && 'id' in item && 'filename' in item;
        });
        setHistory(validHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
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
