
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  highlight = false 
}) => {
  return (
    <Card className={`p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      highlight ? 'zipfast-card border-2 border-zipfast-blue' : 'zipfast-card'
    }`}>
      {highlight && (
        <div className="inline-block bg-zipfast-gradient text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          EXCLUSIVO
        </div>
      )}
      
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
        highlight ? 'bg-zipfast-gradient' : 'bg-gray-100'
      }`}>
        <Icon className={`w-8 h-8 ${highlight ? 'text-white' : 'text-gray-600'}`} />
      </div>
      
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </Card>
  );
};

export default FeatureCard;
