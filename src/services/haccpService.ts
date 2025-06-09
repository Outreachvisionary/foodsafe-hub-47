
import { supabase } from '@/integrations/supabase/client';

export interface HaccpPlan {
  id?: string;
  title: string;
  description?: string;
  facility_id?: string;
  version?: number;
  status?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  approved_by?: string;
  approved_date?: string;
  last_review_date?: string;
  next_review_date?: string;
  ccp_count?: number;
}

export interface CriticalControlPoint {
  id?: string;
  haccp_plan_id: string;
  step_number: number;
  step_description: string;
  hazard_description: string;
  critical_limits: string;
  monitoring_procedure: string;
  corrective_actions: string;
  verification_activities: string;
  record_keeping: string;
  created_at?: string;
  updated_at?: string;
}

export const createHaccpPlan = async (planData: Omit<HaccpPlan, 'id' | 'created_at' | 'updated_at'>): Promise<HaccpPlan> => {
  try {
    // Ensure required fields are present
    if (!planData.created_by) {
      throw new Error('created_by is required');
    }

    if (!planData.title) {
      throw new Error('title is required');
    }

    const dataToInsert = {
      title: planData.title,
      created_by: planData.created_by,
      description: planData.description || '',
      facility_id: planData.facility_id,
      version: planData.version || 1,
      status: planData.status || 'Draft',
      approved_by: planData.approved_by,
      approved_date: planData.approved_date,
      last_review_date: planData.last_review_date,
      next_review_date: planData.next_review_date,
      ccp_count: planData.ccp_count || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('haccp_plans')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error creating HACCP plan:', error);
      throw error;
    }

    return data as HaccpPlan;
  } catch (error) {
    console.error('Error in createHaccpPlan:', error);
    throw error;
  }
};

export const updateHaccpPlan = async (id: string, updates: Partial<HaccpPlan>): Promise<HaccpPlan> => {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('haccp_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating HACCP plan:', error);
      throw error;
    }

    return data as HaccpPlan;
  } catch (error) {
    console.error('Error in updateHaccpPlan:', error);
    throw error;
  }
};

export const createCCP = async (ccpData: Omit<CriticalControlPoint, 'id' | 'created_at' | 'updated_at'>): Promise<CriticalControlPoint> => {
  try {
    // Ensure all required fields are present
    const requiredFields = [
      'haccp_plan_id', 'step_number', 'step_description', 'hazard_description',
      'critical_limits', 'monitoring_procedure', 'corrective_actions',
      'verification_activities', 'record_keeping'
    ];

    for (const field of requiredFields) {
      if (!ccpData[field as keyof typeof ccpData]) {
        throw new Error(`${field} is required`);
      }
    }

    const dataToInsert = {
      haccp_plan_id: ccpData.haccp_plan_id,
      step_number: ccpData.step_number,
      step_description: ccpData.step_description,
      hazard_description: ccpData.hazard_description,
      critical_limits: ccpData.critical_limits,
      monitoring_procedure: ccpData.monitoring_procedure,
      corrective_actions: ccpData.corrective_actions,
      verification_activities: ccpData.verification_activities,
      record_keeping: ccpData.record_keeping,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ccps')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error creating CCP:', error);
      throw error;
    }

    return data as CriticalControlPoint;
  } catch (error) {
    console.error('Error in createCCP:', error);
    throw error;
  }
};

export const getHaccpPlans = async (): Promise<HaccpPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('haccp_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching HACCP plans:', error);
      throw error;
    }

    return data as HaccpPlan[];
  } catch (error) {
    console.error('Error in getHaccpPlans:', error);
    return [];
  }
};

export const getCCPsByPlan = async (planId: string): Promise<CriticalControlPoint[]> => {
  try {
    const { data, error } = await supabase
      .from('ccps')
      .select('*')
      .eq('haccp_plan_id', planId)
      .order('step_number');

    if (error) {
      console.error('Error fetching CCPs:', error);
      throw error;
    }

    return data as CriticalControlPoint[];
  } catch (error) {
    console.error('Error in getCCPsByPlan:', error);
    return [];
  }
};

export default {
  createHaccpPlan,
  updateHaccpPlan,
  createCCP,
  getHaccpPlans,
  getCCPsByPlan
};
