
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, X, Zap, Clock, Star } from 'lucide-react';

interface ConversionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  trigger: 'time' | 'action' | 'exit';
}

const ConversionPopup: React.FC<ConversionPopupProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  trigger 
}) => {
  const getPopupContent = () => {
    switch (trigger) {
      case 'time':
        return {
          title: '⏰ Oferta Especial por Tempo Limitado!',
          subtitle: 'Você está usando o ZipFast há alguns minutos...',
          highlight: '50% OFF',
          description: 'Upgrade para PRO agora e ganhe acesso ilimitado + recursos exclusivos!',
          urgency: 'Esta oferta expira em 10 minutos!'
        };
      
      case 'action':
        return {
          title: '🚀 Desbloqueie Todo o Potencial!',
          subtitle: 'Você está curtindo o ZipFast? Que tal mais recursos?',
          highlight: 'PRO',
          description: 'Processe arquivos até 5GB, integração com nuvem premium e muito mais!',
          urgency: 'Milhares já fizeram upgrade este mês!'
        };
      
      case 'exit':
        return {
          title: '🎯 Última Chance!',
          subtitle: 'Não vá embora sem experimentar o PRO...',
          highlight: '30% OFF',
          description: 'Oferta exclusiva para novos usuários. Não perca!',
          urgency: 'Esta oferta não aparecerá novamente!'
        };
      
      default:
        return {
          title: '✨ Upgrade para PRO',
          subtitle: 'Leve sua produtividade ao próximo nível',
          highlight: 'PRO',
          description: 'Recursos ilimitados e prioritários aguardam você!',
          urgency: 'Junte-se a milhares de usuários satisfeitos!'
        };
    }
  };

  const content = getPopupContent();

  const features = [
    'Arquivos até 5GB',
    'Integrações premium',
    'Sem anúncios',
    'Suporte prioritário',
    'Histórico ilimitado'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold mb-2">
            {content.title}
          </DialogTitle>
          <p className="text-gray-600">{content.subtitle}</p>
        </DialogHeader>

        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zipfast-gradient mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          <div className="text-4xl font-bold text-zipfast-blue mb-2">
            {content.highlight}
          </div>
          
          <p className="text-gray-600 mb-6">{content.description}</p>

          <div className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center gap-2 text-red-600 text-sm font-semibold">
              <Clock className="w-4 h-4" />
              {content.urgency}
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onUpgrade} className="w-full zipfast-button text-lg py-6">
              <Crown className="w-5 h-5 mr-2" />
              Fazer Upgrade Agora
            </Button>
            
            <Button variant="outline" onClick={onClose} className="w-full">
              Talvez mais tarde
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversionPopup;
