
import React from 'react';
import { Crown, Zap, Shield, Upload, X, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePayments } from '@/hooks/usePayments';
import { useAuth } from '@/contexts/AuthContext';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose }) => {
  const { createCheckoutSession, isLoading } = usePayments();
  const { user } = useAuth();

  const features = [
    { icon: Upload, text: "Até 5GB por operação (10x mais)" },
    { icon: Zap, text: "1000 créditos mensais (100x mais)" },
    { icon: Shield, text: "Sem anúncios em toda a plataforma" },
    { icon: Crown, text: "Compressão em lote ilimitada" }
  ];

  const handleUpgrade = async () => {
    await createCheckoutSession();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <DialogTitle className="text-2xl font-bold">
            Upgrade para ZipFast PRO
          </DialogTitle>
          <p className="text-gray-600">
            Desbloqueie todo o potencial do ZipFast
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>

        <Card className="p-6 bg-gradient-to-r from-zipfast-blue to-zipfast-purple text-white text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold">$1.99</span>
            <span className="text-lg opacity-90">/mês</span>
          </div>
          <p className="text-sm opacity-90 mb-4">
            Equivalente a R$ 9,90 • Cancele quando quiser
          </p>
          <div className="text-xs opacity-75">
            Primeiro mês com desconto especial
          </div>
        </Card>

        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3"
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                {user ? 'Assinar Plano PRO' : 'Fazer Login e Assinar'}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClose}
            disabled={isLoading}
          >
            Continuar com Plano Gratuito
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Pagamento seguro via Stripe • Cancele a qualquer momento
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ProUpgradeModal;
