
import { useState, useEffect } from 'react';
import { 
  fetchSupplierRiskAssessment, 
  createRiskAssessment, 
  getRiskDistribution, 
  getRiskCategoryScores, 
  getHighRiskSuppliers 
} from '@/services/supplierRiskService';
import { toast } from 'sonner';

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
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
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
  const addRiskAssessment = async (assessment: Omit<RiskAssessment, 'id'>) => {
    try {
      const newAssessment = await createRiskAssessment(assessment);
      setRiskAssessment(newAssessment);
      
      // Update category scores if this is for the current supplier
      if (assessment.supplierId === supplierId) {
        const scores: { category: string; score: number }[] = [];
        
        if (assessment.foodSafetyScore !== undefined) {
          scores.push({ category: 'Food Safety', score: assessment.foodSafetyScore });
        }
        
        if (assessment.qualitySystemScore !== undefined) {
          scores.push({ category: 'Quality System', score: assessment.qualitySystemScore });
        }
        
        if (assessment.regulatoryScore !== undefined) {
          scores.push({ category: 'Regulatory', score: assessment.regulatoryScore });
        }
        
        if (assessment.deliveryScore !== undefined) {
          scores.push({ category: 'Delivery', score: assessment.deliveryScore });
        }
        
        if (assessment.traceabilityScore !== undefined) {
          scores.push({ category: 'Traceability', score: assessment.traceabilityScore });
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
