import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: string;
  training_category?: string;
  completion_status?: 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue';
  assigned_to: string[];
  department?: string;
  start_date?: string;
  due_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  materials_id?: string[];
  required_roles?: string[];
  is_recurring?: boolean;
  recurring_interval?: number;
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status?: 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue';
  assigned_date?: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  notes?: string;
  last_recurrence?: string;
  next_recurrence?: string;
}

export interface TrainingStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalEnrollments: number;
  completedEnrollments: number;
  averageCompletionRate: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  upcomingSessions: TrainingSession[];
}

// Get all training sessions
export const getTrainingSessions = async (): Promise<TrainingSession[]> => {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching training sessions:', error);
    toast.error('Failed to load training sessions');
    return [];
  }
};

// Get training session by ID
export const getTrainingSessionById = async (id: string): Promise<TrainingSession | null> => {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching training session:', error);
    return null;
  }
};

// Create new training session
export const createTrainingSession = async (session: Partial<TrainingSession>): Promise<TrainingSession> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Get user profile for proper attribution
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const sessionData = {
      title: session.title || '',
      description: session.description,
      training_type: session.training_type || 'Optional',
      training_category: session.training_category || 'Other',
      completion_status: session.completion_status || 'Not Started',
      assigned_to: session.assigned_to || [],
      department: session.department,
      start_date: session.start_date || new Date().toISOString(),
      due_date: session.due_date,
      materials_id: session.materials_id || [],
      required_roles: session.required_roles || [],
      is_recurring: session.is_recurring || false,
      recurring_interval: session.recurring_interval,
      created_by: profile?.full_name || user.email || 'System',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('training_sessions')
      .insert(sessionData) 
      .select()
      .single();

    if (error) throw error;
    toast.success('Training session created successfully');
    return data;
  } catch (error) {
    console.error('Error creating training session:', error);
    toast.error('Failed to create training session');
    throw error;
  }
};

// Update training session
export const updateTrainingSession = async (id: string, updates: Partial<TrainingSession>): Promise<TrainingSession> => {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('training_sessions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Training session updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating training session:', error);
    toast.error('Failed to update training session');
    throw error;
  }
};

// Delete training session
export const deleteTrainingSession = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('training_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Training session deleted successfully');
  } catch (error) {
    console.error('Error deleting training session:', error);
    toast.error('Failed to delete training session');
    throw error;
  }
};

// Get training records for a session
export const getTrainingRecords = async (sessionId?: string): Promise<TrainingRecord[]> => {
  try {
    let query = supabase
      .from('training_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching training records:', error);
    return [];
  }
};

// Enroll employee in training
export const enrollInTraining = async (sessionId: string, employeeId: string, employeeName: string): Promise<TrainingRecord> => {
  try {
    const recordData = {
      session_id: sessionId,
      employee_id: employeeId,
      employee_name: employeeName,
      status: 'Not Started' as const,
      assigned_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };

    const { data, error } = await supabase
      .from('training_records')
      .insert(recordData)
      .select()
      .single();

    if (error) throw error;
    toast.success('Successfully enrolled in training');
    return data;
  } catch (error) {
    console.error('Error enrolling in training:', error);
    toast.error('Failed to enroll in training');
    throw error;
  }
};

// Update training record
export const updateTrainingRecord = async (id: string, updates: Partial<TrainingRecord>): Promise<TrainingRecord> => {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('training_records')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Training record updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating training record:', error);
    toast.error('Failed to update training record');
    throw error;
  }
};

// Get training statistics
export const getTrainingStats = async (): Promise<TrainingStats> => {
  try {
    const [sessionsResult, recordsResult] = await Promise.all([
      supabase.from('training_sessions').select('*'),
      supabase.from('training_records').select('*')
    ]);

    if (sessionsResult.error) throw sessionsResult.error;
    if (recordsResult.error) throw recordsResult.error;

    const sessions = sessionsResult.data || [];
    const records = recordsResult.data || [];

    const stats: TrainingStats = {
      totalSessions: sessions.length,
      activeSessions: sessions.filter(s => s.completion_status === 'In Progress').length,
      completedSessions: sessions.filter(s => s.completion_status === 'Completed').length,
      totalEnrollments: records.length,
      completedEnrollments: records.filter(r => r.status === 'Completed').length,
      averageCompletionRate: 0,
      byCategory: {},
      byType: {},
      upcomingSessions: []
    };

    // Calculate completion rate
    if (stats.totalEnrollments > 0) {
      stats.averageCompletionRate = (stats.completedEnrollments / stats.totalEnrollments) * 100;
    }

    // Count by category and type
    sessions.forEach(session => {
      const category = session.training_category || 'Other';
      const type = session.training_type || 'Other';
      
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    // Get upcoming sessions (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    stats.upcomingSessions = sessions
      .filter(session => {
        const startDate = session.start_date ? new Date(session.start_date) : null;
        return startDate && startDate >= now && startDate <= thirtyDaysFromNow && session.completion_status === 'Not Started';
      })
      .slice(0, 5);

    return stats;
  } catch (error) {
    console.error('Error fetching training stats:', error);
    return {
      totalSessions: 0,
      activeSessions: 0,
      completedSessions: 0,
      totalEnrollments: 0,
      completedEnrollments: 0,
      averageCompletionRate: 0,
      byCategory: {},
      byType: {},
      upcomingSessions: []
    };
  }
};

export default {
  getTrainingSessions,
  getTrainingSessionById,
  createTrainingSession,
  updateTrainingSession,
  deleteTrainingSession,
  getTrainingRecords,
  enrollInTraining,
  updateTrainingRecord,
  getTrainingStats
};