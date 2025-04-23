
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
  
  // Added property aliases for component compatibility
  productInvolved?: string;
  lotNumber?: string;
  reportedDate?: string;
  createdBy?: string;
  assignedTo?: string;
  updatedAt?: string;
  resolutionDate?: string;
  customerName?: string;
  customerContact?: string;
  capaId?: string;
  capaRequired?: boolean;
}

// Mapping functions to help with component usage
export const mapDbToComplaint = (data: any): Complaint => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category as ComplaintCategory,
    status: data.status as ComplaintStatus,
    priority: data.priority as ComplaintPriority,
    reported_date: data.reported_date,
    resolution_date: data.resolution_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    capa_id: data.capa_id,
    assigned_to: data.assigned_to,
    created_by: data.created_by,
    customer_name: data.customer_name,
    customer_contact: data.customer_contact,
    product_involved: data.product_involved,
    lot_number: data.lot_number,
    capa_required: data.capa_required,
    
    // Add component-compatible aliases
    productInvolved: data.product_involved,
    lotNumber: data.lot_number,
    reportedDate: data.reported_date,
    createdBy: data.created_by,
    assignedTo: data.assigned_to,
    updatedAt: data.updated_at,
    resolutionDate: data.resolution_date,
    customerName: data.customer_name,
    customerContact: data.customer_contact,
    capaId: data.capa_id,
    capaRequired: data.capa_required
  };
};

export const mapComplaintToDb = (complaint: Partial<Complaint>): Record<string, any> => {
  const dbComplaint: Record<string, any> = {};
  
  if (complaint.title) dbComplaint.title = complaint.title;
  if (complaint.description) dbComplaint.description = complaint.description;
  if (complaint.category) dbComplaint.category = complaint.category;
  if (complaint.status) dbComplaint.status = complaint.status;
  if (complaint.priority) dbComplaint.priority = complaint.priority;
  
  // Handle reportedDate vs reported_date
  if (complaint.reportedDate) dbComplaint.reported_date = complaint.reportedDate;
  else if (complaint.reported_date) dbComplaint.reported_date = complaint.reported_date;
  
  // Handle resolutionDate vs resolution_date
  if (complaint.resolutionDate) dbComplaint.resolution_date = complaint.resolutionDate;
  else if (complaint.resolution_date) dbComplaint.resolution_date = complaint.resolution_date;
  
  // Handle other fields
  if (complaint.capaId) dbComplaint.capa_id = complaint.capaId;
  else if (complaint.capa_id) dbComplaint.capa_id = complaint.capa_id;
  
  if (complaint.assignedTo) dbComplaint.assigned_to = complaint.assignedTo;
  else if (complaint.assigned_to) dbComplaint.assigned_to = complaint.assigned_to;
  
  if (complaint.createdBy) dbComplaint.created_by = complaint.createdBy;
  else if (complaint.created_by) dbComplaint.created_by = complaint.created_by;
  
  if (complaint.customerName) dbComplaint.customer_name = complaint.customerName;
  else if (complaint.customer_name) dbComplaint.customer_name = complaint.customer_name;
  
  if (complaint.customerContact) dbComplaint.customer_contact = complaint.customerContact;
  else if (complaint.customer_contact) dbComplaint.customer_contact = complaint.customer_contact;
  
  if (complaint.productInvolved) dbComplaint.product_involved = complaint.productInvolved;
  else if (complaint.product_involved) dbComplaint.product_involved = complaint.product_involved;
  
  if (complaint.lotNumber) dbComplaint.lot_number = complaint.lotNumber;
  else if (complaint.lot_number) dbComplaint.lot_number = complaint.lot_number;
  
  if (complaint.capaRequired !== undefined) dbComplaint.capa_required = complaint.capaRequired;
  else if (complaint.capa_required !== undefined) dbComplaint.capa_required = complaint.capa_required;
  
  return dbComplaint;
};
