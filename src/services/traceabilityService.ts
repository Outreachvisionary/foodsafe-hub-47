
import { BatchTrace, BatchIngredient, FDA204Report, generateFDA204Report, isRecallNeeded } from '@/types/traceability';
import { validateFSMA204Compliance } from '@/services/fsma204ValidationService';
import { toast } from 'sonner';

// Evaluate if a batch needs to be recalled and generate appropriate documentation
export const evaluateRecallNeed = (batch: BatchTrace) => {
  if (isRecallNeeded(batch)) {
    const report = generateFDA204Report(batch);
    
    // Validate the batch against FSMA 204 requirements
    const validationResult = validateFSMA204Compliance(batch);
    
    // If there are compliance issues, warn about them
    if (!validationResult.passed) {
      const criticalIssues = validationResult.failedChecks.filter(c => c.impact === 'Critical').length;
      if (criticalIssues > 0) {
        toast.warning(`Recall documentation has ${criticalIssues} critical FSMA 204 compliance issues`);
      }
    }
    
    triggerRecallAlerts(batch, report);
    return { needsRecall: true, report, validationResult };
  }
  return { needsRecall: false };
};

// Trigger appropriate alerts and actions when a recall is needed
export const triggerRecallAlerts = (batch: BatchTrace, report: FDA204Report) => {
  // Send notifications to quality team
  toast.error(`Recall recommended for batch ${batch.id} - ${batch.product}`);
  
  // In a real implementation, this would:
  // 1. Send notifications to relevant teams
  // 2. Flag suppliers for investigation
  // 3. Lock affected batches
  // 4. Schedule relevant training
  console.log('Recall alerts triggered for batch:', batch.id);
  console.log('FDA 204 Report generated:', report);
};

// Get mock complaint trend data
// In a real implementation, this would connect to your complaints database
export const getComplaintTrend = (productId: string | undefined): number => {
  if (!productId) return 0;
  
  // For demonstration purposes, return a random percentage
  // In a real application, this would calculate the actual trend
  const mockTrends: Record<string, number> = {
    'PROD-001': 5,
    'PROD-002': 18, // This would trigger a recall based on the 15% threshold
    'PROD-003': 2,
  };
  
  return mockTrends[productId] || Math.floor(Math.random() * 20);
};

// Evaluate if an ingredient needs to be recalled based on nonconformance level
export const evaluateIngredientRisk = (ingredient: BatchIngredient) => {
  if (ingredient.nonConformanceLevel === 'CLASS_I') {
    return { riskLevel: 'High', requiresRecall: true };
  } else if (ingredient.nonConformanceLevel === 'CLASS_II') {
    return { riskLevel: 'Medium', requiresRecall: false };
  } else {
    return { riskLevel: 'Low', requiresRecall: false };
  }
};
