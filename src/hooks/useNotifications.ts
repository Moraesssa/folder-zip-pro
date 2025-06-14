
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationSettings {
  compressionComplete: boolean;
  cloudUploadComplete: boolean;
  lowCredits: boolean;
  promotions: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  data?: any;
  timestamp: number;
}

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    compressionComplete: true,
    cloudUploadComplete: true,
    lowCredits: true,
    promotions: false
  });
  
  const { user } = useAuth();

  useEffect(() => {
    // Verificar suporte a notificações
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Carregar configurações salvas
    if (user) {
      const savedSettings = localStorage.getItem(`zipfast_notifications_${user.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [user]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (user) {
      localStorage.setItem(`zipfast_notifications_${user.id}`, JSON.stringify(updatedSettings));
    }
  }, [settings, user]);

  const sendNotification = useCallback((notification: Omit<PushNotification, 'id' | 'timestamp'>) => {
    if (!isSupported || permission !== 'granted') return;

    const pushNotification: PushNotification = {
      ...notification,
      id: `notification_${Date.now()}`,
      timestamp: Date.now()
    };

    // Criar notificação do browser
    const browserNotification = new Notification(pushNotification.title, {
      body: pushNotification.body,
      icon: pushNotification.icon || '/favicon.ico',
      data: pushNotification.data,
      tag: pushNotification.id
    });

    // Auto-fechar após 5 segundos
    setTimeout(() => {
      browserNotification.close();
    }, 5000);

    // Salvar no histórico
    if (user) {
      const history = JSON.parse(localStorage.getItem(`zipfast_notification_history_${user.id}`) || '[]');
      const updatedHistory = [pushNotification, ...history].slice(0, 100); // Manter 100 notificações
      localStorage.setItem(`zipfast_notification_history_${user.id}`, JSON.stringify(updatedHistory));
    }

    console.log('Notification sent:', pushNotification);
  }, [isSupported, permission, user]);

  const notifyCompressionComplete = useCallback((fileCount: number, compressionRatio: number) => {
    if (!settings.compressionComplete) return;
    
    sendNotification({
      title: '✅ Compressão Concluída!',
      body: `${fileCount} arquivo(s) comprimidos com ${compressionRatio}% de economia`,
      icon: '/favicon.ico'
    });
  }, [settings.compressionComplete, sendNotification]);

  const notifyCloudUploadComplete = useCallback((provider: string, filename: string) => {
    if (!settings.cloudUploadComplete) return;
    
    sendNotification({
      title: '☁️ Upload Concluído!',
      body: `${filename} enviado para ${provider} com sucesso`,
      icon: '/favicon.ico'
    });
  }, [settings.cloudUploadComplete, sendNotification]);

  const notifyLowCredits = useCallback((credits: number) => {
    if (!settings.lowCredits) return;
    
    sendNotification({
      title: '⚠️ Créditos Baixos',
      body: `Você tem apenas ${credits} crédito(s) restantes. Considere fazer upgrade!`,
      icon: '/favicon.ico'
    });
  }, [settings.lowCredits, sendNotification]);

  const notifyPromotion = useCallback((title: string, message: string) => {
    if (!settings.promotions) return;
    
    sendNotification({
      title: `🎉 ${title}`,
      body: message,
      icon: '/favicon.ico'
    });
  }, [settings.promotions, sendNotification]);

  const getNotificationHistory = useCallback((): PushNotification[] => {
    if (!user) return [];
    
    const history = localStorage.getItem(`zipfast_notification_history_${user.id}`);
    return history ? JSON.parse(history) : [];
  }, [user]);

  const clearNotificationHistory = useCallback(() => {
    if (!user) return;
    
    localStorage.removeItem(`zipfast_notification_history_${user.id}`);
  }, [user]);

  return {
    isSupported,
    permission,
    settings,
    requestPermission,
    updateSettings,
    sendNotification,
    notifyCompressionComplete,
    notifyCloudUploadComplete,
    notifyLowCredits,
    notifyPromotion,
    getNotificationHistory,
    clearNotificationHistory
  };
};
