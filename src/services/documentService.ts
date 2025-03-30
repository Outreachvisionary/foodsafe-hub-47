
import { supabase } from '@/integrations/supabase/client';
import { 
  Document, 
  DocumentVersion, 
  DocumentWorkflow, 
  DocumentWorkflowStep, 
  DocumentActivity,
  DocumentAccess,
  DocumentStatus,
  DocumentCategory
} from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

const documentService = {
  // Fetch documents with optional filters
  async fetchDocuments(filters?: {
    status?: string;
    category?: string;
    searchTerm?: string;
  }): Promise<Document[]> {
    let query = supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });
      
    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        query = query.eq('status', filters.status as DocumentStatus);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category as DocumentCategory);
      }
      
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }
    }
    
    const { data, error } = await query;
    
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
  async createDocument(document: Partial<Document>): Promise<Document> {
    // Generate ID if not provided
    const documentId = document.id || uuidv4();
    
    // Ensure required fields
    const documentData = {
      id: documentId,
      title: document.title || 'Untitled Document',
      status: (document.status as DocumentStatus) || 'Draft',
      category: (document.category as DocumentCategory) || 'Other',
      file_name: document.file_name || `${documentId}.txt`,
      file_size: document.file_size || 0,
      file_type: document.file_type || 'text/plain',
      version: document.version || 1,
      created_by: document.created_by,
      created_at: document.created_at || new Date().toISOString(),
      updated_at: document.updated_at || new Date().toISOString(),
      ...document
    };
    
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating document:', error);
      throw error;
    }
    
    return data as Document;
  },
  
  // Update an existing document
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    // Add updated_at timestamp if not provided
    const updateData = {
      ...updates,
      updated_at: updates.updated_at || new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating document with ID ${id}:`, error);
      throw error;
    }
    
    // Log document activity
    if (updates.status) {
      await this.createDocumentActivity({
        document_id: id,
        action: `update_status_to_${updates.status}`,
        user_id: updates.created_by || 'system',
        user_name: 'System',
        user_role: 'System',
        comments: `Document status updated to ${updates.status}`
      });
    }
    
    return data as Document;
  },
  
  // Delete a document
  async deleteDocument(id: string): Promise<void> {
    // First delete related records
    try {
      // Delete document versions
      await supabase
        .from('document_versions')
        .delete()
        .eq('document_id', id);
        
      // Delete document activities
      await supabase
        .from('document_activities')
        .delete()
        .eq('document_id', id);
        
      // Delete document editor sessions
      await supabase
        .from('document_editor_sessions')
        .delete()
        .eq('document_id', id);
        
      // Delete document workflow instances
      await supabase
        .from('document_workflow_instances')
        .delete()
        .eq('document_id', id);
        
      // Finally delete the document
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Document versions
  async createDocumentVersion(version: Partial<DocumentVersion>): Promise<DocumentVersion> {
    // Ensure required fields
    const versionData = {
      document_id: version.document_id,
      file_name: version.file_name,
      file_size: version.file_size,
      created_by: version.created_by,
      version: version.version || 1,
      created_at: version.created_at || new Date().toISOString(),
      ...version
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
    
    // Update document's current_version_id
    await this.updateDocument(version.document_id as string, {
      current_version_id: data.id,
      version: version.version || 1
    });
    
    return data as DocumentVersion;
  },
  
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
  
  // Document activities
  async createDocumentActivity(activity: Partial<DocumentActivity>): Promise<DocumentActivity> {
    // Ensure required fields
    const activityData = {
      document_id: activity.document_id,
      action: activity.action,
      user_id: activity.user_id,
      user_name: activity.user_name,
      user_role: activity.user_role,
      timestamp: activity.timestamp || new Date().toISOString(),
      ...activity
    };
    
    const { data, error } = await supabase
      .from('document_activities')
      .insert(activityData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating document activity:', error);
      throw error;
    }
    
    return data as DocumentActivity;
  },
  
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
  
  // Document access control methods
  async fetchAccess(documentId: string): Promise<DocumentAccess[]> {
    const { data, error } = await supabase
      .from('document_access')
      .select('*')
      .eq('document_id', documentId)
      .order('granted_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching access for document ${documentId}:`, error);
      throw error;
    }
    
    return data as DocumentAccess[];
  },
  
  async grantAccess(access: Partial<DocumentAccess>): Promise<DocumentAccess> {
    const accessData = {
      document_id: access.document_id,
      user_id: access.user_id,
      permission_level: access.permission_level,
      granted_by: access.granted_by,
      granted_at: access.granted_at || new Date().toISOString(),
      ...access
    };
    
    const { data, error } = await supabase
      .from('document_access')
      .insert(accessData)
      .select()
      .single();
      
    if (error) {
      console.error('Error granting document access:', error);
      throw error;
    }
    
    return data as DocumentAccess;
  },
  
  async revokeAccess(accessId: string): Promise<void> {
    const { error } = await supabase
      .from('document_access')
      .delete()
      .eq('id', accessId);
      
    if (error) {
      console.error(`Error revoking access with ID ${accessId}:`, error);
      throw error;
    }
  },
  
  // Method for uploadToStorage
  async uploadToStorage(file: File, document: Partial<Document>, versionNumber = 1): Promise<string> {
    const documentId = document.id;
    const fileName = file.name;
    const storagePath = `documents/${documentId}/${fileName}_v${versionNumber}`;
    
    await this.uploadFile(file, storagePath);
    
    // Return the storage path
    return storagePath;
  },
  
  // Method for creating versions
  async createVersion(document: Document, versionDetails: any): Promise<DocumentVersion> {
    const versionNumber = document.version + 1;
    
    const versionData = {
      document_id: document.id,
      version: versionNumber,
      ...versionDetails
    };
    
    // Create version record
    const version = await this.createDocumentVersion(versionData);
    
    // Update document with new version
    await this.updateDocument(document.id, {
      version: versionNumber,
      current_version_id: version.id,
      updated_at: new Date().toISOString()
    });
    
    return version;
  },
  
  // Workflow management
  async submitForApproval(document: Document): Promise<Document> {
    return this.updateDocument(document.id, {
      status: 'Pending Approval',
      pending_since: new Date().toISOString(),
      is_locked: true
    });
  },
  
  async approveDocument(document: Document): Promise<Document> {
    return this.updateDocument(document.id, {
      status: 'Approved',
      pending_since: undefined,
      is_locked: false
    });
  },
  
  async rejectDocument(document: Document, reason: string): Promise<Document> {
    return this.updateDocument(document.id, {
      status: 'Draft',
      pending_since: undefined,
      is_locked: false,
      rejection_reason: reason
    });
  },
  
  async publishDocument(document: Document): Promise<Document> {
    if (document.status !== 'Approved') {
      throw new Error('Document must be approved before publishing');
    }
    
    return this.updateDocument(document.id, {
      status: 'Published'
    });
  },
  
  // Document checkout functionality
  async checkoutDocument(documentId: string, userId: string): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update({
        checkout_user_id: userId,
        checkout_timestamp: new Date().toISOString(),
        is_locked: true
      })
      .eq('id', documentId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error checking out document ${documentId}:`, error);
      throw error;
    }
    
    await this.createDocumentActivity({
      document_id: documentId,
      action: 'checkout',
      user_id: userId,
      user_name: 'User', // Would be populated from user profile
      user_role: 'User', // Would be populated from user profile
      comments: 'Document checked out for editing'
    });
    
    return data as Document;
  },
  
  async checkinDocument(documentId: string, userId: string): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update({
        checkout_user_id: null,
        checkout_timestamp: null,
        is_locked: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .eq('checkout_user_id', userId) // Ensure only the user who checked out can check in
      .select()
      .single();
      
    if (error) {
      console.error(`Error checking in document ${documentId}:`, error);
      throw error;
    }
    
    await this.createDocumentActivity({
      document_id: documentId,
      action: 'checkin',
      user_id: userId,
      user_name: 'User', // Would be populated from user profile
      user_role: 'User', // Would be populated from user profile
      comments: 'Document checked in after editing'
    });
    
    return data as Document;
  }
};

export default documentService;
