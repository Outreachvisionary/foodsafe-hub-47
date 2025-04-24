
import { Document, DocumentActionType } from '@/types/document';

/**
 * Adapts a Document object to the database schema format
 * @param document The document to adapt
 */
export const adaptDocumentToDatabase = (document: Document): any => {
  // Handle special status values with underscores
  let status = document.status;
  
  // Ensure the category is a string that the database accepts
  let category = document.category;
  
  return {
    ...document,
    status,
    category
  };
};

/**
 * Maps string action to DocumentActionType
 * @param action The action string
 */
export const mapToDocumentActionType = (action: string): DocumentActionType => {
  // Check if the action is valid in our enum
  const isValidAction = Object.values(DocumentActionType).includes(action as DocumentActionType);
  
  if (isValidAction) {
    return action as DocumentActionType;
  }
  
  // Default to 'view' if not found
  console.warn(`Unknown document action type: ${action}, defaulting to 'view'`);
  return 'view';
};

export default {
  adaptDocumentToDatabase,
  mapToDocumentActionType
};
