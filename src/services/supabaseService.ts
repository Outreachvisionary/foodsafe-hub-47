
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
    title: session.title,
    training_type: session.training_type,
    created_by: session.created_by,
    assigned_to: session.assigned_to,
    ...session
  };

  const { data, error } = await supabase
    .from('training_sessions')
    .insert(newSession)
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
    .insert(newRecord)
    .select()
    .single();

  if (error) {
    console.error('Error creating training record:', error);
    throw new Error('Failed to create training record');
  }

  return data as unknown as TrainingRecord;
};

// Export all functions
export default {
  fetchTrainingSessions,
  fetchTrainingRecords,
  createTrainingSession,
  createTrainingRecord
};
