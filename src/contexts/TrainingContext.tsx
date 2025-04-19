
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingSession, DepartmentTrainingStats, TrainingPlan, TrainingType, TrainingCategory, TrainingCompletionStatus } from '@/types/training';

interface TrainingContextType {
  sessions: TrainingSession[];
  sessionLoading: boolean;
  departmentStats: DepartmentTrainingStats[];
  statsLoading: boolean;
  plans: TrainingPlan[];
  plansLoading: boolean;
  refreshSessions: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshPlans: () => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTrainingContext = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTrainingContext must be used within a TrainingProvider');
  }
  return context;
};

interface TrainingProviderProps {
  children: ReactNode;
}

export const TrainingProvider: React.FC<TrainingProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [departmentStats, setDepartmentStats] = useState<DepartmentTrainingStats[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // Mock data for development, replace with actual API calls
  const loadSessionsData = async () => {
    try {
      setSessionLoading(true);
      
      // In a real implementation, this would fetch from your API
      // const { data, error } = await supabase.from('training_sessions').select('*');
      
      // Mock data for development
      const mockSessions: TrainingSession[] = [
        {
          id: '1',
          title: 'Food Safety Basics',
          description: 'Fundamental training on food safety principles',
          training_type: 'classroom' as TrainingType,
          training_category: 'food-safety' as TrainingCategory,
          department: 'production',
          start_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: ['user1', 'user2', 'user3'],
          materials_id: ['doc1', 'doc2'],
          required_roles: ['operator', 'supervisor'],
          is_recurring: true,
          recurring_interval: '30',
          completion_status: 'in-progress' as TrainingCompletionStatus,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'HACCP Principles',
          description: 'Advanced HACCP training for quality personnel',
          training_type: 'online' as TrainingType,
          training_category: 'haccp' as TrainingCategory,
          department: 'quality',
          start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: ['user4', 'user5'],
          materials_id: ['doc3', 'doc4'],
          required_roles: ['qc', 'supervisor'],
          is_recurring: false,
          recurring_interval: '0',
          completion_status: 'not-started' as TrainingCompletionStatus,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Equipment Safety',
          description: 'Training on safe operation of production equipment',
          training_type: 'on-the-job' as TrainingType,
          training_category: 'technical' as TrainingCategory,
          department: 'maintenance',
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: ['user6', 'user7', 'user8'],
          materials_id: ['doc5'],
          required_roles: ['operator', 'maintenance'],
          is_recurring: true,
          recurring_interval: '90',
          completion_status: 'completed' as TrainingCompletionStatus,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading training sessions:', error);
    } finally {
      setSessionLoading(false);
    }
  };
  
  const loadStatsData = async () => {
    try {
      setStatsLoading(true);
      
      // Mock department stats
      const mockStats: DepartmentTrainingStats[] = [
        {
          department: 'production',
          name: 'Production',
          completed: 45,
          overdue: 5,
          totalAssigned: 60,
          complianceRate: 75
        },
        {
          department: 'quality',
          name: 'Quality Assurance',
          completed: 32,
          overdue: 2,
          totalAssigned: 35,
          complianceRate: 91
        },
        {
          department: 'maintenance',
          name: 'Maintenance',
          completed: 18,
          overdue: 4,
          totalAssigned: 25,
          complianceRate: 72
        },
        {
          department: 'warehouse',
          name: 'Warehouse',
          completed: 15,
          overdue: 1,
          totalAssigned: 20,
          complianceRate: 75
        }
      ];
      
      setDepartmentStats(mockStats);
    } catch (error) {
      console.error('Error loading department stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };
  
  const loadPlansData = async () => {
    try {
      setPlansLoading(true);
      
      // Mock training plans
      const mockPlans: TrainingPlan[] = [
        {
          id: '1',
          name: 'New Employee Onboarding',
          description: 'Standard training plan for all new employees',
          target_roles: ['operator', 'supervisor', 'qc'],
          courses: ['course1', 'course2', 'course3'],
          duration_days: 14,
          is_required: true,
          priority: 'high',
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_automated: true,
          automation_trigger: 'new_employee',
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          target_departments: ['production', 'quality'],
          related_standards: ['ISO 9001']
        },
        {
          id: '2',
          name: 'FSMA Refresher',
          description: 'Annual FSMA requirements refresher training',
          target_roles: ['manager', 'supervisor', 'qc'],
          courses: ['course4', 'course5'],
          duration_days: 7,
          is_required: true,
          priority: 'critical',
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          is_automated: true,
          automation_trigger: 'annual',
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          target_departments: ['production', 'quality', 'warehouse'],
          related_standards: ['FSMA', 'FDA CFR 117']
        }
      ];
      
      setPlans(mockPlans);
    } catch (error) {
      console.error('Error loading training plans:', error);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    loadSessionsData();
    loadStatsData();
    loadPlansData();
  }, []);

  const refreshSessions = async () => {
    await loadSessionsData();
  };

  const refreshStats = async () => {
    await loadStatsData();
  };

  const refreshPlans = async () => {
    await loadPlansData();
  };

  // This would be the implementation for creating a new training session
  const createSession = async (sessionData: any) => {
    try {
      // Convert types to match database expectations
      const mappedSessionData = {
        ...sessionData,
        training_type: sessionData.training_type,
        training_category: sessionData.training_category,
        is_recurring: sessionData.is_recurring || false,
        recurring_interval: sessionData.recurring_interval || "0",
        assigned_to: sessionData.assigned_to || [],
        required_roles: sessionData.required_roles || [],
        materials_id: sessionData.materials_id || [],
        completion_status: "not-started" as TrainingCompletionStatus
      };
      
      // In a real implementation, this would insert into your database
      // const { data, error } = await supabase.from('training_sessions').insert(mappedSessionData);
      
      // For mock implementation, just add to the local state
      const newSession = {
        ...mappedSessionData,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setSessions(prevSessions => [...prevSessions, newSession as TrainingSession]);
      
      return newSession;
    } catch (error) {
      console.error('Error creating training session:', error);
      throw error;
    }
  };

  return (
    <TrainingContext.Provider
      value={{
        sessions,
        sessionLoading,
        departmentStats,
        statsLoading,
        plans,
        plansLoading,
        refreshSessions,
        refreshStats,
        refreshPlans
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export default TrainingContext;
