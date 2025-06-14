
export interface CloudProvider {
  id: 'gdrive' | 'dropbox' | 'onedrive';
  name: string;
  icon: string;
  connected: boolean;
  email?: string;
}

export interface CloudUploadOptions {
  provider: CloudProvider['id'];
  folder?: string;
  filename?: string;
  compress?: boolean;
}

export interface CloudUploadProgress {
  provider: CloudProvider['id'];
  filename: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export class CloudService {
  private providers: CloudProvider[] = [
    {
      id: 'gdrive',
      name: 'Google Drive',
      icon: '📁',
      connected: false
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '📦',
      connected: false
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '☁️',
      connected: false
    }
  ];

  private uploadProgress: CloudUploadProgress[] = [];
  private onProgressCallback?: (progress: CloudUploadProgress[]) => void;

  constructor(onProgressCallback?: (progress: CloudUploadProgress[]) => void) {
    this.onProgressCallback = onProgressCallback;
    this.loadConnectedProviders();
  }

  private loadConnectedProviders(): void {
    const savedProviders = localStorage.getItem('zipfast_cloud_providers');
    if (savedProviders) {
      const parsedProviders = JSON.parse(savedProviders);
      this.providers = this.providers.map(provider => {
        const saved = parsedProviders.find((p: any) => p.id === provider.id);
        return saved ? { ...provider, ...saved } : provider;
      });
    }
  }

  private saveConnectedProviders(): void {
    localStorage.setItem('zipfast_cloud_providers', JSON.stringify(this.providers));
  }

  getProviders(): CloudProvider[] {
    return this.providers;
  }

  getConnectedProviders(): CloudProvider[] {
    return this.providers.filter(p => p.connected);
  }

  async connectProvider(providerId: CloudProvider['id'], email: string): Promise<void> {
    // Simular conexão OAuth
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      provider.connected = true;
      provider.email = email;
      this.saveConnectedProviders();
    }
    
    console.log(`Connected to ${providerId} with email: ${email}`);
  }

  disconnectProvider(providerId: CloudProvider['id']): void {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      provider.connected = false;
      provider.email = undefined;
      this.saveConnectedProviders();
    }
    
    console.log(`Disconnected from ${providerId}`);
  }

  async uploadFile(file: Blob, options: CloudUploadOptions): Promise<string> {
    const provider = this.providers.find(p => p.id === options.provider);
    if (!provider?.connected) {
      throw new Error(`Provider ${options.provider} not connected`);
    }

    const filename = options.filename || `zipfast_${Date.now()}.zip`;
    const progress: CloudUploadProgress = {
      provider: options.provider,
      filename,
      progress: 0,
      status: 'uploading'
    };

    this.uploadProgress.push(progress);
    this.onProgressCallback?.(this.uploadProgress);

    try {
      // Simular upload com progresso
      for (let i = 0; i <= 100; i += 10) {
        progress.progress = i;
        this.onProgressCallback?.(this.uploadProgress);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      progress.status = 'completed';
      this.onProgressCallback?.(this.uploadProgress);

      // Simular URL de compartilhamento
      const shareUrl = `https://${options.provider}.com/share/${filename}`;
      console.log(`File uploaded to ${options.provider}: ${shareUrl}`);
      
      return shareUrl;
    } catch (error) {
      progress.status = 'error';
      progress.error = error instanceof Error ? error.message : 'Upload failed';
      this.onProgressCallback?.(this.uploadProgress);
      throw error;
    }
  }

  clearUploadHistory(): void {
    this.uploadProgress = [];
    this.onProgressCallback?.(this.uploadProgress);
  }

  getUploadHistory(): CloudUploadProgress[] {
    return this.uploadProgress;
  }
}

export const cloudService = new CloudService();
