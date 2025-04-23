
// Define complaint types
export type ComplaintStatus = 'New' | 'Under Investigation' | 'Resolved' | 'Closed' | string;
export type ComplaintCategory = 'Product Quality' | 'Foreign Material' | 'Packaging' | 'Labeling' | 'Customer Service' | 'Other' | string;
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent' | string;

export interface Complaint {
  id?: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  reported_date?: string;
  resolution_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by: string;
  assigned_to?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
  capa_required?: boolean;
}

// Helper function to map Complaint to database format
export const mapComplaintToDb = (complaint: Partial<Complaint>): Record<string, any> => {
  return {
    title: complaint.title,
    description: complaint.description,
    category: complaint.category, // Already a string compatible with the DB enum
    status: complaint.status, // Already a string compatible with the DB enum
    priority: complaint.priority, // Already a string compatible with the DB enum
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

// Map database status to complaint status
export const mapDbStatusToComplaintStatus = (status: string): ComplaintStatus => {
  switch (status) {
    case 'new': return 'New';
    case 'under_investigation': return 'Under Investigation';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    default: return status as ComplaintStatus;
  }
};

// Get badge variant for complaint status
export const getStatusBadgeVariant = (status: ComplaintStatus): string => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-700';
    case 'Under Investigation':
      return 'bg-amber-100 text-amber-700';
    case 'Resolved':
      return 'bg-green-100 text-green-700';
    case 'Closed':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Get badge variant for complaint priority
export const getPriorityBadgeVariant = (priority: ComplaintPriority): string => {
  switch (priority) {
    case 'Low':
      return 'bg-green-100 text-green-700';
    case 'Medium':
      return 'bg-blue-100 text-blue-700';
    case 'High':
      return 'bg-amber-100 text-amber-700';
    case 'Urgent':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
