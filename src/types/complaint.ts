
export type ComplaintCategory = 
  | 'Product_Quality'
  | 'Foreign_Material'
  | 'Packaging'
  | 'Labeling'
  | 'Customer_Service'
  | 'Other';

export type ComplaintStatus = 
  | 'New'
  | 'Under_Investigation'
  | 'Resolved'
  | 'Closed'
  | 'Reopened'
  | 'Escalated'
  | 'On_Hold';

export type ComplaintPriority = 
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Urgent';

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
  assigned_to?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
}

export interface ComplaintFilter {
  status?: ComplaintStatus | ComplaintStatus[];
  category?: ComplaintCategory | ComplaintCategory[];
  priority?: ComplaintPriority | ComplaintPriority[];
  date_range?: {
    start: string;
    end: string;
  };
  search?: string;
}
