
import { BatchTrace } from '@/types/traceability';

interface ValidationResult {
  passed: boolean;
  issues: string[];
  score: number;
  details: {
    kdeComplete: boolean;
    cteComplete: boolean;
    missingElements: string[];
    recommendedActions: string[];
  };
}

export const validateFSMA204Compliance = (batch: BatchTrace): ValidationResult => {
  // Mock implementation of FSMA 204 validation
  const issues: string[] = [];
  const missingElements: string[] = [];
  const recommendedActions: string[] = [];
  
  // Check for required Key Data Elements (KDEs)
  if (!batch.lotNumber) {
    missingElements.push('Lot Number');
    recommendedActions.push('Add lot number to product records');
  }
  
  // Check for traceability data completeness
  if (!batch.distribution || batch.distribution.length === 0) {
    missingElements.push('Distribution Records');
    recommendedActions.push('Record distribution chain information');
    issues.push('Missing Critical Tracking Events (CTEs)');
  }
  
  // Check for supplier information completeness
  if (!batch.suppliers || batch.suppliers.length === 0) {
    missingElements.push('Supplier Information');
    recommendedActions.push('Record supplier details for traceability');
    issues.push('Missing supplier information required by FSMA 204');
  } else {
    // Check if suppliers have required information
    batch.suppliers.forEach(supplier => {
      if (!supplier.ingredients || supplier.ingredients.length === 0) {
        missingElements.push(`Ingredients from ${supplier.name}`);
        recommendedActions.push(`Record ingredients from supplier: ${supplier.name}`);
      }
    });
  }
  
  // Calculate compliance score (0-100)
  const maxScore = 100;
  const deductionsPerIssue = 15;
  const deductionsPerMissingElement = 10;
  
  const deductions = 
    (issues.length * deductionsPerIssue) + 
    (missingElements.length * deductionsPerMissingElement);
  
  const score = Math.max(0, Math.min(100, maxScore - deductions));
  
  return {
    passed: score >= 80,
    issues,
    score,
    details: {
      kdeComplete: missingElements.length === 0,
      cteComplete: batch.distribution !== undefined && batch.distribution.length > 0,
      missingElements,
      recommendedActions
    }
  };
};
