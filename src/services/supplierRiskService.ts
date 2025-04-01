
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Interface representing a risk assessment
interface RiskAssessment {
  id: string;
  supplierId: string;
  assessmentDate: string;
  assessedBy: string;
  overallScore: number;
  foodSafetyScore?: number;
  qualitySystemScore?: number;
  regulatoryScore?: number;
  deliveryScore?: number;
  traceabilityScore?: number;
  riskFactors?: Record<string, any>;
  riskLevel: 'Low' | 'Medium' | 'High';
  nextAssessmentDate?: string;
  notes?: string;
}

// Interface for supplier risk distribution
interface RiskDistribution {
  totalSuppliers: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  highRiskPercentage: number;
  mediumRiskPercentage: number;
  lowRiskPercentage: number;
}

// Interface for risk category data
interface RiskCategoryScore {
  category: string;
  score: number;
}

// Fetch a supplier's risk assessment
export const fetchSupplierRiskAssessment = async (supplierId: string): Promise<RiskAssessment | null> => {
  const { data, error } = await supabase
    .from('supplier_risk_assessments')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('assessment_date', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No risk assessment found
      return null;
    }
    console.error(`Error fetching risk assessment for supplier ${supplierId}:`, error);
    throw new Error('Failed to fetch supplier risk assessment');
  }
  
  return {
    id: data.id,
    supplierId: data.supplier_id,
    assessmentDate: data.assessment_date,
    assessedBy: data.assessed_by,
    overallScore: data.overall_score,
    foodSafetyScore: data.food_safety_score,
    qualitySystemScore: data.quality_system_score,
    regulatoryScore: data.regulatory_score,
    deliveryScore: data.delivery_score,
    traceabilityScore: data.traceability_score,
    riskFactors: data.risk_factors,
    riskLevel: data.risk_level,
    nextAssessmentDate: data.next_assessment_date,
    notes: data.notes
  };
};

// Create a new risk assessment for a supplier
export const createRiskAssessment = async (assessment: Omit<RiskAssessment, 'id'>): Promise<RiskAssessment> => {
  const id = uuidv4();
  
  // Calculate risk level if not provided
  let riskLevel = assessment.riskLevel;
  if (!riskLevel) {
    const score = assessment.overallScore;
    if (score >= 85) riskLevel = 'Low';
    else if (score >= 70) riskLevel = 'Medium';
    else riskLevel = 'High';
  }
  
  const { data, error } = await supabase
    .from('supplier_risk_assessments')
    .insert({
      id,
      supplier_id: assessment.supplierId,
      assessment_date: assessment.assessmentDate || new Date().toISOString(),
      assessed_by: assessment.assessedBy,
      overall_score: assessment.overallScore,
      food_safety_score: assessment.foodSafetyScore,
      quality_system_score: assessment.qualitySystemScore,
      regulatory_score: assessment.regulatoryScore,
      delivery_score: assessment.deliveryScore,
      traceability_score: assessment.traceabilityScore,
      risk_factors: assessment.riskFactors,
      risk_level: riskLevel,
      next_assessment_date: assessment.nextAssessmentDate,
      notes: assessment.notes
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating risk assessment:', error);
    throw new Error('Failed to create risk assessment');
  }
  
  // Update the supplier's risk score
  await supabase
    .from('suppliers')
    .update({ 
      risk_score: assessment.overallScore,
      updated_at: new Date().toISOString()
    })
    .eq('id', assessment.supplierId);
  
  return {
    id: data.id,
    supplierId: data.supplier_id,
    assessmentDate: data.assessment_date,
    assessedBy: data.assessed_by,
    overallScore: data.overall_score,
    foodSafetyScore: data.food_safety_score,
    qualitySystemScore: data.quality_system_score,
    regulatoryScore: data.regulatory_score,
    deliveryScore: data.delivery_score,
    traceabilityScore: data.traceability_score,
    riskFactors: data.risk_factors,
    riskLevel: data.risk_level,
    nextAssessmentDate: data.next_assessment_date,
    notes: data.notes
  };
};

// Get distribution of suppliers by risk level
export const getRiskDistribution = async (): Promise<RiskDistribution> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('risk_score');
  
  if (error) {
    console.error('Error fetching risk distribution:', error);
    throw new Error('Failed to fetch risk distribution');
  }
  
  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;
  
  data.forEach(supplier => {
    const score = supplier.risk_score;
    if (score >= 85) lowRiskCount++;
    else if (score >= 70) mediumRiskCount++;
    else highRiskCount++;
  });
  
  const totalSuppliers = data.length;
  
  return {
    totalSuppliers,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    highRiskPercentage: totalSuppliers > 0 ? Math.round((highRiskCount / totalSuppliers) * 100) : 0,
    mediumRiskPercentage: totalSuppliers > 0 ? Math.round((mediumRiskCount / totalSuppliers) * 100) : 0,
    lowRiskPercentage: totalSuppliers > 0 ? Math.round((lowRiskCount / totalSuppliers) * 100) : 0
  };
};

