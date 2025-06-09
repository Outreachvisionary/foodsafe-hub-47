
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CreateCAPARequest } from '@/types/capa';
import { Complaint, CreateComplaintRequest } from '@/types/complaint';
import { stringToCAPAStatus, stringToCAPAPriority, stringToCAPASource, stringToEffectivenessRating, capaPriorityToString, capaSourceToString, capaStatusToString, effectivenessRatingToString } from '@/utils/capaAdapters';
import { complaintCategoryToDbString, complaintStatusToDbString, stringToComplaintCategory, stringToComplaintStatus } from '@/utils/complaintAdapters';

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
          title: data.title,
          description: data.description,
          priority: capaPriorityToString(data.priority),
          assigned_to: data.assigned_to,
          created_by: data.created_by,
          source: capaSourceToString(data.source),
          due_date: data.due_date,
          department: data.department,
          status: 'Open'
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...result,
        priority: stringToCAPAPriority(result.priority),
        status: stringToCAPAStatus(result.status),
        source: stringToCAPASource(result.source),
        effectiveness_rating: result.effectiveness_rating ? stringToEffectivenessRating(result.effectiveness_rating) : undefined
      };
    } catch (error) {
      this.handleError(error, 'Create CAPA');
      throw error;
    }
  }

  async updateCAPA(id: string, data: Partial<CAPA>): Promise<CAPA> {
    try {
      const updateData: any = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      // Convert enums to strings for database
      if (data.priority) {
        updateData.priority = capaPriorityToString(data.priority);
      }
      if (data.source) {
        updateData.source = capaSourceToString(data.source);
      }
      if (data.status) {
        updateData.status = capaStatusToString(data.status);
      }
      if (data.effectiveness_rating) {
        updateData.effectiveness_rating = effectivenessRatingToString(data.effectiveness_rating);
      }

      const { data: result, error } = await supabase
        .from('capa_actions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...result,
        priority: stringToCAPAPriority(result.priority),
        status: stringToCAPAStatus(result.status),
        source: stringToCAPASource(result.source),
        effectiveness_rating: result.effectiveness_rating ? stringToEffectivenessRating(result.effectiveness_rating) : undefined
      };
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
      
      return (data || []).map(item => ({
        ...item,
        priority: stringToCAPAPriority(item.priority),
        status: stringToCAPAStatus(item.status),
        source: stringToCAPASource(item.source),
        effectiveness_rating: item.effectiveness_rating ? stringToEffectivenessRating(item.effectiveness_rating) : undefined
      }));
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
          title: data.title,
          description: data.description,
          category: complaintCategoryToDbString(data.category),
          priority: data.priority?.toString(),
          customer_name: data.customer_name,
          customer_contact: data.customer_contact,
          product_involved: data.product_involved,
          lot_number: data.lot_number,
          created_by: data.created_by,
          status: 'New',
          reported_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...result,
        category: stringToComplaintCategory(result.category),
        status: stringToComplaintStatus(result.status)
      };
    } catch (error) {
      this.handleError(error, 'Create Complaint');
      throw error;
    }
  }

  async updateComplaint(id: string, data: Partial<Complaint>): Promise<Complaint> {
    try {
      const updateData: any = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      // Convert enums to strings for database
      if (data.category) {
        updateData.category = complaintCategoryToDbString(data.category);
      }
      if (data.status) {
        updateData.status = complaintStatusToDbString(data.status);
      }

      const { data: result, error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...result,
        category: stringToComplaintCategory(result.category),
        status: stringToComplaintStatus(result.status)
      };
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
      
      return (data || []).map(item => ({
        ...item,
        category: stringToComplaintCategory(item.category),
        status: stringToComplaintStatus(item.status)
      }));
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
