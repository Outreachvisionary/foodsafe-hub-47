
/**
 * Mock Documents Service
 * This is a placeholder to support testing.
 */

export const fetchDocuments = async () => {
  // In a real implementation, this would interact with the database
  return [];
};

export const createDocument = async (document: any) => {
  // In a real implementation, this would interact with the database
  return { id: 'mock-doc-id', ...document };
};

export const fetchDocumentById = async (id: string) => {
  // In a real implementation, this would interact with the database
  return { id };
};

export const updateDocument = async (id: string, updates: any) => {
  // In a real implementation, this would interact with the database
  return { id, ...updates };
};

export const deleteDocument = async (id: string) => {
  // In a real implementation, this would interact with the database
  return true;
};

export default {
  fetchDocuments,
  createDocument,
  fetchDocumentById,
  updateDocument,
  deleteDocument
};
