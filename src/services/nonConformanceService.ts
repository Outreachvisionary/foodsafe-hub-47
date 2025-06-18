import { NonConformance, NCActivity, NCAttachment, NCStats } from '@/types/non-conformance';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mapping functions for enum conversion
const mapNCStatusToDatabase = (status: string) => {
  const statusMap: Record<string, string> = {
    'On Hold': 'On Hold',
    'Under Review': 'Under Review',
    'Resolved': 'Resolved',
    'Closed': 'Closed',
    'Released': 'Released',
    'Disposed': 'Disposed'
  };
  return statusMap[status] || status;
};

const mapItemCategoryToDatabase = (category: string) => {
  const categoryMap: Record<string, string> = {
    'Processing Equipment': 'Processing Equipment',
    'Product Storage Tanks': 'Product Storage Tanks',
    'Finished Products': 'Finished Products',
    'Raw Products': 'Raw Products',
    'Packaging Materials': 'Packaging Materials',
    'Other': 'Other'
  };
  return categoryMap[category] || 'Other';
};

const mapReasonCategoryToDatabase = (category: string) => {
  const categoryMap: Record<string, string> = {
    'Contamination': 'Contamination',
    'Quality Issues': 'Quality Issues',
    'Regulatory Non-Compliance': 'Regulatory Non-Compliance',
    'Equipment Malfunction': 'Equipment Malfunction',
    'Documentation Error': 'Documentation Error',
    'Process Deviation': 'Process Deviation',
    'Other': 'Other'
  };
  return categoryMap[category] || 'Other';
};

// Get all non-conformances with RLS enforcement
export const getAllNonConformances = async (): Promise<{ data: NonConformance[] }> => {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    console.error('Error fetching non-conformances:', error);
    toast.error('Failed to load non-conformances');
    throw error;
  }
};

