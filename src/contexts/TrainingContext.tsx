
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  useToast 
} from '@/components/ui/use-toast';
import { 
  TrainingSession, 
  TrainingPlan, 
  TrainingRecord,
  TrainingStatus
} from '@/types/training';
import { 
  mapToTrainingType, 
  mapToTrainingCategory, 
  mapToTrainingStatus,
  mapToTrainingPriority,
  ensureStringArray
} from '@/utils/trainingTypeMapper';

interface TrainingContextType {
  trainingSessions: TrainingSession[];
  trainingPlans: TrainingPlan[];
  trainingRecords: TrainingRecord[];
  loading: boolean;
  error: string | null;
  createTrainingSession: (session: Partial<TrainingSession>) => Promise<TrainingSession | null>;
  createTrainingPlan: (plan: Partial<TrainingPlan>) => Promise<TrainingPlan | null>;
  createTrainingRecord: (record: Partial<TrainingRecord>) => Promise<TrainingRecord | null>;
  updateTrainingSession: (id: string, updates: Partial<TrainingSession>) => Promise<boolean>;
  updateTrainingPlan: (id: string, updates: Partial<TrainingPlan>) => Promise<boolean>;
  updateTrainingRecord: (id: string, updates: Partial<TrainingRecord>) => Promise<boolean>;
}

const TrainingContext = createContext<TrainingContextType>({
  trainingSessions: [],
  trainingPlans: [],
  trainingRecords: [],
  loading: false,
  error: null,
  createTrainingSession: async () => null,
  createTrainingPlan: async () => null,
  createTrainingRecord: async () => null,
  updateTrainingSession: async () => false,
  updateTrainingPlan: async () => false,
  updateTrainingRecord: async () => false,
});

