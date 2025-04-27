
export type ComplaintStatus = 'New' | 'Under_Investigation' | 'Resolved' | 'Closed' | 'Reopened';
export type ComplaintCategory = 'Product_Quality' | 'Food_Safety' | 'Packaging' | 'Delivery' | 'Service' | 'Other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: string;
  reported_date: string;
  resolution_date?: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
  resolution_details?: string;
}
