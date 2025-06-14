
import React, { useState, useCallback } from 'react';
import { Upload, Zap, Crown, Download, Folder, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import CompressionProgress from '@/components/CompressionProgress';
import FeatureCard from '@/components/FeatureCard';
import AdBanner from '@/components/AdBanner';
import ProUpgradeModal from '@/components/ProUpgradeModal';
import StatsSection from '@/components/StatsSection';

interface FileData {
  name: string;
  size: number;
  type: string;
}

const Index = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = useCallback((selectedFiles: FileData[]) => {
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const maxSize = 500 * 1024 * 1024; // 500MB limit for free users
    
    if (totalSize > maxSize) {
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
  }, [toast]);

  const handleCompress = useCallback(async () => {
    if (files.length === 0) return;
    
    setIsCompressing(true);
    setCompressionProgress(0);

    // Simular compressão com progresso realista
    const compressionSteps = [
      { progress: 15, message: "Analisando arquivos..." },
      { progress: 30, message: "Comprimindo dados..." },
      { progress: 60, message: "Otimizando compressão..." },
      { progress: 85, message: "Finalizando arquivo ZIP..." },
      { progress: 100, message: "Compressão concluída!" }
    ];

    for (const step of compressionSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCompressionProgress(step.progress);
      console.log(step.message);
    }

    toast({
      title: "✅ Compressão concluída!",
      description: `${files.length} arquivo(s) comprimidos com sucesso. Economia estimada: ${Math.floor(Math.random() * 40 + 30)}%`,
    });

    // Mostrar opções de download após 1 segundo
    setTimeout(() => {
      setIsCompressing(false);
    }, 1000);
  }, [files, toast]);

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
              progress={compressionProgress}
              onCompress={handleCompress}
              onReset={() => {
                setFiles([]);
                setCompressionProgress(0);
                setIsCompressing(false);
              }}
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

      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
