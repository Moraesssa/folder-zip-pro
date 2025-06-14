
import React, { useState } from 'react';
import { useCompression } from '@/hooks/useCompression';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFileUploadHandler } from '@/components/FileUploadHandler';
import { useCompressionHandler } from '@/components/CompressionHandler';
import { useDownloadHandler } from '@/components/DownloadHandler';
import { useCloudUploadHandler } from '@/components/CloudUploadHandler';
import UploadZone from '@/components/UploadZone';
import CompressionProgress from '@/components/CompressionProgress';
import Cloudintegration from '@/components/Cloudintegration';
import CompressionHistory from '@/components/CompressionHistory';
import DynamicAd from '@/components/DynamicAd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isAuthenticated } = useAuth();
  const { trackUserAction } = useAnalytics();
  
  const { 
    isCompressing, 
    progress, 
    compressedBlob, 
    compressionRatio,
    compressFiles, 
    downloadCompressed, 
    reset 
  } = useCompression();

  // Custom handlers
  const { handleFilesSelected } = useFileUploadHandler({
    onFilesSelected: setFiles,
    onLoginRequired,
    onProUpgradeRequired
  });

  const { handleCompress } = useCompressionHandler({
    files,
    compressFiles,
    onLoginRequired,
    onProUpgradeRequired,
    onActionBasedConversion
  });

  const { handleDownload } = useDownloadHandler({
    compressedBlob,
    downloadCompressed
  });

  const { handleCloudUploadComplete } = useCloudUploadHandler({
    compressedBlob
  });

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

      {/* Main Content Tabs */}
      <div className="mb-12">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-6">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="compress" className="text-center">
                  <span className="hidden sm:inline">Comprimir Arquivos</span>
                  <span className="sm:hidden">Comprimir</span>
                </TabsTrigger>
                <TabsTrigger value="cloud" className="text-center">
                  <span className="hidden sm:inline">Integração Nuvem</span>
                  <span className="sm:hidden">Nuvem</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="text-center">
                  <span className="hidden sm:inline">Histórico</span>
                  <span className="sm:hidden">Histórico</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
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
              <Cloudintegration 
                compressedBlob={compressedBlob}
                onUploadComplete={handleCloudUploadComplete}
              />
            </TabsContent>
            
            <TabsContent value="history">
              <CompressionHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default MainContent;
