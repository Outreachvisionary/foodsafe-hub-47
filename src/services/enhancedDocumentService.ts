
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion, DocumentWorkflow, DocumentActivity } from '@/types/document';

// Base document service for Supabase operations
const enhancedDocumentService = {
  // Fetch all documents
  async fetchDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
    
    return data as Document[];
  },
  
  // Fetch a single document by ID
  async fetchDocumentById(id: string): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      throw error;
    }
    
    return data as Document;
  },
  
  // Create a new document
  async createDocument(document: Omit<Document, 'id'>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document:', error);
      throw error;
    }
    
    return data as Document;
  },
  
  // Update a document
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating document with ID ${id}:`, error);
      throw error;
    }
    
    return data as Document;
  },
  
  // Delete a document
  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
      throw error;
    }
  },

  // Document versions
  async fetchDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    const { data, error } = await supabase
      .from('document_versions')
      .select('*')
      .eq('document_id', documentId)
      .order('version', { ascending: false });
    
    if (error) {
      console.error(`Error fetching versions for document ${documentId}:`, error);
      throw error;
    }
    
    return data as DocumentVersion[];
  },
  
  // Create a new document version
  async createDocumentVersion(version: Omit<DocumentVersion, 'id'>): Promise<DocumentVersion> {
    const { data, error } = await supabase
      .from('document_versions')
      .insert(version)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document version:', error);
      throw error;
    }
    
    return data as DocumentVersion;
  },

  // Document activities
  async fetchDocumentActivities(documentId: string): Promise<DocumentActivity[]> {
    const { data, error } = await supabase
      .from('document_activities')
      .select('*')
      .eq('documentId', documentId)
      .order('performedAt', { ascending: false });
    
    if (error) {
      console.error(`Error fetching activities for document ${documentId}:`, error);
      throw error;
    }
    
    return data as DocumentActivity[];
  },
  
  // Create a document activity
  async createDocumentActivity(activity: Omit<DocumentActivity, 'id'>): Promise<DocumentActivity> {
    const { data, error } = await supabase
      .from('document_activities')
      .insert(activity)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document activity:', error);
      throw error;
    }
    
    return data as DocumentActivity;
  },

  // Document workflows
  async fetchDocumentWorkflows(): Promise<DocumentWorkflow[]> {
    const { data, error } = await supabase
      .from('document_workflows')
      .select('*');
    
    if (error) {
      console.error('Error fetching document workflows:', error);
      throw error;
    }
    
    return data as DocumentWorkflow[];
  },
  
  // Create or update a document workflow
  async saveDocumentWorkflow(workflow: Partial<DocumentWorkflow>): Promise<DocumentWorkflow> {
    const { id, ...workflowData } = workflow;
    
    if (id) {
      // Update existing workflow
      const { data, error } = await supabase
        .from('document_workflows')
        .update(workflowData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating workflow ${id}:`, error);
        throw error;
      }
      
      return data as DocumentWorkflow;
    } else {
      // Create new workflow
      const { data, error } = await supabase
        .from('document_workflows')
        .insert(workflowData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating workflow:', error);
        throw error;
      }
      
      return data as DocumentWorkflow;
    }
  },

  // File storage operations
  getStoragePath(document: Document): string {
    return `documents/${document.id}/${document.file_name}`;
  },
  
  async getDownloadUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('attachments')
      .createSignedUrl(path, 60); // URL valid for 60 seconds
    
    if (error) {
      console.error(`Error getting download URL for ${path}:`, error);
      throw error;
    }
    
    return data.signedUrl;
  },
  
  async uploadFile(file: File, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('attachments')
      .upload(path, file);
    
    if (error) {
      console.error(`Error uploading file to ${path}:`, error);
      throw error;
    }
  }
};

export default enhancedDocumentService;
