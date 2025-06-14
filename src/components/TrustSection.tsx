
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, Users, Clock } from 'lucide-react';

const TrustSection: React.FC = () => {
  const trustElements = [
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Seus arquivos são processados localmente e nunca enviados para nossos servidores",
      color: "text-green-600"
    },
    {
      icon: Award,
      title: "Líder no Brasil",
      description: "Mais de 15.000 usuários confiam no ZipFast para suas necessidades diárias",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Suporte Dedicado",
      description: "Equipe brasileira pronta para ajudar você a resolver qualquer dúvida",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      title: "Sempre Disponível",
      description: "Funciona 24/7 no seu navegador, sem necessidade de instalação",
      color: "text-orange-600"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Designer Gráfica",
      text: "Uso o ZipFast todo dia para enviar projetos para clientes. Nunca me deixou na mão!",
      avatar: "MS"
    },
    {
      name: "João Santos",
      role: "Desenvolvedor",
      text: "A compressão de pastas inteiras é um diferencial incrível. Economizo muito tempo!",
      avatar: "JS"
    },
    {
      name: "Ana Costa",
      role: "Estudante",
      text: "Perfeito para organizar meus trabalhos da faculdade. Interface simples e eficiente.",
      avatar: "AC"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Trust Elements */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Por que confiar no ZipFast?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Milhares de brasileiros já escolheram o ZipFast como sua ferramenta de compressão favorita
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {trustElements.map((element, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="text-center pt-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4`}>
                    <element.icon className={`w-6 h-6 ${element.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{element.title}</h3>
                  <p className="text-sm text-gray-600">{element.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-8">O que nossos usuários dizem</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-zipfast-gradient flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
