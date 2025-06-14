
export interface AdData {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  link: string;
  image?: string;
  type: 'banner' | 'popup' | 'inline' | 'affiliate';
  placement: 'header' | 'footer' | 'sidebar' | 'content' | 'modal';
  priority: number;
  active: boolean;
  targeting?: {
    userType?: 'free' | 'pro' | 'all';
    pages?: string[];
    timeOfDay?: number[];
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
  };
}

export class AdService {
  private ads: AdData[] = [
    {
      id: 'hostinger-main',
      title: 'Hostinger - 75% OFF',
      description: 'Hospedagem premium por apenas R$ 5,99/mês. Ideal para seus projetos profissionais!',
      ctaText: 'Ver Oferta',
      link: 'https://hostinger.com.br/?REFERRALCODE=ZIPFAST75',
      type: 'banner',
      placement: 'content',
      priority: 1,
      active: true,
      targeting: { userType: 'all' },
      metrics: { impressions: 0, clicks: 0, conversions: 0 }
    },
    {
      id: 'cloudflare-storage',
      title: 'Cloudflare R2 Storage',
      description: 'Armazenamento em nuvem com 0% de taxas de saída. Perfeito para backups!',
      ctaText: 'Começar Grátis',
      link: 'https://www.cloudflare.com/products/r2/?ref=zipfast',
      type: 'inline',
      placement: 'content',
      priority: 2,
      active: true,
      targeting: { userType: 'free' },
      metrics: { impressions: 0, clicks: 0, conversions: 0 }
    },
    {
      id: 'pro-upgrade',
      title: 'Upgrade para PRO',
      description: 'Processe arquivos até 5GB, sem anúncios e com prioridade!',
      ctaText: 'Upgrade Agora',
      link: '#pro',
      type: 'popup',
      placement: 'modal',
      priority: 3,
      active: true,
      targeting: { userType: 'free' },
      metrics: { impressions: 0, clicks: 0, conversions: 0 }
    }
  ];

  getAdsForPlacement(placement: string, userType: 'free' | 'pro' | 'all' = 'all'): AdData[] {
    return this.ads
      .filter(ad => ad.active && ad.placement === placement)
      .filter(ad => !ad.targeting?.userType || ad.targeting.userType === userType || ad.targeting.userType === 'all')
      .sort((a, b) => a.priority - b.priority);
  }

  trackImpression(adId: string): void {
    const ad = this.ads.find(a => a.id === adId);
    if (ad) {
      ad.metrics.impressions++;
      console.log(`Ad impression tracked: ${adId}`, ad.metrics);
    }
  }

  trackClick(adId: string): void {
    const ad = this.ads.find(a => a.id === adId);
    if (ad) {
      ad.metrics.clicks++;
      console.log(`Ad click tracked: ${adId}`, ad.metrics);
    }
  }

  trackConversion(adId: string): void {
    const ad = this.ads.find(a => a.id === adId);
    if (ad) {
      ad.metrics.conversions++;
      console.log(`Ad conversion tracked: ${adId}`, ad.metrics);
    }
  }

  getAdMetrics(adId: string) {
    const ad = this.ads.find(a => a.id === adId);
    return ad?.metrics || { impressions: 0, clicks: 0, conversions: 0 };
  }

  getRandomAd(placement: string, userType: 'free' | 'pro' | 'all' = 'all'): AdData | null {
    const ads = this.getAdsForPlacement(placement, userType);
    if (ads.length === 0) return null;
    return ads[Math.floor(Math.random() * ads.length)];
  }
}

export const adService = new AdService();
