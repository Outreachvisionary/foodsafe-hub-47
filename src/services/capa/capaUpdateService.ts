
import { CAPA } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { adaptCAPAToModel } from '@/utils/typeAdapters';

// Function to update CAPA status
export const updateCAPAStatus = async (capaId: string, newStatus: CAPAStatus): Promise<CAPA> => {
  // In a real app, this would call an API
  // For now, we'll mock the update and return a mock response
  
  const mockUpdatedCAPA: CAPA = {
    id: capaId,
    title: `CAPA-${capaId}`,
    description: "Description of the CAPA item",
    status: newStatus,
    priority: 'High' as any,
    source: 'Audit' as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'John Doe',
    due_date: new Date().toISOString(),
    assigned_to: 'Jane Smith'
  };
  
  // Use the adapter to ensure the model is correctly formatted
  return adaptCAPAToModel(mockUpdatedCAPA);
};

export { adaptCAPAToModel };
