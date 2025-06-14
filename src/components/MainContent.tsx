
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCompression } from '@/hooks/useCompression';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import UploadZone from '@/components/UploadZone';
import CompressionProgress from '@/components/CompressionProgress';
import DynamicAd from '@/components/DynamicAd';

interface FileData {
  name: string;
  size: number;
  type: string;
  file?: File;
}

interface MainContentProps {
  onLoginRequired: () => void;
  onProUpgradeRequired: () => void;
  onActionBasedConversion: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  onLoginRequired, 
  onProUpgradeRequired,
  onActionBasedConversion 
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { 
    trackFileUpload, 
    trackCompression, 
    trackDownload, 
    trackUserAction 
  } = useAnalytics();
  
  const { 
    isCompressing, 
    progress, 
    compressedBlob, 
    compressionRatio,
    compressFiles, 
    downloadCompressed, 
    reset 
  } = useCompression();

  const handleFilesSelected = (selectedFiles: FileData[]) => {
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const maxSize = user?.maxFileSize || 500 * 1024 * 1024; // 500MB para não logados
    
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
    
    setFiles(selectedFiles);
    console.log("Files selected:", selectedFiles);
  };

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
    
    // Trigger action-based conversion popup after 3 compressions
    onActionBasedConversion();
    
    try {
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const result = await compressFiles(files);
      
      trackCompression(files.length, totalSize, result.compressedBlob.size, result.compressionRatio);
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

  const handleDownload = () => {
    if (compressedBlob) {
      const filename = `zipfast_${Date.now()}.zip`;
      downloadCompressed(filename);
      trackDownload(filename, compressedBlob.size);
      
      toast({
        title: "📥 Download iniciado!",
        description: "Seu arquivo ZIP está sendo baixado.",
      });
    }
  };

  const handleReset = () => {
    setFiles([]);
    reset();
    trackUserAction('compression_reset');
  };

  return (
    <>
      {/* Sidebar Ad for Free Users */}
      {!isAuthenticated && (
        <div className="mb-8">
          <DynamicAd placement="sidebar" className="max-w-sm mx-auto" />
        </div>
      )}

      {/* Upload Zone */}
      <div id="upload-zone" className="mb-12">
        <UploadZone onFilesSelected={handleFilesSelected} />
      </div>

      {/* Compression Progress */}
      {(files.length > 0 || isCompressing) && (
        <div className="mb-12">
          <CompressionProgress 
            files={files}
            isCompressing={isCompressing}
            progress={progress}
            compressionRatio={compressionRatio}
            compressedBlob={compressedBlob}
            onCompress={handleCompress}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        </div>
      )}
    </>
  );
};

export default MainContent;
