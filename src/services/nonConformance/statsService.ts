
import { supabase } from '@/integrations/supabase/client';
import { NCStats, NonConformance } from '@/types/non-conformance';

export const fetchNCStats = async (): Promise<NCStats> => {
  // Get total count
  const { count: total, error: countError } = await supabase
    .from('non_conformances')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('Error fetching non-conformance count:', countError);
    throw countError;
  }
  
  // Get status distribution
  const { data: statusData, error: statusError } = await supabase
    .from('non_conformances')
    .select('status');
  
  if (statusError) {
    console.error('Error fetching status counts:', statusError);
    throw statusError;
  }
  
  // Get category distribution
  const { data: categoryData, error: categoryError } = await supabase
    .from('non_conformances')
    .select('item_category');
  
  if (categoryError) {
    console.error('Error fetching category counts:', categoryError);
    throw categoryError;
  }
  
  // Get reason distribution
  const { data: reasonData, error: reasonError } = await supabase
    .from('non_conformances')
    .select('reason_category');
  
  if (reasonError) {
    console.error('Error fetching reason counts:', reasonError);
    throw reasonError;
  }
  
  // Get recent items
  const { data: recentItems, error: recentError } = await supabase
    .from('non_conformances')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (recentError) {
    console.error('Error fetching recent items:', recentError);
    throw recentError;
  }
  
  // Process the data
  const byStatus: Record<string, number> = {};
  statusData?.forEach(item => {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  });
  
  const byCategory: Record<string, number> = {};
  categoryData?.forEach(item => {
    byCategory[item.item_category] = (byCategory[item.item_category] || 0) + 1;
  });
  
  const byReason: Record<string, number> = {};
  reasonData?.forEach(item => {
    byReason[item.reason_category] = (byReason[item.reason_category] || 0) + 1;
  });
  
  return {
    total: total || 0,
    byStatus: byStatus as Record<any, number>,
    byCategory: byCategory as Record<any, number>,
    byReason: byReason as Record<any, number>,
    recentItems: recentItems as NonConformance[]
  };
};
