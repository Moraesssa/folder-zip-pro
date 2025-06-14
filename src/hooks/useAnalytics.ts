
import { useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { useAuth } from '@/contexts/AuthContext';

export const useAnalytics = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Atualizar userId quando usuário logar
    if (user) {
      analyticsService.track('user_login', 'auth', 'login', user.email, undefined, {
        userId: user.id,
        plan: user.plan,
        credits: user.credits
      });
    }
  }, [user]);

  const trackEvent = (
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ) => {
    analyticsService.track(event, category, action, label, value, {
      ...properties,
      userId: user?.id,
      userPlan: user?.plan
    });
  };

  const trackPageView = (page?: string) => {
    analyticsService.trackPageView(page);
  };

  const trackFileUpload = (fileCount: number, totalSize: number) => {
    analyticsService.trackFileUpload(fileCount, totalSize);
  };

  const trackCompression = (
    fileCount: number,
    originalSize: number,
    compressedSize: number,
    compressionRatio: number
  ) => {
    analyticsService.trackCompression(fileCount, originalSize, compressedSize, compressionRatio);
  };

  const trackDownload = (filename: string, size: number) => {
    analyticsService.trackDownload(filename, size);
  };

  const trackConversion = (type: 'signup' | 'upgrade' | 'affiliate', value?: number) => {
    analyticsService.trackConversion(type, value);
  };

  const trackUserAction = (action: string, details?: Record<string, any>) => {
    analyticsService.trackUserAction(action, {
      ...details,
      userId: user?.id,
      userPlan: user?.plan
    });
  };

  const trackAdClick = (adId: string, placement: string) => {
    analyticsService.track('ad_click', 'advertisement', 'click', adId, undefined, {
      placement,
      userId: user?.id,
      userPlan: user?.plan
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackFileUpload,
    trackCompression,
    trackDownload,
    trackConversion,
    trackUserAction,
    trackAdClick,
    getSessionStats: () => analyticsService.getSessionStats(),
    getUserJourney: () => analyticsService.getUserJourney()
  };
};