// Get risk category scores for a supplier
export const getRiskCategoryScores = async (supplierId: string): Promise<RiskCategoryScore[]> => {
  const { data, error } = await supabase
    .from('supplier_risk_assessments')
    .select('food_safety_score, quality_system_score, regulatory_score, delivery_score, traceability_score')
    .eq('supplier_id', supplierId)
    .order('assessment_date', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No risk assessment found, return empty array
      return [];
    }
    console.error(`Error fetching risk category scores for supplier ${supplierId}:`, error);
    throw new Error('Failed to fetch risk category scores');
  }
  
  const scores: RiskCategoryScore[] = [];
  
  if (data.food_safety_score !== null) {
    scores.push({ category: 'Food Safety', score: data.food_safety_score });
  }
  
  if (data.quality_system_score !== null) {
    scores.push({ category: 'Quality System', score: data.quality_system_score });
  }
  
  if (data.regulatory_score !== null) {
    scores.push({ category: 'Regulatory', score: data.regulatory_score });
  }
  
  if (data.delivery_score !== null) {
    scores.push({ category: 'Delivery', score: data.delivery_score });
  }
  
  if (data.traceability_score !== null) {
    scores.push({ category: 'Traceability', score: data.traceability_score });
  }
  
  return scores;
};

// Get high-risk suppliers
export const getHighRiskSuppliers = async (limit: number = 3): Promise<any[]> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select(`
      id,
      name,
      risk_score,
      supplier_risk_assessments (
        risk_level,
        food_safety_score,
        quality_system_score,
        regulatory_score,
        delivery_score,
        traceability_score,
        notes
      )
    `)
    .order('risk_score', { ascending: true })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching high-risk suppliers:', error);
    throw new Error('Failed to fetch high-risk suppliers');
  }
  
  return data.map(supplier => ({
    id: supplier.id,
    name: supplier.name,
    riskScore: supplier.risk_score,
    riskLevel: supplier.supplier_risk_assessments?.[0]?.risk_level || 'High',
    categories: {
      foodSafety: supplier.supplier_risk_assessments?.[0]?.food_safety_score,
      qualitySystem: supplier.supplier_risk_assessments?.[0]?.quality_system_score,
      regulatory: supplier.supplier_risk_assessments?.[0]?.regulatory_score,
      delivery: supplier.supplier_risk_assessments?.[0]?.delivery_score,
      traceability: supplier.supplier_risk_assessments?.[0]?.traceability_score
    },
    issues: supplier.supplier_risk_assessments?.[0]?.notes?.split('\n') || []
  }));
};

// Export all functions
export default {
  fetchSupplierRiskAssessment,
  createRiskAssessment,
  getRiskDistribution,
  getRiskCategoryScores,
  getHighRiskSuppliers
};
