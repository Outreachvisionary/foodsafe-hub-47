
import { supabase } from '@/integrations/supabase/client';
import { CAPAStatus } from '@/types/capa';

// These are the actual status values allowed in the database table
export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification';

// Map frontend status values to database status values
export const mapStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  const statusMap: Record<CAPAStatus, DbCAPAStatus> = {
    'Open': 'Open',
    'In Progress': 'In Progress',
    'Closed': 'Closed',
    'Verified': 'Pending Verification' // Map 'verified' to 'Pending Verification' to track verification status
  };
  return statusMap[status] || 'Open';
};

// Map database status values to frontend status values
export const mapStatusFromDb = (dbStatus: string): CAPAStatus => {
  const dbStatusLower = dbStatus.toLowerCase();
  
  if (dbStatusLower === 'in progress') return 'In Progress';
  if (dbStatusLower === 'pending verification') return 'Verified';
  // We map 'overdue' to 'Open' in the UI but with a different display treatment
  if (dbStatusLower === 'overdue') return 'Open';
  
  if (['open', 'closed'].includes(dbStatusLower)) {
    return dbStatusLower.charAt(0).toUpperCase() + dbStatusLower.slice(1) as CAPAStatus;
  }
  
  return 'Open';
};

// Helper function to determine if a CAPA is overdue based on its due date
export const isOverdue = (dueDate: string | undefined): boolean => {
  if (!dueDate) return false;
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  return dueDateObj < today;
};

// Function to check and update overdue status for CAPAs
export const updateOverdueStatus = async (): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Update the status of overdue open and in-progress CAPAs
    const { error } = await supabase
      .from('capa_actions')
      .update({ status: 'Overdue' })
      .lte('due_date', today)
      .in('status', ['Open', 'In Progress']);
      
    if (error) {
      console.error('Error updating overdue status:', error);
    }
  } catch (err) {
    console.error('Error in updateOverdueStatus function:', err);
  }
};
