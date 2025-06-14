
import { useState, useEffect } from 'react';
import { adService, AdData } from '@/services/adService';
import { useAuth } from '@/contexts/AuthContext';

export const useAds = (placement: string) => {
  const [ads, setAds] = useState<AdData[]>([]);
  const [currentAd, setCurrentAd] = useState<AdData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const userType = user?.plan === 'pro' ? 'pro' : 'free';
    const availableAds = adService.getAdsForPlacement(placement, userType);
    setAds(availableAds);
    
    if (availableAds.length > 0) {
      const randomAd = availableAds[Math.floor(Math.random() * availableAds.length)];
      setCurrentAd(randomAd);
    }
  }, [placement, user]);

  const trackImpression = (adId: string) => {
    adService.trackImpression(adId);
  };

  const trackClick = (adId: string) => {
    adService.trackClick(adId);
  };

  const trackConversion = (adId: string) => {
    adService.trackConversion(adId);
  };

  const getRandomAd = () => {
    const userType = user?.plan === 'pro' ? 'pro' : 'free';
    return adService.getRandomAd(placement, userType);
  };

  const refreshAd = () => {
    const newAd = getRandomAd();
    setCurrentAd(newAd);
    if (newAd) {
      trackImpression(newAd.id);
    }
  };

  return {
    ads,
    currentAd,
    trackImpression,
    trackClick,
    trackConversion,
    refreshAd,
    getRandomAd
  };
};
