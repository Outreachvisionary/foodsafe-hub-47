
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: string;
  status?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  due_date: string;
  assigned_to?: string[];
  content?: string;
  duration_minutes?: number;
  pass_threshold?: number;
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Assigned';
  assigned_date: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  notes?: string;
  last_recurrence?: string;
  next_recurrence?: string;
}

export const useTraining = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainingSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedSessions: TrainingSession[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        training_type: item.training_type,
        status: item.status,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at,
        due_date: item.due_date,
        assigned_to: item.assigned_to,
        content: item.content,
        duration_minutes: item.duration_minutes,
        pass_threshold: item.pass_threshold
      }));

      setSessions(mappedSessions);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      setError('Failed to load training sessions');
    }
  };

  const fetchTrainingRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('training_records')
        .select('*')
        .order('assigned_date', { ascending: false });

      if (error) throw error;

      const mappedRecords: TrainingRecord[] = (data || []).map(item => ({
        id: item.id,
        session_id: item.session_id,
        employee_id: item.employee_id,
        employee_name: item.employee_name,
        status: item.status,
        assigned_date: item.assigned_date,
        due_date: item.due_date,
        completion_date: item.completion_date,
        score: item.score,
        pass_threshold: item.pass_threshold,
        notes: item.notes,
        last_recurrence: item.last_recurrence,
        next_recurrence: item.next_recurrence
      }));

      setRecords(mappedRecords);
    } catch (error) {
      console.error('Error fetching training records:', error);
      setError('Failed to load training records');
    }
  };

  const createTrainingSession = async (sessionData: Partial<TrainingSession>) => {
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .insert([{
          title: sessionData.title,
          description: sessionData.description,
          training_type: sessionData.training_type,
          status: sessionData.status || 'Draft',
          created_by: sessionData.created_by,
          due_date: sessionData.due_date,
          assigned_to: sessionData.assigned_to || [],
          content: sessionData.content,
          duration_minutes: sessionData.duration_minutes,
          pass_threshold: sessionData.pass_threshold || 80
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Training session created successfully');
      await fetchTrainingSessions();
      return data;
    } catch (error) {
      console.error('Error creating training session:', error);
      toast.error('Failed to create training session');
      throw error;
    }
  };

  const assignTraining = async (sessionId: string, employeeIds: string[], dueDate: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) throw new Error('Training session not found');

      const assignments = employeeIds.map(employeeId => ({
        session_id: sessionId,
        employee_id: employeeId,
        employee_name: `Employee ${employeeId}`, // TODO: Get actual employee name
        status: 'Assigned' as const,
        due_date: dueDate,
        pass_threshold: session.pass_threshold || 80
      }));

      const { error } = await supabase
        .from('training_records')
        .insert(assignments);

      if (error) throw error;

      toast.success(`Training assigned to ${employeeIds.length} employees`);
      await fetchTrainingRecords();
    } catch (error) {
      console.error('Error assigning training:', error);
      toast.error('Failed to assign training');
      throw error;
    }
  };

  const updateTrainingRecord = async (recordId: string, updates: Partial<TrainingRecord>) => {
    try {
      const { error } = await supabase
        .from('training_records')
        .update(updates)
        .eq('id', recordId);

      if (error) throw error;

      toast.success('Training record updated successfully');
      await fetchTrainingRecords();
    } catch (error) {
      console.error('Error updating training record:', error);
      toast.error('Failed to update training record');
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTrainingSessions(),
        fetchTrainingRecords()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    sessions,
    records,
    loading,
    error,
    createTrainingSession,
    assignTraining,
    updateTrainingRecord,
    refreshData: () => Promise.all([fetchTrainingSessions(), fetchTrainingRecords()])
  };
};
