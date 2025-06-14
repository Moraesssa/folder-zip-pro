
import React from 'react';
import { Users, Download, Zap, Star } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Usuários Ativos",
      color: "text-blue-600"
    },
    {
      icon: Download,
      value: "2.5M+",
      label: "Arquivos Comprimidos",
      color: "text-green-600"
    },
    {
      icon: Zap,
      value: "73%",
      label: "Redução Média",
      color: "text-purple-600"
    },
    {
      icon: Star,
      value: "4.9",
      label: "Avaliação",
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-')}/10 rounded-xl flex items-center justify-center mx-auto mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
