
import { useState, useEffect } from 'react';

interface AuditRelatedTraining {
  id: string;
  auditId: string;
  findingId: string;
  courseTitle: string;
  assignedTo: string[];
  dueDate: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue';
  category?: FoodSafetyCategory;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

// Food safety specific categories
export type FoodSafetyCategory = 
  | 'temperature-control' 
  | 'allergen-control' 
  | 'hygiene-monitoring' 
  | 'documentation' 
  | 'sanitization' 
  | 'pest-control'
  | 'foreign-material'
  | 'traceability'
  | 'general';

// Map food safety categories to recommended training courses
export const FOOD_SAFETY_TRAINING_MAP: Record<FoodSafetyCategory, string[]> = {
  'temperature-control': ['Cold Chain Management', 'Thermometer Calibration'],
  'allergen-control': ['Allergen Management', 'Cross-Contamination Prevention'],
  'hygiene-monitoring': ['GMP Basics', 'Personal Hygiene Standards'],
  'documentation': ['Record Keeping Compliance', 'Documentation Best Practices'],
  'sanitization': ['Sanitation Procedures', 'Chemical Safety'],
  'pest-control': ['Integrated Pest Management', 'Pest Prevention Strategies'],
  'foreign-material': ['Foreign Material Prevention', 'Metal Detection Systems'],
  'traceability': ['Product Traceability', 'Lot Coding Systems'],
  'general': ['Food Safety Refresher', 'HACCP Principles']
};

// This would normally be fetched from an API
const mockAuditTrainingData: AuditRelatedTraining[] = [
  {
    id: 'train1',
    auditId: 'A001',
    findingId: 'find1',
    courseTitle: 'Food Safety Refresher',
    assignedTo: ['emp1', 'emp2'],
    dueDate: '2023-08-30',
    status: 'completed',
    category: 'general',
    priority: 'medium'
  },
  {
    id: 'train2',
    auditId: 'A002',
    findingId: 'find2',
    courseTitle: 'GMP Basics',
    assignedTo: ['emp3'],
    dueDate: '2023-07-15',
    status: 'overdue',
    category: 'hygiene-monitoring',
    priority: 'high'
  },
  {
    id: 'train3',
    auditId: 'A003',
    findingId: 'find3',
    courseTitle: 'HACCP Principles',
    assignedTo: ['emp1', 'emp4'],
    dueDate: '2023-09-01',
    status: 'in-progress',
    category: 'general',
    priority: 'medium'
  },
  {
    id: 'train4',
    auditId: 'A004',
    findingId: 'find4',
    courseTitle: 'Allergen Management',
    assignedTo: ['emp2', 'emp5'],
    dueDate: '2023-09-15',
    status: 'assigned',
    category: 'allergen-control',
    priority: 'critical'
  },
  {
    id: 'train5',
    auditId: 'A002',
    findingId: 'find5',
    courseTitle: 'Cold Chain Management',
    assignedTo: ['emp1', 'emp3'],
    dueDate: '2023-10-01',
    status: 'assigned',
    category: 'temperature-control',
    priority: 'high'
  }
];

export const useAuditTraining = (auditId?: string, findingId?: string, category?: FoodSafetyCategory) => {
  const [trainings, setTrainings] = useState<AuditRelatedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      try {
        let filteredTrainings = [...mockAuditTrainingData];
        
        if (auditId) {
          filteredTrainings = filteredTrainings.filter(t => t.auditId === auditId);
        }
        
        if (findingId) {
          filteredTrainings = filteredTrainings.filter(t => t.findingId === findingId);
        }
        
        if (category) {
          filteredTrainings = filteredTrainings.filter(t => t.category === category);
        }
        
        setTrainings(filteredTrainings);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }, 500);
  }, [auditId, findingId, category]);

  // Gets recommended training courses based on a finding category
  const getRecommendedTraining = (findingCategory: FoodSafetyCategory) => {
    return FOOD_SAFETY_TRAINING_MAP[findingCategory] || FOOD_SAFETY_TRAINING_MAP.general;
  };

  const assignTraining = (training: Omit<AuditRelatedTraining, 'id' | 'status'>) => {
    const newTraining: AuditRelatedTraining = {
      ...training,
      id: `train${Math.floor(Math.random() * 1000)}`,
      status: 'assigned'
    };
    
    setTrainings(prev => [...prev, newTraining]);
    return newTraining;
  };

  // Generate a deadline date based on priority
  const getDeadlineByPriority = (priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    const today = new Date();
    switch (priority) {
      case 'critical':
        // 24 hours for critical findings (FSMA requirement)
        return new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
      case 'high':
        // 3 days for high priority
        return new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0];
      case 'medium':
        // 7 days for medium priority
        return new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
      case 'low':
        // 14 days for low priority
        return new Date(today.setDate(today.getDate() + 14)).toISOString().split('T')[0];
    }
  };

  return {
    trainings,
    loading,
    error,
    assignTraining,
    getRecommendedTraining,
    getDeadlineByPriority
  };
};
