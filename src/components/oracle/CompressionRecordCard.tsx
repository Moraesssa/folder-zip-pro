
import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompressionRecord } from '@/types/oracleCompression';

interface CompressionRecordCardProps {
  record: CompressionRecord;
  onDelete: (id: string) => void;
}

const CompressionRecordCard: React.FC<CompressionRecordCardProps> = ({ record, onDelete }) => {
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

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
          onClick={() => onDelete(record.id)}
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
  );
};

export default CompressionRecordCard;
