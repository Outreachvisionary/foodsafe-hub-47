
import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord, TrainingSession } from '@/types/training';
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

  return data || [];
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

  return data || [];
};

export const createTrainingSession = async (session: Partial<TrainingSession>): Promise<TrainingSession> => {
  // Ensure required fields are present
  if (!session.title || !session.training_type || !session.created_by || !session.assigned_to) {
    throw new Error('Missing required fields for training session');
  }

  const newSession = {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    ...session
  };

  const { data, error } = await supabase
    .from('training_sessions')
    .insert([newSession])
    .select()
    .single();

  if (error) {
    console.error('Error creating training session:', error);
    throw new Error('Failed to create training session');
  }

  return data;
};

export const createTrainingRecord = async (record: Partial<TrainingRecord>): Promise<TrainingRecord> => {
  // Ensure required fields are present
  if (!record.employee_id || !record.employee_name || !record.session_id || !record.due_date) {
    throw new Error('Missing required fields for training record');
  }

  const newRecord = {
    id: uuidv4(),
    ...record
  };

  const { data, error } = await supabase
    .from('training_records')
    .insert([newRecord])
    .select()
    .single();

  if (error) {
    console.error('Error creating training record:', error);
    throw new Error('Failed to create training record');
  }

  return data;
};

// Export all functions
export default {
  fetchTrainingSessions,
  fetchTrainingRecords,
  createTrainingSession,
  createTrainingRecord
};
