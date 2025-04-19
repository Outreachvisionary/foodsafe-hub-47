
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

// Type for facility in the database
export interface Facility {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  status: 'active' | 'inactive' | 'pending';
  organization_id: string;
  contact_email?: string;
  contact_phone?: string;
  location_data?: {
    countryCode?: string;
    stateCode?: string;
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
  facility_type?: string;
}

// Function to fetch all facilities
export const fetchFacilities = async (): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

// Function to fetch facilities by organization ID
export const fetchFacilitiesByOrganization = async (organizationId: string): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching facilities by organization:', error);
    throw error;
  }
};

// Function to fetch a facility by ID
export const fetchFacilityById = async (id: string): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching facility with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new facility
export const createFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert(facilityData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating facility:', error);
    throw error;
  }
};

// Function to update an existing facility
export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<Facility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating facility with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a facility
export const deleteFacility = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting facility with ID ${id}:`, error);
    throw error;
  }
};
