
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrainingStatus } from '@/types/enums';

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  training_type: string;
  training_category?: string;
  assigned_to: string[];
  department?: string;
  start_date: string | null;
  due_date: string | null;
  completion_status: TrainingStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  materials_id?: string[];
}

export const useTrainingSessions = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database records to TrainingSession objects
      const mappedSessions: TrainingSession[] = data.map(session => ({
        ...session,
        completion_status: session.completion_status as TrainingStatus
      }));

      setSessions(mappedSessions);
    } catch (err) {
      console.error('Error fetching training sessions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      
      toast({
        title: 'Error',
        description: 'Failed to fetch training sessions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createSession = useCallback(async (sessionData: Partial<TrainingSession>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert([sessionData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new session to the state
      setSessions(prev => [data as TrainingSession, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Training session created successfully',
      });
      
      return data;
    } catch (err) {
      console.error('Error creating training session:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to create training session',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateSessionStatus = useCallback(async (sessionId: string, newStatus: TrainingStatus) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('training_sessions')
        .update({ completion_status: newStatus })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the session in the state
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId ? { ...session, completion_status: newStatus } : session
        )
      );
      
      toast({
        title: 'Status Updated',
        description: `Training session status updated to ${newStatus}`,
      });
      
      return data;
    } catch (err) {
      console.error('Error updating training session status:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to update training session status',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    updateSessionStatus
  };
};

export default useTrainingSessions;
