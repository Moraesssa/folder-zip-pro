
import React, { useState, useEffect } from 'react';
import { Upload, Zap, Crown, Download, Folder, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCompression } from '@/hooks/useCompression';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import Header from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import CompressionProgress from '@/components/CompressionProgress';
import FeatureCard from '@/components/FeatureCard';
import AdBanner from '@/components/AdBanner';
import AffiliateSection from '@/components/AffiliateSection';
import ConversionPopup from '@/components/ConversionPopup';
import ProUpgradeModal from '@/components/ProUpgradeModal';
import StatsSection from '@/components/StatsSection';
import UserDashboard from '@/components/UserDashboard';
import LoginModal from '@/components/LoginModal';
import DynamicAd from '@/components/DynamicAd';

interface FileData {
  name: string;
  size: number;
  type: string;
  file?: File;
}

const Index = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConversionPopupOpen, setIsConversionPopupOpen] = useState(false);
  const [conversionTrigger, setConversionTrigger] = useState<'time' | 'action' | 'exit' | 'idle'>('time');
  const [userIdleTime, setUserIdleTime] = useState(0);
  const [hasShownTimePopup, setHasShownTimePopup] = useState(false);
  
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { 
    trackFileUpload, 
    trackCompression, 
    trackDownload, 
    trackUserAction, 
    trackConversion 
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

  // Conversion popup logic
  useEffect(() => {
    // Time-based popup (5 minutes)
    const timePopupTimer = setTimeout(() => {
      if (!isAuthenticated && !hasShownTimePopup) {
        setConversionTrigger('time');
        setIsConversionPopupOpen(true);
        setHasShownTimePopup(true);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Idle detection
    let idleTimer: NodeJS.Timeout;
    const resetIdleTimer = () => {
      setUserIdleTime(0);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setUserIdleTime(prev => prev + 1);
        if (userIdleTime > 2 && !isAuthenticated) {
          setConversionTrigger('idle');
          setIsConversionPopupOpen(true);
        }
      }, 30000); // 30 seconds
    };

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isAuthenticated) {
        setConversionTrigger('exit');
        setIsConversionPopupOpen(true);
      }
    };

    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('mousedown', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timePopupTimer);
      clearTimeout(idleTimer);
      document.removeEventListener('mousemove', resetIdleTimer);
      document.removeEventListener('mousedown', resetIdleTimer);
      document.removeEventListener('keypress', resetIdleTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isAuthenticated, hasShownTimePopup, userIdleTime]);

  // Listen for PRO modal trigger
  useEffect(() => {
    const handleOpenProModal = () => {
      setIsProModalOpen(true);
    };

    window.addEventListener('openProModal', handleOpenProModal);
    return () => window.removeEventListener('openProModal', handleOpenProModal);
  }, []);

  const handleFilesSelected = (selectedFiles: FileData[]) => {
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const maxSize = user?.maxFileSize || 500 * 1024 * 1024; // 500MB para não logados
    
    trackFileUpload(selectedFiles.length, totalSize);
    
    if (totalSize > maxSize) {
      if (!isAuthenticated) {
        setIsLoginModalOpen(true);
        toast({
          title: "Faça login para arquivos maiores",
          description: "Crie uma conta gratuita para processar arquivos até 500MB!",
          variant: "destructive"
        });
        return;
      }
      
      setIsProModalOpen(true);
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
      setIsLoginModalOpen(true);
      toast({
        title: "Login necessário",
        description: "Faça login para comprimir arquivos gratuitamente!",
        variant: "destructive"
      });
      return;
    }
    
    // Trigger action-based conversion popup after 3 compressions
    const compressionCount = parseInt(localStorage.getItem('compressionCount') || '0');
    if (compressionCount >= 2 && !isAuthenticated) {
      setConversionTrigger('action');
      setIsConversionPopupOpen(true);
    }
    
    try {
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const result = await compressFiles(files);
      
      trackCompression(files.length, totalSize, result.compressedBlob.size, result.compressionRatio);
      localStorage.setItem('compressionCount', (compressionCount + 1).toString());
      
      toast({
        title: "✅ Compressão concluída!",
        description: `${files.length} arquivo(s) comprimidos com sucesso. Economia: ${result.compressionRatio}%`,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Créditos insuficientes')) {
        setIsProModalOpen(true);
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

  const handleProUpgrade = () => {
    trackConversion('upgrade', 29.90);
    setIsProModalOpen(true);
    setIsConversionPopupOpen(false);
  };

  const features = [
    {
      icon: Folder,
      title: "Compacte Pastas Inteiras",
      description: "Único serviço que comprime pastas completas mantendo a estrutura original",
      highlight: true
    },
    {
      icon: Zap,
      title: "Super Rápido",
      description: "Compressão até 3x mais rápida que ferramentas tradicionais"
    },
    {
      icon: Crown,
      title: "Integração com Drive",
      description: "Salve diretamente no Google Drive ou Dropbox após comprimir"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header onUpgradeClick={() => setIsProModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* User Dashboard */}
        {isAuthenticated && (
          <UserDashboard onUpgradeClick={() => setIsProModalOpen(true)} />
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-zipfast-gradient text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Novo: Compressão de pastas completas!
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-zipfast-blue to-zipfast-purple bg-clip-text text-transparent">
            ZipFast
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            O compressor mais rápido do Brasil. Comprima arquivos e <strong>pastas inteiras</strong> em segundos, 
            com integração direta ao Google Drive e Dropbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
              className="zipfast-button text-lg px-8 py-4"
            >
              <Upload className="w-5 h-5 mr-2" />
              Começar Grátis
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsProModalOpen(true)}
              className="text-lg px-8 py-4 border-2 border-zipfast-blue text-zipfast-blue hover:bg-zipfast-blue hover:text-white"
            >
              <Crown className="w-5 h-5 mr-2" />
              Ver Planos PRO
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <StatsSection />

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

        {/* Ad Banner */}
        <AdBanner />

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher o ZipFast?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos o único serviço no Brasil que permite comprimir pastas inteiras, 
              mantendo toda a estrutura original dos seus arquivos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* Affiliate Section */}
        <AffiliateSection />

        {/* Trust Section */}
        <section className="py-16 text-center">
          <div className="zipfast-card max-w-4xl mx-auto p-8">
            <h3 className="text-3xl font-bold mb-6">Segurança e Privacidade</h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-lg mb-2 text-zipfast-blue">🔒 Totalmente Seguro</h4>
                <p className="text-gray-600">
                  Arquivos excluídos automaticamente após 1 hora. Processamento local sem upload para servidores externos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-zipfast-purple">⚡ Infraestrutura Robusta</h4>
                <p className="text-gray-600">
                  Powered by Oracle Cloud com CDN global da Cloudflare para máxima velocidade e disponibilidade.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <ConversionPopup
        isOpen={isConversionPopupOpen}
        onClose={() => setIsConversionPopupOpen(false)}
        onUpgrade={handleProUpgrade}
        trigger={conversionTrigger}
      />
    </div>
  );
};

export default Index;
