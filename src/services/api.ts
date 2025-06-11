
import { supabase } from '@/integrations/supabase/client';

// Base API service class
class BaseApiService {
  protected async handleError(error: any, operation: string) {
    console.error(`API Error in ${operation}:`, error);
    throw new Error(`${operation} failed: ${error.message || 'Unknown error'}`);
  }

  protected async checkAuth(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.id;
  }
}

// Document service
export class DocumentService extends BaseApiService {
  async getDocuments() {
    try {
      await this.checkAuth();
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.handleError(error, 'Get Documents');
    }
  }

  async createDocument(document: any) {
    try {
      const userId = await this.checkAuth();
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...document,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error, 'Create Document');
    }
  }

  async updateDocument(id: string, updates: any) {
    try {
      await this.checkAuth();
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error, 'Update Document');
    }
  }

  async deleteDocument(id: string) {
    try {
      await this.checkAuth();
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error, 'Delete Document');
    }
  }
}

// CAPA service
export class CAPAService extends BaseApiService {
  async getCAPAs() {
    try {
      await this.checkAuth();
      const { data, error } = await supabase
        .from('capa_actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.handleError(error, 'Get CAPAs');
    }
  }

  async createCAPA(capa: any) {
    try {
      const userId = await this.checkAuth();
      const { data, error } = await supabase
        .from('capa_actions')
        .insert({
          ...capa,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error, 'Create CAPA');
    }
  }

  async updateCAPA(id: string, updates: any) {
    try {
      await this.checkAuth();
      const { data, error } = await supabase
        .from('capa_actions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error, 'Update CAPA');
    }
  }
}

// Non-Conformance service
export class NonConformanceService extends BaseApiService {
  async getNonConformances() {
    try {
      await this.checkAuth();
      const { data, error } = await supabase
        .from('non_conformances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.handleError(error, 'Get Non-Conformances');
    }
  }

  async createNonConformance(nc: any) {
    try {
      const userId = await this.checkAuth();
      const { data, error } = await supabase
        .from('non_conformances')
        .insert({
          ...nc,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error, 'Create Non-Conformance');
    }
  }
}

// Training service
export class TrainingService extends BaseApiService {
  async getTrainingRecords() {
    try {
      await this.checkAuth();
      const { data, error } = await supabase
        .from('training_records')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.handleError(error, 'Get Training Records');
    }
  }

  async createTrainingRecord(record: any) {
    try {
      await this.checkAuth();
      const { data, error } = await supabase
        .from('training_records')
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error, 'Create Training Record');
    }
  }
}

// Audit service
export class AuditService extends BaseApiService {
  async getAudits() {
    try {
      await this.checkAuth();
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.handleError(error, 'Get Audits');
    }
  }

  async createAudit(audit: any) {
    try {
      const userId = await this.checkAuth();
      const { data, error } = await supabase
        .from('audits')
        .insert({
          ...audit,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error, 'Create Audit');
    }
  }
}

// Export service instances
export const documentService = new DocumentService();
export const capaService = new CAPAService();
export const nonConformanceService = new NonConformanceService();
export const trainingService = new TrainingService();
export const auditService = new AuditService();
