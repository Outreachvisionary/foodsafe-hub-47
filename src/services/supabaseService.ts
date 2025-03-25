
import { supabase } from "@/integrations/supabase/client";
import { 
  Document, 
  Folder,
  DocumentCategory,
  DocumentActivity,
  DocumentNotification,
  DocumentVersion
} from "@/types/supabase";

// Folders
export const fetchFolders = async (): Promise<Folder[]> => {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
  
  return data || [];
};

// Document Categories
export const fetchCategories = async (): Promise<DocumentCategory[]> => {
  const { data, error } = await supabase
    .from('document_categories')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data || [];
};

// Documents
export const fetchDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
  
  return data || [];
};

export const fetchDocumentsByFolder = async (folderId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('folder_id', folderId)
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching documents by folder:', error);
    return [];
  }
  
  return data || [];
};

export const createDocument = async (document: Partial<Document>): Promise<Document | null> => {
  const { data, error } = await supabase
    .from('documents')
    .insert([document])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating document:', error);
    return null;
  }
  
  return data;
};

export const updateDocument = async (id: string, updates: Partial<Document>): Promise<Document | null> => {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating document:', error);
    return null;
  }
  
  return data;
};

export const deleteDocument = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting document:', error);
    return false;
  }
  
  return true;
};

// Document Activities
export const addDocumentActivity = async (activity: Partial<DocumentActivity>): Promise<DocumentActivity | null> => {
  const { data, error } = await supabase
    .from('document_activities')
    .insert([activity])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding document activity:', error);
    return null;
  }
  
  return data;
};

export const fetchDocumentActivities = async (documentId: string): Promise<DocumentActivity[]> => {
  const { data, error } = await supabase
    .from('document_activities')
    .select('*')
    .eq('document_id', documentId)
    .order('timestamp', { ascending: false });
    
  if (error) {
    console.error('Error fetching document activities:', error);
    return [];
  }
  
  return data || [];
};

// Document Notifications
export const fetchNotifications = async (): Promise<DocumentNotification[]> => {
  const { data, error } = await supabase
    .from('document_notifications')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  
  return data || [];
};

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('document_notifications')
    .update({ is_read: true })
    .eq('id', id);
    
  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
  
  return true;
};

// Document Versions
export const addDocumentVersion = async (version: Partial<DocumentVersion>): Promise<DocumentVersion | null> => {
  const { data, error } = await supabase
    .from('document_versions')
    .insert([version])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding document version:', error);
    return null;
  }
  
  return data;
};

export const fetchDocumentVersions = async (documentId: string): Promise<DocumentVersion[]> => {
  const { data, error } = await supabase
    .from('document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version', { ascending: false });
    
  if (error) {
    console.error('Error fetching document versions:', error);
    return [];
  }
  
  return data || [];
};
