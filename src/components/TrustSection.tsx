
import React from 'react';

const TrustSection: React.FC = () => {
  return (
    <section className="py-16 text-center">
      <div className="zipfast-card max-w-4xl mx-auto p-8">
        <h3 className="text-3xl font-bold mb-6">Segurança e Privacidade</h3>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div>
            <h4 className="font-semibold text-lg mb-2 text-zipfast-blue">🔒 Totalmente Seguro</h4>
            <p className="text-gray-600">
              Arquivos excluídos automaticamente após 1 hora. Processamento local sem upload para servidores externos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2 text-zipfast-purple">⚡ Infraestrutura Robusta</h4>
            <p className="text-gray-600">
              Powered by Oracle Cloud com CDN global da Cloudflare para máxima velocidade e disponibilidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
