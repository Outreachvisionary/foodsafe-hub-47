
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NCActivity, NCAttachment } from '@/types/non-conformance';
import { z } from 'zod';
import { validateFormData } from '@/lib/validation';

// Define the schema for updating a non-conformance
const ncUpdateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  item_name: z.string().min(1, "Item name is required"),
  item_category: z.string().min(1, "Item category is required"),
  reason_category: z.string().min(1, "Reason category is required"),
  priority: z.string().optional(),
  risk_level: z.string().optional(),
  description: z.string().optional(),
  reason_details: z.string().optional(),
  resolution_details: z.string().optional(),
  quantity: z.number().nonnegative("Quantity must be non-negative").optional(),
  quantity_on_hold: z.number().nonnegative("Quantity on hold must be non-negative").optional(),
  units: z.string().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
  assigned_to: z.string().optional(),
  updated_at: z.date().optional(),
});

// Function to update a non-conformance record
export const updateNonConformance = async (
  id: string,
  data: Partial<NonConformance>,
  userId: string
) => {
  // Validate the data before sending to Supabase
  const validation = validateFormData(ncUpdateSchema, {
    ...data,
    updated_at: new Date()
  });
  
  if (!validation.success) {
    console.error('Validation errors:', validation.errors);
    throw new Error('Invalid form data');
  }
  
  const { data: updatedNC, error } = await supabase
    .from('non_conformances')
    .update(validation.data)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating non-conformance:', error);
    throw new Error(`Failed to update non-conformance: ${error.message}`);
  }
  
  return updatedNC;
};

// Function to fetch a specific non-conformance by ID
export const getNonConformanceById = async (id: string) => {
  const { data, error } = await supabase
    .from('non_conformances')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching non-conformance:', error);
    throw new Error(`Failed to fetch non-conformance: ${error.message}`);
  }
  
  return data;
};

// Function to fetch all non-conformances with filtering options
export const getAllNonConformances = async (options: {
  searchTerm?: string;
  status?: string;
  category?: string;
  priority?: string;
  department?: string;
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
} = {}) => {
  let query = supabase
    .from('non_conformances')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Apply filters if provided
  if (options.searchTerm) {
    query = query.or(`title.ilike.%${options.searchTerm}%,description.ilike.%${options.searchTerm}%,item_name.ilike.%${options.searchTerm}%`);
  }
  
  if (options.status) {
    query = query.eq('status', options.status);
  }
  
  if (options.category) {
    query = query.eq('item_category', options.category);
  }
  
  if (options.priority) {
    query = query.eq('priority', options.priority);
  }
  
  if (options.department) {
    query = query.eq('department', options.department);
  }
  
  if (options.from) {
    query = query.gte('created_at', options.from.toISOString());
  }
  
  if (options.to) {
    query = query.lte('created_at', options.to.toISOString());
  }
  
  // Pagination
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching non-conformances:', error);
    throw new Error(`Failed to fetch non-conformances: ${error.message}`);
  }
  
  return { data, count };
};

// Function to create a new non-conformance
export const createNonConformance = async (data: Partial<NonConformance>, userId: string) => {
  // Define schema for creating a new non-conformance
  const ncCreateSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    item_name: z.string().min(1, "Item name is required"),
    item_category: z.string().min(1, "Item category is required"),
    reason_category: z.string().min(1, "Reason category is required"),
    status: z.string().default('On Hold'),
    priority: z.string().optional(),
    risk_level: z.string().optional(),
    description: z.string().optional(),
    reason_details: z.string().optional(),
    quantity: z.number().nonnegative("Quantity must be non-negative").optional(),
    quantity_on_hold: z.number().nonnegative("Quantity on hold must be non-negative").optional(),
    units: z.string().optional(),
    location: z.string().optional(),
    department: z.string().optional(),
    assigned_to: z.string().optional(),
    created_by: z.string().min(1, "Created by is required"),
    reported_date: z.date().optional(),
  });
  
  // Validate the data before sending to Supabase
  const validation = validateFormData(ncCreateSchema, {
    ...data,
    created_by: userId,
    reported_date: new Date(),
  });
  
  if (!validation.success) {
    console.error('Validation errors:', validation.errors);
    throw new Error('Invalid form data');
  }
  
  // Insert the validated data
  const { data: newNC, error } = await supabase
    .from('non_conformances')
    .insert(validation.data)
    .select();
  
  if (error) {
    console.error('Error creating non-conformance:', error);
    throw new Error(`Failed to create non-conformance: ${error.message}`);
  }
  
  return newNC;
};

