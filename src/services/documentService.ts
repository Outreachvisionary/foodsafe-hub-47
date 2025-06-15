
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';
import { DocumentStatus, DocumentCategory, CheckoutStatus } from '@/types/enums';
import { stringToDocumentStatus, stringToDocumentCategory, stringToCheckoutStatus } from '@/utils/documentAdapters';

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
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          ...document,
          status: document.status || DocumentStatus.Draft,
          category: document.category || DocumentCategory.Other,
          checkout_status: CheckoutStatus.Available,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
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
      const { data, error } = await supabase
        .from('documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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
