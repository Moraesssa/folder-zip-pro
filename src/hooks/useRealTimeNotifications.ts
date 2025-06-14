
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Verificar créditos baixos
    if (user.credits <= 3 && user.plan === 'free') {
      const hasShownWarning = localStorage.getItem(`low_credits_warning_${user.id}`);
      if (!hasShownWarning) {
        toast({
          title: "⚠️ Créditos baixos!",
          description: `Você tem apenas ${user.credits} créditos restantes. Considere fazer upgrade para PRO.`,
          duration: 5000,
        });
        localStorage.setItem(`low_credits_warning_${user.id}`, 'true');
      }
    }

    // Limpar aviso se créditos foram recarregados
    if (user.credits > 3) {
      localStorage.removeItem(`low_credits_warning_${user.id}`);
    }

    // Notificar sobre recursos PRO se usuário free usar muito
    const compressionCount = parseInt(localStorage.getItem('compressionCount') || '0');
    if (compressionCount >= 5 && user.plan === 'free') {
      const hasShownProPromo = localStorage.getItem(`pro_promo_${user.id}`);
      if (!hasShownProPromo) {
        toast({
          title: "🎯 Você está usando muito o ZipFast!",
          description: "Que tal upgrade para PRO? Créditos ilimitados e arquivos até 5GB!",
          duration: 7000,
        });
        localStorage.setItem(`pro_promo_${user.id}`, 'true');
      }
    }
  }, [user, toast]);

  const notifyCompressionSuccess = (fileCount: number, ratio: number, remainingCredits: number) => {
    let description = `${fileCount} arquivo(s) comprimidos com ${ratio}% de economia.`;
    
    if (remainingCredits <= 2 && user?.plan === 'free') {
      description += ` Restam ${remainingCredits} créditos!`;
    }

    toast({
      title: "✅ Compressão concluída!",
      description,
      duration: 4000,
    });
  };

  const notifyPlanUpgrade = (plan: string) => {
    toast({
      title: "🎉 Upgrade realizado!",
      description: `Bem-vindo ao plano ${plan.toUpperCase()}! Aproveite todos os benefícios.`,
      duration: 5000,
    });
  };

  const notifyError = (title: string, message: string) => {
    toast({
      title: `❌ ${title}`,
      description: message,
      variant: "destructive",
      duration: 5000,
    });
  };

  return {
    notifyCompressionSuccess,
    notifyPlanUpgrade,
    notifyError
  };
};
