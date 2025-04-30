
// This file re-exports from the main DocumentContext to maintain backwards compatibility
import { DocumentProvider, useDocument, useDocumentContext } from '@/contexts/DocumentContext';

// Re-export for backward compatibility
export { DocumentProvider, useDocument, useDocumentContext };

export default {
  DocumentProvider,
  useDocument,
  useDocumentContext
};
