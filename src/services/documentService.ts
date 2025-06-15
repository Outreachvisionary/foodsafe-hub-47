
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';
import { DocumentStatus, DocumentCategory, CheckoutStatus } from '@/types/enums';
import { stringToDocumentStatus, stringToDocumentCategory, stringToCheckoutStatus, documentStatusToDbString, documentCategoryToDbString, checkoutStatusToDbString } from '@/utils/documentAdapters';

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
        status: stringToDocumentStatus(doc.status),
        category: stringToDocumentCategory(doc.category),
        checkout_status: stringToCheckoutStatus(doc.checkout_status),
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
        ...document,
        status: documentStatusToDbString(document.status || DocumentStatus.Draft),
        category: documentCategoryToDbString(document.category || DocumentCategory.Other),
        checkout_status: checkoutStatusToDbString(CheckoutStatus.Available),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('documents')
        .insert([dbDocument])
        .select()
        .single();

      if (error) {
        console.error('Error creating document:', error);
        throw error;
      }

      return {
        ...data,
        status: stringToDocumentStatus(data.status),
        category: stringToDocumentCategory(data.category),
        checkout_status: stringToCheckoutStatus(data.checkout_status),
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
        status: updates.status ? documentStatusToDbString(updates.status) : undefined,
        category: updates.category ? documentCategoryToDbString(updates.category) : undefined,
        checkout_status: updates.checkout_status ? checkoutStatusToDbString(updates.checkout_status) : undefined,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(dbUpdates).forEach(key => {
        if (dbUpdates[key as keyof typeof dbUpdates] === undefined) {
          delete dbUpdates[key as keyof typeof dbUpdates];
        }
      });

      const { data, error } = await supabase
        .from('documents')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating document:', error);
        throw error;
      }

      return {
        ...data,
        status: stringToDocumentStatus(data.status),
        category: stringToDocumentCategory(data.category),
        checkout_status: stringToCheckoutStatus(data.checkout_status),
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
