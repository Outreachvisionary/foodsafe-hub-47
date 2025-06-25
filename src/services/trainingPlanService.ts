
import { supabase } from '@/integrations/supabase/client';

export interface TrainingPlan {
  id?: string;
  name: string;
  description?: string;
  target_roles: string[];
  target_departments: string[];
  courses_included: string[];
  duration_days?: number;
  is_required: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Draft' | 'Active' | 'Inactive' | 'Archived';
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingSession {
  id?: string;
  title: string;
  description?: string;
  training_type: 'Internal' | 'External' | 'Online' | 'Certification';
  training_category: 'Safety' | 'Quality' | 'Compliance' | 'Technical' | 'General';
  assigned_to: string[];
  start_date: string;
  due_date: string;
  completion_status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
  required_roles: string[];
  is_recurring: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export const trainingPlanService = {
  // Training Plan CRUD operations
  async getTrainingPlans(): Promise<TrainingPlan[]> {
    const { data, error } = await supabase
      .from('training_plans')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async createTrainingPlan(plan: Omit<TrainingPlan, 'id'>): Promise<TrainingPlan> {
    const { data, error } = await supabase
      .from('training_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrainingPlan(id: string, updates: Partial<TrainingPlan>): Promise<TrainingPlan> {
    const { data, error } = await supabase
      .from('training_plans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTrainingPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('training_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Training Session CRUD operations
  async getTrainingSessions(): Promise<TrainingSession[]> {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .order('start_date');

    if (error) throw error;
    return data || [];
  },

  async createTrainingSession(session: Omit<TrainingSession, 'id'>): Promise<TrainingSession> {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrainingSession(id: string, updates: Partial<TrainingSession>): Promise<TrainingSession> {
    const { data, error } = await supabase
      .from('training_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTrainingSession(id: string): Promise<void> {
    const { error } = await supabase
      .from('training_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Cross-module integrations
  async linkTrainingToCertification(trainingId: string, certificationId: string): Promise<void> {
    const { error } = await supabase
      .from('module_relationships')
      .insert({
        source_id: trainingId,
        target_id: certificationId,
        source_type: 'training',
        target_type: 'certification',
        relationship_type: 'certification_training',
        created_by: 'system'
      });

    if (error) throw error;
  },

  async linkTrainingToCAPA(trainingId: string, capaId: string): Promise<void> {
    const { error } = await supabase
      .from('module_relationships')
      .insert({
        source_id: capaId,
        target_id: trainingId,
        source_type: 'capa',
        target_type: 'training',
        relationship_type: 'capa_training',
        created_by: 'system'
      });

    if (error) throw error;
  }
};
