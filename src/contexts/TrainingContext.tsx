
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TrainingSession, TrainingStats, TrainingCompletionStatus, TrainingPlan, TrainingCourse, DepartmentStat } from '@/types/training';
import { useToast } from '@/hooks/use-toast';

// Define the context type
export interface TrainingContextType {
  sessions: TrainingSession[];
  isLoading: boolean;
  error: string | null;
  departmentStats: DepartmentStat[];
  stats: TrainingStats | null;
  plans: TrainingPlan[];
  courses: TrainingCourse[];
  createTrainingPlan: (plan: Partial<TrainingPlan>) => Promise<TrainingPlan | null>;
  updateTrainingPlan: (id: string, plan: Partial<TrainingPlan>) => Promise<TrainingPlan | null>;
  createTrainingCourse: (course: Partial<TrainingCourse>) => Promise<TrainingCourse | null>;
  updateTrainingCourse: (id: string, course: Partial<TrainingCourse>) => Promise<TrainingCourse | null>;
  fetchData: () => Promise<void>;
}

// Create the context with default values
const TrainingContext = createContext<TrainingContextType>({
  sessions: [],
  isLoading: false,
  error: null,
  departmentStats: [],
  stats: null,
  plans: [],
  courses: [],
  createTrainingPlan: async () => null,
  updateTrainingPlan: async () => null,
  createTrainingCourse: async () => null,
  updateTrainingCourse: async () => null,
  fetchData: async () => {}
});

