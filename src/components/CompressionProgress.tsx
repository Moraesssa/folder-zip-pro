
import React from 'react';
import { Zap, Download, RotateCcw, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileData {
  name: string;
  size: number;
  type: string;
}

interface CompressionProgressProps {
  files: FileData[];
  isCompressing: boolean;
  progress: number;
  onCompress: () => void;
  onReset: () => void;
}

const CompressionProgress: React.FC<CompressionProgressProps> = ({
  files,
  isCompressing,
  progress,
  onCompress,
  onReset
}) => {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (progress === 100 && !isCompressing) {
    return (
      <Card className="zipfast-card">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4 text-green-600">Compressão Concluída!</h3>
          <p className="text-gray-600 mb-6">
            {files.length} arquivo(s) comprimidos • Tamanho original: {formatSize(totalSize)}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button className="zipfast-button">
              <Download className="w-5 h-5 mr-2" />
              Baixar ZIP
            </Button>
            <Button variant="outline" className="border-zipfast-blue text-zipfast-blue hover:bg-zipfast-blue hover:text-white">
              <Upload className="w-5 h-5 mr-2" />
              Salvar no Drive
            </Button>
          </div>

          <Button variant="ghost" onClick={onReset} className="text-gray-500">
            <RotateCcw className="w-4 h-4 mr-2" />
            Comprimir Novos Arquivos
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="zipfast-card">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {isCompressing ? 'Comprimindo...' : 'Arquivos Selecionados'}
          </h3>
          <span className="text-sm text-gray-500">
            {files.length} arquivo(s) • {formatSize(totalSize)}
          </span>
        </div>

        {isCompressing && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso da Compressão</span>
              <span className="text-sm text-zipfast-blue font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}

        <div className="max-h-40 overflow-y-auto mb-6 space-y-2">
          {files.slice(0, 5).map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-zipfast-blue rounded-full"></div>
                <span className="font-medium truncate max-w-xs">{file.name}</span>
              </div>
              <span className="text-sm text-gray-500">{formatSize(file.size)}</span>
            </div>
          ))}
          {files.length > 5 && (
            <div className="text-center text-sm text-gray-500 py-2">
              +{files.length - 5} arquivo(s) adicional(is)
            </div>
          )}
        </div>

        {!isCompressing && (
          <div className="flex gap-4">
            <Button 
              onClick={onCompress}
              className="zipfast-button flex-1"
            >
              <Zap className="w-5 h-5 mr-2" />
              Comprimir Agora
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompressionProgress;
