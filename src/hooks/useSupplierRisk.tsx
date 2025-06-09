
import { useState, useEffect } from 'react';
import { 
  fetchSupplierRiskAssessment, 
  createRiskAssessment, 
  getRiskDistribution, 
  getRiskCategoryScores, 
  getHighRiskSuppliers,
  SupplierRiskAssessment
} from '@/services/supplierRiskService';
import { toast } from 'sonner';

interface RiskDistribution {
  totalSuppliers: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  highRiskPercentage: number;
  mediumRiskPercentage: number;
  lowRiskPercentage: number;
}

export function useSupplierRisk(supplierId?: string) {
  const [riskAssessment, setRiskAssessment] = useState<SupplierRiskAssessment | null>(null);
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution | null>(null);
  const [categoryScores, setCategoryScores] = useState<{ category: string; score: number }[]>([]);
  const [highRiskSuppliers, setHighRiskSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load risk data
  const loadRiskData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get risk distribution data
      const distribution = await getRiskDistribution();
      setRiskDistribution(distribution);
      
      // Get high risk suppliers
      const highRisk = await getHighRiskSuppliers();
      setHighRiskSuppliers(highRisk);
      
      // If we have a supplier ID, get specific data
      if (supplierId) {
        // Get risk assessment
        const assessment = await fetchSupplierRiskAssessment(supplierId);
        setRiskAssessment(assessment);
        
        // Get category scores
        const scores = await getRiskCategoryScores(supplierId);
        setCategoryScores(scores);
      }
    } catch (err) {
      console.error('Error loading risk data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load risk data'));
      toast.error('Failed to load risk assessment data');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new risk assessment
  const addRiskAssessment = async (assessment: Omit<SupplierRiskAssessment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAssessment = await createRiskAssessment(assessment);
      setRiskAssessment(newAssessment);
      
      // Update category scores if this is for the current supplier
      if (assessment.supplier_id === supplierId) {
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
        
        setCategoryScores(scores);
      }
      
      // Refresh risk distribution data
      const distribution = await getRiskDistribution();
      setRiskDistribution(distribution);
      
      // Refresh high risk suppliers
      const highRisk = await getHighRiskSuppliers();
      setHighRiskSuppliers(highRisk);
      
      toast.success('Risk assessment created successfully');
      return newAssessment;
    } catch (err) {
      console.error('Error creating risk assessment:', err);
      toast.error('Failed to create risk assessment');
      throw err;
    }
  };

  // Load risk data when the component mounts or supplierId changes
  useEffect(() => {
    loadRiskData();
  }, [supplierId]);

  return {
    riskAssessment,
    riskDistribution,
    categoryScores,
    highRiskSuppliers,
    isLoading,
    error,
    loadRiskData,
    addRiskAssessment
  };
}
