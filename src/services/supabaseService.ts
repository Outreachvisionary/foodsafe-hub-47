
import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord, TrainingSession } from '@/types/training';
import { TrainingStatus } from '@/types/enums';
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
    id: uuidv4(), // Use proper UUID format instead of string IDs like 'tr-001-a'
    employee_id: record.employee_id,
    employee_name: record.employee_name,
    session_id: record.session_id,
    due_date: record.due_date,
    status: (record.status || 'Not Started') as TrainingStatus, // Properly type-cast the status
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

    console.log('Related training data:', data);
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

// New method to update training record status
export const updateTrainingStatus = async (
  recordId: string, 
  newStatus: TrainingStatus,
  score?: number,
  notes?: string
): Promise<TrainingRecord> => {
  const updates: Partial<TrainingRecord> = {
    status: newStatus,
    notes: notes
  };
  
  // Add completion date if completing the training
  if (newStatus === TrainingStatus.Completed) {
    updates.completed_date = new Date().toISOString();
    if (score !== undefined) updates.score = score;
  }

  const { data, error } = await supabase
    .from('training_records')
    .update(updates)
    .eq('id', recordId)
    .select()
    .single();

  if (error) {
    console.error('Error updating training status:', error);
    throw new Error('Failed to update training status');
  }

  return data as unknown as TrainingRecord;
};

// Export all functions
export default {
  fetchTrainingSessions,
  fetchTrainingRecords,
  createTrainingSession,
  createTrainingRecord,
  fetchRelatedTraining,
  subscribeToTrainingUpdates,
  updateTrainingStatus
};
