
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

interface DownloadHandlerProps {
  compressedBlob: Blob | null;
  downloadCompressed: (filename: string) => void;
}

export const useDownloadHandler = ({ compressedBlob, downloadCompressed }: DownloadHandlerProps) => {
  const { toast } = useToast();
  const { trackDownload } = useAnalytics();

  const handleDownload = () => {
    if (compressedBlob) {
      const filename = `zipfast_${Date.now()}.zip`;
      downloadCompressed(filename);
      trackDownload(filename, compressedBlob.size);
      
      toast({
        title: "📥 Download iniciado!",
        description: "Seu arquivo ZIP está sendo baixado.",
      });
    }
  };

  return { handleDownload };
};
