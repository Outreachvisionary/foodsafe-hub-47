
export type ComplaintCategory = 'quality' | 'safety' | 'packaging' | 'delivery' | 'other';
export type ComplaintStatus = 'new' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
export type ComplaintPriority = 'critical' | 'high' | 'medium' | 'low';
export type ComplaintSource = 'customer' | 'consumer' | 'retailer' | 'distributor' | 'internal' | 'audit' | 'inspection';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  source?: ComplaintSource;
  reportedDate: string;
  assignedTo?: string;
  createdBy: string;
  createdDate: string;
  updatedAt?: string;
  resolutionDate?: string;
  resolutionNotes?: string;
  customerName?: string;
  customerContact?: string;
  productInvolved?: string;
  lotNumber?: string;
  capaRequired?: boolean;
  capaId?: string;
  attachments?: ComplaintAttachment[];
}

export interface ComplaintAttachment {
  id: string;
  complaintId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

export interface ComplaintFilter {
  category?: ComplaintCategory[];
  status?: ComplaintStatus[];
  priority?: ComplaintPriority[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  assignedTo?: string[];
}

export interface ComplaintStats {
  total: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
  closedCount: number;
  byCategory: { name: string; value: number }[];
  byPriority: { name: string; value: number }[];
  bySource?: { name: string; value: number }[];
  responseTimeAvg: number;
  resolutionTimeAvg: number;
}
