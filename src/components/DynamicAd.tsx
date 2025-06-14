
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface DynamicAdProps {
  placement: 'sidebar' | 'banner' | 'popup';
  className?: string;
}

interface AdContent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  targetUrl: string;
  sponsor: string;
}

const DynamicAd: React.FC<DynamicAdProps> = ({ placement, className = '' }) => {
  const [adContent, setAdContent] = useState<AdContent | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { trackAdClick } = useAnalytics();

  useEffect(() => {
    // Simular carregamento de anúncio baseado no placement
    const loadAd = () => {
      const ads: Record<string, AdContent> = {
        sidebar: {
          id: 'dropbox-promo',
          title: 'Dropbox Business',
          description: 'Armazenamento seguro na nuvem para sua empresa',
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop',
          ctaText: 'Teste Grátis',
          targetUrl: 'https://dropbox.com',
          sponsor: 'Dropbox'
        },
        banner: {
          id: 'hosting-promo',
          title: 'Hospedagem Web Premium',
          description: 'Performance e segurança para seu site',
          imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=150&fit=crop',
          ctaText: 'Saiba Mais',
          targetUrl: 'https://hostinger.com',
          sponsor: 'Hostinger'
        },
        popup: {
          id: 'vpn-promo',
          title: 'NordVPN',
          description: 'Navegue com segurança e privacidade total',
          imageUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=350&h=200&fit=crop',
          ctaText: 'Assinar Agora',
          targetUrl: 'https://nordvpn.com',
          sponsor: 'NordVPN'
        }
      };

      setAdContent(ads[placement] || ads.sidebar);
    };

    loadAd();
  }, [placement]);

  const handleAdClick = () => {
    if (adContent) {
      trackAdClick(adContent.id, placement);
      window.open(adContent.targetUrl, '_blank');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!adContent || !isVisible) return null;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="absolute top-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
        Publicidade
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={handleClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardContent className="p-0">
        <div className="cursor-pointer" onClick={handleAdClick}>
          <img 
            src={adContent.imageUrl} 
            alt={adContent.title}
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-1">Por {adContent.sponsor}</div>
            <h3 className="font-semibold mb-2">{adContent.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{adContent.description}</p>
            <Button size="sm" className="w-full">
              {adContent.ctaText}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicAd;
