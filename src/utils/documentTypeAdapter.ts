
import { DocumentActionType } from '@/types/document';

/**
 * Safely maps a string to a DocumentActionType
 * @param action The string action to convert
 * @returns A valid DocumentActionType
 */
export function mapToDocumentActionType(action: string): DocumentActionType {
  const validActions: DocumentActionType[] = [
    'create', 'update', 'delete', 'view', 'download', 
    'approve', 'reject', 'review', 'comment', 'checkout', 
    'checkin', 'restore', 'archive', 'edit'
  ];
  
  if (validActions.includes(action as DocumentActionType)) {
    return action as DocumentActionType;
  }
  
  // Default to 'view' if not a valid action
  console.warn(`Invalid document action: ${action}, defaulting to 'view'`);
  return 'view';
}

/**
 * Adapt document data from database to frontend types
 */
export function adaptDocumentToDatabase(document: any) {
  return document;
}
