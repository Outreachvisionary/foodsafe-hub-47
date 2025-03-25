
// Re-export our database types to maintain compatibility
export { Document, DocumentCategory, DocumentStatus, Folder } from './database';

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at?: string;
  change_notes?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  action: string;
  timestamp?: string;
  user_id: string;
  user_name: string;
  user_role: string;
  comments?: string;
}

export type ModuleReference = 'none' | 'haccp' | 'training' | 'audits' | 'suppliers' | 'capa' | 'traceability';
