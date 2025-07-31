import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  TrainingMaterial, 
  TrainingCompetency, 
  TrainingCompliance, 
  TrainingNotification, 
  TrainingAnalytics 
} from './trainingService';

// Re-export types for external use
export type { 
  TrainingMaterial, 
  TrainingCompetency, 
  TrainingCompliance, 
  TrainingNotification, 
  TrainingAnalytics 
};

class EnhancedTrainingService {
  // ============ Training Materials Management ============
  
  async getTrainingMaterials(sessionId?: string, courseId?: string): Promise<TrainingMaterial[]> {
    try {
      let query = supabase.from('training_materials').select('*').eq('is_active', true);
      
      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }
      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query.order('upload_date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching training materials:', error);
      toast.error('Failed to load training materials');
      return [];
    }
  }

  async uploadTrainingMaterial(
    file: File, 
    materialData: Omit<TrainingMaterial, 'id' | 'file_path' | 'file_size' | 'created_at' | 'updated_at'>
  ): Promise<TrainingMaterial> {
    try {
      // Upload file to storage
      const filePath = await this.uploadFile(file);
      
      const material = {
        ...materialData,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type
      };

      const { data, error } = await supabase
        .from('training_materials')
        .insert(material)
        .select()
        .single();

      if (error) throw error;
      toast.success('Training material uploaded successfully');
      return data;
    } catch (error) {
      console.error('Error uploading training material:', error);
      toast.error('Failed to upload training material');
      throw error;
    }
  }

  async deleteTrainingMaterial(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('training_materials')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      toast.success('Training material deleted');
    } catch (error) {
      console.error('Error deleting training material:', error);
      toast.error('Failed to delete training material');
      throw error;
    }
  }

  // ============ GFSI Competencies Management ============
  
  async getTrainingCompetencies(): Promise<TrainingCompetency[]> {
    try {
      const { data, error } = await supabase
        .from('training_competencies')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching training competencies:', error);
      return [];
    }
  }

  async createTrainingCompetency(competency: Omit<TrainingCompetency, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingCompetency> {
    try {
      const { data, error } = await supabase
        .from('training_competencies')
        .insert(competency)
        .select()
        .single();

      if (error) throw error;
      toast.success('Training competency created');
      return data;
    } catch (error) {
      console.error('Error creating training competency:', error);
      toast.error('Failed to create training competency');
      throw error;
    }
  }

  async updateTrainingCompetency(id: string, updates: Partial<TrainingCompetency>): Promise<TrainingCompetency> {
    try {
      const { data, error } = await supabase
        .from('training_competencies')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Training competency updated');
      return data;
    } catch (error) {
      console.error('Error updating training competency:', error);
      toast.error('Failed to update training competency');
      throw error;
    }
  }

  // ============ Training Compliance Tracking ============
  
  async getTrainingCompliance(employeeId?: string): Promise<TrainingCompliance[]> {
    try {
      let query = supabase.from('training_compliance').select(`
        *,
        training_competencies!inner(name, category, gfsi_requirement, validity_period_months)
      `);
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query.order('next_required_date', { ascending: true });
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'compliant' | 'overdue' | 'expired'
      }));
    } catch (error) {
      console.error('Error fetching training compliance:', error);
      return [];
    }
  }

  async updateTrainingCompliance(id: string, updates: Partial<TrainingCompliance>): Promise<TrainingCompliance> {
    try {
      const { data, error } = await supabase
        .from('training_compliance')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Training compliance updated');
      return {
        ...data,
        status: data.status as 'pending' | 'compliant' | 'overdue' | 'expired'
      };
    } catch (error) {
      console.error('Error updating training compliance:', error);
      toast.error('Failed to update training compliance');
      throw error;
    }
  }

  async createComplianceRecord(compliance: Omit<TrainingCompliance, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingCompliance> {
    try {
      const { data, error } = await supabase
        .from('training_compliance')
        .insert(compliance)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        status: data.status as 'pending' | 'compliant' | 'overdue' | 'expired'
      };
    } catch (error) {
      console.error('Error creating compliance record:', error);
      throw error;
    }
  }

  // ============ Training Notifications ============
  
  async getTrainingNotifications(userId?: string): Promise<TrainingNotification[]> {
    try {
      let query = supabase.from('training_notifications').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        notification_type: item.notification_type as 'reminder' | 'overdue' | 'completion' | 'assignment'
      }));
    } catch (error) {
      console.error('Error fetching training notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('training_notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async createNotification(notification: Omit<TrainingNotification, 'id' | 'created_at'>): Promise<TrainingNotification> {
    try {
      const { data, error } = await supabase
        .from('training_notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        notification_type: data.notification_type as 'reminder' | 'overdue' | 'completion' | 'assignment'
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // ============ Training Analytics ============
  
  async trackTrainingEvent(analytics: Omit<TrainingAnalytics, 'id' | 'timestamp'>): Promise<TrainingAnalytics> {
    try {
      const { data, error } = await supabase
        .from('training_analytics')
        .insert(analytics)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        event_type: data.event_type as 'start' | 'progress' | 'complete' | 'fail' | 'pause' | 'resume',
        event_data: data.event_data as Record<string, any> || {}
      };
    } catch (error) {
      console.error('Error tracking training event:', error);
      throw error;
    }
  }

  async getTrainingAnalytics(sessionId?: string, employeeId?: string): Promise<TrainingAnalytics[]> {
    try {
      let query = supabase.from('training_analytics').select('*');
      
      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query.order('timestamp', { ascending: false });
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        event_type: item.event_type as 'start' | 'progress' | 'complete' | 'fail' | 'pause' | 'resume',
        event_data: item.event_data as Record<string, any> || {}
      }));
    } catch (error) {
      console.error('Error fetching training analytics:', error);
      return [];
    }
  }

  // ============ GFSI Compliance Reporting ============
  
  async getGFSICompliance(): Promise<{ compliant: number; total: number; percentage: number }> {
    try {
      const { data: competencies, error } = await supabase
        .from('training_competencies')
        .select('*')
        .eq('is_mandatory', true);

      if (error) throw error;

      const { data: compliance, error: complianceError } = await supabase
        .from('training_compliance')
        .select('*')
        .eq('status', 'compliant');

      if (complianceError) throw complianceError;

      const total = competencies?.length || 0;
      const compliant = compliance?.length || 0;
      const percentage = total > 0 ? Math.round((compliant / total) * 100) : 0;

      return { compliant, total, percentage };
    } catch (error) {
      console.error('Error fetching GFSI compliance:', error);
      return { compliant: 0, total: 0, percentage: 0 };
    }
  }

  async getExpiringCertifications(days: number = 30): Promise<TrainingCompliance[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const { data, error } = await supabase
        .from('training_compliance')
        .select(`
          *,
          training_competencies!inner(name, category, gfsi_requirement)
        `)
        .lte('next_required_date', futureDate.toISOString())
        .eq('status', 'compliant')
        .order('next_required_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'compliant' | 'overdue' | 'expired'
      }));
    } catch (error) {
      console.error('Error fetching expiring certifications:', error);
      return [];
    }
  }

  // ============ File Upload Helper ============
  
  async uploadFile(file: File, bucket: string = 'training-materials'): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${new Date().getFullYear()}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // ============ Training Register Generation ============
  
  async generateTrainingRegister(startDate?: string, endDate?: string) {
    try {
      let query = supabase
        .from('training_records')
        .select(`
          *,
          training_sessions!inner(title, training_category, instructor)
        `)
        .order('assigned_date', { ascending: false });

      if (startDate) {
        query = query.gte('assigned_date', startDate);
      }
      if (endDate) {
        query = query.lte('assigned_date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error generating training register:', error);
      return [];
    }
  }

  // ============ Auto-Assignment Based on Role Changes ============
  
  async autoAssignTrainingBasedOnRole(employeeId: string, role: string): Promise<void> {
    try {
      // Get mandatory competencies for the role
      const { data: competencies, error } = await supabase
        .from('training_competencies')
        .select('*')
        .contains('required_for_roles', [role])
        .eq('is_mandatory', true);

      if (error) throw error;

      // Create compliance records for each mandatory competency
      for (const competency of competencies || []) {
        const nextRequiredDate = new Date();
        nextRequiredDate.setMonth(nextRequiredDate.getMonth() + competency.validity_period_months);

        await this.createComplianceRecord({
          employee_id: employeeId,
          competency_id: competency.id,
          status: 'pending',
          next_required_date: nextRequiredDate.toISOString(),
          assessed_by: 'system'
        });

        // Create notification
        await this.createNotification({
          user_id: employeeId,
          session_id: competency.id, // Using competency ID as session reference
          notification_type: 'assignment',
          message: `New mandatory training assigned: ${competency.name}`,
          is_read: false,
          scheduled_for: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error auto-assigning training:', error);
    }
  }
}

export const enhancedTrainingService = new EnhancedTrainingService();
export default enhancedTrainingService;