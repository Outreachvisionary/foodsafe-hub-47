
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord, TrainingSession, TrainingPlan, DepartmentTrainingStats } from '@/types/training';
import { useToast } from '@/components/ui/use-toast';

interface TrainingContextProps {
  isLoading: boolean;
  records: TrainingRecord[];
  sessions: TrainingSession[];
  trainingPlans: TrainingPlan[];
  departmentStats: DepartmentTrainingStats[];
  refreshTrainingData: () => Promise<void>;
  assignTraining: (employeeIds: string[], courseIds: string[], dueDate: string) => Promise<boolean>;
  createTrainingPlan: (plan: Partial<TrainingPlan>) => Promise<boolean>;
  updateTrainingRecord: (recordId: string, updates: Partial<TrainingRecord>) => Promise<boolean>;
}

const TrainingContext = createContext<TrainingContextProps>({} as TrainingContextProps);

export const useTrainingContext = () => useContext(TrainingContext);

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentTrainingStats[]>([]);
  const { toast } = useToast();

  // Fetch initial data
  useEffect(() => {
    refreshTrainingData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const recordsSubscription = supabase
      .channel('training-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'training_records' 
      }, (payload) => {
        console.log('Training record changed:', payload);
        refreshTrainingData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(recordsSubscription);
    };
  }, []);

  const refreshTrainingData = async () => {
    setIsLoading(true);
    try {
      // Fetch training records
      const { data: recordsData, error: recordsError } = await supabase
        .from('training_records')
        .select('*')
        .order('due_date', { ascending: true });

      if (recordsError) throw recordsError;
      
      // Convert database records to our TrainingRecord type
      const transformedRecords: TrainingRecord[] = (recordsData || []).map(record => ({
        id: record.id,
        session_id: record.session_id,
        employee_id: record.employee_id,
        employee_name: record.employee_name,
        status: record.status as TrainingStatus,
        assigned_date: record.assigned_date,
        due_date: record.due_date,
        completion_date: record.completion_date,
        score: record.score,
        pass_threshold: record.pass_threshold,
        next_recurrence: record.next_recurrence,
        last_recurrence: record.last_recurrence,
        notes: record.notes
      }));
      
      setRecords(transformedRecords);

      // Fetch training sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('training_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      
      // Convert database sessions to our TrainingSession type
      const transformedSessions: TrainingSession[] = (sessionsData || []).map(session => ({
        id: session.id,
        title: session.title,
        description: session.description,
        training_type: session.training_type,
        training_category: session.training_category,
        department: session.department,
        start_date: session.start_date,
        due_date: session.due_date,
        assigned_to: session.assigned_to || [],
        materials_id: session.materials_id,
        required_roles: session.required_roles,
        is_recurring: session.is_recurring,
        recurring_interval: session.recurring_interval,
        completion_status: session.completion_status as TrainingStatus,
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
      
      // Convert database plans to our TrainingPlan type
      const transformedPlans: TrainingPlan[] = (plansData || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        targetRoles: plan.target_roles || [],
        coursesIncluded: plan.courses || [],
        durationDays: plan.duration_days || 0,
        isRequired: plan.is_required || false,
        priority: plan.priority || 'medium',
        status: plan.status,
        startDate: plan.start_date,
        endDate: plan.end_date,
        isAutomated: plan.is_automated,
        automationTrigger: plan.automation_trigger,
        createdBy: plan.created_by,
        created_by: plan.created_by,
        createdDate: plan.created_at,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
        courses: plan.courses,
        targetDepartments: plan.target_departments,
        relatedStandards: plan.related_standards,
        target_departments: plan.target_departments,
        duration_days: plan.duration_days,
        target_roles: plan.target_roles,
        is_required: plan.is_required,
        is_automated: plan.is_automated,
        start_date: plan.start_date,
        end_date: plan.end_date,
        automation_trigger: plan.automation_trigger,
        related_standards: plan.related_standards
      }));
      
      setTrainingPlans(transformedPlans);

      // Calculate department stats
      const deptStats: DepartmentTrainingStats[] = [];
      
      // Mock department stats for now
      // In a real implementation, you would calculate these from the database
      deptStats.push({
        departmentName: 'Production',
        totalAssigned: 45,
        completed: 32,
        inProgress: 10,
        overdue: 3,
        compliancePercentage: 71,
        completedCount: 32,
        overdueCount: 3,
        employeeCount: 45
      });
      
      deptStats.push({
        departmentName: 'Quality',
        totalAssigned: 28,
        completed: 25,
        inProgress: 3,
        overdue: 0,
        compliancePercentage: 89,
        completedCount: 25,
        overdueCount: 0,
        employeeCount: 28
      });
      
      deptStats.push({
        departmentName: 'Maintenance',
        totalAssigned: 15,
        completed: 10,
        inProgress: 3,
        overdue: 2,
        compliancePercentage: 67,
        completedCount: 10,
        overdueCount: 2,
        employeeCount: 15
      });
      
      setDepartmentStats(deptStats);

    } catch (error) {
      console.error('Error fetching training data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load training data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const assignTraining = async (employeeIds: string[], courseIds: string[], dueDate: string): Promise<boolean> => {
    try {
      // For each employee and course combination, create a training record
      const assignments = [];
      
      for (const employeeId of employeeIds) {
        for (const courseId of courseIds) {
          assignments.push({
            employee_id: employeeId,
            employee_name: 'Employee Name', // In a real app, look up the name
            course_id: courseId,
            due_date: dueDate,
            status: 'Not Started',
            assigned_by: 'Current User', // In a real app, use the current user's ID
          });
        }
      }
      
      const { error } = await supabase
        .from('training_records')
        .insert(assignments);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Training assignments created successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning training:', error);
      toast({
        title: 'Error',
        description: 'Failed to create training assignments',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createTrainingPlan = async (plan: Partial<TrainingPlan>): Promise<boolean> => {
    try {
      // Convert from our interface to the database schema
      const dbPlan = {
        name: plan.name,
        description: plan.description,
        target_roles: plan.targetRoles || plan.target_roles,
        courses: plan.coursesIncluded || plan.courses,
        duration_days: plan.durationDays || plan.duration_days,
        is_required: plan.isRequired || plan.is_required,
        priority: plan.priority,
        status: plan.status,
        start_date: plan.startDate || plan.start_date,
        end_date: plan.endDate || plan.end_date,
        is_automated: plan.isAutomated || plan.is_automated,
        automation_trigger: plan.automationTrigger || plan.automation_trigger,
        target_departments: plan.targetDepartments || plan.target_departments,
        related_standards: plan.relatedStandards || plan.related_standards,
        created_by: plan.createdBy || plan.created_by || 'Current User'
      };
        
      const { error } = await supabase
        .from('training_plans')
        .insert(dbPlan);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Training plan created successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error creating training plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to create training plan',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateTrainingRecord = async (recordId: string, updates: Partial<TrainingRecord>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('training_records')
        .update(updates)
        .eq('id', recordId);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Training record updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating training record:', error);
      toast({
        title: 'Error',
        description: 'Failed to update training record',
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <TrainingContext.Provider 
      value={{ 
        isLoading,
        records,
        sessions,
        trainingPlans,
        departmentStats,
        refreshTrainingData,
        assignTraining,
        createTrainingPlan,
        updateTrainingRecord
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};
