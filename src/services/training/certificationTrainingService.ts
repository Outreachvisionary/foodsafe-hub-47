
import { supabase } from '@/integrations/supabase/client';

export interface Certification {
  id?: string;
  name: string;
  description?: string;
  validity_period_months: number;
  required_score?: number;
  created_at?: string;
  updated_at?: string;
  created_by: string;
}

export interface TrainingCertification {
  id?: string;
  training_session_id: string;
  certification_id: string;
  employee_id: string;
  issued_date: string;
  expiry_date: string;
  status: 'Active' | 'Expired' | 'Revoked';
  created_at?: string;
  updated_at?: string;
}

// Note: Since there's no 'certifications' table in the database schema,
// we'll use the training_sessions table to manage certification-related training

export const getCertificationTraining = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('session_type', 'Certification')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching certification training:', error);
    return [];
  }
};

export const createCertificationTraining = async (trainingData: {
  title: string;
  description?: string;
  duration_hours: number;
  pass_threshold?: number;
  created_by: string;
}): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert({
        ...trainingData,
        session_type: 'Certification',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating certification training:', error);
    throw error;
  }
};

export const updateCertificationTraining = async (
  id: string,
  updates: Partial<{
    title: string;
    description?: string;
    duration_hours: number;
    pass_threshold?: number;
  }>
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating certification training:', error);
    throw error;
  }
};

export const deleteCertificationTraining = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('training_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting certification training:', error);
    throw error;
  }
};

export const getEmployeeCertifications = async (employeeId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('training_records')
      .select(`
        *,
        training_sessions!inner (
          title,
          session_type,
          duration_hours
        )
      `)
      .eq('employee_id', employeeId)
      .eq('training_sessions.session_type', 'Certification')
      .eq('status', 'Completed');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employee certifications:', error);
    return [];
  }
};

export default {
  getCertificationTraining,
  createCertificationTraining,
  updateCertificationTraining,
  deleteCertificationTraining,
  getEmployeeCertifications
};
