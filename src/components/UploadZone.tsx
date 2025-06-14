
import React, { useCallback, useState } from 'react';
import { Upload, FolderOpen, FileText, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FileData {
  name: string;
  size: number;
  type: string;
}

interface UploadZoneProps {
  onFilesSelected: (files: FileData[]) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const items = Array.from(e.dataTransfer.items);
    const files: FileData[] = [];

    items.forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push({
            name: file.name,
            size: file.size,
            type: file.type || 'unknown'
          });
        }
      }
    });

    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const files: FileData[] = Array.from(fileList).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type || 'unknown'
    }));

    onFilesSelected(files);
  }, [onFilesSelected]);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <ImageIcon className="w-6 h-6 text-green-500" />;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
      return <FileText className="w-6 h-6 text-blue-500" />;
    }
    return <FolderOpen className="w-6 h-6 text-purple-500" />;
  };

  return (
    <Card className={`zipfast-card transition-all duration-300 ${
      isDragOver ? 'border-zipfast-blue bg-blue-50/50 scale-102' : ''
    }`}>
      <div
        className="p-12 text-center cursor-pointer"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transition-all duration-300 ${
            isDragOver ? 'bg-zipfast-gradient animate-zip-bounce' : 'bg-gray-100'
          }`}>
            <Upload className={`w-10 h-10 ${isDragOver ? 'text-white' : 'text-gray-400'}`} />
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4">
          {isDragOver ? 'Solte seus arquivos aqui!' : 'Arraste arquivos ou pastas'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          Suportamos todos os tipos de arquivos e <strong>pastas completas</strong>
          <br />
          <span className="text-sm">Limite gratuito: 500MB por operação</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <label className="zipfast-button cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            Selecionar Arquivos
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept="*/*"
            />
          </label>
          
          <span className="text-gray-400">ou</span>
          
          <label className="bg-white border-2 border-zipfast-purple text-zipfast-purple font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:bg-zipfast-purple hover:text-white cursor-pointer">
            <FolderOpen className="w-5 h-5 mr-2 inline" />
            Selecionar Pasta
            <input
              type="file"
              webkitdirectory="true"
              directory="true"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>

        <div className="flex justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {getFileIcon('document.pdf')}
            <span>Documentos</span>
          </div>
          <div className="flex items-center gap-2">
            {getFileIcon('image.jpg')}
            <span>Imagens</span>
          </div>  
          <div className="flex items-center gap-2">
            {getFileIcon('folder')}
            <span>Pastas</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UploadZone;
