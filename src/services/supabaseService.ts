import { supabase } from '@/integrations/supabase/client';
import { Document, Folder, TrainingRecord, TrainingSession } from '@/types/database';

// Document Services
export const fetchDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*');
  
  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
  
  return data as Document[];
};

export const createDocument = async (document: Omit<Document, 'id'>): Promise<Document> => {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating document:', error);
    throw error;
  }
  
  return data as Document;
};

export const updateDocument = async (id: string, updates: Partial<Document>): Promise<Document> => {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating document:', error);
    throw error;
  }
  
  return data as Document;
};

export const deleteDocument = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Folder Services
export const fetchFolders = async (): Promise<Folder[]> => {
  const { data, error } = await supabase
    .from('folders')
    .select('*');
  
  if (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
  
  return data as Folder[];
};

// Training Session Services
export const fetchTrainingSessions = async (): Promise<TrainingSession[]> => {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*');
  
  if (error) {
    console.error('Error fetching training sessions:', error);
    throw error;
  }
  
  return data as TrainingSession[];
};

// Training Record Services
export const fetchTrainingRecords = async (): Promise<TrainingRecord[]> => {
  const { data, error } = await supabase
    .from('training_records')
    .select('*');
  
  if (error) {
    console.error('Error fetching training records:', error);
    throw error;
  }
  
  return data as TrainingRecord[];
};

export const createTrainingRecord = async (record: Omit<TrainingRecord, 'id'>): Promise<TrainingRecord> => {
  // Ensure the record has all required fields according to the TrainingRecord interface
  const validRecord = {
    session_id: record.session_id,
    employee_id: record.employee_id,
    employee_name: record.employee_name,
    due_date: record.due_date,
    status: record.status || 'Not Started',
    assigned_date: record.assigned_date || new Date().toISOString(),
    completion_date: record.completion_date,
    score: record.score,
    pass_threshold: record.pass_threshold,
    notes: record.notes,
    next_recurrence: record.next_recurrence,
    last_recurrence: record.last_recurrence
  };

  const { data, error } = await supabase
    .from('training_records')
    .insert(validRecord)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating training record:', error);
    throw error;
  }
  
  return data as TrainingRecord;
};

export const updateTrainingRecord = async (id: string, updates: Partial<TrainingRecord>): Promise<TrainingRecord> => {
  const { data, error } = await supabase
    .from('training_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating training record:', error);
    throw error;
  }
  
  return data as TrainingRecord;
};
