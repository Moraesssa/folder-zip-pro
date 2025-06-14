
import React from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdBanner: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 mb-12 relative overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-white hover:bg-white/20"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-xs px-2 py-1 rounded">PARCEIRO</span>
            <span className="text-sm opacity-90">Hospedagem Profissional</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Hostinger - 75% OFF</h3>
          <p className="opacity-90 mb-4">
            Hospedagem premium por apenas R$ 5,99/mês. Ideal para seus projetos profissionais!
          </p>
          
          <div className="flex items-center gap-4">
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              onClick={() => console.log('Ad clicked: Hostinger')}
            >
              Ver Oferta
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <span className="text-sm opacity-75">Cupom: ZIPFAST75</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
            <span className="text-2xl font-bold">75%</span>
          </div>
          <p className="text-sm opacity-90">Desconto</p>
        </div>
      </div>

      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>
    </Card>
  );
};

export default AdBanner;
