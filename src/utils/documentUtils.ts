
import { Document, DocumentVersion, DocumentActivity, DocumentRelationship, DocumentSummary } from '@/types/document';

/**
 * Creates a version history item from a document version
 */
export const createVersionHistoryItem = (
  document: Document,
  version: DocumentVersion
): DocumentVersion => {
  return {
    ...version,
    document_id: document.id,
  };
};

/**
 * Checks if a document is checked out
 */
export const isDocumentCheckedOut = (document: Document): boolean => {
  return !!document.checkout_user_id;
};

/**
 * Checks if the current user has checked out the document
 */
export const isCurrentUserCheckout = (document: Document, userId: string): boolean => {
  return document.checkout_user_id === userId;
};

/**
 * Get document approval status text
 */
export const getApprovalStatusText = (document: Document): string => {
  if (document.approval_status === 'pending') {
    return 'Pending Approval';
  } else if (document.approval_status === 'approved') {
    return 'Approved';
  } else if (document.approval_status === 'rejected') {
    return 'Rejected';
  } else {
    return document.status;
  }
};

/**
 * Check if a document is expired
 */
export const isDocumentExpired = (document: Document): boolean => {
  if (!document.expiry_date) return false;
  
  const expiryDate = new Date(document.expiry_date);
  const currentDate = new Date();
  
  return expiryDate < currentDate;
};

/**
 * Creates an activity record for the document
 */
export const createDocumentActivity = (
  document: Document,
  action: DocumentActivity['action'],
  userId: string,
  userName: string,
  userRole: string,
  comments?: string
): DocumentActivity => {
  return {
    id: `activity-${Date.now()}`,
    document_id: document.id,
    action,
    user_id: userId,
    user_name: userName,
    user_role: userRole,
    timestamp: new Date().toISOString(),
    comments
  };
};

/**
 * Creates a relationship between two documents
 */
export const createDocumentRelationship = (
  sourceDocId: string,
  targetDocId: string,
  relationType: string,
  createdBy: string
): DocumentRelationship => {
  return {
    id: `rel-${Date.now()}`,
    sourceDocumentId: sourceDocId,
    targetDocumentId: targetDocId,
    relationshipType: relationType as any,
    createdBy: createdBy,
    createdAt: new Date().toISOString()
  };
};

/**
 * Get relationship type display name
 */
export const getRelationshipTypeDisplay = (relationType: string): string => {
  switch (relationType) {
    case 'references':
      return 'References';
    case 'supersedes':
      return 'Supersedes';
    case 'requires':
      return 'Requires';
    case 'supports':
      return 'Supports';
    case 'implements':
      return 'Implements';
    default:
      return relationType;
  }
};

/**
 * Get a mock AI summary for a document
 * In a real implementation, this would call an AI service
 */
export const generateMockAISummary = (document: Document): DocumentSummary => {
  return {
    id: `summary-${document.id}`,
    documentId: document.id,
    versionId: document.current_version_id || '',
    summary: `This ${document.category} document titled "${document.title}" appears to focus on procedures and guidelines related to document management in the organization.`,
    keyPoints: [
      'Defines key roles and responsibilities',
      'Outlines document creation and approval processes',
      'Specifies record keeping requirements',
      'Provides guidance on document revision procedures'
    ],
    generated_at: new Date().toISOString(),
    modelUsed: 'gpt-4'
  };
};
