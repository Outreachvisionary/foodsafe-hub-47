
import { supabase } from '@/integrations/supabase/client';

export interface Facility {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  organization_id?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Get facilities - Renamed from fetchFacilities for compatibility
export const getFacilities = async (organizationId?: string, onlyAssigned?: boolean): Promise<Facility[]> => {
  try {
    // Call the RPC function which handles permissions and filtering
    const { data, error } = await supabase.rpc('get_facilities', {
      p_organization_id: organizationId || null,
      p_only_assigned: onlyAssigned || false
    });
    
    if (error) {
      console.error('Error fetching facilities:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFacilities:', error);
    return [];
  }
};

// Alias for backward compatibility
export const fetchFacilities = getFacilities;

export default {
  getFacilities,
  fetchFacilities
};
