
import { BatchTrace, FDA204Report, generateFDA204Report, isRecallNeeded } from '@/types/traceability';
import { toast } from 'sonner';

// Evaluate if a batch needs to be recalled and generate appropriate documentation
export const evaluateRecallNeed = (batch: BatchTrace) => {
  if (isRecallNeeded(batch)) {
    const report = generateFDA204Report(batch);
    triggerRecallAlerts(batch, report);
    return { needsRecall: true, report };
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
