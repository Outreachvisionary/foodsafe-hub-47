
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

// Mock exports for other services that are missing
export const capaService = {
  getCAPAs: async () => [],
  createCAPA: async () => ({}),
  updateCAPA: async (id: string, updates: any) => ({}),
  deleteCAPA: async (id: string) => {}
};

export const nonConformanceService = {
  getNonConformances: async () => [],
  createNonConformance: async () => ({}),
  updateNonConformance: async () => ({}),
  deleteNonConformance: async () => {}
};
