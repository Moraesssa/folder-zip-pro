
import { useEffect } from 'react';
import { useOracleAuth } from '@/contexts/OracleAuthContext';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { useNotifications } from '@/hooks/useNotifications';
import { oracleConfig, isOracleConfigured } from '@/config/oracle';

export const useOracleRealTimeSystem = () => {
  const { user, isAuthenticated } = useOracleAuth();
  const { 
    notifyCompressionSuccess, 
    notifyPlanUpgrade, 
    notifyError 
  } = useRealTimeNotifications();
  const { 
    requestPermission, 
    notifyCompressionComplete,
    notifyLowCredits 
  } = useNotifications();

  // Inicializar sistema de notificações
  useEffect(() => {
    if (isAuthenticated && isOracleConfigured()) {
      // Solicitar permissão para notificações do browser
      requestPermission();
      
      console.log('Oracle real-time system initialized for user:', user?.email);
    }
  }, [isAuthenticated, user, requestPermission]);

  // Monitorar créditos baixos
  useEffect(() => {
    if (user && user.plan === 'free' && user.credits <= oracleConfig.notifications.lowCreditsThreshold) {
      notifyLowCredits(user.credits);
    }
  }, [user, notifyLowCredits]);

  const handleCompressionSuccess = (fileCount: number, ratio: number) => {
    if (!user) return;
    
    const remainingCredits = user.credits;
    
    // Notificação toast
    notifyCompressionSuccess(fileCount, ratio, remainingCredits);
    
    // Notificação do browser
    notifyCompressionComplete(fileCount, ratio);
    
    // Atualizar contador local
    const currentCount = parseInt(localStorage.getItem('compressionCount') || '0');
    localStorage.setItem('compressionCount', (currentCount + 1).toString());
  };

  const handlePlanUpgrade = (newPlan: string) => {
    notifyPlanUpgrade(newPlan);
    
    // Limpar avisos antigos
    if (user) {
      localStorage.removeItem(`low_credits_warning_${user.id}`);
      localStorage.removeItem(`pro_promo_${user.id}`);
    }
  };

  const handleError = (title: string, message: string) => {
    notifyError(title, message);
  };

  return {
    handleCompressionSuccess,
    handlePlanUpgrade,
    handleError,
    isSystemReady: isAuthenticated && isOracleConfigured()
  };
};
