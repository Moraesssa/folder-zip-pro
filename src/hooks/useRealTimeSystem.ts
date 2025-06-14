
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { useNotifications } from '@/hooks/useNotifications';
import { supabaseConfig, isSupabaseConfigured } from '@/config/supabase';

export const useRealTimeSystem = () => {
  const { user, isAuthenticated } = useAuth();
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
    if (isAuthenticated && isSupabaseConfigured()) {
      // Solicitar permissão para notificações do browser
      requestPermission();
      
      console.log('Sistema de tempo real inicializado para usuário:', user?.email);
    }
  }, [isAuthenticated, user, requestPermission]);

  // Monitorar créditos baixos
  useEffect(() => {
    if (user && user.plan === 'free' && user.credits <= supabaseConfig.notifications.lowCreditsThreshold) {
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
    isSystemReady: isAuthenticated && isSupabaseConfigured()
  };
};
