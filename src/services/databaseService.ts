
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CreateCAPARequest } from '@/types/capa';
import { Complaint, CreateComplaintRequest } from '@/types/complaint';

class DatabaseService {
  // Generic error handler
  private handleError(error: any, operation: string) {
    console.error(`Database error in ${operation}:`, error);
    throw new Error(`${operation} failed: ${error.message || 'Unknown error'}`);
  }

  // CAPA operations
  async createCAPA(data: CreateCAPARequest): Promise<CAPA> {
    try {
      const { data: result, error } = await supabase
        .from('capa_actions')
        .insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      this.handleError(error, 'Create CAPA');
      throw error;
    }
  }

  async updateCAPA(id: string, data: Partial<CAPA>): Promise<CAPA> {
    try {
      const { data: result, error } = await supabase
        .from('capa_actions')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      this.handleError(error, 'Update CAPA');
      throw error;
    }
  }

  async getCAPAs(): Promise<CAPA[]> {
    try {
      const { data, error } = await supabase
        .from('capa_actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      this.handleError(error, 'Get CAPAs');
      return [];
    }
  }

  // Complaint operations
  async createComplaint(data: CreateComplaintRequest): Promise<Complaint> {
    try {
      const { data: result, error } = await supabase
        .from('complaints')
        .insert({
          ...data,
          reported_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      this.handleError(error, 'Create Complaint');
      throw error;
    }
  }

  async updateComplaint(id: string, data: Partial<Complaint>): Promise<Complaint> {
    try {
      const { data: result, error } = await supabase
        .from('complaints')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      this.handleError(error, 'Update Complaint');
      throw error;
    }
  }

  async getComplaints(): Promise<Complaint[]> {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      this.handleError(error, 'Get Complaints');
      return [];
    }
  }

  // Authentication check
  async checkAuth(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return !!user;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