// NEW: Function alias for compatibility with existing components
export const fetchNonConformanceById = getNonConformanceById;
export const fetchNonConformances = async () => {
  const result = await getAllNonConformances();
  return result.data || [];
};

// NEW: Function to fetch NC activities
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  const { data, error } = await supabase
    .from('nc_activities')
    .select('*')
    .eq('non_conformance_id', nonConformanceId)
    .order('performed_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching NC activities:', error);
    throw new Error(`Failed to fetch NC activities: ${error.message}`);
  }
  
  return data || [];
};

// NEW: Function to fetch NC attachments
export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  const { data, error } = await supabase
    .from('nc_attachments')
    .select('*')
    .eq('non_conformance_id', nonConformanceId)
    .order('uploaded_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching NC attachments:', error);
    throw new Error(`Failed to fetch NC attachments: ${error.message}`);
  }
  
  return data || [];
};

// NEW: Function to upload NC attachment
export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  userId: string
): Promise<NCAttachment> => {
  try {
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${nonConformanceId}-${timestamp}.${fileExtension}`;
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('nc-attachments')
      .upload(`attachments/${fileName}`, file);
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from('nc-attachments')
      .getPublicUrl(`attachments/${fileName}`);
    
    // Create attachment record
    const attachmentData = {
      non_conformance_id: nonConformanceId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_path: publicUrl,
      description: description,
      uploaded_by: userId
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('nc_attachments')
      .insert(attachmentData)
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating attachment record:', insertError);
      throw new Error(`Failed to create attachment record: ${insertError.message}`);
    }
    
    return insertData;
  } catch (error) {
    console.error('Error in uploadNCAttachment:', error);
    throw error;
  }
};

// NEW: Function to delete a non-conformance
export const deleteNonConformance = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('non_conformances')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting non-conformance:', error);
    throw new Error(`Failed to delete non-conformance: ${error.message}`);
  }
};

// NEW: Function to fetch NC statistics
export const fetchNCStats = async () => {
  try {
    // Fetch all non-conformances for stats calculation
    const { data: nonConformances } = await supabase
      .from('non_conformances')
      .select('*');
    
    if (!nonConformances || nonConformances.length === 0) {
      return {
        total: 0,
        byStatus: {},
        byCategory: {},
        byReasonCategory: {},
        byRiskLevel: {},
        byReason: {},
        overdue: 0,
        pendingReview: 0,
        recentlyResolved: 0,
        totalQuantityOnHold: 0,
        recentItems: []
      };
    }
    
    // Calculate statistics
    const stats = {
      total: nonConformances.length,
      byStatus: countByProperty(nonConformances, 'status'),
      byCategory: countByProperty(nonConformances, 'item_category'),
      byReasonCategory: countByProperty(nonConformances, 'reason_category'),
      byRiskLevel: countByProperty(nonConformances, 'risk_level'),
      byReason: countByProperty(nonConformances, 'reason_details'),
      overdue: 0, // Would require due_date logic
      pendingReview: nonConformances.filter(nc => nc.status === 'Under Review').length,
      recentlyResolved: nonConformances.filter(nc => 
        nc.status === 'Resolved' && 
        new Date(nc.resolution_date).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
      ).length,
      totalQuantityOnHold: nonConformances.reduce((sum, nc) => sum + (nc.quantity_on_hold || 0), 0),
      recentItems: nonConformances
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5)
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching NC stats:', error);
    throw new Error(`Failed to fetch NC statistics: ${error.message}`);
  }
};

// Helper function for stats calculation
function countByProperty(array: any[], property: string): Record<string, number> {
  return array.reduce((counts, item) => {
    const value = item[property] || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}
