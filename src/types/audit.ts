
export type AuditStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold' | 'Open';
export type AuditType = 'Internal' | 'External' | 'Supplier' | 'Regulatory' | 'Gap Analysis';
export type FindingSeverity = 'Critical' | 'Major' | 'Minor' | 'Observation';
export type FindingStatus = 'Open' | 'In Progress' | 'Closed' | 'Verified';

export interface Audit {
  id: string;
  title: string;
  description?: string;
  status: AuditStatus;
  startDate: string;
  dueDate: string;
  completionDate?: string;
  auditType: string;
  assignedTo: string;
  createdBy: string;
  findings?: number;
  relatedStandard?: string;
  location?: string;
  department?: string;
  createdAt?: string;
  updatedAt?: string;
  // For backward compatibility
  scheduledDate?: string;
  audit_type?: string;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  description: string;
  evidence?: string;
  severity: FindingSeverity;
  status: FindingStatus;
  assignedTo?: string;
  dueDate?: string;
  capaId?: string;
  createdAt?: string;
  updatedAt?: string;
  // For backward compatibility
  audit_id?: string;
}
