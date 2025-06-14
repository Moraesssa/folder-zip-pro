
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Download, TrendingUp, RefreshCw, Calendar } from 'lucide-react';
import { useAuth, supabase } from '@/contexts/AuthContext';

interface UserDashboardRealProps {
  onUpgradeClick: () => void;
}

interface DashboardStats {
  totalCompressions: number;
  totalSavings: number;
  totalFiles: number;
  thisWeekCompressions: number;
  avgCompressionRatio: number;
}

const UserDashboardReal: React.FC<UserDashboardRealProps> = ({ onUpgradeClick }) => {
  const { user, refreshUserData } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCompressions: 0,
    totalSavings: 0,
    totalFiles: 0,
    thisWeekCompressions: 0,
    avgCompressionRatio: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    if (!supabase || !user) return;
    
    setIsLoadingStats(true);
    try {
      const { data, error } = await supabase
        .from('compression_history')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const records = data || [];
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const weekRecords = records.filter(record => 
        new Date(record.created_at) >= oneWeekAgo
      );

      const totalSavings = records.reduce((acc, record) => 
        acc + (record.original_size - record.compressed_size), 0
      );

      const totalFiles = records.reduce((acc, record) => 
        acc + record.file_count, 0
      );

      const avgRatio = records.length > 0 
        ? records.reduce((acc, record) => acc + record.compression_ratio, 0) / records.length
        : 0;

      setStats({
        totalCompressions: records.length,
        totalSavings,
        totalFiles,
        thisWeekCompressions: weekRecords.length,
        avgCompressionRatio: Math.round(avgRatio)
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleRefreshData = async () => {
    await Promise.all([
      refreshUserData(),
      loadDashboardStats()
    ]);
  };

  if (!user) return null;

  const creditsPercentage = user.plan === 'pro' 
    ? 100 // PRO users always show full
    : (user.credits / 10) * 100; // Free users out of 10

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshData}
          disabled={isLoadingStats}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingStats ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Card */}
        <Card className={user.plan === 'pro' ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.plan === 'pro' ? 'Plano PRO Ativo' : 'Créditos Gratuitos'}
            </CardTitle>
            {user.plan === 'pro' ? (
              <Crown className="h-4 w-4 text-yellow-500" />
            ) : (
              <Zap className="h-4 w-4 text-blue-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.plan === 'pro' ? '∞' : user.credits}
            </div>
            {user.plan === 'free' && (
              <>
                <Progress value={creditsPercentage} className="mt-2" />
                {user.credits <= 3 && (
                  <Button onClick={onUpgradeClick} size="sm" className="mt-3 w-full">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade PRO
                  </Button>
                )}
              </>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {user.plan === 'pro' 
                ? 'Compressões ilimitadas' 
                : `Limite: ${Math.round(user.maxFileSize / 1024 / 1024)}MB por operação`
              }
            </p>
          </CardContent>
        </Card>

        {/* Total Compressions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compressões Total</CardTitle>
            <Download className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompressions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalFiles} arquivos processados
            </p>
            {stats.thisWeekCompressions > 0 && (
              <p className="text-xs text-green-600 mt-1">
                +{stats.thisWeekCompressions} esta semana
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Savings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(stats.totalSavings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Espaço economizado
            </p>
            {stats.avgCompressionRatio > 0 && (
              <p className="text-xs text-purple-600 mt-1">
                {stats.avgCompressionRatio}% média de compressão
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          {user.plan === 'free' && (
            <Button onClick={onUpgradeClick} className="zipfast-button">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade para PRO
            </Button>
          )}
          
          <Button variant="outline" onClick={loadDashboardStats}>
            <Calendar className="w-4 h-4 mr-2" />
            Ver Histórico Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboardReal;
