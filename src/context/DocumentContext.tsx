
// This file re-exports from the main DocumentContext to maintain backwards compatibility
import { DocumentProvider, useDocument, useDocuments } from '@/contexts/DocumentContext';

// Re-export for backward compatibility
export { DocumentProvider, useDocument, useDocuments };

export default {
  DocumentProvider,
  useDocument,
  useDocuments
};
