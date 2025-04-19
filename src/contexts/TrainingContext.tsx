
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TrainingSession, 
  TrainingPlan, 
  DepartmentTrainingStats, 
  TrainingStatus, 
  TrainingType, 
  TrainingCategory, 
  TrainingCompletionStatus,
  TrainingPriority
} from '@/types/training';
import { supabase } from '@/integrations/supabase/client';

interface TrainingContextType {
  sessions: TrainingSession[];
  plans: TrainingPlan[];
  departmentStats: DepartmentTrainingStats[];
  isLoading: boolean;
  createTrainingSession: (sessionData: Partial<TrainingSession>) => Promise<TrainingSession | null>;
  createTrainingPlan: (planData: Partial<TrainingPlan>) => Promise<TrainingPlan | null>;
}

const mapDbToTrainingType = (type: string): TrainingType => {
  const validTypes: TrainingType[] = [
    'classroom', 'online', 'self-study', 'on-the-job', 'workshop', 'certification'
  ];
  return validTypes.includes(type as TrainingType) 
    ? type as TrainingType 
    : 'classroom';
};

const mapDbToTrainingCategory = (category: string): TrainingCategory => {
  const validCategories: TrainingCategory[] = [
    'food-safety', 'gmp', 'haccp', 'quality', 'regulatory', 'technical', 'leadership', 'other'
  ];
  return validCategories.includes(category as TrainingCategory) 
    ? category as TrainingCategory 
    : 'other';
};

const mapDbToCompletionStatus = (status: string): TrainingCompletionStatus => {
  const validStatuses: TrainingCompletionStatus[] = [
    'not-started', 'in-progress', 'completed', 'overdue', 'cancelled'
  ];
  return validStatuses.includes(status as TrainingCompletionStatus) 
    ? status as TrainingCompletionStatus 
    : 'not-started';
};

const mapDbToTrainingPriority = (priority: string): TrainingPriority => {
  const validPriorities: TrainingPriority[] = [
    'critical', 'high', 'medium', 'low'
  ];
  return validPriorities.includes(priority as TrainingPriority)
    ? priority as TrainingPriority
    : 'medium';
};

const mapTrainingStatus = (status: string): TrainingStatus => {
  switch(status.toLowerCase()) {
    case 'not-started': return 'Not Started';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'overdue': return 'Overdue';
    case 'cancelled': return 'Cancelled';
    default: return 'Not Started';
  }
};

