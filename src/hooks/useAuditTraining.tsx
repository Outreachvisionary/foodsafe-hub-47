
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define food safety categories
export type FoodSafetyCategory = 
  'temperature-control' | 
  'allergen-control' | 
  'hygiene-monitoring' | 
  'documentation' | 
  'sanitization' | 
  'pest-control' | 
  'foreign-material' | 
  'traceability' | 
  'general';

// Define food hazard types
export type FoodHazardType = 'biological' | 'chemical' | 'physical' | 'allergen' | 'radiological';

// Map of training courses for each food safety category
export const FOOD_SAFETY_TRAINING_MAP: Record<FoodSafetyCategory, string[]> = {
  'temperature-control': [
    'Temperature Control Basics',
    'Cold Chain Management',
    'Hot Holding Safety',
    'Thermometer Calibration Training',
    'HACCP Temperature Critical Limits'
  ],
  'allergen-control': [
    'Allergen Awareness Training',
    'Allergen Cross-Contamination Prevention',
    'Allergen Cleaning Validation',
    'Allergen Labeling Requirements',
    'Managing Allergen Change Control'
  ],
  'hygiene-monitoring': [
    'Personal Hygiene Best Practices',
    'Environmental Monitoring Program',
    'Hand Washing Technique',
    'Sanitation Standard Operating Procedures',
    'ATP Testing Methodology'
  ],
  'documentation': [
    'Record Keeping Requirements',
    'Documentation Control System',
    'Electronic Records Compliance',
    'Form Completion Training',
    'Regulatory Documentation Standards'
  ],
  'sanitization': [
    'Cleaning Chemical Safety',
    'Effective Sanitization Procedures',
    'Clean-in-Place (CIP) Systems',
    'Sanitation Verification Methods',
    'Master Cleaning Schedule Development'
  ],
  'pest-control': [
    'Integrated Pest Management',
    'Pest Identification Training',
    'Pest Control Documentation',
    'Structural Pest Prevention',
    'Chemical Control Measures Safety'
  ],
  'foreign-material': [
    'Foreign Material Detection Methods',
    'Metal Detection Program',
    'Glass and Brittle Plastic Control',
    'Physical Contaminant Prevention',
    'X-Ray Technology Training'
  ],
  'traceability': [
    'Traceability System Basics',
    'Lot Coding Best Practices',
    'Mock Recall Training',
    'Supply Chain Traceability',
    'FSMA 204 Food Traceability Requirements'
  ],
  'general': [
    'Food Safety Fundamentals',
    'GMP Basics',
    'HACCP Principles Overview',
    'Food Safety Culture',
    'Regulatory Compliance Fundamentals'
  ]
};

// Hazard-specific courses
const HAZARD_COURSES: Record<FoodHazardType, string[]> = {
  'biological': [
    'Pathogen Control Measures',
    'Microbiological Testing Methods',
    'Biological Hazards in Food Processing',
    'Fermentation Controls',
    'Biofilm Prevention'
  ],
  'chemical': [
    'Chemical Hazard Management',
    'Cleaning Chemical Safety',
    'Pesticide Residue Controls',
    'Chemical Storage Requirements',
    'Chemical Contamination Prevention'
  ],
  'physical': [
    'Foreign Object Detection',
    'Physical Hazard Control Program',
    'Glass and Hard Plastic Controls',
    'Preventive Maintenance for Physical Hazards',
    'Metal Detection Validation'
  ],
  'allergen': [
    'Allergen Management Program',
    'Allergen Cleaning Validation',
    'Allergen Cross-Contact Prevention',
    'Allergen Identification Training',
    'Allergen Testing Methods'
  ],
  'radiological': [
    'Radiological Hazards in Food',
    'Radiation Safety Basics',
    'Detection Methods for Radiological Contaminants',
    'Regulatory Requirements for Radiological Controls',
    'Emergency Response for Radiological Incidents'
  ]
};

export interface AuditTraining {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  audit_id: string;
  assigned_to: string;
}

export interface TrainingAssignmentParams {
  auditId: string;
  findingId: string;
  courseTitle: string;
  assignedTo: string[];
  dueDate: string;
  category: FoodSafetyCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  hazardTypes?: FoodHazardType[];
  equipmentId?: string;
  locationId?: string;
  notes?: string;
}

