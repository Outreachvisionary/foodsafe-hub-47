
import { 
  TrainingStatus, 
  TrainingType, 
  TrainingCategory 
} from '@/types/enums';
import { TrainingPriority } from '@/types/training';

// Map database string values to our type system
export function mapToTrainingType(value: string): TrainingType {
  const mapping: Record<string, TrainingType> = {
    'onboarding': TrainingType.Onboarding,
    'compliance': TrainingType.Compliance,
    'technical': TrainingType.Technical,
    'safety': TrainingType.Safety,
    'quality': TrainingType.Quality,
    'management': TrainingType.Management,
    'other': TrainingType.Other
  };
  
  return mapping[value.toLowerCase()] || TrainingType.Other;
}

export function mapToTrainingCategory(value: string): TrainingCategory {
  const mapping: Record<string, TrainingCategory> = {
    'food_safety': TrainingCategory.FoodSafety,
    'haccp': TrainingCategory.HACCP,
    'sqf': TrainingCategory.SQF,
    'gmp': TrainingCategory.GMP,
    'sanitation': TrainingCategory.Sanitation,
    'allergen': TrainingCategory.Allergen,
    'regulatory_compliance': TrainingCategory.RegulatoryCompliance,
    'equipment_operation': TrainingCategory.EquipmentOperation,
    'other': TrainingCategory.Other
  };
  
  return mapping[value.toLowerCase()] || TrainingCategory.Other;
}

export function mapToTrainingStatus(value: string): TrainingStatus {
  const mapping: Record<string, TrainingStatus> = {
    'not started': TrainingStatus.NotStarted,
    'in progress': TrainingStatus.InProgress,
    'completed': TrainingStatus.Completed,
    'overdue': TrainingStatus.Overdue,
    'cancelled': TrainingStatus.Cancelled,
    'canceled': TrainingStatus.Cancelled, // Handle different spellings
    // Map from database values to our TrainingStatus
    'not-started': TrainingStatus.NotStarted,
    'in-progress': TrainingStatus.InProgress
  };
  
  return mapping[value.toLowerCase()] || TrainingStatus.NotStarted;
}

export function mapToCompletionStatus(value: string): string {
  const mapping: Record<string, string> = {
    'Not Started': 'not-started',
    'In Progress': 'in-progress',
    'Completed': 'completed',
    'Overdue': 'overdue',
    'Cancelled': 'cancelled',
    'Canceled': 'cancelled'
  };
  
  return mapping[value] || 'not-started';
}

export function mapToTrainingPriority(value: string): TrainingPriority {
  const mapping: Record<string, TrainingPriority> = {
    'critical': TrainingPriority.Critical,
    'high': TrainingPriority.High,
    'medium': TrainingPriority.Medium,
    'low': TrainingPriority.Low
  };
  
  return mapping[value.toLowerCase()] || TrainingPriority.Medium;
}

export function mapToRecurrencePattern(value: string): string {
  const mapping: Record<string, string> = {
    'daily': 'daily',
    'weekly': 'weekly',
    'monthly': 'monthly',
    'quarterly': 'quarterly',
    'annual': 'annual',
    'annually': 'annual', // Handle different wording
    'Monthly': 'monthly', // Handle capitalization
    'Annually': 'annual'
  };
  
  return mapping[value] || 'monthly';
}

// Helper to ensure string arrays
export function ensureStringArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  return [String(value)];
}
