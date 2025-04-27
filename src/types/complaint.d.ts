
export type ComplaintStatus = 
  | 'New'
  | 'Under_Investigation'
  | 'Resolved'
  | 'Closed'
  | 'Reopened';

export type ComplaintCategory =
  | 'Product_Quality'
  | 'Food_Safety'
  | 'Packaging'
  | 'Foreign_Matter'
  | 'Allergen'
  | 'Customer_Service'
  | 'Documentation'
  | 'Other';

export type ComplaintPriority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

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
}

export interface ComplaintListProps {
  complaints: Complaint[];
  onComplaintClick?: (complaint: Complaint) => void;
}
