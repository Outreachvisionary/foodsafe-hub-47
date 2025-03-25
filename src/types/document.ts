
// Re-export our database types to maintain compatibility
export type { Document, DocumentCategory, DocumentStatus, Folder } from './database';

import { Json } from '@/integrations/supabase/types';

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number?: number;
  version: number; // This is required by the database
  file_name: string;
  file_path?: string;
  file_size: number;
  file_type?: string;
  created_by: string;
  created_at?: string;
  change_summary?: string;
  change_notes?: string; // For database compatibility
  storage_path?: string;
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

export interface DocumentPreview {
  id: string;
  document_id: string;
  version_id?: string;
  preview_type: string;
  content?: string;
  thumbnail_path?: string;
  created_at?: string;
}

export interface DocumentAccess {
  id: string;
  document_id?: string;
  folder_id?: string;
  user_id?: string;
  user_role?: string;
  permission_level: string;
  granted_by: string;
  granted_at?: string;
}

export interface DocumentWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: DocumentWorkflowStep[];
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description?: string;
  approvers: string[];
  required_approvals: number;
  deadline_days?: number;
  is_final: boolean;
}

export interface DocumentWorkflowInstance {
  id: string;
  document_id: string;
  workflow_id: string;
  current_step: number;
  status: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export type ModuleReference = 'none' | 'haccp' | 'training' | 'audits' | 'suppliers' | 'capa' | 'traceability' | 'non-conformance';

// Add missing types that were referenced in other components
export interface DocumentNotification {
  id: string;
  documentId: string;
  documentTitle: string;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  targetUserIds: string[];
}

export interface DocumentStats {
  totalDocuments: number;
  pendingApproval: number;
  expiringSoon: number;
  expired: number;
  published: number;
  archived: number;
  byCategory: Record<string, number>;
}

export interface ApprovalRule {
  id: string;
  name: string;
  requiredApprovers: string[];
  roles: string[];
  escalationThresholdDays: number;
  escalationTargets: string[];
}

export interface ApproverRole {
  id: string;
  name: string;
  canApprove: string[];
}

export type DocumentAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'submit_for_approval'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'archive'
  | 'checkout'
  | 'checkin'
  | 'revert_version';

// Translation related types
export interface Translation {
  id: string;
  key: string;
  language: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface TranslationNamespace {
  id: string;
  name: string;
  description?: string;
}

// Extend the Document type from database.ts with additional properties
declare module './database' {
  interface Document {
    checkout_user_id?: string;
    checkout_timestamp?: string;
    current_version_id?: string;
    workflow_status?: string;
  }
}

// Type guard to check if a value is a DocumentWorkflowStep[]
export function isDocumentWorkflowSteps(value: any): value is DocumentWorkflowStep[] {
  return Array.isArray(value) && 
    value.every(item => 
      typeof item === 'object' && 
      'id' in item && 
      'name' in item && 
      'approvers' in item && 
      'required_approvals' in item && 
      'is_final' in item
    );
}

// Helper function to convert Json to DocumentWorkflowStep[]
export function parseWorkflowSteps(steps: Json): DocumentWorkflowStep[] {
  if (typeof steps === 'string') {
    try {
      return JSON.parse(steps) as DocumentWorkflowStep[];
    } catch (e) {
      console.error('Error parsing workflow steps:', e);
      return [];
    }
  }
  
  if (Array.isArray(steps)) {
    return steps as unknown as DocumentWorkflowStep[];
  }
  
  return [];
}
