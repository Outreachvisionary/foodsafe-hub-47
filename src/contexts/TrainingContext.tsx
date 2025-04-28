
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TrainingPlan, TrainingCourse } from '@/types/training';

interface TrainingContextType {
  trainingPlans: TrainingPlan[];
  trainingCourses: TrainingCourse[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  createTrainingPlan: (plan: Partial<TrainingPlan>) => Promise<void>;
  updateTrainingPlan: (id: string, plan: Partial<TrainingPlan>) => Promise<void>;
  deleteTrainingPlan: (id: string) => Promise<void>;
  createTrainingCourse: (course: Partial<TrainingCourse>) => Promise<void>;
  updateTrainingCourse: (id: string, course: Partial<TrainingCourse>) => Promise<void>;
  deleteTrainingCourse: (id: string) => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTrainingContext = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTrainingContext must be used within a TrainingProvider');
  }
  return context;
};

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data - in a real implementation, this would fetch from an API
      const plans: TrainingPlan[] = [
        {
          id: '1',
          name: 'Food Safety Onboarding',
          description: 'Basic food safety training for new employees',
          target_roles: ['Production Staff', 'Warehouse Staff'],
          courses: [],
          priority: 'High',
          status: 'Active',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Quality Management Training',
          description: 'Advanced quality control procedures',
          target_roles: ['Quality Team', 'Supervisors'],
          courses: [],
          priority: 'Medium',
          status: 'Active',
          created_at: new Date().toISOString()
        }
      ];
      
      setTrainingPlans(plans);
    } catch (err) {
      setError('Failed to fetch training plans');
      console.error('Error fetching training plans:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data - in a real implementation, this would fetch from an API
      const courses: TrainingCourse[] = [
        {
          id: '1',
          title: 'HACCP Principles',
          description: 'Introduction to HACCP principles and implementation',
          category: 'Food Safety',
          duration_hours: 4,
          created_at: new Date().toISOString(),
          created_by: 'admin'
        },
        {
          id: '2',
          title: 'GMP Basics',
          description: 'Good Manufacturing Practices fundamentals',
          category: 'Compliance',
          duration_hours: 2,
          created_at: new Date().toISOString(),
          created_by: 'admin'
        }
      ];
      
      setTrainingCourses(courses);
    } catch (err) {
      setError('Failed to fetch training courses');
      console.error('Error fetching training courses:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const createTrainingPlan = async (plan: Partial<TrainingPlan>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newPlan: TrainingPlan = {
        id: `plan-${Date.now()}`,
        name: plan.name || 'Untitled Plan',
        description: plan.description || '',
        target_roles: plan.target_roles || [],
        courses: plan.courses || [],
        priority: plan.priority || 'Medium',
        status: plan.status || 'Active',
        created_at: new Date().toISOString()
      };
      
      setTrainingPlans([...trainingPlans, newPlan]);
    } catch (err) {
      setError('Failed to create training plan');
      console.error('Error creating training plan:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateTrainingPlan = async (id: string, plan: Partial<TrainingPlan>) => {
    try {
      setLoading(true);
      setError(null);
      
      const planIndex = trainingPlans.findIndex(p => p.id === id);
      
      if (planIndex === -1) {
        throw new Error(`Training plan with ID ${id} not found`);
      }
      
      const updatedPlan = {
        ...trainingPlans[planIndex],
        ...plan
      };
      
      const newPlans = [...trainingPlans];
      newPlans[planIndex] = updatedPlan;
      setTrainingPlans(newPlans);
    } catch (err) {
      setError('Failed to update training plan');
      console.error('Error updating training plan:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTrainingPlan = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const newPlans = trainingPlans.filter(p => p.id !== id);
      setTrainingPlans(newPlans);
    } catch (err) {
      setError('Failed to delete training plan');
      console.error('Error deleting training plan:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const createTrainingCourse = async (course: Partial<TrainingCourse>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newCourse: TrainingCourse = {
        id: `course-${Date.now()}`,
        title: course.title || 'Untitled Course',
        description: course.description || '',
        category: course.category || '',
        duration_hours: course.duration_hours || 1,
        created_at: new Date().toISOString(),
        created_by: course.created_by || 'admin'
      };
      
      setTrainingCourses([...trainingCourses, newCourse]);
    } catch (err) {
      setError('Failed to create training course');
      console.error('Error creating training course:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateTrainingCourse = async (id: string, course: Partial<TrainingCourse>) => {
    try {
      setLoading(true);
      setError(null);
      
      const courseIndex = trainingCourses.findIndex(c => c.id === id);
      
      if (courseIndex === -1) {
        throw new Error(`Training course with ID ${id} not found`);
      }
      
      const updatedCourse = {
        ...trainingCourses[courseIndex],
        ...course
      };
      
      const newCourses = [...trainingCourses];
      newCourses[courseIndex] = updatedCourse;
      setTrainingCourses(newCourses);
    } catch (err) {
      setError('Failed to update training course');
      console.error('Error updating training course:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTrainingCourse = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const newCourses = trainingCourses.filter(c => c.id !== id);
      setTrainingCourses(newCourses);
    } catch (err) {
      setError('Failed to delete training course');
      console.error('Error deleting training course:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <TrainingContext.Provider
      value={{
        trainingPlans,
        trainingCourses,
        loading,
        error,
        fetchPlans,
        fetchCourses,
        createTrainingPlan,
        updateTrainingPlan,
        deleteTrainingPlan,
        createTrainingCourse,
        updateTrainingCourse,
        deleteTrainingCourse
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};
