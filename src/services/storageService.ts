
import { supabase } from '@/integrations/supabase/client';

export interface UploadOptions {
  bucket: 'documents' | 'attachments' | 'profiles';
  folder?: string;
  filename?: string;
  upsert?: boolean;
}

export interface UploadResult {
  path: string;
  url: string;
  error?: string;
}

class StorageService {
  /**
   * Upload a file to the specified bucket
   */
  async uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    try {
      const { bucket, folder = '', filename, upsert = false } = options;
      
      // Generate filename if not provided
      const finalFilename = filename || `${Date.now()}-${file.name}`;
      const filePath = folder ? `${folder}/${finalFilename}` : finalFilename;

      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert,
        });

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        url: urlData.publicUrl,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        path: '',
        url: '',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files: File[], options: UploadOptions): Promise<UploadResult[]> {
    const promises = files.map(file => this.uploadFile(file, options));
    return Promise.all(promises);
  }

  /**
   * Get a signed URL for private file download
   */
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Get signed URL error:', error);
      return null;
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(bucket: string, paths: string[]): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove(paths);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete files error:', error);
      return false;
    }
  }

  /**
   * List files in a bucket/folder
   */
  async listFiles(bucket: string, folder: string = '', limit: number = 100) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit,
          offset: 0,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('List files error:', error);
      return [];
    }
  }

  /**
   * Get public URL for a file (works only for public buckets)
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  /**
   * Check if buckets exist and create them if they don't
   */
  async initializeBuckets(): Promise<void> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const existingBuckets = buckets?.map(b => b.name) || [];

      const bucketsToCreate = [
        { name: 'documents', public: false },
        { name: 'attachments', public: false },
        { name: 'profiles', public: true },
      ];

      for (const bucket of bucketsToCreate) {
        if (!existingBuckets.includes(bucket.name)) {
          const { error } = await supabase.storage.createBucket(bucket.name, {
            public: bucket.public,
            fileSizeLimit: bucket.name === 'profiles' ? 5242880 : 52428800, // 5MB for profiles, 50MB for others
          });

          if (error) {
            console.error(`Error creating bucket ${bucket.name}:`, error);
          } else {
            console.log(`Bucket ${bucket.name} created successfully`);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing buckets:', error);
    }
  }
}

export const storageService = new StorageService();

// Initialize buckets on service creation
storageService.initializeBuckets();

export default storageService;
