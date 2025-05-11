
import { supabase } from '@/integrations/supabase/client';

export interface HaccpPlan {
  id: string;
  title: string;
  description: string;
  product_scope: string;
  created_by: string;
  status: string;
  ccp_count: number;
  created_at: string;
  updated_at: string;
  version: number;
  approved_by?: string;
  approved_date?: string;
  last_review_date?: string;
  next_review_date?: string;
  review_frequency?: string;
}

export interface CriticalControlPoint {
  id: string;
  haccp_plan_id: string;
  step_number: number;
  step_description: string;
  hazard_description: string;
  critical_limits: string;
  monitoring_procedure: string;
  corrective_actions: string;
  verification_activities: string;
  record_keeping: string;
  created_at: string;
  updated_at: string;
}

// Fetch all HACCP plans
export const fetchHaccpPlans = async (): Promise<HaccpPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('haccp_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching HACCP plans:', error);
    return [];
  }
};

// Fetch a single HACCP plan by ID
export const fetchHaccpPlanById = async (planId: string): Promise<HaccpPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('haccp_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching HACCP plan with ID ${planId}:`, error);
    return null;
  }
};

// Fetch CCPs for a specific HACCP plan
export const fetchCriticalControlPoints = async (planId: string): Promise<CriticalControlPoint[]> => {
  try {
    const { data, error } = await supabase
      .from('ccps')
      .select('*')
      .eq('haccp_plan_id', planId)
      .order('step_number', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching CCPs for plan ${planId}:`, error);
    return [];
  }
};

// Create a new HACCP plan
export const createHaccpPlan = async (plan: Partial<HaccpPlan>): Promise<HaccpPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('haccp_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating HACCP plan:', error);
    return null;
  }
};

// Update an existing HACCP plan
export const updateHaccpPlan = async (planId: string, updates: Partial<HaccpPlan>): Promise<HaccpPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('haccp_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating HACCP plan ${planId}:`, error);
    return null;
  }
};

// Add a Critical Control Point to a HACCP plan
export const addCriticalControlPoint = async (ccp: Partial<CriticalControlPoint>): Promise<CriticalControlPoint | null> => {
  try {
    const { data, error } = await supabase
      .from('ccps')
      .insert(ccp)
      .select()
      .single();

    if (error) throw error;
    
    // Update the CCP count on the parent HACCP plan
    await updateHaccpPlanCcpCount(ccp.haccp_plan_id as string);
    
    return data;
  } catch (error) {
    console.error('Error adding Critical Control Point:', error);
    return null;
  }
};

// Helper function to update CCP count
const updateHaccpPlanCcpCount = async (planId: string): Promise<void> => {
  try {
    // Count CCPs for this plan
    const { count, error: countError } = await supabase
      .from('ccps')
      .select('*', { count: 'exact', head: true })
      .eq('haccp_plan_id', planId);
    
    if (countError) throw countError;
    
    // Update the plan with the new count
    const { error: updateError } = await supabase
      .from('haccp_plans')
      .update({ ccp_count: count || 0 })
      .eq('id', planId);
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error(`Error updating CCP count for plan ${planId}:`, error);
  }
};
