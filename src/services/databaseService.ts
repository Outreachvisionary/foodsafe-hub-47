import { Complaint, ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types/complaint';
import { supabase } from '@/integrations/supabase/client';
import { 
  complaintCategoryToDbString, 
  complaintStatusToDbString, 
  stringToComplaintCategory, 
  stringToComplaintStatus
} from '@/utils/complaintAdapters';

const convertDatabaseComplaintToComplaint = (dbComplaint: any): Complaint => {
  return {
    id: dbComplaint.id,
    title: dbComplaint.title,
    description: dbComplaint.description,
    category: stringToComplaintCategory(dbComplaint.category),
    status: stringToComplaintStatus(dbComplaint.status),
    priority: ComplaintPriority.Medium, // Default since priority doesn't exist in DB
    reported_date: dbComplaint.reported_date,
    resolution_date: dbComplaint.resolution_date,
    assigned_to: dbComplaint.assigned_to,
    created_by: dbComplaint.created_by,
    customer_name: dbComplaint.customer_name,
    customer_contact: dbComplaint.customer_contact,
    product_involved: dbComplaint.product_involved,
    lot_number: dbComplaint.lot_number,
    capa_id: dbComplaint.capa_id,
    created_at: dbComplaint.created_at,
    updated_at: dbComplaint.updated_at
  };
};

export const getComplaints = async (): Promise<Complaint[]> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('reported_date', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(convertDatabaseComplaintToComplaint);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const getComplaintById = async (id: string): Promise<Complaint | null> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return convertDatabaseComplaintToComplaint(data);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    throw error;
  }
};

export const getComplaintsByStatus = async (status: ComplaintStatus): Promise<Complaint[]> => {
  try {
    const dbStatus = complaintStatusToDbString(status);
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('status', dbStatus)
      .order('reported_date', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(convertDatabaseComplaintToComplaint);
  } catch (error) {
    console.error('Error fetching complaints by status:', error);
    throw error;
  }
};

export const createComplaint = async (complaint: Complaint): Promise<Complaint> => {
  try {
    const dbComplaint = {
      title: complaint.title,
      description: complaint.description,
      category: complaintCategoryToDbString(complaint.category) as any,
      status: complaintStatusToDbString(complaint.status) as any,
      reported_date: complaint.reported_date,
      created_by: complaint.created_by,
      customer_name: complaint.customer_name,
      customer_contact: complaint.customer_contact,
      product_involved: complaint.product_involved,
      lot_number: complaint.lot_number,
      capa_id: complaint.capa_id,
      created_at: complaint.created_at,
      updated_at: complaint.updated_at,
      assigned_to: complaint.assigned_to
    };

    const { data, error } = await supabase
      .from('complaints')
      .insert(dbComplaint)
      .select()
      .single();

    if (error) throw error;
    
    return convertDatabaseComplaintToComplaint(data);
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
};

export const updateComplaint = async (id: string, updates: Partial<Complaint>): Promise<Complaint> => {
  try {
    const dbUpdates: any = {};
    
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.category) dbUpdates.category = complaintCategoryToDbString(updates.category) as any;
    if (updates.status) dbUpdates.status = complaintStatusToDbString(updates.status) as any;
    if (updates.reported_date) dbUpdates.reported_date = updates.reported_date;
    if (updates.resolution_date) dbUpdates.resolution_date = updates.resolution_date;
    if (updates.customer_name) dbUpdates.customer_name = updates.customer_name;
    if (updates.customer_contact) dbUpdates.customer_contact = updates.customer_contact;
    if (updates.product_involved) dbUpdates.product_involved = updates.product_involved;
    if (updates.lot_number) dbUpdates.lot_number = updates.lot_number;
    if (updates.capa_id) dbUpdates.capa_id = updates.capa_id;
    if (updates.assigned_to) dbUpdates.assigned_to = updates.assigned_to;

    const { data, error } = await supabase
      .from('complaints')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return convertDatabaseComplaintToComplaint(data);
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
};

export const deleteComplaint = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
};
