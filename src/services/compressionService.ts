
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface FileData {
  name: string;
  size: number;
  type: string;
  file?: File;
}

export class CompressionService {
  private zip = new JSZip();
  private onProgress?: (progress: number) => void;

  constructor(onProgressCallback?: (progress: number) => void) {
    this.onProgress = onProgressCallback;
  }

  async compressFiles(files: FileData[]): Promise<Blob> {
    this.zip = new JSZip();
    
    const totalFiles = files.length;
    let processedFiles = 0;

    for (const fileData of files) {
      if (fileData.file) {
        // Simular progresso de leitura do arquivo
        await this.addFileToZip(fileData.file);
        processedFiles++;
        
        const progress = Math.round((processedFiles / totalFiles) * 85); // 85% para compressão
        this.onProgress?.(progress);
        
        // Pequeno delay para mostrar progresso
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Fase de finalização (15% restante)
    this.onProgress?.(90);
    const zipBlob = await this.zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    
    this.onProgress?.(100);
    return zipBlob;
  }

  private async addFileToZip(file: File): Promise<void> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.zip.file(file.name, e.target.result);
        }
        resolve();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  downloadZip(zipBlob: Blob, filename: string = 'compressed_files.zip'): void {
    saveAs(zipBlob, filename);
  }

  calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  }
}
