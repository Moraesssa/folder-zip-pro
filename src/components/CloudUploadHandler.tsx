
import { useAuth } from '@/contexts/AuthContext';

interface CloudUploadHandlerProps {
  compressedBlob: Blob | null;
}

export const useCloudUploadHandler = ({ compressedBlob }: CloudUploadHandlerProps) => {
  const { user } = useAuth();

  const handleCloudUploadComplete = (shareUrl: string) => {
    if (user && compressedBlob) {
      const existingHistory = JSON.parse(localStorage.getItem(`zipfast_history_${user.id}`) || '[]');
      const updatedHistory = existingHistory.map((record: any) => {
        if (record.id === `compression_${Date.now()}`) {
          return {
            ...record,
            cloudUploads: [
              ...(record.cloudUploads || []),
              {
                provider: 'gdrive',
                shareUrl,
                uploadedAt: Date.now()
              }
            ]
          };
        }
        return record;
      });
      localStorage.setItem(`zipfast_history_${user.id}`, JSON.stringify(updatedHistory));
    }
  };

  return { handleCloudUploadComplete };
};
