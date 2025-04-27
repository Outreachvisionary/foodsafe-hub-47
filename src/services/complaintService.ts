
import { supabase } from '@/integrations/supabase/client';

// Define complaint types
export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  category: ComplaintCategory;
  reported_date: string;
  resolution_date?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  created_by: string;
  assigned_to?: string;
  capa_id?: string;
}

export type ComplaintStatus = 
  | 'New'
  | 'Under_Investigation'
  | 'Awaiting_Response'
  | 'Resolved'
  | 'Closed'
  | 'Rejected';

export type ComplaintCategory =
  | 'Product_Quality'
  | 'Foreign_Material'
  | 'Packaging'
  | 'Labeling'
  | 'Delivery'
  | 'Service'
  | 'Other';

// Mock complaints data
const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Foreign object found in product',
    description: 'Customer reported finding a small piece of plastic in the product.',
    status: 'Under_Investigation',
    category: 'Foreign_Material',
    reported_date: '2025-03-15T14:30:00Z',
    customer_name: 'John Davis',
    customer_contact: 'john.davis@example.com',
    product_involved: 'Premium Cookies 12oz',
    lot_number: 'LOT-20250228-A4',
    created_by: 'sarah.johnson',
    assigned_to: 'emily.wilson'
  },
  {
    id: '2',
    title: 'Incorrect allergen labeling',
    description: 'Product label missing peanut allergen declaration.',
    status: 'Resolved',
    category: 'Labeling',
    reported_date: '2025-03-10T09:45:00Z',
    resolution_date: '2025-03-14T16:20:00Z',
    product_involved: 'Chocolate Granola Bars 8pk',
    lot_number: 'LOT-20250305-B2',
    created_by: 'david.zhang',
    assigned_to: 'maria.garcia',
    capa_id: '3'
  },
  {
    id: '3',
    title: 'Product arrived damaged',
    description: 'Full pallet arrived with crushed boxes on bottom layer.',
    status: 'Closed',
    category: 'Packaging',
    reported_date: '2025-03-01T11:15:00Z',
    resolution_date: '2025-03-05T14:30:00Z',
    customer_name: 'Metro Grocery',
    customer_contact: 'orders@metrogrocery.com',
    product_involved: 'Assorted Products',
    created_by: 'robert.chen',
    assigned_to: 'karen.nguyen'
  },
  {
    id: '4',
    title: 'Off flavor in batch',
    description: 'Multiple consumer complaints about off flavor in recent batch.',
    status: 'New',
    category: 'Product_Quality',
    reported_date: '2025-03-18T10:20:00Z',
    product_involved: 'Vanilla Yogurt 32oz',
    lot_number: 'LOT-20250315-C3',
    created_by: 'john.smith',
    assigned_to: 'michael.brown'
  }
];

/**
 * Fetch all complaints
 */
export const fetchComplaints = async (): Promise<Complaint[]> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('reported_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching complaints:', error);
      return mockComplaints;
    }
    
    return data.map(transformDBComplaint);
  } catch (err) {
    console.error('Error in fetchComplaints:', err);
    return mockComplaints;
  }
};

/**
 * Fetch complaint by ID
 */
export const fetchComplaintById = async (id: string): Promise<Complaint | null> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching complaint with ID ${id}:`, error);
      const mockComplaint = mockComplaints.find(c => c.id === id);
      return mockComplaint || null;
    }
    
    return transformDBComplaint(data);
  } catch (err) {
    console.error(`Error in fetchComplaintById for ID ${id}:`, err);
    const mockComplaint = mockComplaints.find(c => c.id === id);
    return mockComplaint || null;
  }
};

/**
 * Update complaint status
 */
export const updateComplaintStatus = async (
  id: string, 
  status: ComplaintStatus,
  comments?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('complaints')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'Resolved' || status === 'Closed' ? { resolution_date: new Date().toISOString() } : {})
      })
      .eq('id', id);
      
    if (error) {
      console.error(`Error updating complaint status for ID ${id}:`, error);
      return false;
    }
    
    // Log the status change activity
    await logComplaintActivity(id, {
      action_type: 'status_change',
      description: `Status changed to ${status}`,
      comments
    });
    
    return true;
  } catch (err) {
    console.error(`Error in updateComplaintStatus for ID ${id}:`, err);
    return false;
  }
};

/**
 * Log complaint activity
 */
const logComplaintActivity = async (
  complaintId: string, 
  activity: { action_type: string, description: string, comments?: string }
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('complaint_activities')
      .insert({
        complaint_id: complaintId,
        action_type: activity.action_type,
        description: activity.description,
        comments: activity.comments,
        performed_at: new Date().toISOString(),
        performed_by: 'current_user' // In a real app, get from auth context
      });
      
    if (error) {
      console.error('Error logging complaint activity:', error);
    }
  } catch (err) {
    console.error('Error in logComplaintActivity:', err);
  }
};

/**
 * Transform database complaint to app format
 */
const transformDBComplaint = (dbComplaint: any): Complaint => {
  return {
    id: dbComplaint.id,
    title: dbComplaint.title,
    description: dbComplaint.description,
    status: normalizeComplaintStatus(dbComplaint.status),
    category: normalizeComplaintCategory(dbComplaint.category),
    reported_date: dbComplaint.reported_date,
    resolution_date: dbComplaint.resolution_date,
    customer_name: dbComplaint.customer_name,
    customer_contact: dbComplaint.customer_contact,
    product_involved: dbComplaint.product_involved,
    lot_number: dbComplaint.lot_number,
    created_by: dbComplaint.created_by,
    assigned_to: dbComplaint.assigned_to,
    capa_id: dbComplaint.capa_id
  };
};

/**
 * Normalize complaint status from database to app format
 */
const normalizeComplaintStatus = (status: string): ComplaintStatus => {
  const statusMap: Record<string, ComplaintStatus> = {
    'New': 'New',
    'Under Investigation': 'Under_Investigation',
    'Awaiting Response': 'Awaiting_Response',
    'Resolved': 'Resolved',
    'Closed': 'Closed',
    'Rejected': 'Rejected'
  };
  
  return statusMap[status] || 'New';
};

/**
 * Normalize complaint category from database to app format
 */
const normalizeComplaintCategory = (category: string): ComplaintCategory => {
  const categoryMap: Record<string, ComplaintCategory> = {
    'Product Quality': 'Product_Quality',
    'Foreign Material': 'Foreign_Material',
    'Packaging': 'Packaging',
    'Labeling': 'Labeling',
    'Delivery': 'Delivery',
    'Service': 'Service',
    'Other': 'Other'
  };
  
  return categoryMap[category] || 'Other';
};
