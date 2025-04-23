
/**
 * Complaint types
 */
export type ComplaintStatus = 'New' | 'Under Investigation' | 'Resolved' | 'Closed' | string;
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent' | string;
export type ComplaintCategory = 'Product Quality' | 'Foreign Material' | 'Packaging' | 'Labeling' | 'Customer Service' | 'Other' | string;

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
  capa_id?: string;
  assigned_to?: string;
  created_by: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_required?: boolean;
}
