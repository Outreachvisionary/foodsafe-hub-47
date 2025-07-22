import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Audit {
  id: string;
  title: string;
  description?: string;
  status: string;
  start_date: string;
  due_date: string;
  completion_date?: string;
  audit_type: string;
  assigned_to: string;
  created_by: string;
  findings_count: number;
  department?: string;
  location?: string;
  related_standard?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditFinding {
  id: string;
  audit_id: string;
  description: string;
  severity: string;
  status: string;
  due_date?: string;
  assigned_to?: string;
  evidence?: string;
  capa_id?: string;
  created_at: string;
  updated_at: string;
}

// Fetch all audits
export const fetchAudits = async (): Promise<Audit[]> => {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching audits:', error);
    toast.error('Failed to load audits');
    return [];
  }
};

// Create new audit
export const createAudit = async (audit: Partial<Audit>): Promise<Audit> => {
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

    const auditData = {
      title: audit.title || '',
      description: audit.description,
      status: audit.status || 'Scheduled',
      start_date: audit.start_date || new Date().toISOString(),
      due_date: audit.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      audit_type: audit.audit_type || 'Internal',
      assigned_to: audit.assigned_to || profile?.full_name || user.email || 'System',
      department: audit.department,
      location: audit.location,
      related_standard: audit.related_standard,
      findings_count: 0,
      created_by: profile?.full_name || user.email || 'System',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('audits')
      .insert(auditData)
      .select()
      .single();

    if (error) throw error;
    toast.success('Audit created successfully');
    return data;
  } catch (error) {
    console.error('Error creating audit:', error);
    toast.error('Failed to create audit');
    throw error;
  }
};

// Fetch audit by ID
export const fetchAuditById = async (id: string): Promise<Audit | null> => {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching audit:', error);
    return null;
  }
};

// Update audit
export const updateAudit = async (id: string, updates: Partial<Audit>): Promise<Audit> => {
  try {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values and ensure proper types
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from('audits')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Audit updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating audit:', error);
    toast.error('Failed to update audit');
    throw error;
  }
};

// Delete audit
export const deleteAudit = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Audit deleted successfully');
  } catch (error) {
    console.error('Error deleting audit:', error);
    toast.error('Failed to delete audit');
    throw error;
  }
};

// Fetch audit findings
export const fetchAuditFindings = async (auditId: string): Promise<AuditFinding[]> => {
  try {
    const { data, error } = await supabase
      .from('audit_findings')
      .select('*')
      .eq('audit_id', auditId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching audit findings:', error);
    return [];
  }
};

// Create finding
export const createFinding = async (finding: Partial<AuditFinding>): Promise<AuditFinding> => {
  try {
    const findingData = {
      audit_id: finding.audit_id || '',
      description: finding.description || '',
      severity: (finding.severity as any) || 'Minor',
      status: (finding.status as any) || 'Open',
      due_date: finding.due_date,
      assigned_to: finding.assigned_to,
      evidence: finding.evidence,
      capa_id: finding.capa_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('audit_findings')
      .insert(findingData)
      .select()
      .single();

    if (error) throw error;
    toast.success('Finding created successfully');
    return data;
  } catch (error) {
    console.error('Error creating finding:', error);
    toast.error('Failed to create finding');
    throw error;
  }
};

// Update finding
export const updateFinding = async (id: string, updates: Partial<AuditFinding>): Promise<AuditFinding> => {
  try {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from('audit_findings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Finding updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating finding:', error);
    toast.error('Failed to update finding');
    throw error;
  }
};

// Delete finding
export const deleteFinding = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('audit_findings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Finding deleted successfully');
  } catch (error) {
    console.error('Error deleting finding:', error);
    toast.error('Failed to delete finding');
    throw error;
  }
};

// Export audit report
export const exportAuditReport = async (auditId: string, format: string): Promise<{ url: string }> => {
  try {
    // For now, return a mock URL - in production this would generate an actual report
    return { url: `#audit-report-${auditId}.${format}` };
  } catch (error) {
    console.error('Error exporting audit report:', error);
    throw error;
  }
};

// Get audit statistics
export const getAuditStats = async () => {
  try {
    const { data: audits, error } = await supabase
      .from('audits')
      .select('*');

    if (error) throw error;

    const stats = {
      total: audits.length,
      byStatus: {} as Record<string, number>,
      overdue: 0,
      completed: 0,
      inProgress: 0,
    };

    audits.forEach(audit => {
      const status = audit.status || 'Unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      
      if (status === 'Completed') {
        stats.completed++;
      } else if (status === 'In Progress') {
        stats.inProgress++;
      }
      
      // Check if overdue
      if (new Date(audit.due_date) < new Date() && status !== 'Completed') {
        stats.overdue++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching audit stats:', error);
    return {
      total: 0,
      byStatus: {},
      overdue: 0,
      completed: 0,
      inProgress: 0,
    };
  }
};

export default {
  fetchAudits,
  createAudit,
  fetchAuditById,
  updateAudit,
  deleteAudit,
  fetchAuditFindings,
  createFinding,
  updateFinding,
  deleteFinding,
  exportAuditReport,
  getAuditStats
};