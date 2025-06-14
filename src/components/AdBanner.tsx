
import React, { useEffect } from 'react';
import { useAds } from '@/hooks/useAds';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import DynamicAd from './DynamicAd';

const AdBanner: React.FC = () => {
  const { user } = useAuth();
  const { currentAd, trackImpression, trackClick } = useAds('content');
  const { trackUserAction } = useAnalytics();

  useEffect(() => {
    if (currentAd) {
      trackImpression(currentAd.id);
    }
  }, [currentAd, trackImpression]);

  const handleAdClose = () => {
    trackUserAction('ad_close', { adId: currentAd?.id, placement: 'content' });
  };

  // Não mostrar anúncios para usuários PRO
  if (user?.plan === 'pro') {
    return null;
  }

  return (
    <div className="mb-12">
      <DynamicAd 
        placement="content" 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        onClose={handleAdClose}
      />
    </div>
  );
};

export default AdBanner;
