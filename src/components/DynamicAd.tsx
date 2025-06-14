
import React, { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adService, AdData } from '@/services/adService';
import { analyticsService } from '@/services/analyticsService';
import { useAuth } from '@/contexts/AuthContext';

interface DynamicAdProps {
  placement: string;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

const DynamicAd: React.FC<DynamicAdProps> = ({ 
  placement, 
  className = '', 
  showCloseButton = true,
  onClose 
}) => {
  const [ad, setAd] = useState<AdData | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const userType = user?.plan === 'pro' ? 'pro' : 'free';
    const selectedAd = adService.getRandomAd(placement, userType);
    
    if (selectedAd) {
      setAd(selectedAd);
      adService.trackImpression(selectedAd.id);
    }
  }, [placement, user]);

  const handleAdClick = () => {
    if (!ad) return;
    
    adService.trackClick(ad.id);
    analyticsService.trackAdClick(ad.id, placement);
    
    if (ad.link === '#pro') {
      onClose?.();
      // Trigger PRO modal (would be handled by parent component)
      window.dispatchEvent(new CustomEvent('openProModal'));
    } else {
      window.open(ad.link, '_blank');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!ad || !isVisible || (user?.plan === 'pro' && ad.type !== 'affiliate')) {
    return null;
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {showCloseButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {ad.type === 'affiliate' ? 'PARCEIRO' : 'ANÚNCIO'}
          </span>
          <span className="text-xs text-gray-500">Patrocinado</span>
        </div>

        <h3 className="font-bold text-lg mb-2">{ad.title}</h3>
        <p className="text-gray-600 mb-4">{ad.description}</p>

        <Button 
          onClick={handleAdClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {ad.ctaText}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default DynamicAd;
