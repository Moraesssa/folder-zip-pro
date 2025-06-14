
import React from 'react';
import { Upload, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onUpgradeClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onUpgradeClick }) => {
  return (
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
          onClick={onUpgradeClick}
          className="text-lg px-8 py-4 border-2 border-zipfast-blue text-zipfast-blue hover:bg-zipfast-blue hover:text-white"
        >
          <Crown className="w-5 h-5 mr-2" />
          Ver Planos PRO
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
