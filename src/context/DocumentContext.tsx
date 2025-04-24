
// This file now just re-exports from the correct location to avoid duplication
// and prevent confusion in imports
export { 
  DocumentProvider,
  useDocuments as useDocumentContext
} from '@/contexts/DocumentContext';
