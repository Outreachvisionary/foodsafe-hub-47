
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a file to Supabase Storage with retry capability
 * @param file The file to upload
 * @param bucketName The storage bucket name
 * @param filePath The path within the bucket
 * @param options Upload options
 * @returns The upload result data
 */
export const uploadFileWithRetry = async (
  file: File,
  bucketName: string,
  filePath: string,
  options?: {
    maxRetries?: number;
    upsert?: boolean;
    cacheControl?: string;
    progressCallback?: (progress: number) => void;
  }
): Promise<{
  path: string;
  url?: string;
}> => {
  const {
    maxRetries = 3,
    upsert = false,
    cacheControl = '3600',
    progressCallback
  } = options || {};
  
  let attempt = 0;
  let lastError: Error | null = null;
  
  // Validate inputs
  if (!file) throw new Error('No file provided for upload');
  if (!bucketName) throw new Error('No bucket name provided');
  if (!filePath) throw new Error('No file path provided');
  
  while (attempt < maxRetries) {
    attempt++;
    try {
      console.log(`Upload attempt ${attempt}/${maxRetries} for file:`, filePath);
      
      // Verify bucket exists before attempting upload
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucketName);
      
      if (!bucketExists) {
        throw new Error(`Storage bucket "${bucketName}" does not exist`);
      }
      
      // Perform the upload
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl,
          upsert,
        });
      
      if (error) throw error;
      
      // Get public URL if upload succeeded
      let url: string | undefined;
      try {
        const { data: urlData } = await supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        
        url = urlData.publicUrl;
      } catch (urlError) {
        console.warn('Could not generate public URL for uploaded file', urlError);
      }
      
      // Success - return the result
      if (progressCallback) progressCallback(100);
      
      return {
        path: data.path,
        url
      };
    } catch (err) {
      lastError = err as Error;
      console.error(`Upload attempt ${attempt} failed:`, err);
      
      // Update progress to indicate retry
      if (progressCallback) {
        progressCallback(Math.floor((attempt / maxRetries) * 50)); // Max 50% on retries
      }
      
      // Only retry if we haven't exceeded max attempts
      if (attempt >= maxRetries) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  // If we get here, all retries failed
  throw new Error(`Failed to upload file after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Downloads a file from Supabase Storage
 * @param bucketName The storage bucket name
 * @param filePath The path within the bucket
 * @returns The file data
 */
export const downloadFile = async (
  bucketName: string,
  filePath: string
): Promise<Blob> => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(filePath);
  
  if (error) {
    throw error;
  }
  
  if (!data) {
    throw new Error('No data returned from download');
  }
  
  return data;
};

/**
 * Gets a public or signed URL for a file
 * @param bucketName The storage bucket name
 * @param filePath The path within the bucket
 * @param options Options for the URL generation
 * @returns The URL to the file
 */
export const getFileUrl = async (
  bucketName: string,
  filePath: string,
  options?: {
    expiresIn?: number; // Seconds
    transform?: {
      width?: number;
      height?: number;
      resize?: 'cover' | 'contain' | 'fill';
      format?: 'origin' | 'webp' | 'avif';
      quality?: number;
    };
  }
): Promise<string> => {
  try {
    // Try to get a public URL first (for public buckets)
    const { data: publicUrlData } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath, options?.transform ? { transform: options.transform } : undefined);
    
    if (publicUrlData?.publicUrl) {
      return publicUrlData.publicUrl;
    }
    
    // If that doesn't work, get a signed URL
    const { data: signedUrlData, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, options?.expiresIn || 3600, options?.transform ? { transform: options.transform } : undefined);
    
    if (error) throw error;
    
    if (signedUrlData?.signedUrl) {
      return signedUrlData.signedUrl;
    }
    
    throw new Error('Could not generate URL for file');
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * Lists files in a storage bucket
 * @param bucketName The storage bucket name
 * @param path The path within the bucket
 * @param options Listing options
 * @returns The list of files
 */
export const listFiles = async (
  bucketName: string,
  path: string = '',
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: 'asc' | 'desc' };
  }
): Promise<{
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}[]> => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(path, options);
  
  if (error) {
    throw error;
  }
  
  return data || [];
};
