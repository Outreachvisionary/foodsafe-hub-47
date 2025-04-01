
import { supabase } from '@/integrations/supabase/client';

// Initialize storage bucket if it doesn't exist
export const initializeStorageBuckets = async (): Promise<void> => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'attachments');
    
    if (!bucketExists) {
      // Create attachments bucket
      const { error } = await supabase.storage.createBucket('attachments', {
        public: true, // Make bucket publicly accessible for file downloads
        fileSizeLimit: 10485760, // 10MB limit
      });
      
      if (error) {
        console.error('Error creating attachments bucket:', error);
      } else {
        console.log('Attachments bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
  }
};

// Call initialization on module load
initializeStorageBuckets();
