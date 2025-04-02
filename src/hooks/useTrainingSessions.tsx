
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrainingSession } from '@/types/training';
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
        
        setSessions(data || []);
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
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert(sessionData)
        .select()
        .single();
        
      if (error) throw error;
      
      setSessions(prev => [data as TrainingSession, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Training session created successfully.',
      });
      
      return data as TrainingSession;
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
