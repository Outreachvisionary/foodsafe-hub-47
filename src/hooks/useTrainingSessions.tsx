
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingSession, TrainingType, TrainingCategory, TrainingCompletionStatus } from '@/types/training';

export const useTrainingSessions = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      // Convert data format from database to our interface
      const formattedSessions: TrainingSession[] = (data || []).map(session => ({
        id: session.id,
        title: session.title,
        description: session.description || '',
        training_type: session.training_type as TrainingType,
        training_category: session.training_category as TrainingCategory,
        department: session.department || '',
        start_date: session.start_date,
        due_date: session.due_date,
        assigned_to: session.assigned_to || [],
        materials_id: session.materials_id || [],
        required_roles: session.required_roles || [],
        is_recurring: session.is_recurring || false,
        recurring_interval: String(session.recurring_interval || ''),
        completion_status: mapDbCompletionStatus(session.completion_status),
        created_by: session.created_by,
        created_at: session.created_at,
        updated_at: session.updated_at
      }));
      
      setSessions(formattedSessions);
    } catch (err) {
      console.error('Error fetching training sessions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch training sessions'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (sessionData: Omit<TrainingSession, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      // Convert our interface format to database format
      const dbSessionData = {
        title: sessionData.title,
        description: sessionData.description,
        training_type: sessionData.training_type,
        training_category: sessionData.training_category,
        department: sessionData.department,
        start_date: sessionData.start_date,
        due_date: sessionData.due_date,
        assigned_to: sessionData.assigned_to,
        materials_id: sessionData.materials_id,
        required_roles: sessionData.required_roles,
        is_recurring: sessionData.is_recurring,
        recurring_interval: sessionData.recurring_interval ? parseInt(sessionData.recurring_interval) : null,
        completion_status: mapToDbCompletionStatus(sessionData.completion_status),
        created_by: sessionData.created_by
      };
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert(dbSessionData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert the returned data to our interface format
      const newSession: TrainingSession = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        training_type: data.training_type as TrainingType,
        training_category: data.training_category as TrainingCategory,
        department: data.department || '',
        start_date: data.start_date,
        due_date: data.due_date,
        assigned_to: data.assigned_to || [],
        materials_id: data.materials_id || [],
        required_roles: data.required_roles || [],
        is_recurring: data.is_recurring || false,
        recurring_interval: String(data.recurring_interval || ''),
        completion_status: mapDbCompletionStatus(data.completion_status),
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      console.error('Error creating training session:', err);
      setError(err instanceof Error ? err : new Error('Failed to create training session'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper functions to map between DB representation and interface representation
  function mapDbCompletionStatus(dbStatus: string): TrainingCompletionStatus {
    switch(dbStatus) {
      case 'Not Started': return 'not-started';
      case 'In Progress': return 'in-progress';
      case 'Completed': return 'completed';
      case 'Overdue': return 'overdue';
      case 'Cancelled': return 'cancelled';
      default: return 'not-started';
    }
  }

  function mapToDbCompletionStatus(status: TrainingCompletionStatus): string {
    switch(status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
      case 'cancelled': return 'Cancelled';
      default: return 'Not Started';
    }
  }

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession
  };
};
