
import React from 'react';
import { CompressionStats } from '@/types/oracleCompression';

interface CompressionStatsProps {
  stats: CompressionStats;
}

const CompressionStatsDisplay: React.FC<CompressionStatsProps> = ({ stats }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <span>
      {stats.totalCompressions} compressões • {stats.totalFiles} arquivos • {formatFileSize(stats.totalSavings)} economizados
    </span>
  );
};

export default CompressionStatsDisplay;
