
import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord, TrainingSession } from '@/types/training';
import { TrainingStatus } from '@/types/enums';
import { stringToTrainingStatus, trainingStatusToString } from '@/utils/trainingTypeMapper';

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

  // Convert string status from database to enum
  return {
    ...data,
    status: stringToTrainingStatus(data.status)
  };
};

export const createTrainingRecord = async (
  record: Omit<TrainingRecord, 'id'>
): Promise<TrainingRecord> => {
  // Convert enum values to strings for database storage
  const dbRecord = {
    ...record,
    status: trainingStatusToString(record.status)
  };

  const { data, error } = await supabase
    .from('training_records')
    .insert([dbRecord])
    .select()
    .single();

  if (error) {
    console.error('Error creating training record:', error);
    throw error;
  }

  // Convert string status back to enum for return
  return {
    ...data,
    status: stringToTrainingStatus(data.status)
  };
};

export const createTrainingSession = async (
  session: Omit<TrainingSession, 'id'>
): Promise<TrainingSession> => {
  const { data, error } = await supabase
    .from('training_sessions')
    .insert([session])
    .select()
    .single();

  if (error) {
    console.error('Error creating training session:', error);
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
  
  // Convert string status back to enum for return
  return {
    ...data,
    status: stringToTrainingStatus(data.status)
  };
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

export const fetchRelatedTraining = async (sourceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('module_relationships')
      .select(`
        *,
        training_records:target_id (
          *,
          training_sessions:session_id (*)
        )
      `)
      .eq('source_id', sourceId)
      .eq('source_type', 'non_conformance')
      .eq('target_type', 'training');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching related training:', error);
    return [];
  }
};
