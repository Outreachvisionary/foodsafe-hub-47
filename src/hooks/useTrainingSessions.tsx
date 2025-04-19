
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrainingSession, TrainingStatus } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';

export function useTrainingSessions() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrainingSessions = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('training_sessions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform database records to our TrainingSession type
        const transformedSessions: TrainingSession[] = (data || []).map(session => ({
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
      } catch (err) {
        console.error('Error fetching training sessions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch training sessions'));
        toast({
          title: 'Error',
          description: 'Failed to load training sessions. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingSessions();
  }, [toast]);

  const createTrainingSession = async (sessionData: Partial<TrainingSession>): Promise<TrainingSession | null> => {
    try {
      setLoading(true);
      
      // Convert to database schema format with the required fields
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
        completion_status: sessionData.completion_status,
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
        training_type: data.training_type,
        training_category: data.training_category,
        department: data.department,
        start_date: data.start_date,
        due_date: data.due_date,
        assigned_to: data.assigned_to || [],
        materials_id: data.materials_id,
        required_roles: data.required_roles,
        is_recurring: data.is_recurring,
        recurring_interval: data.recurring_interval,
        completion_status: data.completion_status as TrainingStatus,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setSessions(prev => [newSession, ...prev]);
      
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

  return {
    sessions,
    loading,
    error,
    createTrainingSession
  };
}
