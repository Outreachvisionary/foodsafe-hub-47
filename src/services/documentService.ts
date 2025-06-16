

import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';

// Database to TypeScript enum mapping functions
const mapDatabaseStatus = (dbStatus: string): string => {
  const statusMap: Record<string, string> = {
    'Pending Approval': 'Pending_Approval',
    'Pending Review': 'Pending_Review',
    'In Review': 'In_Review',
    'Checked Out': 'Checked_Out',
    'Audit Report': 'Audit_Report',
    'HACCP Plan': 'HACCP_Plan',
    'Training Material': 'Training_Material',
    'Supplier Documentation': 'Supplier_Documentation',
    'Risk Assessment': 'Risk_Assessment'
  };
  return statusMap[dbStatus] || dbStatus;
};

const mapTypeScriptStatus = (tsStatus: string): string => {
  const statusMap: Record<string, string> = {
    'Pending_Approval': 'Pending Approval',
    'Pending_Review': 'Pending Review',
    'In_Review': 'In Review',
    'Checked_Out': 'Checked Out',
    'Audit_Report': 'Audit Report',
    'HACCP_Plan': 'HACCP Plan',
    'Training_Material': 'Training Material',
    'Supplier_Documentation': 'Supplier Documentation',
    'Risk_Assessment': 'Risk Assessment'
  };
  return statusMap[tsStatus] || tsStatus;
};

export const documentService = {
  async getDocuments(): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      // Transform database data to match our types
      return (data || []).map(doc => ({
        ...doc,
        status: mapDatabaseStatus(doc.status || 'Draft') as any,
        category: mapDatabaseStatus(doc.category || 'Other') as any,
        checkout_status: mapDatabaseStatus(doc.checkout_status || 'Available') as any,
        tags: doc.tags || [],
        approvers: doc.approvers || []
      }));
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      throw error;
    }
  },

  async createDocument(document: Partial<Document>): Promise<Document> {
    try {
      const dbDocument = {
        title: document.title || '',
        description: document.description,
        file_name: document.file_name || '',
        file_path: document.file_path,
        file_type: document.file_type || '',
        file_size: document.file_size || 0,
        category: mapTypeScriptStatus(document.category || 'Other') as any,
        status: mapTypeScriptStatus(document.status || 'Draft') as any,
        version: document.version || 1,
        created_by: document.created_by || '',
        checkout_status: mapTypeScriptStatus(document.checkout_status || 'Available') as any,
        tags: document.tags || [],
        approvers: document.approvers || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('documents')
        .insert(dbDocument)
        .select()
        .single();

      if (error) {
        console.error('Error creating document:', error);
        throw error;
      }

      return {
        ...data,
        status: mapDatabaseStatus(data.status || 'Draft') as any,
        category: mapDatabaseStatus(data.category || 'Other') as any,
        checkout_status: mapDatabaseStatus(data.checkout_status || 'Available') as any,
        tags: data.tags || [],
        approvers: data.approvers || []
      };
    } catch (error) {
      console.error('Failed to create document:', error);
      throw error;
    }
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    try {
      const dbUpdates = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Convert TypeScript enums to database format
      if (dbUpdates.status) {
        dbUpdates.status = mapTypeScriptStatus(dbUpdates.status) as any;
      }
      if (dbUpdates.category) {
        dbUpdates.category = mapTypeScriptStatus(dbUpdates.category) as any;
      }
      if (dbUpdates.checkout_status) {
        dbUpdates.checkout_status = mapTypeScriptStatus(dbUpdates.checkout_status) as any;
      }

      // Remove undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(dbUpdates).filter(([_, value]) => value !== undefined)
      );

      const { data, error } = await supabase
        .from('documents')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating document:', error);
        throw error;
      }

      return {
        ...data,
        status: mapDatabaseStatus(data.status || 'Draft') as any,
        category: mapDatabaseStatus(data.category || 'Other') as any,
        checkout_status: mapDatabaseStatus(data.checkout_status || 'Available') as any,
        tags: data.tags || [],
        approvers: data.approvers || []
      };
    } catch (error) {
      console.error('Failed to update document:', error);
      throw error;
    }
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting document:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  }
};

// Export for backward compatibility
export const fetchDocuments = documentService.getDocuments;

