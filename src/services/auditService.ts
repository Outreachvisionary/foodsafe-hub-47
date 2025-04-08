
/**
 * Mock Audit Service
 * This is a placeholder to support testing.
 */

// Original functions
export const fetchAudits = async () => {
  // In a real implementation, this would interact with the database
  return [];
};

export const createAudit = async (audit: any) => {
  // In a real implementation, this would interact with the database
  return { id: 'mock-audit-id', ...audit };
};

export const fetchAuditById = async (id: string) => {
  // In a real implementation, this would interact with the database
  return { id };
};

export const updateAudit = async (id: string, updates: any) => {
  // In a real implementation, this would interact with the database
  return { id, ...updates };
};

export const deleteAudit = async (id: string) => {
  // In a real implementation, this would interact with the database
  return true;
};

// New functions required by hooks
export const fetchAuditFindings = async (auditId: string) => {
  return [];
};

export const createFinding = async (finding: any) => {
  return { id: 'mock-finding-id', ...finding };
};

export const updateFinding = async (id: string, updates: any) => {
  return { id, ...updates };
};

export const deleteFinding = async (id: string) => {
  return true;
};

export const exportAuditReport = async (auditId: string, format: string) => {
  return { url: `mock-export-url-${auditId}.${format}` };
};

// Types needed by hooks
export interface Audit {
  id: string;
  title: string;
  description?: string;
  status: string;
  startDate: string;
  dueDate: string;
  completionDate?: string;
  auditType: string;
  assignedTo: string;
  createdBy: string;
  findingsCount: number;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  description: string;
  severity: string;
  status: string;
  dueDate?: string;
  assignedTo?: string;
  evidence?: string;
  capaId?: string;
}

export default {
  fetchAudits,
  createAudit,
  fetchAuditById,
  updateAudit,
  deleteAudit,
  fetchAuditFindings,
  createFinding,
  updateFinding,
  deleteFinding,
  exportAuditReport
};
