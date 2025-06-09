import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord } from '@/types/training';
import { trainingStatusToString } from '@/utils/typeAdapters';

export const getTrainingRecordById = async (id: string): Promise<TrainingRecord | null> => {
  const { data, error } = await supabase
    .from('training_records')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching training record:', error);
    return null;
  }

  return data;
};

export const createTrainingRecord = async (
  record: Omit<TrainingRecord, 'id'>
): Promise<TrainingRecord> => {
  const { data, error } = await supabase
    .from('training_records')
    .insert([record])
    .select()
    .single();

  if (error) {
    console.error('Error creating training record:', error);
    throw error;
  }

  return data;
};

export const updateTrainingRecord = async (
  id: string, 
  updates: Partial<TrainingRecord>
): Promise<TrainingRecord> => {
  // Convert enum values to strings for database storage
  const dbUpdates = {
    ...updates,
    status: updates.status ? trainingStatusToString(updates.status) : undefined
  };

  const { data, error } = await supabase
    .from('training_records')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTrainingRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('training_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting training record:', error);
    throw error;
  }
};
