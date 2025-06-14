
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Download, Zap, Globe } from 'lucide-react';

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 15742,
    totalCompressions: 89231,
    dataProcessed: 2.4,
    countries: 47
  });

  useEffect(() => {
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      setStats(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        totalCompressions: prev.totalCompressions + Math.floor(Math.random() * 8),
        dataProcessed: prev.dataProcessed + (Math.random() * 0.01),
        countries: prev.countries + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      title: "Usuários Ativos",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Arquivos Comprimidos",
      value: stats.totalCompressions.toLocaleString(),
      icon: Download,
      color: "text-green-600"
    },
    {
      title: "TB Processados",
      value: stats.dataProcessed.toFixed(1),
      icon: Zap,
      color: "text-purple-600"
    },
    {
      title: "Países",
      value: stats.countries.toString(),
      icon: Globe,
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">ZipFast em Números</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Milhares de usuários confiam no ZipFast para suas necessidades de compressão diariamente
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
