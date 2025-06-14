
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Share2, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AffiliateSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular cadastro no programa de afiliados
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "✅ Cadastro realizado!",
      description: "Você foi inscrito no programa de afiliados. Verifique seu email!",
    });

    setEmail('');
    setIsSubmitting(false);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "30% de Comissão",
      description: "Ganhe 30% em cada venda realizada através do seu link"
    },
    {
      icon: Users,
      title: "Audiência Engajada",
      description: "Promova para uma base de usuários que realmente precisa do serviço"
    },
    {
      icon: TrendingUp,
      title: "Material de Marketing",
      description: "Banners, links e conteúdo pronto para suas campanhas"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-zipfast-blue/5 to-zipfast-purple/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Programa de Afiliados ZipFast
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monetize sua audiência promovendo a melhor ferramenta de compressão do Brasil. 
            Ganhe até 30% de comissão em cada venda!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zipfast-gradient mb-4 mx-auto">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Share2 className="w-6 h-6 text-zipfast-blue" />
              Cadastre-se Agora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="affiliate-email">Email para cadastro</Label>
                <Input
                  id="affiliate-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full zipfast-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cadastrando...' : 'Quero Ser Afiliado'}
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                Ao se cadastrar, você concorda com nossos termos do programa de afiliados
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AffiliateSection;
