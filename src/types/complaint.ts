
export type ComplaintStatus = 'New' | 'Under_Investigation' | 'Resolved' | 'Closed' | 'Reopened';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintCategory = 
  | 'Product_Quality' 
  | 'Food_Safety' 
  | 'Packaging' 
  | 'Delivery' 
  | 'Customer_Service' 
  | 'Other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  customer_name: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  assigned_to?: string;
  created_by: string;
  reported_date: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  capa_id?: string;
}

export interface CreateComplaintRequest {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  customer_name: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  assigned_to?: string;
  created_by: string;
  status: ComplaintStatus;
  reported_date: string;
}

export interface ComplaintFilter {
  status?: ComplaintStatus | ComplaintStatus[];
  category?: ComplaintCategory | ComplaintCategory[];
  priority?: ComplaintPriority | ComplaintPriority[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface ComplaintListProps {
  complaints: Complaint[];
  onComplaintClick?: (complaint: Complaint) => void;
}

// Enum values for easy iteration
export const ComplaintStatusValues = ['New', 'Under_Investigation', 'Resolved', 'Closed', 'Reopened'] as const;
export const ComplaintPriorityValues = ['Low', 'Medium', 'High', 'Critical'] as const;
export const ComplaintCategoryValues = [
  'Product_Quality',
  'Food_Safety', 
  'Packaging',
  'Delivery',
  'Customer_Service',
  'Other'
] as const;
