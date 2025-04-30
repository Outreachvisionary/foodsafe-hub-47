
import { ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  reported_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  customer_name: string;
  customer_contact?: string;
  resolved_date?: string;
  resolution_notes?: string;
  assigned_to?: string;
  product_affected?: string;
  lot_number?: string;
  capa_id?: string;
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
