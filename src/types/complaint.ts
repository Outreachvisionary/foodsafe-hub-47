
// Define the types for Complaint module

export type ComplaintStatus = 'new' | 'investigating' | 'resolved' | 'closed';
export type ComplaintPriority = 'critical' | 'high' | 'medium' | 'low';
export type ComplaintCategory = 
  | 'product_quality' 
  | 'foreign_material' 
  | 'packaging' 
  | 'service' 
  | 'delivery' 
  | 'other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  category: ComplaintCategory;
  reportedDate: string;
  createdBy: string;
  assignedTo?: string;
  customerName?: string;
  customerContact?: string;
  productInvolved?: string;
  lotNumber?: string;
  resolutionDate?: string;
  updatedAt: string;
  capaId?: string;
}
