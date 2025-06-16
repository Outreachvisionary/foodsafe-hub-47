
import { documentService } from './documentService';
import * as nonConformanceService from './nonConformanceService';

// Export the document service
export { documentService };

// Re-export for backward compatibility
export const {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} = documentService;

// Export non-conformance service
export { nonConformanceService };

// Mock exports for other services that are missing
export const capaService = {
  getCAPAs: async () => [],
  createCAPA: async () => ({}),
  updateCAPA: async (id: string, updates: any) => ({}),
  deleteCAPA: async (id: string) => {}
};
