
import { documentService } from './documentService';

// Export the document service
export { documentService };

// Re-export for backward compatibility
export const {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} = documentService;
