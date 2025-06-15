
import React from 'react';
import { History, Trash2, FileArchive, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOracleAuth } from '@/contexts/OracleAuthContext';
import { useOracleCompressionHistory } from '@/hooks/useOracleCompressionHistory';
import CompressionRecordCard from '@/components/oracle/CompressionRecordCard';
import CompressionStatsDisplay from '@/components/oracle/CompressionStats';

const OracleCompressionHistory: React.FC = () => {
  const { user } = useOracleAuth();
  const {
    history,
    isLoading,
    loadHistory,
    deleteRecord,
    clearAllHistory,
    getTotalStats
  } = useOracleCompressionHistory();

  const stats = getTotalStats();

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <History className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Faça login para ver seu histórico de compressões</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-zipfast-blue" />
              Histórico de Compressões (Oracle)
            </CardTitle>
            <CardDescription>
              <CompressionStatsDisplay stats={stats} />
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadHistory}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllHistory}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Tudo
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-zipfast-blue" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileArchive className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              Nenhuma compressão encontrada<br />
              <span className="text-sm">Comprima alguns arquivos para ver seu histórico aqui</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <CompressionRecordCard
                key={record.id}
                record={record}
                onDelete={deleteRecord}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OracleCompressionHistory;
