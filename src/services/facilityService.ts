
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

export const getFacilities = async (): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*');

    if (error) {
      console.error('Error fetching facilities:', error);
      return [];
    }

    // Ensure all facilities have the required organization_id
    return data.map(facility => ({
      ...facility,
      organization_id: facility.organization_id || ''
    })) as Facility[];
  } catch (err) {
    console.error('Error in getFacilities:', err);
    return [];
  }
};

export const getFacilityById = async (id: string): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching facility:', error);
      return null;
    }

    // Ensure facility has the required organization_id
    return {
      ...data,
      organization_id: data.organization_id || ''
    } as Facility;
  } catch (err) {
    console.error('Error in getFacilityById:', err);
    return null;
  }
};

export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    // Ensure required fields
    if (!facilityData.organization_id) {
      throw new Error('Organization ID is required when creating a facility');
    }

    // Prepare data with timestamps if not provided
    const dataToSend = {
      ...facilityData,
      created_at: facilityData.created_at || new Date().toISOString(),
      updated_at: facilityData.updated_at || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('facilities')
      .insert([dataToSend])
      .select()
      .single();

    if (error) {
      console.error('Error creating facility:', error);
      throw error;
    }

    return data as Facility;
  } catch (err) {
    console.error('Error in createFacility:', err);
    throw err;
  }
};

export const updateFacility = async (id: string, facilityData: Facility): Promise<Facility> => {
  try {
    // Ensure required fields
    if (!facilityData.organization_id) {
      throw new Error('Organization ID is required when updating a facility');
    }

    // Update the timestamp
    const dataToUpdate = {
      ...facilityData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('facilities')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating facility:', error);
      throw error;
    }

    return data as Facility;
  } catch (err) {
    console.error('Error in updateFacility:', err);
    throw err;
  }
};

export const deleteFacility = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting facility:', error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error('Error in deleteFacility:', err);
    throw err;
  }
};

export const getFacilitiesByOrganization = async (organizationId: string): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error fetching facilities by organization:', error);
      return [];
    }

    return data as Facility[];
  } catch (err) {
    console.error('Error in getFacilitiesByOrganization:', err);
    return [];
  }
};

export const updateFacilityStatus = async (id: string, status: string): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating facility status:', error);
      return null;
    }

    return data as Facility;
  } catch (err) {
    console.error('Error in updateFacilityStatus:', err);
    return null;
  }
};

export default {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilitiesByOrganization,
  updateFacilityStatus
};
