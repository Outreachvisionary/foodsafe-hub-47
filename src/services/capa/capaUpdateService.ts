
import { CAPA } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { fetchCAPAById } from './capaFetchService';
import { adaptCAPAToModel } from '@/utils/typeAdapters';

export const updateCAPAStatus = async (
  capaId: string, 
  newStatus: CAPAStatus, 
  userId: string
): Promise<CAPA> => {
  // In a real implementation, this would call an API
  console.log(`Updating CAPA ${capaId} to status ${newStatus} by user ${userId}`);
  
  // Fetch the current CAPA first (in a real app this would be a DB update)
  const capa = await fetchCAPAById(capaId);
  
  // Update the status
  const updatedCapa: CAPA = {
    ...capa,
    status: newStatus,
  };
  
  return updatedCapa;
};

export default {
  updateCAPAStatus,
};
