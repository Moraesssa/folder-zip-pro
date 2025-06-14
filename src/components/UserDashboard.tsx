
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Zap, Download, TrendingUp } from 'lucide-react';

interface UserDashboardProps {
  onUpgradeClick: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onUpgradeClick }) => {
  const { user } = useAuth();

  if (!user) return null;

  const usagePercentage = ((10 - user.credits) / 10) * 100;

  return (
    <Card className="zipfast-card mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-zipfast-gradient rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user.plan === 'pro' ? (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                <Crown className="w-4 h-4" />
                <span className="font-semibold">PRO</span>
              </div>
            ) : (
              <Button onClick={onUpgradeClick} variant="outline" size="sm">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade para PRO
              </Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-zipfast-blue" />
            </div>
            <h4 className="font-semibold mb-1">Créditos Restantes</h4>
            <p className="text-2xl font-bold text-zipfast-blue">{user.credits}</p>
            <p className="text-sm text-gray-600">de 10 créditos</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold mb-1">Limite de Arquivo</h4>
            <p className="text-2xl font-bold text-green-600">
              {user.maxFileSize / (1024 * 1024)}MB
            </p>
            <p className="text-sm text-gray-600">por operação</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-zipfast-purple" />
            </div>
            <h4 className="font-semibold mb-1">Uso Atual</h4>
            <p className="text-2xl font-bold text-zipfast-purple">{usagePercentage.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">dos créditos</p>
          </div>
        </div>

        {user.plan === 'free' && user.credits <= 3 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">Poucos créditos restantes!</p>
                <p className="text-sm text-yellow-700">
                  Upgrade para PRO e tenha créditos ilimitados + arquivos até 5GB
                </p>
              </div>
              <Button onClick={onUpgradeClick} size="sm" className="ml-auto">
                Upgrade Agora
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserDashboard;