// Get non-conformance by ID with RLS enforcement
export const getNonConformanceById = async (id: string): Promise<NonConformance> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Non-conformance with ID ${id} not found`);
    
    return data as NonConformance;
  } catch (error) {
    console.error('Error fetching non-conformance:', error);
    throw error;
  }
};

// Create non-conformance with proper user context
export const createNonConformance = async (data: Partial<NonConformance>): Promise<NonConformance> => {
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

    const insertData = {
      title: data.title || '',
      description: data.description || '',
      item_name: data.item_name || '',
      item_category: mapItemCategoryToDatabase(data.item_category || 'Other') as any,
      reason_category: mapReasonCategoryToDatabase(data.reason_category || 'Other') as any,
      status: mapNCStatusToDatabase(data.status || 'On Hold') as any,
      created_by: profile?.full_name || user.email || 'System',
      assigned_to: data.assigned_to,
      department: data.department,
      location: data.location,
      priority: data.priority,
      risk_level: data.risk_level,
      quantity: data.quantity || 0,
      quantity_on_hold: data.quantity_on_hold || 0,
      tags: data.tags || [],
      units: data.units,
      item_id: data.item_id,
      reason_details: data.reason_details,
      reviewer: data.reviewer,
      resolution_details: data.resolution_details,
      capa_id: data.capa_id,
      reported_date: data.reported_date || new Date().toISOString(),
    };

    const { data: newNC, error } = await supabase
      .from('non_conformances')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Non-conformance created successfully');
    return newNC as NonConformance;
  } catch (error) {
    console.error('Error creating non-conformance:', error);
    toast.error('Failed to create non-conformance');
    throw error;
  }
};

// Update non-conformance
export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance> => {
  try {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Convert enum values to database format
    if (updates.status) {
      updateData.status = mapNCStatusToDatabase(updates.status as string);
    }
    if (updates.item_category) {
      updateData.item_category = mapItemCategoryToDatabase(updates.item_category as string);
    }
    if (updates.reason_category) {
      updateData.reason_category = mapReasonCategoryToDatabase(updates.reason_category as string);
    }

    const { data: updatedNC, error } = await supabase
      .from('non_conformances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedNC as NonConformance;
  } catch (error) {
    console.error('Error updating non-conformance:', error);
    throw error;
  }
};

// Delete non-conformance
export const deleteNonConformance = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('non_conformances')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting non-conformance:', error);
    throw error;
  }
};

// Generate CAPA from non-conformance
export const generateCAPAFromNC = async (ncId: string, isAutomatic: boolean = false): Promise<any> => {
  try {
    // Get the non-conformance details
    const nc = await getNonConformanceById(ncId);
    
    // Prepare CAPA data based on NC
    const capaData = {
      title: `CAPA for NC: ${nc.title}`,
      description: `Corrective and Preventive Action for Non-Conformance: ${nc.description || nc.title}`,
      source: 'Non_Conformance',
      source_id: ncId,
      priority: nc.risk_level === 'Critical' ? 'High' : nc.risk_level === 'High' ? 'Medium' : 'Low',
      assigned_to: nc.assigned_to || 'System',
      created_by: nc.created_by || 'System',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      department: nc.department,
      root_cause: isAutomatic ? `Automatic analysis based on NC: ${nc.reason_details || nc.reason_category}` : '',
      corrective_action: isAutomatic ? `Address immediate cause of ${nc.item_category} issue in ${nc.location || 'facility'}` : '',
      preventive_action: isAutomatic ? `Implement preventive measures to avoid recurrence of ${nc.reason_category} issues` : '',
      effectiveness_criteria: isAutomatic ? 'No recurrence of similar non-conformances within 90 days' : ''
    };

    // Create CAPA in database
    const { data: capa, error } = await supabase
      .from('capa_actions')
      .insert(capaData)
      .select()
      .single();

    if (error) throw error;

    // Update the non-conformance with the CAPA ID
    await updateNonConformance(ncId, { capa_id: capa.id });

    // Create module relationship
    await supabase
      .from('module_relationships')
      .insert({
        source_id: ncId,
        target_id: capa.id,
        source_type: 'non_conformance',
        target_type: 'capa',
        relationship_type: 'generated_from',
        created_by: nc.created_by || 'System'
      });

    return capa;
  } catch (error) {
    console.error('Error generating CAPA from NC:', error);
    throw error;
  }
};

// Link existing CAPA to non-conformance
export const linkCAPAToNC = async (ncId: string, capaId: string): Promise<void> => {
  try {
    // Update the non-conformance with the CAPA ID
    await updateNonConformance(ncId, { capa_id: capaId });

    // Create module relationship
    const nc = await getNonConformanceById(ncId);
    await supabase
      .from('module_relationships')
      .insert({
        source_id: ncId,
        target_id: capaId,
        source_type: 'non_conformance',
        target_type: 'capa',
        relationship_type: 'linked_to',
        created_by: nc.created_by || 'System'
      });
  } catch (error) {
    console.error('Error linking CAPA to NC:', error);
    throw error;
  }
};

// Get linked CAPAs for a non-conformance
export const getLinkedCAPAs = async (ncId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('module_relationships')
      .select(`
        target_id,
        relationship_type,
        created_at,
        capa_actions!inner(*)
      `)
      .eq('source_id', ncId)
      .eq('source_type', 'non_conformance')
      .eq('target_type', 'capa');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching linked CAPAs:', error);
    return [];
  }
};

// Fetch NC activities with RLS enforcement
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('nc_activities')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('performed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching NC activities:', error);
    throw error;
  }
};

// Fetch NC attachments
export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching NC attachments:', error);
    throw error;
  }
};

// Upload NC attachment
export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description?: string
): Promise<NCAttachment> => {
  try {
    const { data: newAttachment, error } = await supabase
      .from('nc_attachments')
      .insert([{
        non_conformance_id: nonConformanceId,
        file_name: file.name,
        file_path: `/attachments/${nonConformanceId}/${file.name}`,
        file_type: file.type,
        file_size: file.size,
        description: description || '',
        uploaded_by: 'Current User'
      }])
      .select()
      .single();

    if (error) throw error;
    return newAttachment as NCAttachment;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

// Fetch NC stats
export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    const { data: nonConformances, error } = await supabase
      .from('non_conformances')
      .select('*');

    if (error) throw error;

    const ncs = nonConformances || [];
    
    const stats: NCStats = {
      total: ncs.length,
      byStatus: {},
      byCategory: {},
      byReasonCategory: {},
      byRiskLevel: {},
      overdue: 0,
      pendingReview: 0,
      recentlyResolved: 0,
      totalQuantityOnHold: 0,
      recentItems: ncs.slice(0, 5)
    };

    ncs.forEach(nc => {
      const status = nc.status || 'Unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      
      const category = nc.item_category || 'Unknown';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      
      const reasonCategory = nc.reason_category || 'Unknown';
      stats.byReasonCategory[reasonCategory] = (stats.byReasonCategory[reasonCategory] || 0) + 1;
      
      const riskLevel = nc.risk_level || 'Unknown';
      stats.byRiskLevel[riskLevel] = (stats.byRiskLevel[riskLevel] || 0) + 1;
      
      if (nc.quantity_on_hold) {
        stats.totalQuantityOnHold += Number(nc.quantity_on_hold);
      }
      
      if (nc.status === 'Under Review') {
        stats.pendingReview++;
      }
      
      if (nc.resolution_date) {
        const resolvedDate = new Date(nc.resolution_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (resolvedDate > thirtyDaysAgo) {
          stats.recentlyResolved++;
        }
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching NC stats:', error);
    throw error;
  }
};
