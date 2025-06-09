import { ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types/enums';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority?: ComplaintPriority;
  reported_date: string;
  resolution_date?: string;
  assigned_to?: string;
  created_by: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateComplaintRequest {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority?: ComplaintPriority;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  created_by: string;
}

export interface UpdateComplaintRequest {
  id: string;
  title?: string;
  description?: string;
  category?: ComplaintCategory;
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  assigned_to?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  resolution_date?: string;
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

// Export enums for backward compatibility
export { ComplaintCategory, ComplaintStatus, ComplaintPriority };
