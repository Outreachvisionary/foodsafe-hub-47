
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingSession, TrainingRecord, TrainingStatus, TrainingCategory, TrainingStatistics, TrainingPlan, TrainingPriority, DepartmentStat } from '@/types/training';
import { getMockTrainingStatistics } from '@/services/mockDataService';
import { convertToTrainingStatus } from '@/utils/typeAdapters';

interface TrainingContextType {
  trainingSessions: TrainingSession[];
  trainingRecords: TrainingRecord[];
  trainingPlans: TrainingPlan[];
  statistics: TrainingStatistics | null;
  departmentStats: DepartmentStat[];
  sessions: TrainingSession[];
  loading: boolean;
  error: string | null;
  isLoading: boolean;
  fetchSessions: () => Promise<void>;
  fetchRecords: (employeeId?: string) => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  createSession: (session: Partial<TrainingSession>) => Promise<void>;
  updateSession: (id: string, updates: Partial<TrainingSession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  updateTrainingRecord: (id: string, updates: Partial<TrainingRecord>) => Promise<void>;
  createTrainingPlan: (plan: Partial<TrainingPlan>) => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType>({
  trainingSessions: [],
  trainingRecords: [],
  trainingPlans: [],
  statistics: null,
  departmentStats: [],
  sessions: [],
  loading: false,
  isLoading: false,
  error: null,
  fetchSessions: async () => {},
  fetchRecords: async () => {},
  fetchPlans: async () => {},
  fetchStatistics: async () => {},
  createSession: async () => {},
  updateSession: async () => {},
  deleteSession: async () => {},
  updateTrainingRecord: async () => {},
  createTrainingPlan: async () => {}
});

export const useTraining = useContext(TrainingContext);

export const useTrainingContext = () => useContext(TrainingContext);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [statistics, setStatistics] = useState<TrainingStatistics | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize mock department stats
  useEffect(() => {
    const mockDeptStats: DepartmentStat[] = [
      { department: "Production", totalAssigned: 50, completed: 42, overdue: 5, compliance: 84 },
      { department: "Quality", totalAssigned: 20, completed: 18, overdue: 1, compliance: 90 },
      { department: "Warehouse", totalAssigned: 25, completed: 15, overdue: 8, compliance: 60 }
    ];
    setDepartmentStats(mockDeptStats);
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would fetch from Supabase
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*');
      
      if (error) throw error;
      
      // Convert data to match TrainingSession interface
      const formattedSessions = data.map((session: any) => ({
        ...session,
        training_type: session.training_type || 'classroom',
        training_category: session.training_category || 'other',
        completion_status: convertToTrainingStatus(session.completion_status || 'Not Started')
      }));
      
      setTrainingSessions(formattedSessions);
    } catch (err: any) {
      console.error('Error fetching training sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecords = async (employeeId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('training_records')
        .select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTrainingRecords(data as TrainingRecord[]);
    } catch (err: any) {
      console.error('Error fetching training records:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('training_plans')
        .select('*');
      
      if (error) throw error;
      
      setTrainingPlans(data as TrainingPlan[]);
    } catch (err: any) {
      console.error('Error fetching training plans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now
      const mockStats = getMockTrainingStatistics();
      setStatistics(mockStats);
    } catch (err: any) {
      console.error('Error fetching training statistics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const createSession = async (session: Partial<TrainingSession>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure required fields have values before sending to Supabase
      if (!session.created_by) {
        session.created_by = 'system';
      }
      
      if (!session.assigned_to) {
        session.assigned_to = [];
      }
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert({
          title: session.title,
          description: session.description,
          training_type: session.training_type,
          training_category: session.training_category,
          department: session.department,
          start_date: session.start_date,
          due_date: session.due_date,
          assigned_to: session.assigned_to,
          materials_id: session.materials_id,
          is_recurring: session.is_recurring,
          recurring_interval: session.recurring_interval,
          required_roles: session.required_roles,
          completion_status: session.completion_status,
          created_by: session.created_by
        })
        .select();
      
      if (error) throw error;
      
      setTrainingSessions([...trainingSessions, data[0] as TrainingSession]);
    } catch (err: any) {
      console.error('Error creating training session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateSession = async (id: string, updates: Partial<TrainingSession>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare updates with proper field types
      const updateData: any = {
        ...updates
      };
      
      // Delete undefined fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      const { error } = await supabase
        .from('training_sessions')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setTrainingSessions(
        trainingSessions.map(session => 
          session.id === id ? { ...session, ...updates } : session
        )
      );
    } catch (err: any) {
      console.error('Error updating training session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteSession = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('training_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTrainingSessions(trainingSessions.filter(session => session.id !== id));
    } catch (err: any) {
      console.error('Error deleting training session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateTrainingRecord = async (id: string, updates: Partial<TrainingRecord>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('training_records')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setTrainingRecords(
        trainingRecords.map(record => 
          record.id === id ? { ...record, ...updates } : record
        )
      );
    } catch (err: any) {
      console.error('Error updating training record:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const createTrainingPlan = async (plan: Partial<TrainingPlan>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure required fields
      if (!plan.created_by) {
        plan.created_by = 'system';
      }
      
      const { data, error } = await supabase
        .from('training_plans')
        .insert({
          name: plan.name,
          description: plan.description,
          courses: plan.courses,
          target_roles: plan.target_roles,
          target_departments: plan.target_departments,
          duration_days: plan.duration_days,
          is_required: plan.is_required,
          is_automated: plan.is_automated,
          automation_trigger: plan.automation_trigger,
          start_date: plan.start_date,
          end_date: plan.end_date,
          priority: plan.priority,
          status: plan.status,
          created_by: plan.created_by,
          related_standards: plan.related_standards
        })
        .select();
      
      if (error) throw error;
      
      setTrainingPlans([...trainingPlans, data[0] as TrainingPlan]);
    } catch (err: any) {
      console.error('Error creating training plan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainingContext.Provider value={{
      trainingSessions,
      trainingRecords,
      trainingPlans,
      statistics,
      departmentStats,
      sessions: trainingSessions, // Alias for components expecting 'sessions'
      loading,
      isLoading: loading, // Alias for components expecting 'isLoading'
      error,
      fetchSessions,
      fetchRecords,
      fetchPlans,
      fetchStatistics,
      createSession,
      updateSession,
      deleteSession,
      updateTrainingRecord,
      createTrainingPlan
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

export default TrainingContext;
