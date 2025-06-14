
import React, { useState, useEffect } from 'react';
import { History, Download, Trash2, Calendar, FileArchive, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth, supabase } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CompressionRecord {
  id: string;
  filename: string;
  original_size: number;
  compressed_size: number;
  compression_ratio: number;
  file_count: number;
  created_at: string;
}

const CompressionHistoryReal: React.FC = () => {
  const [history, setHistory] = useState<CompressionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!supabase || !user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('compression_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de compressões.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    if (!supabase || !user) return;
    
    try {
      const { error } = await supabase
        .from('compression_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory(prev => prev.filter(record => record.id !== id));
      toast({
        title: "Registro removido",
        description: "O registro foi removido do histórico.",
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o registro.",
        variant: "destructive"
      });
    }
  };

  const clearAllHistory = async () => {
    if (!supabase || !user) return;
    
    try {
      const { error } = await supabase
        .from('compression_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory([]);
      toast({
        title: "Histórico limpo",
        description: "Todo o histórico foi removido.",
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Erro ao limpar",
        description: "Não foi possível limpar o histórico.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalStats = () => {
    const totalCompressions = history.length;
    const totalSavings = history.reduce((acc, record) => {
      return acc + (record.original_size - record.compressed_size);
    }, 0);
    const totalFiles = history.reduce((acc, record) => acc + record.file_count, 0);
    
    return { totalCompressions, totalSavings, totalFiles };
  };

  const { totalCompressions, totalSavings, totalFiles } = getTotalStats();

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
              Histórico de Compressões
            </CardTitle>
            <CardDescription>
              {totalCompressions} compressões • {totalFiles} arquivos • {formatFileSize(totalSavings)} economizados
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
              <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{record.filename}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(record.created_at)}
                      </span>
                      <span>{record.file_count} arquivo(s)</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {record.compression_ratio}% economia
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRecord(record.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span className="text-sm font-medium">Tamanho Original:</span>
                    <span className="text-sm">{formatFileSize(record.original_size)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span className="text-sm font-medium">Tamanho Comprimido:</span>
                    <span className="text-sm">{formatFileSize(record.compressed_size)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompressionHistoryReal;
