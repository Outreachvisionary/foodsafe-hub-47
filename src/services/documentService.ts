
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentFolder, DocumentVersion } from '@/types/document';
import { CrudService } from './crudService';

export class DocumentService extends CrudService {
  // Document operations
  static async getDocuments(filters?: any): Promise<Document[]> {
    return this.fetchRecords<Document>({
      table: 'documents',
      select: '*',
      filters,
      orderBy: { column: 'updated_at', ascending: false }
    });
  }

  static async getDocument(id: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Document | null;
  }

  static async createDocument(data: Partial<Document>): Promise<Document> {
    return this.createRecord<Document>('documents', data);
  }

  static async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    return this.updateRecord<Document>('documents', id, updates);
  }

  static async deleteDocument(id: string): Promise<boolean> {
    return this.deleteRecord('documents', id);
  }

  // Folder operations
  static async getFolders(): Promise<DocumentFolder[]> {
    return this.fetchRecords<DocumentFolder>({
      table: 'document_folders',
      select: '*',
      orderBy: { column: 'name', ascending: true }
    });
  }

  static async createFolder(data: Partial<DocumentFolder>): Promise<DocumentFolder> {
    return this.createRecord<DocumentFolder>('document_folders', data);
  }

  static async updateFolder(id: string, updates: Partial<DocumentFolder>): Promise<DocumentFolder> {
    return this.updateRecord<DocumentFolder>('document_folders', id, updates);
  }

  static async deleteFolder(id: string): Promise<boolean> {
    // Check if folder has documents
    const documents = await this.fetchRecords({
      table: 'documents',
      filters: { folder_id: id },
      limit: 1
    });

    if (documents.length > 0) {
      throw new Error('Cannot delete folder that contains documents');
    }

    return this.deleteRecord('document_folders', id, true); // Hard delete for folders
  }

  // Document workflow operations
  static async submitForReview(documentId: string): Promise<Document> {
    return this.updateDocument(documentId, {
      status: 'Pending Review',
      workflow_status: 'review',
      pending_since: new Date().toISOString()
    });
  }

  static async approveDocument(documentId: string, approverComments?: string): Promise<Document> {
    const updates: Partial<Document> = {
      status: 'Approved',
      workflow_status: 'approved',
      pending_since: null
    };

    // Log approval activity
    await this.logDocumentActivity(documentId, 'approved', approverComments);

    return this.updateDocument(documentId, updates);
  }

  static async rejectDocument(documentId: string, rejectionReason: string): Promise<Document> {
    const updates: Partial<Document> = {
      status: 'Draft',
      workflow_status: 'rejected',
      rejection_reason: rejectionReason,
      pending_since: null
    };

    // Log rejection activity
    await this.logDocumentActivity(documentId, 'rejected', rejectionReason);

    return this.updateDocument(documentId, updates);
  }

  static async publishDocument(documentId: string): Promise<Document> {
    return this.updateDocument(documentId, {
      status: 'Published',
      workflow_status: 'published'
    });
  }

  // Document checkout/checkin
  static async checkoutDocument(documentId: string, userId: string, userName: string): Promise<Document> {
    return this.updateDocument(documentId, {
      checkout_status: 'Checked Out',
      checkout_user_id: userId,
      checkout_user_name: userName,
      checkout_timestamp: new Date().toISOString(),
      is_locked: true
    });
  }

  static async checkinDocument(documentId: string, versionData?: Partial<DocumentVersion>): Promise<Document> {
    const updates: Partial<Document> = {
      checkout_status: 'Available',
      checkout_user_id: null,
      checkout_user_name: null,
      checkout_timestamp: null,
      is_locked: false
    };

    // If version data is provided, increment version
    if (versionData) {
      const document = await this.getDocument(documentId);
      if (document) {
        updates.version = document.version + 1;
        
        // Create new version record
        await this.createRecord('document_versions', {
          document_id: documentId,
          version: updates.version,
          ...versionData
        });
      }
    }

    return this.updateDocument(documentId, updates);
  }

  // Activity logging
  static async logDocumentActivity(
    documentId: string, 
    action: string, 
    comments?: string, 
    userId?: string
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    await this.createRecord('document_activities', {
      document_id: documentId,
      action,
      comments,
      user_id: userId || user?.id,
      user_name: user?.email || 'Unknown',
      timestamp: new Date().toISOString()
    });
  }

  // Search and filter
  static async searchDocuments(query: string, filters?: any): Promise<Document[]> {
    const searchFilters = {
      ...filters,
      title: `%${query}%`
    };

    return this.fetchRecords<Document>({
      table: 'documents',
      select: '*',
      filters: searchFilters,
      orderBy: { column: 'updated_at', ascending: false }
    });
  }

  // Document statistics
  static async getDocumentStats(): Promise<any> {
    const documents = await this.getDocuments();
    
    const stats = {
      total: documents.length,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      expiringCount: 0,
      pendingReviewCount: 0,
      pendingApprovalCount: 0
    };

    documents.forEach(doc => {
      // Status counts
      stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
      
      // Category counts
      stats.byCategory[doc.category] = (stats.byCategory[doc.category] || 0) + 1;
      
      // Expiring documents (within 30 days)
      if (doc.expiry_date) {
        const expiryDate = new Date(doc.expiry_date);
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        if (expiryDate <= thirtyDaysFromNow) {
          stats.expiringCount++;
        }
      }
      
      // Pending counts
      if (doc.status === 'Pending Review') stats.pendingReviewCount++;
      if (doc.status === 'Pending Approval') stats.pendingApprovalCount++;
    });

    return stats;
  }
}

export default DocumentService;
