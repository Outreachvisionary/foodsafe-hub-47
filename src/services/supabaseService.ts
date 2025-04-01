
import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord, TrainingSession, TrainingStatus } from '@/types/training';
import { v4 as uuidv4 } from 'uuid';

// Training services
export const fetchTrainingSessions = async (): Promise<TrainingSession[]> => {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching training sessions:', error);
    throw new Error('Failed to fetch training sessions');
  }

  // Cast the data to satisfy TypeScript
  return (data || []) as unknown as TrainingSession[];
};

export const fetchTrainingRecords = async (): Promise<TrainingRecord[]> => {
  const { data, error } = await supabase
    .from('training_records')
    .select('*')
    .order('assigned_date', { ascending: false });

  if (error) {
    console.error('Error fetching training records:', error);
    throw new Error('Failed to fetch training records');
  }

  // Cast the data to satisfy TypeScript
  return (data || []) as unknown as TrainingRecord[];
};

export const createTrainingSession = async (session: Partial<TrainingSession>): Promise<TrainingSession> => {
  // Ensure required fields are present
  if (!session.title || !session.training_type || !session.created_by || !session.assigned_to) {
    throw new Error('Missing required fields for training session');
  }

  const newSession = {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: session.title,
    training_type: session.training_type,
    created_by: session.created_by,
    assigned_to: session.assigned_to,
    ...session
  };

  const { data, error } = await supabase
    .from('training_sessions')
    .insert(newSession as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating training session:', error);
    throw new Error('Failed to create training session');
  }

  return data as unknown as TrainingSession;
};

export const createTrainingRecord = async (record: Partial<TrainingRecord>): Promise<TrainingRecord> => {
  // Ensure required fields are present
  if (!record.employee_id || !record.employee_name || !record.session_id || !record.due_date) {
    throw new Error('Missing required fields for training record');
  }

  const newRecord = {
    id: uuidv4(),
    employee_id: record.employee_id,
    employee_name: record.employee_name,
    session_id: record.session_id,
    due_date: record.due_date,
    status: record.status || 'Not Started' as TrainingStatus,
    ...record
  };

  const { data, error } = await supabase
    .from('training_records')
    .insert(newRecord as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating training record:', error);
    throw new Error('Failed to create training record');
  }

  return data as unknown as TrainingRecord;
};

// New method to fetch training related to a source (like a non-conformance)
export const fetchRelatedTraining = async (sourceId: string, sourceType: string = 'non_conformance'): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('module_relationships')
      .select(`
        *,
        training_records!target_id (
          *,
          training_sessions (*)
        )
      `)
      .eq('source_id', sourceId)
      .eq('source_type', sourceType)
      .eq('target_type', 'training');

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching related training:', error);
    return [];
  }
};

// New method to set up real-time updates for training records
export const subscribeToTrainingUpdates = (
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel('public:training_records')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'training_records' }, 
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Export all functions
export default {
  fetchTrainingSessions,
  fetchTrainingRecords,
  createTrainingSession,
  createTrainingRecord,
  fetchRelatedTraining,
  subscribeToTrainingUpdates
};
