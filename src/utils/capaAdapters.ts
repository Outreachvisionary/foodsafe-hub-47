
import { CAPAStatus, CAPAPriority } from '@/types/enums';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  source: string;
  source_id?: string;
  assigned_to?: string;
  due_date?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  verification_method?: string;
  effectiveness_criteria?: string;
  department?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  closed_date?: string;
  verified_date?: string;
  effectiveness_rating?: string;
}

export const adaptCAPAToModel = (capaData: any): CAPA => {
  return {
    ...capaData,
    status: capaData.status as CAPAStatus,
    priority: capaData.priority as CAPAPriority
  };
};

export const capaStatusToString = (status: CAPAStatus): string => {
  if (typeof status === 'string') return status;
  return status as unknown as string;
};

export const stringToCAPAStatus = (status: string): CAPAStatus => {
  // Normalize the status string to match the CAPAStatus enum format
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as CAPAStatus;
};

// Add the missing function that's being imported in LinkedCAPAsList.tsx
export const convertToCAPAStatus = (status: string | CAPAStatus): CAPAStatus => {
  if (typeof status !== 'string') {
    return status;
  }
  
  return stringToCAPAStatus(status);
};

// Add the CAPAInput interface
export interface CAPAInput {
  title: string;
  description: string;
  status?: CAPAStatus | string;
  priority?: CAPAPriority | string;
  source?: string;
  source_id?: string;
  assigned_to?: string;
  due_date?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  verification_method?: string;
  effectiveness_criteria?: string;
  department?: string;
}
