
import { CAPA, CAPAStatus, CAPAPriority, CAPASource, CAPAStats, CAPAFilter, CAPAFetchParams, SourceReference, CAPAEffectivenessMetrics } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch multiple CAPAs
export const fetchCAPAs = async (filters?: CAPAFilter): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capas')
      .select('*')
      .order('createdDate', { ascending: false });

    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }
      
      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          query = query.in('priority', filters.priority);
        } else {
          query = query.eq('priority', filters.priority);
        }
      }
      
      if (filters.source) {
        if (Array.isArray(filters.source)) {
          query = query.in('source', filters.source);
        } else {
          query = query.eq('source', filters.source);
        }
      }
      
      if (filters.assignedTo) {
        if (Array.isArray(filters.assignedTo)) {
          query = query.in('assignedTo', filters.assignedTo);
        } else {
          query = query.eq('assignedTo', filters.assignedTo);
        }
      }
      
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }
      
      if (filters.dateRange) {
        query = query
          .gte('createdDate', filters.dateRange.start)
          .lte('createdDate', filters.dateRange.end);
      }
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // For mock purposes, just return the raw data as CAPA objects
    // In a real implementation, you would need to convert DB fields to the CAPA interface
    return data as CAPA[];
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

// Function to fetch a single CAPA by ID
export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error(`CAPA with ID ${id} not found`);
    }
    
    // Return the data as a CAPA object (mock implementation)
    return data as CAPA;
  } catch (error) {
    console.error(`Error fetching CAPA with ID ${id}:`, error);
    throw error;
  }
};

// Function to update a CAPA
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as CAPA;
  } catch (error) {
    console.error(`Error updating CAPA with ID ${id}:`, error);
    throw error;
  }
};

// Function to get CAPA statistics
export const getCAPAStats = async (): Promise<CAPAStats> => {
  // Mock implementation for CAPA statistics
  return {
    total: 15,
    openCount: 3,
    inProgressCount: 5,
    closedCount: 4,
    verifiedCount: 2,
    pendingVerificationCount: 1,
    overdueCount: 2,
    byStatus: [
      { name: 'Open', value: 3 },
      { name: 'In Progress', value: 5 },
      { name: 'Pending Verification', value: 1 },
      { name: 'Closed', value: 4 },
      { name: 'Verified', value: 2 }
    ],
    byPriority: [
      { name: 'Critical', value: 2 },
      { name: 'High', value: 4 },
      { name: 'Medium', value: 7 },
      { name: 'Low', value: 2 }
    ],
    bySource: [
      { name: 'Audit', value: 4 },
      { name: 'Complaint', value: 3 },
      { name: 'Incident', value: 2 },
      { name: 'Internal', value: 4 },
      { name: 'Supplier', value: 2 }
    ],
    fsma204ComplianceRate: 87.5,
    effectivenessStats: {
      effective: 6,
      partiallyEffective: 2,
      ineffective: 1
    }
  };
};

// Function to get potential CAPAs
export const getPotentialCAPAs = async (): Promise<CAPA[]> => {
  // Mock implementation for potential CAPAs
  const mockPotentialCAPAs: CAPA[] = [
    {
      id: 'auto-1',
      title: 'Potential CAPA: Temperature Deviation Pattern',
      description: 'Multiple temperature deviations detected in cold storage area C over the past week.',
      source: 'nonconformance',
      sourceId: 'nc-58912',
      priority: 'high',
      status: 'open',
      dueDate: new Date().toISOString(),
      assignedTo: 'John Doe',
      department: 'Quality',
      createdBy: 'System',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      rootCause: '',
      correctiveAction: '',
      preventiveAction: '',
      effectivenessCriteria: '',
      effectivenessVerified: false,
      isFsma204Compliant: true
    },
    {
      id: 'auto-2',
      title: 'Potential CAPA: Recurring Supplier Issues',
      description: 'Multiple quality issues identified with raw materials from Supplier XYZ in the last month.',
      source: 'supplier',
      sourceId: 'sup-234',
      priority: 'medium',
      status: 'open',
      dueDate: new Date().toISOString(),
      assignedTo: 'Jane Smith',
      department: 'Purchasing',
      createdBy: 'System',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      rootCause: '',
      correctiveAction: '',
      preventiveAction: '',
      effectivenessCriteria: '',
      effectivenessVerified: false,
      isFsma204Compliant: true
    }
  ];
  
  return mockPotentialCAPAs;
};

// Function to get CAPA effectiveness metrics
export const getCAPAEffectivenessMetrics = async (capaId: string): Promise<CAPAEffectivenessMetrics> => {
  // Mock implementation for CAPA effectiveness metrics
  return {
    score: 85,
    rating: 'good',
    notes: 'Corrective actions effectively addressed the root cause, but some minor improvements needed in documentation.'
  };
};
