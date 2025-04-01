
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RiskAssessment {
  id: string;
  supplier_id: string;
  assessed_by: string;
  assessment_date: string;
  overall_score: number;
  risk_level: string;
  food_safety_score: number;
  quality_system_score: number;
  regulatory_score: number;
  delivery_score: number;
  traceability_score: number;
  notes?: string;
  next_assessment_date?: string;
  risk_factors?: any;
  created_at: string;
  updated_at: string;
  suppliers?: {
    name: string;
  };
}

export interface RiskStatistics {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  totalAssessments: number;
}

export function useSupplierRiskAssessment(supplierId?: string) {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [statistics, setStatistics] = useState<RiskStatistics>({
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    totalAssessments: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAssessments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('supplier_risk_assessments')
        .select(`
          *,
          suppliers(name)
        `)
        .order('assessment_date', { ascending: false });
      
      // If supplierId is provided, filter by supplier
      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setAssessments(data || []);
      
      // Calculate statistics
      const highRisk = (data || []).filter(a => a.risk_level === 'High').length;
      const mediumRisk = (data || []).filter(a => a.risk_level === 'Medium').length;
      const lowRisk = (data || []).filter(a => a.risk_level === 'Low').length;
      
      setStatistics({
        highRiskCount: highRisk,
        mediumRiskCount: mediumRisk,
        lowRiskCount: lowRisk,
        totalAssessments: (data || []).length
      });
    } catch (err) {
      console.error('Error loading risk assessments:', err);
      setError(err instanceof Error ? err : new Error('Failed to load risk assessments'));
      toast.error('Failed to load risk assessments');
    } finally {
      setIsLoading(false);
    }
  };

  const createRiskAssessment = async (assessment: {
    supplier_id: string;
    food_safety_score: number;
    quality_system_score: number;
    regulatory_score: number;
    delivery_score: number;
    traceability_score: number;
    notes?: string;
    next_assessment_date?: string;
  }) => {
    try {
      // Calculate overall score as average of the individual scores
      const overallScore = Math.round(
        (assessment.food_safety_score +
         assessment.quality_system_score +
         assessment.regulatory_score +
         assessment.delivery_score +
         assessment.traceability_score) / 5
      );
      
      // Determine risk level based on overall score
      let riskLevel = 'Low';
      if (overallScore < 70) {
        riskLevel = 'High';
      } else if (overallScore < 85) {
        riskLevel = 'Medium';
      }
      
      const { data, error } = await supabase
        .from('supplier_risk_assessments')
        .insert({
          ...assessment,
          overall_score: overallScore,
          risk_level: riskLevel,
          assessed_by: 'Quality Manager', // Hardcoded for now, should come from authentication
          assessment_date: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      // Update supplier's risk score if this is the latest assessment
      await supabase
        .from('suppliers')
        .update({ 
          risk_score: overallScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', assessment.supplier_id);
        
      toast.success('Risk assessment created successfully');
      loadAssessments();
      return data[0];
    } catch (err) {
      console.error('Error creating risk assessment:', err);
      toast.error('Failed to create risk assessment');
      throw err;
    }
  };

  // Load assessments on mount or when supplierId changes
  useEffect(() => {
    loadAssessments();
  }, [supplierId]);

  return {
    assessments,
    statistics,
    isLoading,
    error,
    loadAssessments,
    createRiskAssessment
  };
}
