
import { supabase } from '@/integrations/supabase/client';

export interface Certification {
  id?: string;
  name: string;
  description?: string;
  issuing_body: string;
  validity_period_months: number;
  required_score?: number;
  category: string;
  is_required: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeCertification {
  id?: string;
  employee_id: string;
  employee_name: string;
  certification_id?: string;
  certification_name: string;
  issued_date: string;
  expiry_date: string;
  status: 'Active' | 'Expired' | 'Revoked' | 'Pending';
  certificate_number?: string;
  issuing_body: string;
  department?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CertificationStats {
  total_certifications: number;
  active_certifications: number;
  expiring_soon: number;
  expired_certifications: number;
}

export const certificationService = {
  // Certification CRUD operations
  async getCertifications(): Promise<Certification[]> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async createCertification(certification: Omit<Certification, 'id'>): Promise<Certification> {
    const { data, error } = await supabase
      .from('certifications')
      .insert(certification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
    const { data, error } = await supabase
      .from('certifications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCertification(id: string): Promise<void> {
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Employee Certification CRUD operations
  async getEmployeeCertifications(): Promise<EmployeeCertification[]> {
    const { data, error } = await supabase
      .from('employee_certifications')
      .select('*')
      .order('expiry_date');

    if (error) throw error;
    
    // Cast the status to the correct type
    return (data || []).map(cert => ({
      ...cert,
      status: cert.status as 'Active' | 'Expired' | 'Revoked' | 'Pending'
    }));
  },

  async createEmployeeCertification(certification: Omit<EmployeeCertification, 'id'>): Promise<EmployeeCertification> {
    const { data, error } = await supabase
      .from('employee_certifications')
      .insert(certification)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'Active' | 'Expired' | 'Revoked' | 'Pending'
    };
  },

  async updateEmployeeCertification(id: string, updates: Partial<EmployeeCertification>): Promise<EmployeeCertification> {
    const { data, error } = await supabase
      .from('employee_certifications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'Active' | 'Expired' | 'Revoked' | 'Pending'
    };
  },

  async deleteEmployeeCertification(id: string): Promise<void> {
    const { error } = await supabase
      .from('employee_certifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Statistics and reporting
  async getCertificationStatistics(): Promise<CertificationStats> {
    const { data, error } = await supabase.rpc('get_certification_statistics');

    if (error) throw error;
    return data[0] || {
      total_certifications: 0,
      active_certifications: 0,
      expiring_soon: 0,
      expired_certifications: 0
    };
  },

  async getEmployeeCertificationStatus(employeeId: string) {
    const { data, error } = await supabase.rpc('get_employee_certification_status', {
      emp_id: employeeId
    });

    if (error) throw error;
    return data || [];
  },

  // Export functionality
  async exportCertifications(): Promise<Blob> {
    const certifications = await this.getCertifications();
    const employeeCertifications = await this.getEmployeeCertifications();
    
    const exportData = {
      certifications,
      employee_certifications: employeeCertifications,
      exported_at: new Date().toISOString()
    };

    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
  },

  // Import functionality
  async importCertifications(file: File): Promise<{ success: number; errors: string[] }> {
    const text = await file.text();
    const data = JSON.parse(text);
    
    const results = { success: 0, errors: [] as string[] };

    if (data.certifications) {
      for (const cert of data.certifications) {
        try {
          await this.createCertification(cert);
          results.success++;
        } catch (error) {
          results.errors.push(`Failed to import certification ${cert.name}: ${error}`);
        }
      }
    }

    return results;
  }
};
