
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
      setRecords(recordsData || []);

      // Fetch training sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('training_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      // Fetch training plans
      const { data: plansData, error: plansError } = await supabase
        .from('training_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setTrainingPlans(plansData || []);

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
      const { error } = await supabase
        .from('training_plans')
        .insert(plan);
        
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
