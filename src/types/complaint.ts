
export type ComplaintStatus = 'New' | 'Under Investigation' | 'In Progress' | 'Resolved' | 'Closed';

export type ComplaintCategory = 'Food Safety' | 'Quality' | 'Regulatory' | 'Foreign Material' | 'Product Quality' | 'Other';

export type ComplaintPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ComplaintSource = 'Consumer' | 'Retailer' | 'Internal QA' | 'Laboratory Test' | 'Regulatory Agency';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  category: ComplaintCategory;
  source: ComplaintSource;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedTo: string;
  product_involved?: string;
  customer_name?: string;
  customer_contact?: string;
  resolution_date?: string;
  resolution_details?: string;
  lot_number?: string;
  capa_id?: string;
}

export interface ComplaintFilters {
  status?: string;
  category?: string;
  priority?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string;
}
