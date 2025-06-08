
import { ComplaintCategory, ComplaintStatus } from '@/types/enums';

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

export interface CreateComplaintRequest {
  title: string;
  description: string;
  category: ComplaintCategory;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
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
}

// Export enums for backward compatibility
export { ComplaintCategory, ComplaintStatus };
