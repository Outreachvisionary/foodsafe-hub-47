
import { supabase } from '@/integrations/supabase/client';
import { NCAttachment } from '@/types/non-conformance';

export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  const { data, error } = await supabase
    .from('nc_attachments')
    .select('*')
    .eq('non_conformance_id', nonConformanceId);
  
  if (error) {
    console.error(`Error fetching attachments for non-conformance ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data as NCAttachment[];
};

export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  userId: string
): Promise<NCAttachment> => {
  // Generate unique path for the file
  const filePath = `non-conformance/${nonConformanceId}/${Date.now()}_${file.name}`;
  
  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading attachment:', uploadError);
    throw uploadError;
  }
  
  // Create database record for the attachment
  const { data, error } = await supabase
    .from('nc_attachments')
    .insert({
      non_conformance_id: nonConformanceId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_path: filePath,
      description,
      uploaded_by: userId
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating attachment record:', error);
    throw error;
  }
  
  return data as NCAttachment;
};

export const deleteNCAttachment = async (id: string, filePath: string): Promise<void> => {
  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('attachments')
    .remove([filePath]);
  
  if (storageError) {
    console.error(`Error deleting attachment file:`, storageError);
    throw storageError;
  }
  
  // Delete record from database
  const { error } = await supabase
    .from('nc_attachments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting attachment record:`, error);
    throw error;
  }
};
