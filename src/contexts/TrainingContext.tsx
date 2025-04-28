
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingSession, TrainingRecord, TrainingStatus, TrainingCategory, TrainingStatistics, TrainingPlan, TrainingPriority, DepartmentStat, TrainingType } from '@/types/training';
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
  deleteTrainingPlan: (id: string) => Promise<void>;
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
  createTrainingPlan: async () => {},
  deleteTrainingPlan: async () => {}
});

export const useTraining = () => useContext(TrainingContext);
export const useTrainingContext = () => useContext(TrainingContext);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [statistics, setStatistics] = useState<TrainingStatistics | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mockDeptStats: DepartmentStat[] = [
      { department: "Production", name: "Production", totalAssigned: 50, completed: 42, overdue: 5, compliance: 84, complianceRate: 84 },
      { department: "Quality", name: "Quality", totalAssigned: 20, completed: 18, overdue: 1, compliance: 90, complianceRate: 90 },
      { department: "Warehouse", name: "Warehouse", totalAssigned: 25, completed: 15, overdue: 8, compliance: 60, complianceRate: 60 }
    ];
    setDepartmentStats(mockDeptStats);
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*');
      
      if (error) throw error;
      
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
      
      if (!session.created_by) {
        session.created_by = 'system';
      }
      
      if (!session.assigned_to) {
        session.assigned_to = [];
      }
      
      // Convert TrainingStatus to string literal expected by the database
      const dbCompletionStatus = session.completion_status ? 
        convertTrainingStatusForDb(session.completion_status) : 
        'Not Started';
      
      const sessionData = {
        title: session.title,
        description: session.description,
        training_type: session.training_type || 'classroom' as TrainingType,
        training_category: session.training_category || 'other' as TrainingCategory,
        department: session.department,
        start_date: session.start_date,
        due_date: session.due_date,
        assigned_to: session.assigned_to || [],
        materials_id: session.materials_id,
        is_recurring: session.is_recurring,
        recurring_interval: session.recurring_interval,
        required_roles: session.required_roles,
        completion_status: dbCompletionStatus,
        created_by: session.created_by || 'system'
      };
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert([sessionData]);
      
      if (error) throw error;
      
      if (data) {
        setTrainingSessions([...trainingSessions, data[0] as TrainingSession]);
      }
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
      
      const updateData: any = { ...updates };
      
      // Convert TrainingStatus to string literal expected by the database
      if (updateData.completion_status) {
        updateData.completion_status = convertTrainingStatusForDb(updateData.completion_status);
      }
      
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
      
      const recordData: any = { ...updates };
      
      // Convert TrainingStatus to string literal expected by the database
      if (recordData.status) {
        recordData.status = convertTrainingStatusForDb(recordData.status);
      }
      
      const { error } = await supabase
        .from('training_records')
        .update(recordData)
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
      
      const planData = {
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
        created_by: plan.created_by || 'system',
        related_standards: plan.related_standards
      };
      
      const { data, error } = await supabase
        .from('training_plans')
        .insert([planData]);
      
      if (error) throw error;
      
      if (data) {
        setTrainingPlans([...trainingPlans, data[0] as TrainingPlan]);
      }
    } catch (err: any) {
      console.error('Error creating training plan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTrainingPlan = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('training_plans')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTrainingPlans(trainingPlans.filter(plan => plan.id !== id));
    } catch (err: any) {
      console.error('Error deleting training plan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert TrainingStatus to database format
  const convertTrainingStatusForDb = (status: TrainingStatus): string => {
    switch(status) {
      case 'Not Started': return 'Not Started';
      case 'In Progress': return 'In Progress';
      case 'Completed': return 'Completed';
      case 'Overdue': return 'Overdue';
      case 'Failed': return 'Failed';
      case 'Cancelled': return 'Cancelled';
      default: return 'Not Started';
    }
  };

  return (
    <TrainingContext.Provider value={{
      trainingSessions,
      trainingRecords,
      trainingPlans,
      statistics,
      departmentStats,
      sessions: trainingSessions,
      loading,
      isLoading: loading,
      error,
      fetchSessions,
      fetchRecords,
      fetchPlans,
      fetchStatistics,
      createSession,
      updateSession,
      deleteSession,
      updateTrainingRecord,
      createTrainingPlan,
      deleteTrainingPlan
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

export default TrainingContext;
