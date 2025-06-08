
import { ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';

// Re-export the enums for easy access
export { ComplaintStatus, ComplaintCategory, ComplaintPriority };

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  reported_date: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  customer_name: string;
  customer_contact?: string;
  assigned_to?: string;
  product_affected?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
  resolution_notes?: string;
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

export interface ComplaintActivity {
  id: string;
  complaint_id: string;
  action_type: string;
  description: string;
  performed_at: string;
  performed_by: string;
  old_status?: ComplaintStatus;
  new_status?: ComplaintStatus;
}
