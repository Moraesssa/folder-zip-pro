
import React, { useState } from 'react';
import { Cloud, Link, Upload, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCloudUpload } from '@/hooks/useCloudUpload';
import { CloudProvider } from '@/services/cloudService';
import { useToast } from '@/hooks/use-toast';

interface CloudIntegrationProps {
  compressedBlob?: Blob | null;
  onUploadComplete?: (shareUrl: string) => void;
}

const CloudIntegration: React.FC<CloudIntegrationProps> = ({ 
  compressedBlob, 
  onUploadComplete 
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [connectEmail, setConnectEmail] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [uploadFolder, setUploadFolder] = useState('ZipFast');
  const [customFilename, setCustomFilename] = useState('');

  const { toast } = useToast();
  const {
    connectedProviders,
    uploadProgress,
    isUploading,
    error,
    connectProvider,
    disconnectProvider,
    uploadToCloud,
    getProviders
  } = useCloudUpload();

  const allProviders = getProviders();

  const handleConnect = async () => {
    if (!selectedProvider || !connectEmail) return;
    
    setIsConnecting(true);
    const success = await connectProvider(selectedProvider as CloudProvider['id'], connectEmail);
    
    if (success) {
      toast({
        title: "✅ Provedor conectado!",
        description: `Conectado com sucesso ao ${allProviders.find(p => p.id === selectedProvider)?.name}`,
      });
      setSelectedProvider('');
      setConnectEmail('');
    } else {
      toast({
        title: "❌ Erro na conexão",
        description: error || "Não foi possível conectar ao provedor",
        variant: "destructive"
      });
    }
    
    setIsConnecting(false);
  };

  const handleUpload = async (providerId: CloudProvider['id']) => {
    if (!compressedBlob) return;

    const filename = customFilename || `zipfast_${Date.now()}.zip`;
    
    const shareUrl = await uploadToCloud(compressedBlob, {
      provider: providerId,
      folder: uploadFolder,
      filename
    });

    if (shareUrl) {
      toast({
        title: "☁️ Upload concluído!",
        description: `Arquivo enviado para ${allProviders.find(p => p.id === providerId)?.name}`,
      });
      onUploadComplete?.(shareUrl);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-zipfast-blue" />
          Integração com Nuvem
        </CardTitle>
        <CardDescription>
          Conecte-se aos seus serviços de nuvem para salvar arquivos diretamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provedores Conectados */}
        {connectedProviders.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Contas Conectadas</h4>
            <div className="grid gap-3">
              {connectedProviders.map((provider) => (
                <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-gray-500">{provider.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {compressedBlob && (
                      <Button
                        size="sm"
                        onClick={() => handleUpload(provider.id)}
                        disabled={isUploading}
                        className="zipfast-button"
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        Enviar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => disconnectProvider(provider.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configurações de Upload */}
        {compressedBlob && connectedProviders.length > 0 && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">Configurações de Upload</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="folder">Pasta de Destino</Label>
                <Input
                  id="folder"
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  placeholder="ZipFast"
                />
              </div>
              <div>
                <Label htmlFor="filename">Nome do Arquivo (opcional)</Label>
                <Input
                  id="filename"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  placeholder="meu_arquivo.zip"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conectar Novo Provedor */}
        <div>
          <h4 className="font-medium mb-3">Conectar Novo Provedor</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="provider">Selecionar Provedor</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um provedor" />
                </SelectTrigger>
                <SelectContent>
                  {allProviders
                    .filter(p => !p.connected)
                    .map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center gap-2">
                          <span>{provider.icon}</span>
                          {provider.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProvider && (
              <div>
                <Label htmlFor="email">Email da Conta</Label>
                <Input
                  id="email"
                  type="email"
                  value={connectEmail}
                  onChange={(e) => setConnectEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            )}

            <Button
              onClick={handleConnect}
              disabled={!selectedProvider || !connectEmail || isConnecting}
              className="w-full zipfast-button"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Conectar Provedor
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progresso de Upload */}
        {uploadProgress.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Progresso de Upload</h4>
            <div className="space-y-2">
              {uploadProgress.map((progress, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{progress.filename}</span>
                      <span className="text-xs text-gray-500">
                        {allProviders.find(p => p.id === progress.provider)?.name}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-zipfast-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  </div>
                  {progress.status === 'completed' && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {progress.status === 'error' && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CloudIntegration;
