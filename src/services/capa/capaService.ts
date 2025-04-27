
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStats, CAPAFromDB, mapDBToAppCAPA } from '@/types/capa';
import { getMockCAPAs, getMockCAPAStats } from '@/services/mockDataService';

/**
 * Fetch CAPAs from the database with optimized query
 */
export const fetchCapas = async (): Promise<CAPA[]> => {
  try {
    // First try to fetch from Supabase
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching CAPAs from database:', error);
      // Fallback to mock data
      return getMockCAPAs();
    }
    
    // Transform database records to application CAPA objects
    return data.map((capaRecord: CAPAFromDB) => mapDBToAppCAPA(capaRecord));
  } catch (err) {
    console.error('Error in fetchCapas:', err);
    // Return mock data as fallback
    return getMockCAPAs();
  }
};

/**
 * Fetch a specific CAPA by ID
 */
export const fetchCapaById = async (id: string): Promise<CAPA | null> => {
  try {
    // First try to fetch from Supabase
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching CAPA with ID ${id} from database:`, error);
      // Find in mock data as fallback
      const mockCapas = getMockCAPAs();
      const mockCapa = mockCapas.find(capa => capa.id === id);
      return mockCapa || null;
    }
    
    // Transform database record to application CAPA object
    return mapDBToAppCAPA(data as CAPAFromDB);
  } catch (err) {
    console.error(`Error in fetchCapaById for ID ${id}:`, err);
    // Find in mock data as fallback
    const mockCapas = getMockCAPAs();
    const mockCapa = mockCapas.find(capa => capa.id === id);
    return mockCapa || null;
  }
};

/**
 * Fetch CAPA statistics for dashboard
 */
export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    // Try to compute statistics from real data first
    const capas = await fetchCapas();
    
    if (capas.length === 0) {
      return getMockCAPAStats();
    }
    
    // Calculate real statistics from fetched CAPAs
    // This is a simplified example; in a real app, you might want to do this calculation on the server
    
    const openCount = capas.filter(capa => capa.status === 'Open').length;
    const closedCount = capas.filter(capa => capa.status === 'Closed').length;
    const overdueCount = capas.filter(capa => {
      const dueDate = new Date(capa.dueDate);
      const today = new Date();
      return dueDate < today && capa.status !== 'Closed' && capa.status !== 'Completed';
    }).length;
    
    const pendingVerificationCount = capas.filter(capa => 
      capa.status === 'Pending_Verification'
    ).length;
    
    const completedWithVerification = capas.filter(capa => 
      capa.status === 'Closed' && capa.effectivenessVerified === true
    ).length;
    
    // Calculate effectiveness rate
    const effectivenessRate = closedCount > 0 
      ? Math.round((completedWithVerification / closedCount) * 100) 
      : 0;
    
    // Create category distributions
    const byPriority: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    
    capas.forEach(capa => {
      // Count by priority
      byPriority[capa.priority] = (byPriority[capa.priority] || 0) + 1;
      
      // Count by source
      bySource[capa.source] = (bySource[capa.source] || 0) + 1;
      
      // Count by department
      if (capa.department) {
        byDepartment[capa.department] = (byDepartment[capa.department] || 0) + 1;
      }
      
      // Count by status
      byStatus[capa.status] = (byStatus[capa.status] || 0) + 1;
      
      // Count by month
      const creationMonth = new Date(capa.createdAt).toLocaleString('default', { month: 'short' });
      byMonth[creationMonth] = (byMonth[creationMonth] || 0) + 1;
    });
    
    return {
      total: capas.length,
      openCount,
      closedCount,
      overdueCount,
      pendingVerificationCount,
      effectivenessRate,
      byPriority,
      bySource,
      byDepartment,
      byStatus,
      byMonth,
      overdue: overdueCount
    };
  } catch (err) {
    console.error('Error computing CAPA statistics:', err);
    // Return mock statistics as fallback
    return getMockCAPAStats();
  }
};

/**
 * Delete a CAPA by ID
 */
export const deleteCAPA = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting CAPA with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Error in deleteCAPA for ID ${id}:`, err);
    return false;
  }
};
