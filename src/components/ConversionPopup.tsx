
import React, { useState, useEffect } from 'react';
import { X, Crown, Zap, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyticsService } from '@/services/analyticsService';
import { useAuth } from '@/contexts/AuthContext';

interface ConversionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  trigger: 'time' | 'action' | 'exit' | 'idle';
}

const ConversionPopup: React.FC<ConversionPopupProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  trigger 
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && trigger === 'time') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, trigger, onClose]);

  useEffect(() => {
    if (isOpen) {
      analyticsService.track('conversion_popup_shown', 'monetization', 'popup_view', trigger);
    }
  }, [isOpen, trigger]);

  const handleUpgrade = () => {
    analyticsService.track('conversion_popup_click', 'monetization', 'upgrade_click', trigger);
    onUpgrade();
    onClose();
  };

  const handleClose = () => {
    analyticsService.track('conversion_popup_close', 'monetization', 'popup_close', trigger);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || user?.plan === 'pro') return null;

  const getPopupContent = () => {
    switch (trigger) {
      case 'time':
        return {
          title: '⏰ Oferta Especial por Tempo Limitado!',
          subtitle: 'Upgrade para PRO com 50% OFF',
          description: 'Esta oferta expira em breve. Não perca a chance de processar arquivos até 5GB sem limitações!',
          ctaText: 'Upgrade com Desconto',
          urgency: true
        };
      case 'action':
        return {
          title: '🚀 Você está quase lá!',
          subtitle: 'Desbloqueie todo o potencial do ZipFast',
          description: 'Vemos que você está usando bastante nossa ferramenta. Que tal remover todas as limitações?',
          ctaText: 'Remover Limitações',
          urgency: false
        };
      case 'exit':
        return {
          title: '✋ Espere! Não vá embora ainda...',
          subtitle: 'Uma oferta especial para você',
          description: 'Aproveite nossa oferta exclusiva antes de sair. Upgrade para PRO e tenha acesso total!',
          ctaText: 'Aproveitar Oferta',
          urgency: false
        };
      case 'idle':
        return {
          title: '💡 Que tal tornar sua experiência ainda melhor?',
          subtitle: 'Upgrade para PRO e economize tempo',
          description: 'Processe arquivos maiores, sem anúncios e com velocidade máxima!',
          ctaText: 'Melhorar Experiência',
          urgency: false
        };
      default:
        return {
          title: 'Upgrade para PRO',
          subtitle: 'Desbloqueie recursos premium',
          description: 'Acesso completo a todas as funcionalidades do ZipFast',
          ctaText: 'Fazer Upgrade',
          urgency: false
        };
    }
  };

  const content = getPopupContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full relative animate-in fade-in-0 zoom-in-95">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
          <h3 className="text-lg text-blue-600 font-semibold mb-4">{content.subtitle}</h3>
          <p className="text-gray-600 mb-6">{content.description}</p>

          {content.urgency && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
                <Clock className="w-5 h-5" />
                <span>Oferta expira em: {formatTime(timeLeft)}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Plano PRO</span>
                <div className="flex items-center gap-2">
                  {content.urgency && (
                    <span className="text-sm text-gray-500 line-through">R$ 29,90</span>
                  )}
                  <span className="text-xl font-bold text-green-600">
                    R$ {content.urgency ? '14,90' : '29,90'}
                  </span>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  Arquivos até 5GB
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  Sem anúncios
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  Velocidade máxima
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  Suporte prioritário
                </li>
              </ul>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg py-3"
            >
              <Crown className="w-5 h-5 mr-2" />
              {content.ctaText}
            </Button>

            <Button 
              variant="ghost" 
              onClick={handleClose}
              className="w-full text-gray-500"
            >
              Talvez mais tarde
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConversionPopup;
