
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { TrainingSession, TrainingStatus, TrainingType, TrainingCategory, TrainingCompletionStatus } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';
import { 
  mapToTrainingType, 
  mapToTrainingCategory, 
  mapToTrainingStatus,
  mapToCompletionStatus,
  ensureStringArray 
} from '@/utils/trainingTypeMapper';

export function useTrainingSessions() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('training_sessions').select('*');
      // if (error) throw error;
      
      // Mock data for development
      const mockSessions = [
        {
          id: '1',
          title: 'Food Safety Basics',
          description: 'Fundamental training on food safety principles',
          training_type: 'classroom' as TrainingType,
          training_category: 'food-safety' as TrainingCategory,
          department: 'production',
          start_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: ['user1', 'user2', 'user3'],
          materials_id: ['doc1', 'doc2'],
          required_roles: ['operator', 'supervisor'],
          is_recurring: true,
          recurring_interval: '30',
          completion_status: 'in-progress' as TrainingCompletionStatus,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'HACCP Principles',
          description: 'Advanced HACCP training for quality personnel',
          training_type: 'online' as TrainingType,
          training_category: 'haccp' as TrainingCategory,
          department: 'quality',
          start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: ['user4', 'user5'],
          materials_id: ['doc3', 'doc4'],
          required_roles: ['qc', 'supervisor'],
          is_recurring: false,
          recurring_interval: '0',
          completion_status: 'not-started' as TrainingCompletionStatus,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Equipment Safety',
          description: 'Training on safe operation of production equipment',
          training_type: 'on-the-job' as TrainingType,
          training_category: 'technical' as TrainingCategory,
          department: 'maintenance',
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: ['user6', 'user7', 'user8'],
          materials_id: ['doc5'],
          required_roles: ['operator', 'maintenance'],
          is_recurring: true,
          recurring_interval: '90',
          completion_status: 'completed' as TrainingCompletionStatus,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setSessions(mockSessions);
    } catch (err) {
      console.error('Error fetching training sessions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch training sessions'));
      toast({
        title: 'Error',
        description: 'Failed to load training sessions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSessions();
  }, []);
  
  const createSession = async (sessionData: Partial<TrainingSession>) => {
    try {
      // Format the data to ensure proper types
      const formattedData = {
        ...sessionData,
        title: sessionData.title || '',
        description: sessionData.description || '',
        training_type: sessionData.training_type || 'classroom',
        training_category: sessionData.training_category || 'food-safety',
        department: sessionData.department || '',
        start_date: sessionData.start_date || new Date().toISOString(),
        due_date: sessionData.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: sessionData.assigned_to || [],
        materials_id: sessionData.materials_id || [],
        required_roles: sessionData.required_roles || [],
        is_recurring: Boolean(sessionData.is_recurring),
        recurring_interval: sessionData.recurring_interval || '0',
        completion_status: sessionData.completion_status || 'not-started',
        created_by: sessionData.created_by || 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Mock database insert
      const newSession = {
        ...formattedData,
        id: `session-${Date.now()}`
      } as TrainingSession;
      
      setSessions(prev => [...prev, newSession]);
      
      return newSession;
    } catch (err) {
      console.error('Error creating training session:', err);
      toast({
        title: 'Error',
        description: 'Failed to create training session',
        variant: 'destructive',
      });
      throw err;
    }
  };
  
  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession
  };
}
