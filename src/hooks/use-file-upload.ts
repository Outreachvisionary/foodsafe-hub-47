import { useState } from 'react';
import { useToast } from './use-toast';

interface FileUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const { maxSizeMB = 10, allowedTypes = [] } = options;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file size (default 10MB limit)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        message: `File size exceeds the ${maxSizeMB}MB limit.`
      };
    }

    // Check file type if allowedTypes is specified
    if (allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const mimeType = file.type.toLowerCase();
      
      // Check if either the extension or mime type is allowed
      const isAllowedType = allowedTypes.some(type => {
        // Check if it's a mime type pattern (contains '/')
        if (type.includes('/')) {
          // Handle wildcards like 'image/*'
          if (type.endsWith('/*')) {
            const typeCategory = type.split('/')[0];
            return mimeType.startsWith(`${typeCategory}/`);
          }
          return mimeType === type;
        } 
        // Otherwise treat it as a file extension
        return fileExtension === type.toLowerCase().replace('.', '');
      });

      if (!isAllowedType) {
        return {
          valid: false,
          message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        };
      }
    }

    return { valid: true };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);
      
      if (!validation.valid) {
        setError(validation.message || 'Invalid file');
        toast({
          title: "Invalid file",
          description: validation.message || 'The selected file is invalid.',
          variant: 'destructive',
        });
        // Reset the input
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return {
    file,
    setFile,
    loading,
    setLoading,
    error,
    handleFileChange,
    clearFile,
    validateFile
  };
}