const TrainingContext = createContext<TrainingContextType>({
  sessions: [],
  plans: [],
  departmentStats: [],
  isLoading: true,
  createTrainingSession: async () => null,
  createTrainingPlan: async () => null,
});

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentTrainingStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch training sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('training_sessions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (sessionsError) throw sessionsError;
        
        const transformedSessions: TrainingSession[] = (sessionsData || []).map(session => ({
          id: session.id,
          title: session.title,
          description: session.description,
          training_type: mapDbToTrainingType(session.training_type),
          training_category: mapDbToTrainingCategory(session.training_category),
          department: session.department,
          start_date: session.start_date,
          due_date: session.due_date,
          assigned_to: Array.isArray(session.assigned_to) ? session.assigned_to : [],
          materials_id: Array.isArray(session.materials_id) ? session.materials_id : [],
          required_roles: Array.isArray(session.required_roles) ? session.required_roles : [],
          is_recurring: Boolean(session.is_recurring),
          recurring_interval: String(session.recurring_interval || ''),
          completion_status: mapDbToCompletionStatus(session.completion_status),
          created_by: session.created_by,
          created_at: session.created_at,
          updated_at: session.updated_at
        }));
        
        setSessions(transformedSessions);
        
        // Fetch training plans
        const { data: plansData, error: plansError } = await supabase
          .from('training_plans')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (plansError) throw plansError;
        
        const transformedPlans: TrainingPlan[] = (plansData || []).map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          target_roles: Array.isArray(plan.target_roles) ? plan.target_roles : [],
          courses: Array.isArray(plan.courses) ? plan.courses : [],
          duration_days: plan.duration_days || 0,
          is_required: Boolean(plan.is_required),
          priority: mapDbToTrainingPriority(plan.priority || 'medium'),
          status: plan.status,
          start_date: plan.start_date,
          end_date: plan.end_date,
          is_automated: Boolean(plan.is_automated),
          automation_trigger: plan.automation_trigger,
          created_by: plan.created_by,
          created_at: plan.created_at,
          updated_at: plan.updated_at,
          target_departments: Array.isArray(plan.target_departments) ? plan.target_departments : [],
          related_standards: Array.isArray(plan.related_standards) ? plan.related_standards : []
        }));
        
        setPlans(transformedPlans);
        
        // For demo purposes, generate department stats
        // In a real app, this would be computed from actual data
        setDepartmentStats([
          {
            department: 'production',
            name: 'Production',
            completed: 42,
            overdue: 8,
            totalAssigned: 50,
            complianceRate: 84
          },
          {
            department: 'quality',
            name: 'Quality',
            completed: 18,
            overdue: 2,
            totalAssigned: 20,
            complianceRate: 90
          },
          {
            department: 'maintenance',
            name: 'Maintenance',
            completed: 12,
            overdue: 3,
            totalAssigned: 15,
            complianceRate: 80
          },
          {
            department: 'warehouse',
            name: 'Warehouse',
            completed: 22,
            overdue: 3,
            totalAssigned: 25,
            complianceRate: 88
          }
        ]);
        
      } catch (err) {
        console.error('Error fetching training data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  const createTrainingSession = async (sessionData: Partial<TrainingSession>): Promise<TrainingSession | null> => {
    try {
      setIsLoading(true);
      
      // Convert from our interface to the database schema
      const dbSession = {
        title: sessionData.title,
        description: sessionData.description,
        training_type: sessionData.training_type,
        training_category: sessionData.training_category,
        department: sessionData.department,
        start_date: sessionData.start_date,
        due_date: sessionData.due_date,
        assigned_to: sessionData.assigned_to || [],
        materials_id: sessionData.materials_id || [],
        required_roles: sessionData.required_roles || [],
        is_recurring: sessionData.is_recurring || false,
        recurring_interval: sessionData.recurring_interval || '',
        completion_status: sessionData.completion_status || 'not-started',
        created_by: sessionData.created_by || 'Current User'
      };
      
      // Map completion_status from our app format to DB format
      const completionStatusForDb = (status: TrainingCompletionStatus): string => {
        switch(status) {
          case 'not-started': return 'Not Started';
          case 'in-progress': return 'In Progress';
          case 'completed': return 'Completed';
          case 'overdue': return 'Overdue';
          case 'cancelled': return 'Cancelled';
          default: return 'Not Started';
        }
      };
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert({
          ...dbSession,
          completion_status: completionStatusForDb(dbSession.completion_status as TrainingCompletionStatus)
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform to our TrainingSession type
      const newSession: TrainingSession = {
        id: data.id,
        title: data.title,
        description: data.description,
        training_type: mapDbToTrainingType(data.training_type),
        training_category: mapDbToTrainingCategory(data.training_category),
        department: data.department,
        start_date: data.start_date,
        due_date: data.due_date,
        assigned_to: Array.isArray(data.assigned_to) ? data.assigned_to : [],
        materials_id: Array.isArray(data.materials_id) ? data.materials_id : [],
        required_roles: Array.isArray(data.required_roles) ? data.required_roles : [],
        is_recurring: Boolean(data.is_recurring),
        recurring_interval: String(data.recurring_interval || ''),
        completion_status: mapDbToCompletionStatus(data.completion_status),
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setSessions(prev => [newSession, ...prev]);
      
      return newSession;
    } catch (err) {
      console.error('Error creating training session:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createTrainingPlan = async (planData: Partial<TrainingPlan>): Promise<TrainingPlan | null> => {
    try {
      setIsLoading(true);
      
      // Convert from our interface to the database schema
      const dbPlan = {
        name: planData.name,
        description: planData.description,
        target_roles: planData.target_roles || [],
        courses: planData.courses || [],
        duration_days: planData.duration_days || 0,
        is_required: planData.is_required || false,
        priority: planData.priority || 'medium',
        status: planData.status || 'Active',
        start_date: planData.start_date,
        end_date: planData.end_date,
        is_automated: planData.is_automated || false,
        automation_trigger: planData.automation_trigger,
        target_departments: planData.target_departments || [],
        related_standards: planData.related_standards || [],
        created_by: planData.created_by || 'Current User'
      };
      
      const { data, error } = await supabase
        .from('training_plans')
        .insert(dbPlan)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform database response to match our TrainingPlan interface
      const newPlan: TrainingPlan = {
        id: data.id,
        name: data.name,
        description: data.description,
        target_roles: Array.isArray(data.target_roles) ? data.target_roles : [],
        courses: Array.isArray(data.courses) ? data.courses : [],
        duration_days: data.duration_days || 0,
        is_required: Boolean(data.is_required),
        priority: mapDbToTrainingPriority(data.priority || 'medium'),
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        is_automated: Boolean(data.is_automated),
        automation_trigger: data.automation_trigger,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        target_departments: Array.isArray(data.target_departments) ? data.target_departments : [],
        related_standards: Array.isArray(data.related_standards) ? data.related_standards : []
      };
      
      setPlans(prev => [newPlan, ...prev]);
      
      return newPlan;
    } catch (err) {
      console.error('Error creating training plan:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TrainingContext.Provider value={{
      sessions,
      plans,
      departmentStats,
      isLoading,
      createTrainingSession,
      createTrainingPlan
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTrainingContext = () => useContext(TrainingContext);

export default TrainingContext;
