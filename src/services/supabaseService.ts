
import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord, TrainingSession } from '@/types/training';
import { TrainingStatus, TrainingType, TrainingCategory } from '@/types/enums';
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
    session_id: record.session_id,
    employee_id: record.employee_id,
    employee_name: record.employee_name,
    status: trainingStatusToString(record.status), // Convert enum to string for database
    assigned_date: record.assigned_date,
    due_date: record.due_date,
    completion_date: record.completion_date,
    score: record.score,
    pass_threshold: record.pass_threshold,
    last_recurrence: record.last_recurrence,
    next_recurrence: record.next_recurrence,
    notes: record.notes
  };

  const { data, error } = await supabase
    .from('training_records')
    .insert(dbRecord)
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
  // Convert enums to strings for database storage
  const dbSession = {
    title: session.title,
    description: session.description,
    training_type: session.training_type, // Already a string from enum
    training_category: session.training_category, // Already a string from enum
    assigned_to: session.assigned_to,
    start_date: session.start_date,
    due_date: session.due_date,
    created_by: session.created_by,
    required_roles: session.required_roles,
    is_recurring: session.is_recurring
  };

  const { data, error } = await supabase
    .from('training_sessions')
    .insert([dbSession])
    .select()
    .single();

  if (error) {
    console.error('Error creating training session:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    training_type: data.training_type as TrainingType,
    training_category: data.training_category as TrainingCategory,
    assigned_to: data.assigned_to,
    start_date: data.start_date,
    due_date: data.due_date,
    created_by: data.created_by,
    required_roles: data.required_roles,
    is_recurring: data.is_recurring,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const updateTrainingRecord = async (
  id: string, 
  updates: Partial<TrainingRecord>
): Promise<TrainingRecord> => {
  // Convert enum values to strings for database storage
  const dbUpdates: any = {};
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'status' && value) {
        dbUpdates[key] = trainingStatusToString(value as TrainingStatus);
      } else {
        dbUpdates[key] = value;
      }
    }
  });

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

// Helper function to assign training to employees
export const assignTrainingToEmployees = async (
  sessionId: string,
  employeeIds: string[],
  employeeNames: Record<string, string>
): Promise<void> => {
  try {
    // Create individual assignments
    for (const employeeId of employeeIds) {
      const assignment = {
        session_id: sessionId,
        employee_id: employeeId,
        employee_name: employeeNames[employeeId] || 'Unknown Employee',
        status: trainingStatusToString(TrainingStatus.Not_Started), // Convert enum to string
        assigned_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };

      const { error } = await supabase
        .from('training_records')
        .insert(assignment);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error assigning training to employees:', error);
    throw error;
  }
};
