
// Define the complaint types and mappers
export type ComplaintCategory = 'Product Quality' | 'Foreign Material' | 'Packaging' | 'Labeling' | 'Customer Service' | 'Other';
export type ComplaintStatus = 'New' | 'Under Investigation' | 'Resolved' | 'Closed';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

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
  assigned_to?: string;
  created_by: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
  capa_required?: boolean;
}

export const mapComplaintToDb = (complaint: Partial<Complaint>) => {
  return {
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    status: complaint.status,
    priority: complaint.priority,
    reported_date: complaint.reported_date || new Date().toISOString(),
    resolution_date: complaint.resolution_date,
    created_by: complaint.created_by,
    assigned_to: complaint.assigned_to,
    customer_name: complaint.customer_name,
    customer_contact: complaint.customer_contact,
    product_involved: complaint.product_involved,
    lot_number: complaint.lot_number,
    capa_id: complaint.capa_id
  };
};

export const mapDbToComplaint = (dbComplaint: any): Complaint => {
  return {
    id: dbComplaint.id,
    title: dbComplaint.title,
    description: dbComplaint.description,
    category: dbComplaint.category as ComplaintCategory,
    status: dbComplaint.status as ComplaintStatus,
    priority: dbComplaint.priority as ComplaintPriority,
    reported_date: dbComplaint.reported_date,
    resolution_date: dbComplaint.resolution_date,
    created_at: dbComplaint.created_at,
    updated_at: dbComplaint.updated_at,
    assigned_to: dbComplaint.assigned_to,
    created_by: dbComplaint.created_by,
    customer_name: dbComplaint.customer_name,
    customer_contact: dbComplaint.customer_contact,
    product_involved: dbComplaint.product_involved,
    lot_number: dbComplaint.lot_number,
    capa_id: dbComplaint.capa_id
  };
};
