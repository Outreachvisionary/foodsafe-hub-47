import { BatchTrace } from '@/types/traceability';

export interface ValidationResult {
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

export interface ValidationScenario {
  id: string;
  name: string;
  description: string;
  requirements: string[];
}

export const VALIDATION_SCENARIOS: ValidationScenario[] = [
  {
    id: 'basic-traceability',
    name: 'Basic Traceability Requirements',
    description: 'Checks the baseline requirements for traceability as per FSMA 204',
    requirements: [
      'Batch/lot identification',
      'Product descriptions',
      'Supplier information',
      'Receiving records',
      'Shipping records'
    ]
  },
  {
    id: 'cte-validation',
    name: 'Critical Tracking Events (CTEs)',
    description: 'Validates the presence and completeness of Critical Tracking Events',
    requirements: [
      'Growing records (if applicable)',
      'Receiving records',
      'Transformation records',
      'Shipping records'
    ]
  },
  {
    id: 'kde-validation',
    name: 'Key Data Elements (KDEs)',
    description: 'Checks that all required KDEs are present for each CTE',
    requirements: [
      'Location identifiers',
      'Date/time information',
      'Product identifiers',
      'Quantity information',
      'Traceability lot codes'
    ]
  },
  {
    id: 'recall-readiness',
    name: 'Recall Readiness',
    description: 'Evaluates if the data is sufficient to execute a rapid recall',
    requirements: [
      'Complete supply chain mapping',
      'Accurate contact information',
      'Quantity tracking',
      'Location specificity',
      'Batch/lot specificity'
    ]
  }
];

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

export const validateAllScenarios = (batch: BatchTrace): Record<string, ValidationResult> => {
  // This is a mock implementation that would normally validate against each scenario
  const results: Record<string, ValidationResult> = {};
  
  // For demo purposes, generate results for each scenario
  VALIDATION_SCENARIOS.forEach(scenario => {
    const baseResult = validateFSMA204Compliance(batch);
    
    // Slightly modify the base result for each scenario to simulate different validations
    const scenarioResult: ValidationResult = {
      ...baseResult,
      score: Math.max(0, Math.min(100, baseResult.score + (Math.random() * 20 - 10))), // Vary score slightly
      passed: Math.random() > 0.3, // Random pass/fail but biased toward passing
      issues: [...baseResult.issues],
      details: {
        ...baseResult.details,
        missingElements: [...baseResult.details.missingElements],
        recommendedActions: [...baseResult.details.recommendedActions]
      }
    };
    
    // Add scenario-specific issues
    if (scenario.id === 'cte-validation' && !batch.distribution) {
      scenarioResult.issues.push('Missing distribution records for CTE validation');
      scenarioResult.passed = false;
    }
    
    if (scenario.id === 'kde-validation') {
      const missingKDEs = ['traceability lot code', 'product identifiers']
        .filter(() => Math.random() > 0.7); // Random selection of possible issues
      
      if (missingKDEs.length > 0) {
        scenarioResult.issues.push(`Missing KDEs: ${missingKDEs.join(', ')}`);
        scenarioResult.details.missingElements.push(...missingKDEs);
        scenarioResult.passed = false;
      }
    }
    
    if (scenario.id === 'recall-readiness') {
      // Check for missing contact information in suppliers
      const recordingIssues = !batch.suppliers || batch.suppliers.some(s => !s.name);
      if (recordingIssues) {
        scenarioResult.issues.push('Missing contact information for rapid recalls');
        scenarioResult.details.recommendedActions.push('Add contact information for all suppliers');
        scenarioResult.passed = false;
      }
    }
    
    results[scenario.id] = scenarioResult;
  });
  
  return results;
};
