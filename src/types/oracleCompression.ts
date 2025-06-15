
export interface CompressionRecord {
  id: string;
  filename: string;
  original_size: number;
  compressed_size: number;
  compression_ratio: number;
  file_count: number;
  created_at: string;
}

export interface CompressionStats {
  totalCompressions: number;
  totalSavings: number;
  totalFiles: number;
}
