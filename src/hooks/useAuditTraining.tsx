
import { useState, useEffect } from 'react';

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

// Food safety hazard types for HACCP compliance
export type FoodHazardType = 
  | 'biological' 
  | 'chemical' 
  | 'physical' 
  | 'allergen'
  | 'radiological';

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
  hazardTypes?: FoodHazardType[];
  equipmentId?: string;
  locationId?: string;
  notes?: string;
}

// Map food safety categories to recommended training courses
export const FOOD_SAFETY_TRAINING_MAP: Record<FoodSafetyCategory, string[]> = {
  'temperature-control': ['Cold Chain Management', 'Thermometer Calibration', 'Temperature Monitoring Procedures'],
  'allergen-control': ['Allergen Management', 'Cross-Contamination Prevention', 'Allergen Cleanup Protocols'],
  'hygiene-monitoring': ['GMP Basics', 'Personal Hygiene Standards', 'Handwashing Protocols'],
  'documentation': ['Record Keeping Compliance', 'Documentation Best Practices', 'HACCP Records Management'],
  'sanitization': ['Sanitation Procedures', 'Chemical Safety', 'Clean-in-Place (CIP) Validation'],
  'pest-control': ['Integrated Pest Management', 'Pest Prevention Strategies', 'Pest Monitoring Systems'],
  'foreign-material': ['Foreign Material Prevention', 'Metal Detection Systems', 'Glass & Brittle Plastic Control'],
  'traceability': ['Product Traceability', 'Lot Coding Systems', 'Mock Recall Procedures'],
  'general': ['Food Safety Refresher', 'HACCP Principles', 'Food Safety Modernization Act (FSMA) Overview']
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

  // Assign training based on audit finding
  const assignTraining = (trainingData: Omit<AuditRelatedTraining, 'id' | 'status'>) => {
    const newTraining: AuditRelatedTraining = {
      ...trainingData,
      id: `train${Math.floor(Math.random() * 1000)}`,
      status: 'assigned'
    };
    
    setTrainings(prev => [...prev, newTraining]);
    return newTraining;
  };

  // Generate a deadline date based on priority - compliant with food safety requirements
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

  // New method: Get relevant courses based on hazard types
  const getCoursesForHazards = (hazardTypes: FoodHazardType[]) => {
    const recommendedCourses: string[] = [];
    
    if (hazardTypes.includes('biological')) {
      recommendedCourses.push('Microbiological Controls', 'Pathogen Testing');
    }
    
    if (hazardTypes.includes('chemical')) {
      recommendedCourses.push('Chemical Handling', 'Sanitation Chemical Safety');
    }
    
    if (hazardTypes.includes('physical')) {
      recommendedCourses.push('Foreign Object Detection', 'Glass & Hard Plastic Control');
    }
    
    if (hazardTypes.includes('allergen')) {
      recommendedCourses.push('Allergen Management', 'Cross-Contact Prevention');
    }
    
    if (hazardTypes.includes('radiological')) {
      recommendedCourses.push('Radiological Hazard Control');
    }
    
    return recommendedCourses.length > 0 ? recommendedCourses : ['HACCP Principles'];
  };

  // New method: Check if a finding requires CCP training
  const isCriticalControlPoint = (finding: { category: FoodSafetyCategory, priority?: string }) => {
    // Categories that are typically CCPs in food safety
    const ccpCategories: FoodSafetyCategory[] = ['temperature-control', 'foreign-material', 'allergen-control'];
    
    return ccpCategories.includes(finding.category) || finding.priority === 'critical';
  };

  return {
    trainings,
    loading,
    error,
    assignTraining,
    getRecommendedTraining,
    getDeadlineByPriority,
    getCoursesForHazards,
    isCriticalControlPoint
  };
};
