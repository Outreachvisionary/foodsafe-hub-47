
import { supabase } from '@/integrations/supabase/client';
import { NCStats, NonConformance } from '@/types/non-conformance';

export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    // Get all non-conformances with counts by status, category, and reason
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching non-conformance stats:', error);
      throw error;
    }
    
    // Get total count
    const total = data.length;
    
    // Count by status
    const byStatus = {
      'On Hold': 0,
      'Under Review': 0,
      'Released': 0,
      'Disposed': 0
    };
    
    // Count by category
    const byCategory = {
      'Processing Equipment': 0,
      'Product Storage Tanks': 0,
      'Finished Products': 0,
      'Raw Products': 0,
      'Packaging Materials': 0,
      'Other': 0
    };
    
    // Count by reason
    const byReason = {
      'Contamination': 0,
      'Quality Issues': 0,
      'Regulatory Non-Compliance': 0,
      'Equipment Malfunction': 0,
      'Documentation Error': 0,
      'Process Deviation': 0,
      'Other': 0
    };
    
    // Total quantity on hold
    let totalQuantityOnHold = 0;
    
    // Process data
    data.forEach(item => {
      // Count by status
      byStatus[item.status as keyof typeof byStatus]++;
      
      // Count by category
      byCategory[item.item_category as keyof typeof byCategory]++;
      
      // Count by reason
      byReason[item.reason_category as keyof typeof byReason]++;
      
      // Sum quantity on hold
      if (item.status === 'On Hold' && item.quantity_on_hold !== undefined) {
        totalQuantityOnHold += Number(item.quantity_on_hold);
      } else if (item.status === 'On Hold' && item.quantity !== undefined) {
        // If quantity_on_hold is not specified, use the full quantity
        totalQuantityOnHold += Number(item.quantity);
      }
    });
    
    // Get recent items
    const { data: recentItems, error: recentError } = await supabase
      .from('non_conformances')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error('Error fetching recent non-conformance items:', recentError);
      throw recentError;
    }
    
    return {
      total,
      byStatus,
      byCategory,
      byReason,
      totalQuantityOnHold,
      recentItems: recentItems as NonConformance[]
    };
  } catch (error) {
    console.error('Error in fetchNCStats:', error);
    // Return empty stats in case of error
    return {
      total: 0,
      byStatus: {
        'On Hold': 0,
        'Under Review': 0,
        'Released': 0,
        'Disposed': 0
      },
      byCategory: {
        'Processing Equipment': 0,
        'Product Storage Tanks': 0,
        'Finished Products': 0,
        'Raw Products': 0,
        'Packaging Materials': 0,
        'Other': 0
      },
      byReason: {
        'Contamination': 0,
        'Quality Issues': 0,
        'Regulatory Non-Compliance': 0,
        'Equipment Malfunction': 0,
        'Documentation Error': 0,
        'Process Deviation': 0,
        'Other': 0
      },
      totalQuantityOnHold: 0,
      recentItems: []
    };
  }
};
