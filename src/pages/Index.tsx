
import React, { useState, useEffect } from 'react';
import { Folder, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useConversionLogic } from '@/hooks/useConversionLogic';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MainContent from '@/components/MainContent';
import FeatureCard from '@/components/FeatureCard';
import AdBanner from '@/components/AdBanner';
import AffiliateSection from '@/components/AffiliateSection';
import ConversionPopup from '@/components/ConversionPopup';
import ProUpgradeModal from '@/components/ProUpgradeModal';
import StatsSection from '@/components/StatsSection';
import UserDashboardReal from '@/components/UserDashboardReal';
import LoginModal from '@/components/LoginModal';
import TrustSection from '@/components/TrustSection';

const Index = () => {
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const { trackConversion } = useAnalytics();
  
  const {
    isConversionPopupOpen,
    conversionTrigger,
    closeConversionPopup,
    triggerActionBasedPopup
  } = useConversionLogic(isAuthenticated);

  // Listen for PRO modal trigger
  useEffect(() => {
    const handleOpenProModal = () => {
      setIsProModalOpen(true);
    };

    window.addEventListener('openProModal', handleOpenProModal);
    return () => window.removeEventListener('openProModal', handleOpenProModal);
  }, []);

  const handleProUpgrade = () => {
    trackConversion('upgrade', 29.90);
    setIsProModalOpen(true);
    closeConversionPopup();
  };

  const features = [
    {
      icon: Folder,
      title: "Compacte Pastas Inteiras",
      description: "Único serviço que comprime pastas completas mantendo a estrutura original",
      highlight: true
    },
    {
      icon: Zap,
      title: "Super Rápido",
      description: "Compressão até 3x mais rápida que ferramentas tradicionais"
    },
    {
      icon: Crown,
      title: "Integração com Drive",
      description: "Salve diretamente no Google Drive ou Dropbox após comprimir"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header onUpgradeClick={() => setIsProModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Real User Dashboard with Supabase integration */}
        {isAuthenticated && (
          <UserDashboardReal onUpgradeClick={() => setIsProModalOpen(true)} />
        )}

        {/* Hero Section */}
        <HeroSection onUpgradeClick={() => setIsProModalOpen(true)} />

        {/* Stats Section */}
        <StatsSection />

        {/* Main Content */}
        <MainContent 
          onLoginRequired={() => setIsLoginModalOpen(true)}
          onProUpgradeRequired={() => setIsProModalOpen(true)}
          onActionBasedConversion={triggerActionBasedPopup}
        />

        {/* Ad Banner */}
        <AdBanner />

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher o ZipFast?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos o único serviço no Brasil que permite comprimir pastas inteiras, 
              mantendo toda a estrutura original dos seus arquivos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* Affiliate Section */}
        <AffiliateSection />

        {/* Trust Section */}
        <TrustSection />
      </main>

      {/* Modals */}
      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <ConversionPopup
        isOpen={isConversionPopupOpen}
        onClose={closeConversionPopup}
        onUpgrade={handleProUpgrade}
        trigger={conversionTrigger}
      />
    </div>
  );
};

export default Index;
