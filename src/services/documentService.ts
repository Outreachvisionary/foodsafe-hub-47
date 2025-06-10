
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentActivity, DocumentActionType } from '@/types/document';
import { DocumentStatus, CheckoutStatus, DocumentCategory } from '@/types/enums';

// Helper function to convert enum to database string
const documentStatusToString = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.Draft:
      return 'Draft';
    case DocumentStatus.Pending_Approval:
      return 'Pending Approval';
    case DocumentStatus.Pending_Review:
      return 'Pending Review';
    case DocumentStatus.Approved:
      return 'Approved';
    case DocumentStatus.Published:
    case DocumentStatus.Active:
      return 'Published';
    case DocumentStatus.Archived:
      return 'Archived';
    case DocumentStatus.Expired:
      return 'Expired';
    case DocumentStatus.Rejected:
      return 'Rejected';
    default:
      return 'Draft';
  }
};

// Helper function to convert string from database to enum
const stringToDocumentStatus = (status: string): DocumentStatus => {
  switch (status) {
    case 'Draft':
      return DocumentStatus.Draft;
    case 'Pending Approval':
      return DocumentStatus.Pending_Approval;
    case 'Pending Review':
      return DocumentStatus.Pending_Review;
    case 'Approved':
      return DocumentStatus.Approved;
    case 'Published':
      return DocumentStatus.Published;
    case 'Archived':
      return DocumentStatus.Archived;
    case 'Expired':
      return DocumentStatus.Expired;
    case 'Rejected':
      return DocumentStatus.Rejected;
    default:
      return DocumentStatus.Draft;
  }
};

// Helper function to convert category enum to database string
const documentCategoryToString = (category: DocumentCategory): string => {
  switch (category) {
    case DocumentCategory.Audit_Report:
      return 'Audit Report';
    case DocumentCategory.HACCP_Plan:
      return 'HACCP Plan';
    case DocumentCategory.Training_Material:
      return 'Training Material';
    case DocumentCategory.Supplier_Documentation:
      return 'Supplier Documentation';
    case DocumentCategory.Risk_Assessment:
      return 'Risk Assessment';
    default:
      return category;
  }
};

// Helper function to convert string from database to category enum
const stringToDocumentCategory = (category: string): DocumentCategory => {
  switch (category) {
    case 'Audit Report':
      return DocumentCategory.Audit_Report;
    case 'HACCP Plan':
      return DocumentCategory.HACCP_Plan;
    case 'Training Material':
      return DocumentCategory.Training_Material;
    case 'Supplier Documentation':
      return DocumentCategory.Supplier_Documentation;
    case 'Risk Assessment':
      return DocumentCategory.Risk_Assessment;
    case 'SOP':
      return DocumentCategory.SOP;
    case 'Policy':
      return DocumentCategory.Policy;
    case 'Form':
      return DocumentCategory.Form;
    case 'Certificate':
      return DocumentCategory.Certificate;
    case 'Other':
      return DocumentCategory.Other;
    default:
      return DocumentCategory.Other;
  }
};

export const fetchDocuments = async (): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: stringToDocumentStatus(item.status),
      checkout_status: (item.checkout_status || 'Available') as CheckoutStatus,
      category: stringToDocumentCategory(item.category),
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchActiveDocuments = async (): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .in('status', ['Published', 'Approved'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: stringToDocumentStatus(item.status),
      checkout_status: (item.checkout_status || 'Available') as CheckoutStatus,
      category: stringToDocumentCategory(item.category),
    }));
  } catch (error) {
    console.error('Error fetching active documents:', error);
    throw error;
  }
};

export const createDocument = async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> => {
  try {
    const documentData = {
      ...document,
      status: documentStatusToString(document.status),
      category: documentCategoryToString(document.category),
      checkout_status: document.checkout_status || 'Available',
    };

    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: stringToDocumentStatus(data.status),
      checkout_status: (data.checkout_status || 'Available') as CheckoutStatus,
      category: stringToDocumentCategory(data.category),
    };
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocument = async (id: string, updates: Partial<Document>): Promise<Document> => {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      ...(updates.status && { status: documentStatusToString(updates.status) }),
      ...(updates.category && { category: documentCategoryToString(updates.category) }),
    };

    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: stringToDocumentStatus(data.status),
      checkout_status: (data.checkout_status || 'Available') as CheckoutStatus,
      category: stringToDocumentCategory(data.category),
    };
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const createDocumentActivity = async (activity: Omit<DocumentActivity, 'id' | 'timestamp'>): Promise<DocumentActivity> => {
  try {
    const { data, error } = await supabase
      .from('document_activities')
      .insert({
        ...activity,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      action: data.action as DocumentActionType
    };
  } catch (error) {
    console.error('Error creating document activity:', error);
    throw error;
  }
};
