
import React, { useState, useEffect } from 'react';
import { History, Download, Cloud, Trash2, Calendar, FileArchive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface CompressionRecord {
  id: string;
  filename: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  createdAt: number;
  fileCount: number;
  cloudUploads?: {
    provider: string;
    shareUrl: string;
    uploadedAt: number;
  }[];
}

const CompressionHistory: React.FC = () => {
  const [history, setHistory] = useState<CompressionRecord[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = () => {
    if (!user) return;
    
    const savedHistory = localStorage.getItem(`zipfast_history_${user.id}`);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  };

  const clearHistory = () => {
    if (!user) return;
    
    localStorage.removeItem(`zipfast_history_${user.id}`);
    setHistory([]);
  };

  const deleteRecord = (id: string) => {
    if (!user) return;
    
    const updatedHistory = history.filter(record => record.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(`zipfast_history_${user.id}`, JSON.stringify(updatedHistory));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              Suas compressões recentes e uploads na nuvem
            </CardDescription>
          </div>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Histórico
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
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
                        {formatDate(record.createdAt)}
                      </span>
                      <span>{record.fileCount} arquivo(s)</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {record.compressionRatio}% economia
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

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span className="text-sm font-medium">Tamanho Original:</span>
                    <span className="text-sm">{formatFileSize(record.originalSize)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span className="text-sm font-medium">Tamanho Comprimido:</span>
                    <span className="text-sm">{formatFileSize(record.compressedSize)}</span>
                  </div>
                </div>

                {record.cloudUploads && record.cloudUploads.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Cloud className="w-4 h-4" />
                      Uploads na Nuvem
                    </h5>
                    <div className="space-y-2">
                      {record.cloudUploads.map((upload, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {upload.provider}
                            </Badge>
                            <span className="text-gray-600">
                              {formatDate(upload.uploadedAt)}
                            </span>
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(upload.shareUrl, '_blank')}
                            className="h-6 px-2"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Abrir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompressionHistory;
