
import { 
  TrainingType, 
  TrainingCategory, 
  TrainingStatus, 
  TrainingCompletionStatus, 
  TrainingPriority,
  RecurrencePattern
} from '@/types/training';

// Map database string values to our type system
export function mapToTrainingType(value: string): TrainingType {
  const mapping: Record<string, TrainingType> = {
    'onboarding': 'onboarding',
    'food-safety': 'food-safety',
    'regulatory': 'regulatory',
    'quality': 'quality',
    'procedural': 'procedural',
    'operational': 'operational',
    'technical': 'technical',
    'soft-skills': 'soft-skills'
  };
  
  return mapping[value.toLowerCase()] || 'other' as TrainingType;
}

export function mapToTrainingCategory(value: string): TrainingCategory {
  const mapping: Record<string, TrainingCategory> = {
    'haccp': 'haccp',
    'gmp': 'gmp',
    'fsma': 'fsma',
    'allergen': 'allergen',
    'sanitation': 'sanitation',
    'quality': 'quality',
    'safety': 'safety',
    'compliance': 'compliance',
    'leadership': 'leadership',
    'technical': 'technical',
    'other': 'other'
  };
  
  return mapping[value.toLowerCase()] || 'other';
}

export function mapToTrainingStatus(value: string): TrainingStatus {
  const mapping: Record<string, TrainingStatus> = {
    'not started': 'Not Started',
    'in progress': 'In Progress',
    'completed': 'Completed',
    'overdue': 'Overdue',
    'cancelled': 'Cancelled',
    'canceled': 'Cancelled', // Handle different spellings
    // Map from database values to our TrainingStatus
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'overdue': 'Overdue',
    'cancelled': 'Cancelled',
    'canceled': 'Cancelled'
  };
  
  return mapping[value.toLowerCase()] || 'Not Started';
}

export function mapToCompletionStatus(value: string): TrainingCompletionStatus {
  const mapping: Record<string, TrainingCompletionStatus> = {
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
    'critical': 'critical',
    'high': 'high',
    'medium': 'medium',
    'low': 'low'
  };
  
  return mapping[value.toLowerCase()] || 'medium';
}

export function mapToRecurrencePattern(value: string): RecurrencePattern {
  const mapping: Record<string, RecurrencePattern> = {
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
