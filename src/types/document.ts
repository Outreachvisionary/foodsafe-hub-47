
export type DocumentStatus = 
  | 'Draft' 
  | 'Pending Approval' 
  | 'Approved' 
  | 'Published' 
  | 'Archived' 
  | 'Expired';

export type DocumentCategory = 
  | 'SOP' 
  | 'Policy' 
  | 'Form' 
  | 'Certificate' 
  | 'Audit Report' 
  | 'HACCP Plan' 
  | 'Training Material' 
  | 'Supplier Documentation' 
  | 'Risk Assessment'
  | 'Other';

export type ModuleReference = 
  | 'haccp' 
  | 'training' 
  | 'audits' 
  | 'suppliers' 
  | 'capa' 
  | 'traceability' 
  | 'none';

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  linkedModule?: ModuleReference;
  linkedItemId?: string;
  tags?: string[];
  approvers?: string[];
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  createdBy: string;
  createdAt: string;
  changeNotes?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  path: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
}
