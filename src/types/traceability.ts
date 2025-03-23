
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
}

export interface BatchTrace {
  id: string;
  product: string;
  date: string;
  quantity: string;
  status: 'Released' | 'On Hold' | 'Recalled' | 'In Production';
  suppliers: Array<{
    id: string;
    name: string;
    auditScore?: number;
    certificates?: string[];
  }>;
  location: string;
  haccpChecks: CCPCheck[];
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

export const isRecallNeeded = (batch: BatchTrace): boolean => 
  batch.haccpChecks.some(check => !check.passed) ||
  batch.suppliers.some(s => s.auditScore !== undefined && s.auditScore < 80);