export const useTraining = () => useContext(TrainingContext);

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setLoading(true);
        
        // Fetch training sessions
        const { data: sessionData, error: sessionError } = await supabase
          .from('training_sessions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (sessionError) throw sessionError;
        
        // Transform database records to our TrainingSession type
        const transformedSessions: TrainingSession[] = (sessionData || []).map(session => ({
          id: session.id,
          title: session.title,
          description: session.description,
          training_type: mapToTrainingType(session.training_type),
          training_category: mapToTrainingCategory(session.training_category || 'other'),
          department: session.department,
          start_date: session.start_date,
          due_date: session.due_date,
          assigned_to: ensureStringArray(session.assigned_to),
          materials_id: ensureStringArray(session.materials_id),
          required_roles: ensureStringArray(session.required_roles),
          is_recurring: session.is_recurring,
          recurring_interval: session.recurring_interval,
          completion_status: mapToTrainingStatus(session.completion_status),
          created_by: session.created_by,
          created_at: session.created_at,
          updated_at: session.updated_at
        }));
        
        setTrainingSessions(transformedSessions);
        
        // Fetch training plans
        const { data: planData, error: planError } = await supabase
          .from('training_plans')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (planError) throw planError;
        
        // Transform database data to match our TrainingPlan interface
        const transformedPlans: TrainingPlan[] = (planData || []).map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          target_roles: ensureStringArray(plan.target_roles),
          courses: ensureStringArray(plan.courses),
          duration_days: plan.duration_days || 0,
          is_required: plan.is_required || false,
          priority: mapToTrainingPriority(plan.priority || 'medium'),
          status: plan.status,
          start_date: plan.start_date,
          end_date: plan.end_date,
          is_automated: plan.is_automated,
          automation_trigger: plan.automation_trigger,
          created_by: plan.created_by,
          created_at: plan.created_at,
          updated_at: plan.updated_at,
          target_departments: ensureStringArray(plan.target_departments),
          related_standards: ensureStringArray(plan.related_standards),
          // Legacy fields
          targetRoles: ensureStringArray(plan.target_roles),
          coursesIncluded: ensureStringArray(plan.courses),
          durationDays: plan.duration_days || 0,
          isRequired: plan.is_required || false,
          startDate: plan.start_date,
          endDate: plan.end_date,
          isAutomated: plan.is_automated,
          automationTrigger: plan.automation_trigger,
          createdBy: plan.created_by,
          createdDate: plan.created_at,
          targetDepartments: ensureStringArray(plan.target_departments),
          relatedStandards: ensureStringArray(plan.related_standards)
        }));
        
        setTrainingPlans(transformedPlans);
        
        // Fetch training records
        const { data: recordData, error: recordError } = await supabase
          .from('training_records')
          .select('*')
          .order('assigned_date', { ascending: false });
          
        if (recordError) throw recordError;
        
        // Transform database records to our TrainingRecord type
        const transformedRecords: TrainingRecord[] = (recordData || []).map(record => ({
          id: record.id,
          session_id: record.session_id,
          status: mapToTrainingStatus(record.status),
          assigned_date: record.assigned_date,
          due_date: record.due_date,
          completion_date: record.completion_date,
          score: record.score,
          pass_threshold: record.pass_threshold,
          last_recurrence: record.last_recurrence,
          next_recurrence: record.next_recurrence,
          employee_id: record.employee_id,
          employee_name: record.employee_name,
          notes: record.notes
        }));
        
        setTrainingRecords(transformedRecords);
      } catch (err) {
        console.error('Error fetching training data:', err);
        setError('Failed to load training data.');
        toast({
          title: 'Error',
          description: 'Failed to load training data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainingData();
  }, [toast]);

  const createTrainingSession = async (sessionData: Partial<TrainingSession>): Promise<TrainingSession | null> => {
    try {
      setLoading(true);
      
      // Convert to database schema format
      const dbSession = {
        title: sessionData.title,
        description: sessionData.description,
        training_type: sessionData.training_type,
        training_category: sessionData.training_category,
        department: sessionData.department,
        start_date: sessionData.start_date,
        due_date: sessionData.due_date,
        assigned_to: sessionData.assigned_to || [],
        materials_id: sessionData.materials_id,
        required_roles: sessionData.required_roles,
        is_recurring: sessionData.is_recurring,
        recurring_interval: sessionData.recurring_interval,
        completion_status: sessionData.completion_status 
          ? mapToTrainingStatus(sessionData.completion_status) 
          : 'Not Started',
        created_by: sessionData.created_by || 'Current User'
      };
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert(dbSession)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform to our TrainingSession type
      const newSession: TrainingSession = {
        id: data.id,
        title: data.title,
        description: data.description,
        training_type: mapToTrainingType(data.training_type),
        training_category: mapToTrainingCategory(data.training_category || 'other'),
        department: data.department,
        start_date: data.start_date,
        due_date: data.due_date,
        assigned_to: ensureStringArray(data.assigned_to),
        materials_id: ensureStringArray(data.materials_id),
        required_roles: ensureStringArray(data.required_roles),
        is_recurring: data.is_recurring,
        recurring_interval: data.recurring_interval,
        completion_status: mapToTrainingStatus(data.completion_status),
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setTrainingSessions(prev => [newSession, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Training session created successfully.',
      });
      
      return newSession;
    } catch (err) {
      console.error('Error creating training session:', err);
      toast({
        title: 'Error',
        description: 'Failed to create training session. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createTrainingPlan = async (planData: Partial<TrainingPlan>): Promise<TrainingPlan | null> => {
    try {
      setLoading(true);
      
      // Convert from our interface to the database schema
      const dbPlan = {
        name: planData.name,
        description: planData.description,
        target_roles: planData.targetRoles || planData.target_roles,
        courses: planData.coursesIncluded || planData.courses,
        duration_days: planData.durationDays || planData.duration_days,
        is_required: planData.isRequired || planData.is_required,
        priority: planData.priority,
        status: planData.status,
        start_date: planData.startDate || planData.start_date,
        end_date: planData.endDate || planData.end_date,
        is_automated: planData.isAutomated || planData.is_automated,
        automation_trigger: planData.automationTrigger || planData.automation_trigger,
        target_departments: planData.targetDepartments || planData.target_departments,
        related_standards: planData.relatedStandards || planData.related_standards,
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
        target_roles: ensureStringArray(data.target_roles),
        courses: ensureStringArray(data.courses),
        duration_days: data.duration_days || 0,
        is_required: data.is_required || false,
        priority: mapToTrainingPriority(data.priority || 'medium'),
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        is_automated: data.is_automated,
        automation_trigger: data.automation_trigger,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        target_departments: ensureStringArray(data.target_departments),
        related_standards: ensureStringArray(data.related_standards),
        // Add legacy fields for compatibility
        targetRoles: ensureStringArray(data.target_roles),
        coursesIncluded: ensureStringArray(data.courses),
        durationDays: data.duration_days || 0,
        isRequired: data.is_required || false,
        startDate: data.start_date,
        endDate: data.end_date,
        isAutomated: data.is_automated,
        automationTrigger: data.automation_trigger,
        createdBy: data.created_by,
        createdDate: data.created_at,
        targetDepartments: ensureStringArray(data.target_departments),
        relatedStandards: ensureStringArray(data.related_standards)
      };
      
      setTrainingPlans(prev => [newPlan, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Training plan created successfully.',
      });
      
      return newPlan;
    } catch (err) {
      console.error('Error creating training plan:', err);
      toast({
        title: 'Error',
        description: 'Failed to create training plan. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createTrainingRecord = async (recordData: Partial<TrainingRecord>): Promise<TrainingRecord | null> => {
    try {
      setLoading(true);
      
      // Convert to database schema format
      const dbRecord = {
        session_id: recordData.session_id,
        status: recordData.status || 'Not Started',
        assigned_date: recordData.assigned_date || new Date().toISOString(),
        due_date: recordData.due_date,
        completion_date: recordData.completion_date,
        score: recordData.score,
        pass_threshold: recordData.pass_threshold,
        last_recurrence: recordData.last_recurrence,
        next_recurrence: recordData.next_recurrence,
        employee_id: recordData.employee_id,
        employee_name: recordData.employee_name,
        notes: recordData.notes
      };
      
      const { data, error } = await supabase
        .from('training_records')
        .insert(dbRecord)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform to our TrainingRecord type
      const newRecord: TrainingRecord = {
        id: data.id,
        session_id: data.session_id,
        status: mapToTrainingStatus(data.status),
        assigned_date: data.assigned_date,
        due_date: data.due_date,
        completion_date: data.completion_date,
        score: data.score,
        pass_threshold: data.pass_threshold,
        last_recurrence: data.last_recurrence,
        next_recurrence: data.next_recurrence,
        employee_id: data.employee_id,
        employee_name: data.employee_name,
        notes: data.notes
      };
      
      setTrainingRecords(prev => [newRecord, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Training record created successfully.',
      });
      
      return newRecord;
    } catch (err) {
      console.error('Error creating training record:', err);
      toast({
        title: 'Error',
        description: 'Failed to create training record. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingSession = async (
    sessionId: string,
    updates: Partial<TrainingSession>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Convert to database schema format
      const dbUpdates = {
        title: updates.title,
        description: updates.description,
        training_type: updates.training_type,
        training_category: updates.training_category,
        department: updates.department,
        start_date: updates.start_date,
        due_date: updates.due_date,
        assigned_to: updates.assigned_to,
        materials_id: updates.materials_id,
        required_roles: updates.required_roles,
        is_recurring: updates.is_recurring,
        recurring_interval: updates.recurring_interval,
        completion_status: updates.completion_status
      };
      
      const { error } = await supabase
        .from('training_sessions')
        .update(dbUpdates)
        .eq('id', sessionId);
        
      if (error) throw error;
      
      // Update the local state
      setTrainingSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId ? { ...session, ...updates } : session
        )
      );
      
      toast({
        title: 'Success',
        description: 'Training session updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating training session:', err);
      toast({
        title: 'Error',
        description: 'Failed to update training session. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingPlan = async (
    planId: string,
    updates: Partial<TrainingPlan>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Convert from our interface to the database schema
      const dbUpdates = {
        name: updates.name,
        description: updates.description,
        target_roles: updates.targetRoles || updates.target_roles,
        courses: updates.coursesIncluded || updates.courses,
        duration_days: updates.durationDays || updates.duration_days,
        is_required: updates.isRequired || updates.is_required,
        priority: updates.priority,
        status: updates.status,
        start_date: updates.startDate || updates.start_date,
        end_date: updates.endDate || updates.end_date,
        is_automated: updates.isAutomated || updates.is_automated,
        automation_trigger: updates.automationTrigger || updates.automation_trigger,
        target_departments: updates.targetDepartments || updates.target_departments,
        related_standards: updates.relatedStandards || updates.related_standards
      };
      
      const { error } = await supabase
        .from('training_plans')
        .update(dbUpdates)
        .eq('id', planId);
        
      if (error) throw error;
      
      // Update the local state
      setTrainingPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === planId ? { ...plan, ...updates } : plan
        )
      );
      
      toast({
        title: 'Success',
        description: 'Training plan updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating training plan:', err);
      toast({
        title: 'Error',
        description: 'Failed to update training plan. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingRecord = async (
    recordId: string,
    updates: Partial<TrainingRecord>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Convert to database schema format
      const dbUpdates = {
        session_id: updates.session_id,
        status: updates.status,
        assigned_date: updates.assigned_date,
        due_date: updates.due_date,
        completion_date: updates.completion_date,
        score: updates.score,
        pass_threshold: updates.pass_threshold,
        last_recurrence: updates.last_recurrence,
        next_recurrence: updates.next_recurrence,
        employee_id: updates.employee_id,
        employee_name: updates.employee_name,
        notes: updates.notes
      };
      
      const { error } = await supabase
        .from('training_records')
        .update(dbUpdates)
        .eq('id', recordId);
        
      if (error) throw error;
      
      // Update the local state
      setTrainingRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === recordId ? { ...record, ...updates } : record
        )
      );
      
      toast({
        title: 'Success',
        description: 'Training record updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating training record:', err);
      toast({
        title: 'Error',
        description: 'Failed to update training record. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainingContext.Provider value={{
      trainingSessions,
      trainingPlans,
      trainingRecords,
      loading,
      error,
      createTrainingSession,
      createTrainingPlan,
      createTrainingRecord,
      updateTrainingSession,
      updateTrainingPlan,
      updateTrainingRecord
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

export default TrainingContext;
