
import React from 'react';
import { ExternalLink, Server, Cloud, Shield, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyticsService } from '@/services/analyticsService';

interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  coupon?: string;
  features: string[];
}

const AffiliateSection: React.FC = () => {
  const products: AffiliateProduct[] = [
    {
      id: 'hostinger',
      name: 'Hostinger',
      description: 'Hospedagem web premium com performance excepcional',
      price: 'R$ 5,99/mês',
      originalPrice: 'R$ 23,99/mês',
      discount: '75% OFF',
      icon: Server,
      link: 'https://hostinger.com.br/?REFERRALCODE=ZIPFAST75',
      coupon: 'ZIPFAST75',
      features: ['SSL Grátis', '100GB SSD', 'Backup Automático', 'Suporte 24/7']
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare R2',
      description: 'Armazenamento em nuvem com zero taxas de saída',
      price: 'Grátis',
      originalPrice: 'Até 10GB',
      icon: Cloud,
      link: 'https://www.cloudflare.com/products/r2/?ref=zipfast',
      features: ['10GB Grátis', 'CDN Global', 'API S3', 'Zero Egress Fees']
    },
    {
      id: 'vpn',
      name: 'NordVPN',
      description: 'Proteja sua privacidade online com a melhor VPN',
      price: 'R$ 12,99/mês',
      originalPrice: 'R$ 32,99/mês',
      discount: '61% OFF',
      icon: Shield,
      link: 'https://nordvpn.com/?ref=zipfast',
      coupon: 'ZIPFAST61',
      features: ['6 Dispositivos', '5400+ Servers', 'Kill Switch', 'Sem Logs']
    },
    {
      id: 'surge',
      name: 'Surge.sh',
      description: 'Deploy estático simples e rápido para desenvolvedores',
      price: 'R$ 30/mês',
      originalPrice: 'Domínio personalizado',
      icon: Zap,
      link: 'https://surge.sh/?ref=zipfast',
      features: ['Deploy Instantâneo', 'SSL Automático', 'CDN Global', 'CLI Simples']
    }
  ];

  const handleProductClick = (product: AffiliateProduct) => {
    analyticsService.trackAdClick(product.id, 'affiliate_section');
    analyticsService.track('affiliate_click', 'monetization', 'click', product.name, 1, {
      productId: product.id,
      productName: product.name,
      price: product.price
    });
    
    window.open(product.link, '_blank');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ferramentas Recomendadas</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Potencialize seus projetos com as melhores ferramentas do mercado. 
            Ofertas exclusivas para usuários ZipFast!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card key={product.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {product.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {product.discount}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      {product.coupon && (
                        <span className="text-xs text-green-600 font-medium">
                          Cupom: {product.coupon}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-1 mb-6">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleProductClick(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Ver Oferta
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            * Ofertas exclusivas para usuários ZipFast. Preços podem variar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AffiliateSection;
