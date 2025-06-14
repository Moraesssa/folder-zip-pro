
import React from 'react';
import DynamicAd from './DynamicAd';
import { useAuth } from '@/contexts/AuthContext';

const AdBanner: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Não mostrar anúncios para usuários PRO
  if (isAuthenticated && user?.plan === 'pro') {
    return null;
  }

  return (
    <div className="py-8">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">
          {isAuthenticated ? 'Remova os anúncios com o plano PRO' : 'Anúncio - Apoie nossos parceiros'}
        </p>
      </div>
      <DynamicAd placement="banner" className="max-w-4xl mx-auto" />
    </div>
  );
};

export default AdBanner;
