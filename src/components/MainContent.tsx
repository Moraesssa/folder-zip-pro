
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCompression } from '@/hooks/useCompression';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import UploadZone from '@/components/UploadZone';
import CompressionProgress from '@/components/CompressionProgress';
import CloudIntegration from '@/components/CloudIntegration';
import CompressionHistory from '@/components/CompressionHistory';
import DynamicAd from '@/components/DynamicAd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState('compress');
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
        const updatedHistory = [compressionRecord, ...existingHistory].slice(0, 50); // Manter apenas 50 registros
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

  const handleCloudUploadComplete = (shareUrl: string) => {
    // Atualizar histórico com upload na nuvem
    if (user && compressedBlob) {
      const existingHistory = JSON.parse(localStorage.getItem(`zipfast_history_${user.id}`) || '[]');
      const updatedHistory = existingHistory.map((record: any) => {
        if (record.id === `compression_${Date.now()}`) { // Último registro
          return {
            ...record,
            cloudUploads: [
              ...(record.cloudUploads || []),
              {
                provider: 'gdrive', // Seria dinâmico
                shareUrl,
                uploadedAt: Date.now()
              }
            ]
          };
        }
        return record;
      });
      localStorage.setItem(`zipfast_history_${user.id}`, JSON.stringify(updatedHistory));
    }
  };

  return (
    <>
      {/* Sidebar Ad for Free Users */}
      {!isAuthenticated && (
        <div className="mb-8">
          <DynamicAd placement="sidebar" className="max-w-sm mx-auto" />
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="mb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compress">Comprimir Arquivos</TabsTrigger>
            <TabsTrigger value="cloud">Integração Nuvem</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compress" className="space-y-8">
            {/* Upload Zone */}
            <div id="upload-zone">
              <UploadZone onFilesSelected={handleFilesSelected} />
            </div>

            {/* Compression Progress */}
            {(files.length > 0 || isCompressing) && (
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
            )}
          </TabsContent>
          
          <TabsContent value="cloud">
            <CloudIntegration 
              compressedBlob={compressedBlob}
              onUploadComplete={handleCloudUploadComplete}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <CompressionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default MainContent;
