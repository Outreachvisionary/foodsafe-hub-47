
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Audit {
  id: string;
  title: string;
  standard: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Due Soon';
  scheduledDate: string;
  completedDate: string | null;
  assignedTo: string;
  findings: number;
  recurrence?: string;
  lastCompleted?: string;
  description?: string;
  audit_type?: string;
  location?: string;
  department?: string;
}

export interface AuditFinding {
  id: string;
  audit_id: string;
  description: string;
  severity: 'Minor' | 'Major' | 'Critical';
  status: 'Open' | 'Closed';
  assigned_to?: string;
  evidence?: string;
  created_at: string;
}

// Fetch all audits
export const fetchAudits = async () => {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    
    // Transform database data to match the Audit interface
    return data.map(audit => ({
      id: audit.id,
      title: audit.title,
      standard: audit.related_standard || '',
      status: audit.status,
      scheduledDate: audit.start_date,
      completedDate: audit.completion_date,
      assignedTo: audit.assigned_to,
      findings: audit.findings_count || 0,
      description: audit.description,
      audit_type: audit.audit_type,
      location: audit.location,
      department: audit.department,
    })) as Audit[];
  } catch (error) {
    console.error('Error fetching audits:', error);
    toast.error('Failed to load audits');
    return [];
  }
};

// Fetch a single audit by ID
export const fetchAuditById = async (auditId: string) => {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      standard: data.related_standard || '',
      status: data.status,
      scheduledDate: data.start_date,
      completedDate: data.completion_date,
      assignedTo: data.assigned_to,
      findings: data.findings_count || 0,
      description: data.description,
      audit_type: data.audit_type,
      location: data.location,
      department: data.department,
    } as Audit;
  } catch (error) {
    console.error('Error fetching audit:', error);
    toast.error('Failed to load audit details');
    return null;
  }
};

// Create a new audit
export const createAudit = async (auditData: Omit<Audit, 'id'>) => {
  try {
    // Transform the data to match the database schema
    const dbAudit = {
      title: auditData.title,
      related_standard: auditData.standard,
      status: auditData.status,
      start_date: auditData.scheduledDate,
      completion_date: auditData.completedDate,
      assigned_to: auditData.assignedTo,
      findings_count: auditData.findings,
      description: auditData.description,
      audit_type: auditData.audit_type,
      location: auditData.location,
      department: auditData.department,
      due_date: new Date(auditData.scheduledDate), // Set due date same as scheduled date by default
      created_at: new Date(),
      created_by: 'Current User', // This should be replaced with actual user info
    };
    
    const { data, error } = await supabase
      .from('audits')
      .insert(dbAudit)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Audit created successfully');
    return data;
  } catch (error) {
    console.error('Error creating audit:', error);
    toast.error('Failed to create audit');
    return null;
  }
};

// Update an existing audit
export const updateAudit = async (auditId: string, auditData: Partial<Audit>) => {
  try {
    // Transform the data to match the database schema
    const dbAudit: any = {};
    
    if (auditData.title) dbAudit.title = auditData.title;
    if (auditData.standard) dbAudit.related_standard = auditData.standard;
    if (auditData.status) dbAudit.status = auditData.status;
    if (auditData.scheduledDate) dbAudit.start_date = auditData.scheduledDate;
    if (auditData.completedDate) dbAudit.completion_date = auditData.completedDate;
    if (auditData.assignedTo) dbAudit.assigned_to = auditData.assignedTo;
    if (auditData.findings !== undefined) dbAudit.findings_count = auditData.findings;
    if (auditData.description) dbAudit.description = auditData.description;
    if (auditData.audit_type) dbAudit.audit_type = auditData.audit_type;
    if (auditData.location) dbAudit.location = auditData.location;
    if (auditData.department) dbAudit.department = auditData.department;
    
    dbAudit.updated_at = new Date();
    
    const { data, error } = await supabase
      .from('audits')
      .update(dbAudit)
      .eq('id', auditId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Audit updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating audit:', error);
    toast.error('Failed to update audit');
    return null;
  }
};

// Delete an audit
export const deleteAudit = async (auditId: string) => {
  try {
    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', auditId);
    
    if (error) throw error;
    
    toast.success('Audit deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting audit:', error);
    toast.error('Failed to delete audit');
    return false;
  }
};

// Fetch findings for a specific audit
export const fetchAuditFindings = async (auditId: string) => {
  try {
    const { data, error } = await supabase
      .from('audit_findings')
      .select('*')
      .eq('audit_id', auditId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as AuditFinding[];
  } catch (error) {
    console.error('Error fetching audit findings:', error);
    toast.error('Failed to load audit findings');
    return [];
  }
};

// Create a new finding
export const createFinding = async (finding: Omit<AuditFinding, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('audit_findings')
      .insert({
        ...finding,
        created_at: new Date()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update the findings count for the audit
    const { error: updateError } = await supabase
      .from('audits')
      .update({ 
        findings_count: supabase.rpc('increment_counter', { 
          row_id: finding.audit_id, 
          table_name: 'audits', 
          column_name: 'findings_count' 
        }) 
      })
      .eq('id', finding.audit_id);
    
    if (updateError) console.error('Error updating findings count:', updateError);
    
    toast.success('Finding added successfully');
    return data;
  } catch (error) {
    console.error('Error creating finding:', error);
    toast.error('Failed to add finding');
    return null;
  }
};

// Update a finding
export const updateFinding = async (findingId: string, findingData: Partial<AuditFinding>) => {
  try {
    const { data, error } = await supabase
      .from('audit_findings')
      .update(findingData)
      .eq('id', findingId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Finding updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating finding:', error);
    toast.error('Failed to update finding');
    return null;
  }
};

// Delete a finding
export const deleteFinding = async (findingId: string, auditId: string) => {
  try {
    const { error } = await supabase
      .from('audit_findings')
      .delete()
      .eq('id', findingId);
    
    if (error) throw error;
    
    // Update the findings count for the audit
    const { error: updateError } = await supabase
      .from('audits')
      .update({ 
        findings_count: supabase.rpc('decrement_counter', { 
          row_id: auditId, 
          table_name: 'audits', 
          column_name: 'findings_count',
          min_value: 0
        }) 
      })
      .eq('id', auditId);
    
    if (updateError) console.error('Error updating findings count:', updateError);
    
    toast.success('Finding deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting finding:', error);
    toast.error('Failed to delete finding');
    return false;
  }
};

// Export audit report data
export const exportAuditReport = async (auditId: string, format: 'pdf' | 'excel' = 'pdf') => {
  try {
    // Get audit details
    const audit = await fetchAuditById(auditId);
    if (!audit) throw new Error('Audit not found');
    
    // Get audit findings
    const findings = await fetchAuditFindings(auditId);
    
    // Prepare the export data
    const exportData = {
      audit,
      findings,
      exported_at: new Date().toISOString(),
      exported_by: 'Current User', // This should be replaced with actual user info
    };
    
    // In a real implementation, you would generate the file here
    // For now, we'll just return the data structure
    console.log('Exporting audit report:', exportData);
    
    // Record the export in the database
    const { error } = await supabase
      .from('audit_reports')
      .insert({
        audit_id: auditId,
        format: format,
        generated_by: 'Current User', // This should be replaced with actual user info
        generated_at: new Date()
      });
    
    if (error) throw error;
    
    toast.success(`Audit report exported as ${format.toUpperCase()}`);
    return exportData;
  } catch (error) {
    console.error('Error exporting audit report:', error);
    toast.error('Failed to export audit report');
    return null;
  }
};
