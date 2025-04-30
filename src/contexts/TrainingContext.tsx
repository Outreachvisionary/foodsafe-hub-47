
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TrainingSession, TrainingPlan, TrainingCourse, DepartmentStat } from '@/types/training';
import { TrainingStatus, TrainingType, TrainingCategory } from '@/types/enums';

// Define the context type
export interface TrainingContextType {
  sessions: TrainingSession[];
  trainingPlans: TrainingPlan[];
  courses: TrainingCourse[];
  departmentStats: DepartmentStat[];
  isLoading: boolean;
  fetchSessions: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  createTrainingPlan: (plan: Partial<TrainingPlan>) => Promise<TrainingPlan>;
  updateTrainingPlan: (id: string, plan: Partial<TrainingPlan>) => Promise<TrainingPlan>;
  deleteTrainingPlan: (id: string) => Promise<void>;
  createTrainingSession: (session: Partial<TrainingSession>) => Promise<TrainingSession>;
  updateTrainingSession: (id: string, session: Partial<TrainingSession>) => Promise<TrainingSession>;
  deleteTrainingSession: (id: string) => Promise<void>;
  fetchDepartmentStats: () => Promise<void>;
}

// Create the context with default values
const TrainingContext = createContext<TrainingContextType>({
  sessions: [],
  trainingPlans: [],
  courses: [],
  departmentStats: [],
  isLoading: false,
  fetchSessions: async () => {},
  fetchPlans: async () => {},
  fetchCourses: async () => {},
  createTrainingPlan: async () => ({} as TrainingPlan),
  updateTrainingPlan: async () => ({} as TrainingPlan),
  deleteTrainingPlan: async () => {},
  createTrainingSession: async () => ({} as TrainingSession),
  updateTrainingSession: async () => ({} as TrainingSession),
  deleteTrainingSession: async () => {},
  fetchDepartmentStats: async () => {}
});

// Create the provider component
export const TrainingProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch training sessions
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      // Implement session fetching logic or use mock data
      const mockSessions: TrainingSession[] = [
        {
          id: '1',
          title: 'HACCP Training',
          description: 'Basic HACCP principles',
          status: 'scheduled',
          startDate: '2025-05-15',
          participants: ['user1', 'user2'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Food Safety Training',
          description: 'Essential food safety practices',
          status: 'in_progress',
          startDate: '2025-05-10',
          participants: ['user3', 'user4'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch training plans
  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      // Implement plan fetching logic or use mock data
      const mockPlans: TrainingPlan[] = [
        {
          id: '1',
          name: 'New Employee Onboarding',
          title: 'New Employee Onboarding',
          description: 'Training plan for new employees',
          targetRoles: ['Employee'],
          targetDepartments: ['All'],
          courses: ['course1', 'course2'],
          durationDays: 30,
          isRequired: true,
          priority: 'High',
          status: 'active',
          startDate: '2025-05-01',
          endDate: '2025-06-01',
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          required_for: ['all'],
          is_active: true
        }
      ];
      setTrainingPlans(mockPlans);
    } catch (error) {
      console.error('Error fetching training plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch training courses
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // Implement course fetching logic or use mock data
      const mockCourses: TrainingCourse[] = [
        {
          id: '1',
          title: 'Food Safety Basics',
          description: 'Essential food safety knowledge',
          category: 'Food Safety',
          duration_hours: 2,
          is_active: true,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch department stats
  const fetchDepartmentStats = async () => {
    setIsLoading(true);
    try {
      // Implement department stats fetching logic or use mock data
      const mockStats: DepartmentStat[] = [
        {
          department: 'Production',
          name: 'Production',
          total: 30,
          completed: 25,
          overdue: 5,
          compliance: 83,
          totalAssigned: 30,
          complianceRate: 83
        },
        {
          department: 'Quality',
          name: 'Quality',
          total: 20,
          completed: 18,
          overdue: 2,
          compliance: 90,
          totalAssigned: 20,
          complianceRate: 90
        }
      ];
      setDepartmentStats(mockStats);
    } catch (error) {
      console.error('Error fetching department stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD operations for training plans
  const createTrainingPlan = async (plan: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    // Mock implementation
    const newPlan: TrainingPlan = {
      id: Date.now().toString(),
      name: plan.name || '',
      title: plan.name || '',
      description: plan.description || '',
      targetRoles: plan.targetRoles || [],
      targetDepartments: plan.targetDepartments || [],
      courses: plan.courses || [],
      durationDays: plan.durationDays || 30,
      isRequired: plan.isRequired || false,
      priority: plan.priority || 'Medium',
      status: plan.status || 'draft',
      startDate: plan.startDate || new Date().toISOString(),
      endDate: plan.endDate || new Date().toISOString(),
      created_by: 'current_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      required_for: plan.required_for || [],
      is_active: plan.is_active || true
    };
    
    setTrainingPlans(prev => [...prev, newPlan]);
    return newPlan;
  };

  const updateTrainingPlan = async (id: string, plan: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    // Mock implementation
    const updatedPlans = trainingPlans.map(p => 
      p.id === id ? { ...p, ...plan, updated_at: new Date().toISOString() } : p
    );
    setTrainingPlans(updatedPlans);
    return updatedPlans.find(p => p.id === id) as TrainingPlan;
  };

  const deleteTrainingPlan = async (id: string): Promise<void> => {
    // Mock implementation
    setTrainingPlans(prev => prev.filter(p => p.id !== id));
  };

  // CRUD operations for training sessions
  const createTrainingSession = async (session: Partial<TrainingSession>): Promise<TrainingSession> => {
    // Mock implementation
    const newSession: TrainingSession = {
      id: Date.now().toString(),
      title: session.title || '',
      description: session.description || '',
      status: session.status || 'scheduled',
      startDate: session.startDate || new Date().toISOString(),
      participants: session.participants || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSessions(prev => [...prev, newSession]);
    return newSession;
  };

  const updateTrainingSession = async (id: string, session: Partial<TrainingSession>): Promise<TrainingSession> => {
    // Mock implementation
    const updatedSessions = sessions.map(s => 
      s.id === id ? { ...s, ...session, updated_at: new Date().toISOString() } : s
    );
    setSessions(updatedSessions);
    return updatedSessions.find(s => s.id === id) as TrainingSession;
  };

  const deleteTrainingSession = async (id: string): Promise<void> => {
    // Mock implementation
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Load initial data
  useEffect(() => {
    fetchSessions();
    fetchPlans();
    fetchCourses();
    fetchDepartmentStats();
  }, []);

  return (
    <TrainingContext.Provider value={{
      sessions,
      trainingPlans,
      courses,
      departmentStats,
      isLoading,
      fetchSessions,
      fetchPlans,
      fetchCourses,
      createTrainingPlan,
      updateTrainingPlan,
      deleteTrainingPlan,
      createTrainingSession,
      updateTrainingSession,
      deleteTrainingSession,
      fetchDepartmentStats
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

// Custom hook to use the training context
export const useTrainingContext = () => useContext(TrainingContext);

export default TrainingContext;