// Provider component
export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Mock data for departmentStats with compliance
      const mockDepartmentStats: DepartmentStat[] = [
        { department: 'Production', total: 30, completed: 20, overdue: 5, compliance: 67 },
        { department: 'Quality', total: 25, completed: 22, overdue: 1, compliance: 88 },
        { department: 'Maintenance', total: 15, completed: 10, overdue: 3, compliance: 67 },
        { department: 'Warehouse', total: 10, completed: 8, overdue: 1, compliance: 80 },
        { department: 'Administration', total: 8, completed: 7, overdue: 0, compliance: 88 }
      ];
      
      setDepartmentStats(mockDepartmentStats);
      
      // Mock data for sessions
      const mockSessions: TrainingSession[] = [
        {
          id: '1',
          title: 'Food Safety Basics',
          description: 'Basic training for all food handling staff',
          status: 'active',
          startDate: '2023-01-15',
          due_date: '2023-02-15',
          participants: ['1', '2', '3'],
          completionStatus: 'completed',
          created_at: '2023-01-10',
          updated_at: '2023-01-10'
        },
        {
          id: '2',
          title: 'HACCP Principles',
          description: 'Advanced HACCP training',
          status: 'active',
          startDate: '2023-02-01',
          due_date: '2023-03-01',
          participants: ['1', '4', '5'],
          completionStatus: 'in-progress',
          created_at: '2023-01-20',
          updated_at: '2023-01-20'
        }
      ];
      
      setSessions(mockSessions);
      
      // Mock training stats
      const mockStats: TrainingStats = {
        total: 88,
        completed: 67,
        inProgress: 12,
        overdue: 9,
        complianceRate: 76,
        byDepartment: mockDepartmentStats,
        byType: {
          'Food Safety': 30,
          'Compliance': 25,
          'Technical': 15,
          'Quality': 10,
          'Onboarding': 8
        },
        byStatus: {
          'completed': 67,
          'in-progress': 12,
          'overdue': 9
        },
        recentActivity: []
      };
      
      setStats(mockStats);
      
      // Mock training plans
      const mockPlans: TrainingPlan[] = [
        {
          id: '1',
          name: 'Food Safety Certification',
          title: 'Food Safety Certification',
          description: 'Comprehensive food safety training program',
          targetRoles: ['Quality Manager', 'Production Supervisor'],
          targetDepartments: ['Production', 'Quality'],
          courses: ['1', '2', '3'],
          durationDays: 30,
          isRequired: true,
          priority: 'High',
          status: 'Active',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          created_by: 'Admin',
          created_at: '2022-12-15',
          updated_at: '2022-12-15',
          required_for: ['new-hires', 'annual-renewal'],
          is_active: true
        },
        {
          id: '2',
          name: 'FSMA Compliance',
          title: 'FSMA Compliance',
          description: 'Training for FSMA regulatory compliance',
          targetRoles: ['Quality Analyst', 'Quality Manager'],
          targetDepartments: ['Quality'],
          courses: ['4', '5'],
          durationDays: 15,
          isRequired: true,
          priority: 'High',
          status: 'Active',
          startDate: '2023-02-01',
          endDate: '2023-12-31',
          created_by: 'Admin',
          created_at: '2023-01-10',
          updated_at: '2023-01-10',
          required_for: ['annual-renewal'],
          is_active: true
        }
      ];
      
      setPlans(mockPlans);
      
      // Mock training courses
      const mockCourses: TrainingCourse[] = [
        {
          id: '1',
          title: 'Basic Food Handling',
          description: 'Fundamental food handling practices',
          category: 'Food Safety',
          duration_hours: 2,
          is_active: true,
          created_at: '2022-12-01',
          updated_at: '2022-12-01',
          created_by: 'Admin'
        },
        {
          id: '2',
          title: 'HACCP Principles',
          description: 'Hazard Analysis Critical Control Points',
          category: 'Food Safety',
          duration_hours: 4,
          is_active: true,
          created_at: '2022-12-05',
          updated_at: '2022-12-05',
          created_by: 'Admin'
        }
      ];
      
      setCourses(mockCourses);
    } catch (err) {
      console.error('Error fetching training data:', err);
      setError('Failed to fetch training data');
      toast({
        title: 'Error',
        description: 'Failed to load training data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createTrainingPlan = async (plan: Partial<TrainingPlan>): Promise<TrainingPlan | null> => {
    try {
      // Mock implementation - would be a real API call
      const newPlan: TrainingPlan = {
        id: Math.random().toString(36).substr(2, 9),
        name: plan.name || '',
        title: plan.title || plan.name || '',
        description: plan.description || '',
        targetRoles: plan.targetRoles || [],
        targetDepartments: plan.targetDepartments || [],
        courses: plan.courses || [],
        durationDays: plan.durationDays || 0,
        isRequired: plan.isRequired || false,
        priority: plan.priority || 'Medium',
        status: plan.status || 'Active',
        startDate: plan.startDate || new Date().toISOString(),
        endDate: plan.endDate || new Date().toISOString(),
        created_by: 'Current User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        required_for: plan.required_for || [],
        is_active: true
      };
      
      setPlans([...plans, newPlan]);
      return newPlan;
    } catch (err) {
      console.error('Error creating training plan:', err);
      setError('Failed to create training plan');
      toast({
        title: 'Error',
        description: 'Failed to create training plan',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTrainingPlan = async (id: string, plan: Partial<TrainingPlan>): Promise<TrainingPlan | null> => {
    try {
      const updatedPlans = plans.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...plan,
            updated_at: new Date().toISOString()
          };
        }
        return p;
      });
      
      setPlans(updatedPlans);
      return updatedPlans.find(p => p.id === id) || null;
    } catch (err) {
      console.error('Error updating training plan:', err);
      setError('Failed to update training plan');
      toast({
        title: 'Error',
        description: 'Failed to update training plan',
        variant: 'destructive',
      });
      return null;
    }
  };

  const createTrainingCourse = async (course: Partial<TrainingCourse>): Promise<TrainingCourse | null> => {
    try {
      // Mock implementation - would be a real API call
      const newCourse: TrainingCourse = {
        id: Math.random().toString(36).substr(2, 9),
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        duration_hours: course.duration_hours || 0,
        is_active: course.is_active !== undefined ? course.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'Current User',
        prerequisite_courses: course.prerequisite_courses || []
      };
      
      setCourses([...courses, newCourse]);
      return newCourse;
    } catch (err) {
      console.error('Error creating training course:', err);
      setError('Failed to create training course');
      toast({
        title: 'Error',
        description: 'Failed to create training course',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTrainingCourse = async (id: string, course: Partial<TrainingCourse>): Promise<TrainingCourse | null> => {
    try {
      const updatedCourses = courses.map(c => {
        if (c.id === id) {
          return {
            ...c,
            ...course,
            updated_at: new Date().toISOString()
          };
        }
        return c;
      });
      
      setCourses(updatedCourses);
      return updatedCourses.find(c => c.id === id) || null;
    } catch (err) {
      console.error('Error updating training course:', err);
      setError('Failed to update training course');
      toast({
        title: 'Error',
        description: 'Failed to update training course',
        variant: 'destructive',
      });
      return null;
    }
  };

  return (
    <TrainingContext.Provider value={{
      sessions,
      isLoading,
      error,
      departmentStats,
      stats,
      plans,
      courses,
      createTrainingPlan,
      updateTrainingPlan,
      createTrainingCourse,
      updateTrainingCourse,
      fetchData
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

// Custom hook for using the training context
export const useTrainingContext = () => useContext(TrainingContext);
