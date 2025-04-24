
// This file re-exports from the main DocumentContext to maintain backwards compatibility
import { DocumentProvider, useDocument } from '@/contexts/DocumentContext';

// Re-export for backward compatibility
export { DocumentProvider, useDocument };
export const useDocuments = useDocument; // Alias for components that haven't been updated

export default {
  DocumentProvider,
  useDocument
};
