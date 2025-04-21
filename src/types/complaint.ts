
// Define the types for complaint module

export type ComplaintCategory = 'quality' | 'safety' | 'packaging' | 'delivery' | 'other';
export type ComplaintStatus = 'new' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
export type ComplaintPriority = 'critical' | 'high' | 'medium' | 'low';
export type ComplaintSource = 'customer' | 'consumer' | 'retailer' | 'distributor' | 'internal' | 'audit' | 'inspection';

// Database-compatible types - MUST match the exact values in database enum
export type DbComplaintCategory = 'Product Quality' | 'Foreign Material' | 'Packaging' | 'Labeling' | 'Customer Service' | 'Other';
export type DbComplaintStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed' | 'Reopened';

// Category map for UI display
export const categoryDisplayMap: Record<ComplaintCategory, string> = {
  'quality': 'Product Quality',
  'safety': 'Food Safety',
  'packaging': 'Packaging',
  'delivery': 'Delivery',
  'other': 'Other'
};

// Database category mapping
export const dbCategoryDisplayMap = {
  'Product Quality': 'Product Quality',
  'Foreign Material': 'Foreign Material',
  'Packaging': 'Packaging',
  'Labeling': 'Labeling',
  'Customer Service': 'Customer Service',
  'Other': 'Other'
};

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

// Database interface for complaints table
export interface DbComplaint {
  id: string;
  title: string;
  description: string;
  category: DbComplaintCategory;
  status: DbComplaintStatus;
  priority: string;
  reported_date: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  resolution_date?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_required?: boolean;
  capa_id?: string;
}

// Map function for database conversions
export const mapDbCategoryToDisplay = (dbCategory: string): string => {
  const mappings: Record<string, string> = {
    'Product Quality': 'Product Quality',
    'Foreign Material': 'Foreign Material',
    'Packaging': 'Packaging',
    'Labeling': 'Labeling',
    'Customer Service': 'Customer Service', 
    'Other': 'Other'
  };
  return mappings[dbCategory] || dbCategory;
};

export const mapDisplayCategoryToDb = (displayCategory: string): string => {
  const mappings: Record<string, string> = {
    'Product Quality': 'Product Quality',
    'Food Safety': 'Foreign Material',
    'Packaging': 'Packaging',
    'Delivery': 'Labeling',
    'Other': 'Other'
  };
  return mappings[displayCategory] || 'Other';
};

// Helper function to map our app's category to DB category
export function mapCategoryToDb(category: ComplaintCategory): DbComplaintCategory {
  switch(category) {
    case 'quality': return 'Product Quality';
    case 'safety': return 'Foreign Material';
    case 'packaging': return 'Packaging';
    case 'delivery': return 'Labeling';
    case 'other': return 'Other';
    default: return 'Other';
  }
}

// Helper function to map DB category to our app's category
export function mapDbCategoryToInternal(dbCategory: DbComplaintCategory): ComplaintCategory {
  switch(dbCategory) {
    case 'Product Quality': return 'quality';
    case 'Foreign Material': return 'safety';
    case 'Packaging': return 'packaging';
    case 'Labeling': return 'delivery';
    case 'Customer Service': return 'other';
    case 'Other': return 'other';
    default: return 'other';
  }
}

// Helper function to map our app's status to DB status
export function mapStatusToDb(status: ComplaintStatus): DbComplaintStatus {
  switch(status) {
    case 'new': return 'New';
    case 'in-progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    case 'reopened': return 'Reopened';
    default: return 'New';
  }
}

// Helper function to map DB status to our app's status
export function mapDbStatusToInternal(dbStatus: DbComplaintStatus): ComplaintStatus {
  switch(dbStatus) {
    case 'New': return 'new';
    case 'In Progress': return 'in-progress';
    case 'Resolved': return 'resolved';
    case 'Closed': return 'closed';
    case 'Reopened': return 'reopened';
    default: return 'new';
  }
}
