
import { supabase } from '@/integrations/supabase/client';

export interface SupplierRiskAssessment {
  id?: string;
  supplier_id: string;
  assessment_date?: string;
  overall_score: number;
  food_safety_score?: number;
  quality_system_score?: number;
  regulatory_score?: number;
  delivery_score?: number;
  traceability_score?: number;
  risk_factors?: Record<string, any>;
  next_assessment_date?: string;
  created_at?: string;
  updated_at?: string;
  assessed_by: string;
  risk_level: 'Low' | 'Medium' | 'High';
  notes?: string;
}

export const createSupplierRiskAssessment = async (
  assessmentData: Omit<SupplierRiskAssessment, 'id' | 'created_at' | 'updated_at'>
): Promise<SupplierRiskAssessment> => {
  try {
    const { data, error } = await supabase
      .from('supplier_risk_assessments')
      .insert({
        ...assessmentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as SupplierRiskAssessment;
  } catch (error) {
    console.error('Error creating supplier risk assessment:', error);
    throw error;
  }
};

export const getSupplierRiskAssessments = async (supplierId?: string): Promise<SupplierRiskAssessment[]> => {
  try {
    let query = supabase
      .from('supplier_risk_assessments')
      .select('*')
      .order('assessment_date', { ascending: false });

    if (supplierId) {
      query = query.eq('supplier_id', supplierId);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Convert Json types to proper types and ensure type safety
    return (data || []).map(item => ({
      ...item,
      risk_factors: typeof item.risk_factors === 'object' && item.risk_factors !== null 
        ? item.risk_factors as Record<string, any>
        : {},
      risk_level: (item.risk_level as 'Low' | 'Medium' | 'High') || 'Medium'
    }));
  } catch (error) {
    console.error('Error fetching supplier risk assessments:', error);
    return [];
  }
};

export const updateSupplierRiskAssessment = async (
  id: string,
  updates: Partial<SupplierRiskAssessment>
): Promise<SupplierRiskAssessment> => {
  try {
    const { data, error } = await supabase
      .from('supplier_risk_assessments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Convert Json types to proper types
    return {
      ...data,
      risk_factors: typeof data.risk_factors === 'object' && data.risk_factors !== null 
        ? data.risk_factors as Record<string, any>
        : {},
      risk_level: (data.risk_level as 'Low' | 'Medium' | 'High') || 'Medium'
    };
  } catch (error) {
    console.error('Error updating supplier risk assessment:', error);
    throw error;
  }
};

export const deleteSupplierRiskAssessment = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('supplier_risk_assessments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting supplier risk assessment:', error);
    throw error;
  }
};

export const getLatestSupplierRiskAssessment = async (supplierId: string): Promise<SupplierRiskAssessment | null> => {
  try {
    const { data, error } = await supabase
      .from('supplier_risk_assessments')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;
    
    // Convert Json types to proper types
    return {
      ...data,
      risk_factors: typeof data.risk_factors === 'object' && data.risk_factors !== null 
        ? data.risk_factors as Record<string, any>
        : {},
      risk_level: (data.risk_level as 'Low' | 'Medium' | 'High') || 'Medium'
    };
  } catch (error) {
    console.error('Error fetching latest supplier risk assessment:', error);
    return null;
  }
};

export default {
  createSupplierRiskAssessment,
  getSupplierRiskAssessments,
  updateSupplierRiskAssessment,
  deleteSupplierRiskAssessment,
  getLatestSupplierRiskAssessment
};
