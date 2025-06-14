
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

interface FileUploadHandlerProps {
  onFilesSelected: (files: FileData[]) => void;
  onLoginRequired: () => void;
  onProUpgradeRequired: () => void;
}

export const useFileUploadHandler = ({ 
  onFilesSelected, 
  onLoginRequired, 
  onProUpgradeRequired 
}: FileUploadHandlerProps) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { trackFileUpload } = useAnalytics();

  const handleFilesSelected = (selectedFiles: FileData[]) => {
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const maxSize = user?.maxFileSize || 500 * 1024 * 1024;
    
    trackFileUpload(selectedFiles.length, totalSize);
    
    if (totalSize > maxSize) {
      if (!isAuthenticated) {
        onLoginRequired();
        toast({
          title: "Faça login para arquivos maiores",
          description: "Crie uma conta gratuita para processar arquivos até 500MB!",
          variant: "destructive"
        });
        return;
      }
      
      onProUpgradeRequired();
      toast({
        title: "Limite excedido",
        description: `Arquivos muito grandes (${(totalSize / 1024 / 1024).toFixed(1)}MB). Upgrade para PRO para processar até 5GB!`,
        variant: "destructive"
      });
      return;
    }
    
    onFilesSelected(selectedFiles);
    console.log("Files selected:", selectedFiles);
  };

  return { handleFilesSelected };
};
