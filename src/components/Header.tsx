
import React from 'react';
import { Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onUpgradeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUpgradeClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zipfast-gradient rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-zipfast-blue to-zipfast-purple bg-clip-text text-transparent">
                ZipFast
              </h1>
              <p className="text-xs text-gray-500">Compressor Profissional</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-zipfast-blue transition-colors">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-zipfast-blue transition-colors">
              Preços
            </a>
            <a href="#help" className="text-gray-600 hover:text-zipfast-blue transition-colors">
              Ajuda
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-700">Plano Gratuito</p>
              <p className="text-xs text-gray-500">500MB por operação</p>
            </div>
            <Button 
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Crown className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Upgrade PRO</span>
              <span className="sm:hidden">PRO</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
