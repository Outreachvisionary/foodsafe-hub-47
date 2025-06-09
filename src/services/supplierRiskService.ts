
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

// Additional functions needed by useSupplierRisk hook
export const fetchSupplierRiskAssessment = async (supplierId: string): Promise<SupplierRiskAssessment | null> => {
  return getLatestSupplierRiskAssessment(supplierId);
};

export const createRiskAssessment = async (assessment: Omit<SupplierRiskAssessment, 'id'>): Promise<SupplierRiskAssessment> => {
  return createSupplierRiskAssessment(assessment);
};

export const getRiskDistribution = async (): Promise<{
  totalSuppliers: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  highRiskPercentage: number;
  mediumRiskPercentage: number;
  lowRiskPercentage: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('supplier_risk_assessments')
      .select('risk_level');

    if (error) throw error;

    const assessments = data || [];
    const totalSuppliers = assessments.length;
    const highRiskCount = assessments.filter(a => a.risk_level === 'High').length;
    const mediumRiskCount = assessments.filter(a => a.risk_level === 'Medium').length;
    const lowRiskCount = assessments.filter(a => a.risk_level === 'Low').length;

    return {
      totalSuppliers,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      highRiskPercentage: totalSuppliers > 0 ? (highRiskCount / totalSuppliers) * 100 : 0,
      mediumRiskPercentage: totalSuppliers > 0 ? (mediumRiskCount / totalSuppliers) * 100 : 0,
      lowRiskPercentage: totalSuppliers > 0 ? (lowRiskCount / totalSuppliers) * 100 : 0,
    };
  } catch (error) {
    console.error('Error fetching risk distribution:', error);
    return {
      totalSuppliers: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      highRiskPercentage: 0,
      mediumRiskPercentage: 0,
      lowRiskPercentage: 0,
    };
  }
};

export const getRiskCategoryScores = async (supplierId: string): Promise<{ category: string; score: number }[]> => {
  try {
    const assessment = await getLatestSupplierRiskAssessment(supplierId);
    if (!assessment) return [];

    const scores: { category: string; score: number }[] = [];
    
    if (assessment.food_safety_score !== undefined) {
      scores.push({ category: 'Food Safety', score: assessment.food_safety_score });
    }
    if (assessment.quality_system_score !== undefined) {
      scores.push({ category: 'Quality System', score: assessment.quality_system_score });
    }
    if (assessment.regulatory_score !== undefined) {
      scores.push({ category: 'Regulatory', score: assessment.regulatory_score });
    }
    if (assessment.delivery_score !== undefined) {
      scores.push({ category: 'Delivery', score: assessment.delivery_score });
    }
    if (assessment.traceability_score !== undefined) {
      scores.push({ category: 'Traceability', score: assessment.traceability_score });
    }

    return scores;
  } catch (error) {
    console.error('Error fetching risk category scores:', error);
    return [];
  }
};

export const getHighRiskSuppliers = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('supplier_risk_assessments')
      .select(`
        *,
        suppliers (
          id,
          name,
          category,
          country
        )
      `)
      .eq('risk_level', 'High')
      .order('assessment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching high risk suppliers:', error);
    return [];
  }
};

export default {
  createSupplierRiskAssessment,
  getSupplierRiskAssessments,
  updateSupplierRiskAssessment,
  deleteSupplierRiskAssessment,
  getLatestSupplierRiskAssessment,
  fetchSupplierRiskAssessment,
  createRiskAssessment,
  getRiskDistribution,
  getRiskCategoryScores,
  getHighRiskSuppliers
};
