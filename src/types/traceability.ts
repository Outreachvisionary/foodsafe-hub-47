
import { FoodHazardType } from '@/hooks/useAuditTraining';

export interface CCPCheck {
  id: string;
  ccpId: string;
  name: string;
  target: number | string;
  actual: number | string;
  unit: string;
  timestamp: string;
  passed: boolean;
  auditor: string;
  auditId?: string;
  hazardType: FoodHazardType;
  notes?: string;
  criticality?: 'CRITICAL' | 'MAJOR' | 'MINOR';
}

export interface BatchIngredient {
  id: string;
  name: string;
  lotNumber: string;
  nonConformanceLevel?: 'CLASS_I' | 'CLASS_II' | 'CLASS_III';
  allergens?: string[];
}

export interface BatchSupplier {
  id: string;
  name: string;
  auditScore?: number;
  certificates?: string[];
  ingredients?: BatchIngredient[];
}

export interface DistributionNode {
  id: string;
  facilityId: string;
  date: string;
  location: string;
  contact: string;
}

export interface BatchTrace {
  id: string;
  product: string;
  date: string;
  quantity: string;
  status: 'Released' | 'On Hold' | 'Recalled' | 'In Production';
  suppliers: BatchSupplier[];
  location: string;
  haccpChecks: CCPCheck[];
  distribution?: DistributionNode[];
  lotNumber?: string;
  productId?: string;
}

export interface RecallEvent {
  id: string;
  date: string;
  type: 'Mock' | 'Actual';
  product: string;
  reason: string;
  timeToComplete: string;
  recoveryRate: string;
}

export interface FDA204Report {
  sections: Array<{
    title: string;
    data: any;
  }>;
  batchId: string;
  generatedDate: string;
  regulatoryContact: string;
}

// Let's add the missing functions that were causing errors in other components
export const evaluateRecallNeed = (batch: BatchTrace): { needed: boolean; reason: string } => {
  const isNeeded = isRecallNeeded(batch);
  
  return {
    needed: isNeeded,
    reason: isNeeded 
      ? 'Critical failures detected that require recall action' 
      : 'No critical failures detected'
  };
};

export const getComplaintTrend = (productId: string): number => {
  // Mock implementation - in a real app, this would query complaint data
  // and calculate trends
  const mockTrendData: Record<string, number> = {
    'prod-123': 25,
    'prod-124': 5,
    'prod-125': 18,
    'prod-126': 12
  };
  
  return mockTrendData[productId] || 0;
};

// Enhanced recall evaluation with FSMA 204 compliance logic
export const isRecallNeeded = (batch: BatchTrace): boolean => {
  // Check for CCP failures, focusing on critical control points
  const ccpFailure = batch.haccpChecks.some(check => 
    !check.passed && (check.criticality === 'CRITICAL' || !check.criticality)
  );
  
  // Check for supplier issues, including both audit scores and ingredient non-conformances
  const supplierRisk = batch.suppliers.some(supplier => 
    (supplier.auditScore !== undefined && supplier.auditScore < 80) ||
    (supplier.ingredients?.some(ingredient => 
      ingredient.nonConformanceLevel === 'CLASS_I'
    ))
  );
  
  // If either condition is met, a recall is needed
  return ccpFailure || supplierRisk;
};

// New function to generate FSMA 204-compliant reports
export const generateFDA204Report = (batch: BatchTrace): FDA204Report => {
  return {
    batchId: batch.id,
    generatedDate: new Date().toISOString(),
    regulatoryContact: 'regulatory@company.com',
    sections: [
      {
        title: 'Critical Tracking Events',
        data: batch.distribution?.map(node => ({
          timestamp: node.date,
          location: node.location,
          facilityId: node.facilityId,
          contact: node.contact
        })) || []
      },
      {
        title: 'Key Data Elements',
        data: {
          LOT: batch.lotNumber || batch.id,
          PRODUCT: batch.product,
          QUANTITY: batch.quantity,
          DATE: batch.date,
          CCP_FAILURES: batch.haccpChecks.filter(check => !check.passed),
          SUPPLIER_ISSUES: batch.suppliers.filter(supplier => 
            supplier.auditScore !== undefined && supplier.auditScore < 80
          )
        }
      }
    ]
  };
};
