
import { supabase } from '@/integrations/supabase/client';
import { NonConformance } from '@/types/non-conformance';
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
