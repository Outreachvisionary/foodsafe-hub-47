
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

// Get certification training sessions using the actual training_sessions table
export const getCertificationTraining = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
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
  created_by: string;
}): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert({
        title: trainingData.title,
        description: trainingData.description || '',
        created_by: trainingData.created_by,
        assigned_to: [],
        completion_status: 'Not Started',
        training_type: 'certification',
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
          title
        )
      `)
      .eq('employee_id', employeeId)
      .eq('status', 'Completed');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employee certifications:', error);
    return [];
  }
};

export const processExpiringCertifications = async (): Promise<void> => {
  console.log('Processing expiring certifications...');
  // Implementation for processing expiring certifications
};

export const createRemediationTraining = async (data: any): Promise<void> => {
  console.log('Creating remediation training...', data);
  // Implementation for creating remediation training
};

export default {
  getCertificationTraining,
  createCertificationTraining,
  updateCertificationTraining,
  deleteCertificationTraining,
  getEmployeeCertifications,
  processExpiringCertifications,
  createRemediationTraining
};