export function useAuditTraining() {
  const [trainings, setTrainings] = useState<AuditTraining[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditTraining = async () => {
      try {
        setLoading(true);
        
        // Mock data for now
        // In a real app, fetch from Supabase
        const mockTrainings: AuditTraining[] = [
          {
            id: '1',
            title: 'Annual GMP Training Update',
            description: 'Complete GMP refresher training required by SQF audit findings',
            due_date: '2025-04-20',
            status: 'pending',
            priority: 'high',
            audit_id: 'audit-123',
            assigned_to: 'Production Team'
          },
          {
            id: '2',
            title: 'HACCP Documentation Review',
            description: 'Review and update HACCP documentation based on audit findings',
            due_date: '2025-04-15',
            status: 'in_progress',
            priority: 'critical',
            audit_id: 'audit-123',
            assigned_to: 'Quality Team'
          },
          {
            id: '3',
            title: 'Metal Detection Training',
            description: 'Conduct training on proper metal detector verification procedures',
            due_date: '2025-04-25',
            status: 'pending',
            priority: 'medium',
            audit_id: 'audit-124',
            assigned_to: 'Production Team'
          },
          {
            id: '4',
            title: 'Allergen Control Training',
            description: 'Conduct training on allergen control procedures',
            due_date: '2025-05-01',
            status: 'completed',
            priority: 'high',
            audit_id: 'audit-125',
            assigned_to: 'All Staff'
          }
        ];
        
        setTrainings(mockTrainings);
      } catch (error) {
        console.error('Error fetching audit-related training:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditTraining();
  }, []);

  const updateTrainingStatus = async (id: string, status: AuditTraining['status']) => {
    try {
      // Update status locally first
      setTrainings(prev => 
        prev.map(training => 
          training.id === id 
            ? { ...training, status } 
            : training
        )
      );
      
      // In a real app, update in Supabase
      // const { error } = await supabase
      //   .from('audit_training')
      //   .update({ status })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating training status:', error);
      return false;
    }
  };

  const getRecommendedTraining = useCallback((category: FoodSafetyCategory): string[] => {
    return FOOD_SAFETY_TRAINING_MAP[category] || FOOD_SAFETY_TRAINING_MAP.general;
  }, []);

  const getCoursesForHazards = useCallback((hazards: FoodHazardType[]): string[] => {
    const courses: string[] = [];
    
    hazards.forEach(hazard => {
      if (HAZARD_COURSES[hazard]) {
        courses.push(...HAZARD_COURSES[hazard]);
      }
    });
    
    // Add some general courses if there aren't many hazard-specific ones
    if (courses.length < 3) {
      courses.push(...FOOD_SAFETY_TRAINING_MAP.general.slice(0, 3));
    }
    
    return [...new Set(courses)]; // Remove duplicates
  }, []);

  const getDeadlineByPriority = useCallback((priority: 'low' | 'medium' | 'high' | 'critical'): string => {
    const today = new Date();
    let daysToAdd = 14; // Default (low priority)
    
    switch(priority) {
      case 'critical':
        daysToAdd = 1;
        break;
      case 'high':
        daysToAdd = 3;
        break;
      case 'medium':
        daysToAdd = 7;
        break;
      case 'low':
      default:
        daysToAdd = 14;
        break;
    }
    
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + daysToAdd);
    
    return dueDate.toISOString().split('T')[0];
  }, []);

  const assignTraining = useCallback(async (params: TrainingAssignmentParams): Promise<boolean> => {
    try {
      console.log('Training assigned with parameters:', params);
      
      // In a real app, this would insert into the database
      // For now, just add to the local state
      const newTrainings = params.assignedTo.map((assignee, index) => {
        const id = `temp-${Date.now()}-${index}`;
        return {
          id,
          title: params.courseTitle,
          description: `Training from audit finding: ${params.findingId}`,
          due_date: params.dueDate,
          status: 'pending' as AuditTraining['status'],
          priority: params.priority,
          audit_id: params.auditId,
          assigned_to: assignee
        };
      });
      
      setTrainings(prev => [...prev, ...newTrainings]);
      
      return true;
    } catch (error) {
      console.error('Error assigning training:', error);
      return false;
    }
  }, []);

  const isCriticalControlPoint = useCallback(({ category, priority }: { 
    category: FoodSafetyCategory, 
    priority: 'low' | 'medium' | 'high' | 'critical' 
  }): boolean => {
    // Critical categories that are considered CCPs
    const ccpCategories: FoodSafetyCategory[] = [
      'temperature-control',
      'allergen-control',
      'foreign-material'
    ];
    
    return ccpCategories.includes(category) && (priority === 'critical' || priority === 'high');
  }, []);

  return { 
    trainings, 
    loading, 
    updateTrainingStatus,
    getRecommendedTraining,
    getDeadlineByPriority,
    assignTraining,
    getCoursesForHazards,
    isCriticalControlPoint
  };
}
