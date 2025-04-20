
// Define the types for complaint module

export type ComplaintCategory = 'quality' | 'safety' | 'packaging' | 'delivery' | 'other';
export type ComplaintStatus = 'new' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
export type ComplaintPriority = 'critical' | 'high' | 'medium' | 'low';
export type ComplaintSource = 'customer' | 'consumer' | 'retailer' | 'distributor' | 'internal' | 'audit' | 'inspection';

// Database-compatible types
export type DbComplaintCategory = 'quality' | 'safety' | 'packaging' | 'delivery' | 'other';
export type DbComplaintStatus = 'new' | 'in-progress' | 'resolved' | 'closed' | 'reopened';

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
  'quality': 'Product Quality',
  'safety': 'Food Safety',
  'packaging': 'Packaging',
  'delivery': 'Delivery',
  'other': 'Other'
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
    'quality': 'Product Quality',
    'safety': 'Food Safety',
    'packaging': 'Packaging',
    'delivery': 'Delivery',
    'other': 'Other'
  };
  return mappings[dbCategory] || dbCategory;
};

export const mapDisplayCategoryToDb = (displayCategory: string): string => {
  const mappings: Record<string, string> = {
    'Product Quality': 'quality',
    'Food Safety': 'safety',
    'Packaging': 'packaging',
    'Delivery': 'delivery',
    'Other': 'other'
  };
  return mappings[displayCategory.toLowerCase()] || displayCategory.toLowerCase();
};
