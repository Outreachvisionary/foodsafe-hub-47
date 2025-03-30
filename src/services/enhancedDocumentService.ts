import { supabase } from '@/integrations/supabase/client';
import { 
  Document, 
  DocumentVersion, 
  DocumentWorkflow, 
  DocumentWorkflowStep, 
  DocumentActivity,
  parseWorkflowSteps
} from '@/types/document';
import { Json } from '@/integrations/supabase/types';

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

  // Document versions with enhanced metadata support
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
  
  // Create a new document version with enhanced metadata
  async createDocumentVersion(version: Omit<DocumentVersion, 'id'>): Promise<DocumentVersion> {
    // Ensure version is defined and properly typed
    const versionData = {
      document_id: version.document_id,
      file_name: version.file_name,
      file_size: version.file_size,
      file_type: version.file_type,
      created_by: version.created_by,
      change_notes: version.change_notes || version.change_summary,
      version: version.version ?? 1, // Ensure version is always provided
      editor_metadata: version.editor_metadata || null,
      is_binary_file: version.is_binary_file || false
    };
    
    const { data, error } = await supabase
      .from('document_versions')
      .insert(versionData)
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
      .eq('document_id', documentId)
      .order('timestamp', { ascending: false });
    
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
    
    // Convert the JSON steps to our typed DocumentWorkflowStep[]
    return data.map(workflow => ({
      ...workflow,
      steps: parseWorkflowSteps(workflow.steps)
    })) as DocumentWorkflow[];
  },
  
  // Create or update a document workflow
  async saveDocumentWorkflow(workflow: Partial<DocumentWorkflow>): Promise<DocumentWorkflow> {
    const { id, ...workflowData } = workflow;
    
    // Convert DocumentWorkflowStep[] to Json for database storage
    const dbWorkflowData = {
      ...workflowData,
      steps: workflowData.steps ? JSON.stringify(workflowData.steps) : undefined
    };
    
    if (id) {
      // Update existing workflow
      const { data, error } = await supabase
        .from('document_workflows')
        .update({
          name: dbWorkflowData.name,
          description: dbWorkflowData.description,
          steps: dbWorkflowData.steps as unknown as Json,
          updated_at: new Date().toISOString(),
          created_by: dbWorkflowData.created_by || 'system'
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating workflow ${id}:`, error);
        throw error;
      }
      
      return {
        ...data,
        steps: parseWorkflowSteps(data.steps)
      } as DocumentWorkflow;
    } else {
      // Create new workflow
      const { data, error } = await supabase
        .from('document_workflows')
        .insert({
          name: dbWorkflowData.name || 'New Workflow',
          description: dbWorkflowData.description || '',
          steps: dbWorkflowData.steps as unknown as Json,
          created_by: dbWorkflowData.created_by || 'system'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating workflow:', error);
        throw error;
      }
      
      return {
        ...data,
        steps: parseWorkflowSteps(data.steps)
      } as DocumentWorkflow;
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
  },

  // Editor sessions management
  async createEditorSession(documentId: string, userId: string): Promise<string> {
    const { data, error } = await supabase
      .from('document_editor_sessions')
      .insert({
        document_id: documentId,
        user_id: userId,
        is_active: true
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating editor session:', error);
      throw error;
    }
    
    return data.id;
  },
  
  async updateEditorSession(sessionId: string, sessionData: any): Promise<void> {
    const { error } = await supabase
      .from('document_editor_sessions')
      .update({
        last_activity: new Date().toISOString(),
        session_data: sessionData
      })
      .eq('id', sessionId);
      
    if (error) {
      console.error('Error updating editor session:', error);
      throw error;
    }
  },
  
  async closeEditorSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('document_editor_sessions')
      .update({
        is_active: false,
        last_activity: new Date().toISOString()
      })
      .eq('id', sessionId);
      
    if (error) {
      console.error('Error closing editor session:', error);
      throw error;
    }
  },
  
  async getActiveEditorSessions(documentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('document_editor_sessions')
      .select('*')
      .eq('document_id', documentId)
      .eq('is_active', true);
      
    if (error) {
      console.error('Error fetching active editor sessions:', error);
      throw error;
    }
    
    return data;
  },
  
  // Office document special handling
  detectDocumentType(fileName: string, mimeType: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['doc', 'docx'].includes(extension || '') || 
        mimeType.includes('word') || 
        mimeType === 'application/msword' || 
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'word';
    }
    
    if (['xls', 'xlsx'].includes(extension || '') || 
        mimeType.includes('excel') || 
        mimeType === 'application/vnd.ms-excel' || 
        mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return 'excel';
    }
    
    if (['ppt', 'pptx'].includes(extension || '') || 
        mimeType.includes('powerpoint') || 
        mimeType === 'application/vnd.ms-powerpoint' || 
        mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return 'powerpoint';
    }
    
    if (['pdf'].includes(extension || '') || mimeType === 'application/pdf') {
      return 'pdf';
    }
    
    return 'other';
  }
};

export default enhancedDocumentService;
