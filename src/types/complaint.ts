
import { ComplaintStatus, ComplaintCategory } from '@/types/enums';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
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

export interface ComplaintFilter {
  status?: ComplaintStatus | ComplaintStatus[];
  category?: ComplaintCategory | ComplaintCategory[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  assigned_to?: string;
  customer_name?: string;
  product_involved?: string;
  created_by?: string;
}

export interface CreateComplaintRequest {
  title: string;
  description: string;
  category: ComplaintCategory;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  assigned_to?: string;
}

export interface UpdateComplaintRequest {
  id: string;
  title?: string;
  description?: string;
  category?: ComplaintCategory;
  status?: ComplaintStatus;
  assigned_to?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  resolution_date?: string;
  capa_id?: string;
}

// Export enums for backward compatibility
export { ComplaintStatus, ComplaintCategory };
