
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Download, Cloud, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserDashboardProps {
  onUpgradeClick: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onUpgradeClick }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getUsageData = () => {
    const history = JSON.parse(localStorage.getItem(`zipfast_history_${user.id}`) || '[]');
    const totalCompressions = history.length;
    const totalSavings = history.reduce((acc: number, record: any) => {
      return acc + (record.originalSize - record.compressedSize);
    }, 0);
    
    return { totalCompressions, totalSavings };
  };

  const { totalCompressions, totalSavings } = getUsageData();
  const creditsPercentage = (user.credits / (user.plan === 'pro' ? 1000 : 10)) * 100;

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Credits Card */}
      <Card className={user.plan === 'pro' ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {user.plan === 'pro' ? 'Créditos PRO' : 'Créditos Gratuitos'}
          </CardTitle>
          {user.plan === 'pro' ? (
            <Crown className="h-4 w-4 text-yellow-500" />
          ) : (
            <Zap className="h-4 w-4 text-blue-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.credits}</div>
          <Progress value={creditsPercentage} className="mt-2" />
          {user.plan === 'free' && user.credits <= 3 && (
            <Button onClick={onUpgradeClick} size="sm" className="mt-3 w-full">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade PRO
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compressões</CardTitle>
          <Download className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompressions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total de arquivos processados
          </p>
        </CardContent>
      </Card>

      {/* Savings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Economia Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(totalSavings / 1024 / 1024).toFixed(1)}MB
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Espaço economizado
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
