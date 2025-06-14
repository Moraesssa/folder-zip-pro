
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FileData {
  name: string;
  size: number;
  type: string;
  file?: File;
}

interface CompressionHandlerProps {
  files: FileData[];
  compressFiles: (files: FileData[]) => Promise<any>;
  onLoginRequired: () => void;
  onProUpgradeRequired: () => void;
  onActionBasedConversion: () => void;
}

export const useCompressionHandler = ({
  files,
  compressFiles,
  onLoginRequired,
  onProUpgradeRequired,
  onActionBasedConversion
}: CompressionHandlerProps) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { trackCompression } = useAnalytics();

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    if (!isAuthenticated) {
      onLoginRequired();
      toast({
        title: "Login necessário",
        description: "Faça login para comprimir arquivos gratuitamente!",
        variant: "destructive"
      });
      return;
    }
    
    onActionBasedConversion();
    
    try {
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const result = await compressFiles(files);
      
      trackCompression(files.length, totalSize, result.compressedBlob.size, result.compressionRatio);
      
      // Salvar no histórico
      if (user) {
        const compressionRecord = {
          id: `compression_${Date.now()}`,
          filename: `zipfast_${Date.now()}.zip`,
          originalSize: totalSize,
          compressedSize: result.compressedBlob.size,
          compressionRatio: result.compressionRatio,
          createdAt: Date.now(),
          fileCount: files.length
        };
        
        const existingHistory = JSON.parse(localStorage.getItem(`zipfast_history_${user.id}`) || '[]');
        const updatedHistory = [compressionRecord, ...existingHistory].slice(0, 50);
        localStorage.setItem(`zipfast_history_${user.id}`, JSON.stringify(updatedHistory));
      }
      
      const compressionCount = parseInt(localStorage.getItem('compressionCount') || '0');
      localStorage.setItem('compressionCount', (compressionCount + 1).toString());
      
      toast({
        title: "✅ Compressão concluída!",
        description: `${files.length} arquivo(s) comprimidos com sucesso. Economia: ${result.compressionRatio}%`,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Créditos insuficientes')) {
        onProUpgradeRequired();
      } else {
        toast({
          title: "❌ Erro na compressão",
          description: "Houve um problema ao comprimir os arquivos. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  return { handleCompress };
};
