
import { CAPA, CAPAActivity } from '@/types/capa';
import { CAPAStats } from '@/types/capa';
import { getMockCAPAs } from '@/services/mockDataService';
import { getCAPAStats, getCAPAById } from '@/services/capa/capaService';

// Function to return mock CAPAs
export const getCAPAs = async (): Promise<CAPA[]> => {
  // Return mock data
  return getMockCAPAs();
};

// Function to get CAPA activities
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  // Mock activities for now
  const mockActivities: CAPAActivity[] = [
    {
      id: `act-${capaId}-1`,
      capa_id: capaId,
      action_type: 'status_change',
      action_description: 'CAPA status changed from Open to In Progress',
      performed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      performed_by: 'John Doe',
      old_status: 'Open' as any,
      new_status: 'In_Progress' as any
    },
    {
      id: `act-${capaId}-2`,
      capa_id: capaId,
      action_type: 'comment',
      action_description: 'Root cause analysis completed',
      performed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      performed_by: 'Jane Smith'
    }
  ];
  
  return mockActivities;
};

// Function to update CAPA
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  // Get the existing CAPA
  const existingCAPA = await getCAPAById(id);
  
  if (!existingCAPA) {
    throw new Error(`CAPA with ID ${id} not found`);
  }
  
  // Create the updated CAPA
  const updatedCAPA: CAPA = {
    ...existingCAPA,
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // In a real app, we would call an API here to update the CAPA
  // For now, just return the updated object
  return updatedCAPA;
};

// Re-export functions from capaService
export { getCAPAStats, getCAPAById };

// Export the getCAPA function for single document (alias for getCAPAById)
export const getCAPA = getCAPAById;
