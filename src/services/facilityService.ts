
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';
import { mapFacilityStatusFromDb } from '@/types/capa';

/**
 * Get all facilities
 */
export async function getFacilities(): Promise<Facility[]> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    // Transform data to match Facility type
    return data.map(facility => ({
      id: facility.id,
      name: facility.name,
      description: facility.description,
      address: facility.address,
      contact_email: facility.contact_email,
      contact_phone: facility.contact_phone,
      status: mapFacilityStatusFromDb(facility.status),
      organization_id: facility.organization_id,
      country: facility.country,
      state: facility.state,
      city: facility.city,
      zipcode: facility.zipcode,
      created_at: facility.created_at,
      updated_at: facility.updated_at,
      location_data: facility.location_data
    }));
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
}

/**
 * Get a facility by ID
 */
export async function getFacilityById(id: string): Promise<Facility> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      address: data.address,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      status: mapFacilityStatusFromDb(data.status),
      organization_id: data.organization_id,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
      created_at: data.created_at,
      updated_at: data.updated_at,
      location_data: data.location_data
    };
  } catch (error) {
    console.error('Error fetching facility by ID:', error);
    throw error;
  }
}

/**
 * Create a new facility
 */
export async function createFacility(facilityData: Omit<Facility, "id" | "created_at" | "updated_at">): Promise<Facility> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert({
        name: facilityData.name,
        description: facilityData.description,
        address: facilityData.address,
        contact_email: facilityData.contact_email,
        contact_phone: facilityData.contact_phone,
        status: facilityData.status || 'pending',
        organization_id: facilityData.organization_id,
        country: facilityData.country,
        state: facilityData.state,
        city: facilityData.city,
        zipcode: facilityData.zipcode,
        location_data: facilityData.location_data
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      address: data.address,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      status: mapFacilityStatusFromDb(data.status),
      organization_id: data.organization_id,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
      created_at: data.created_at,
      updated_at: data.updated_at,
      location_data: data.location_data
    };
  } catch (error) {
    console.error('Error creating facility:', error);
    throw error;
  }
}

/**
 * Update an existing facility
 */
export async function updateFacility(id: string, facilityData: Partial<Facility>): Promise<Facility> {
  try {
    const updateData: any = {};
    
    // Only include properties that are present in the facilityData
    if (facilityData.name !== undefined) updateData.name = facilityData.name;
    if (facilityData.description !== undefined) updateData.description = facilityData.description;
    if (facilityData.address !== undefined) updateData.address = facilityData.address;
    if (facilityData.contact_email !== undefined) updateData.contact_email = facilityData.contact_email;
    if (facilityData.contact_phone !== undefined) updateData.contact_phone = facilityData.contact_phone;
    if (facilityData.status !== undefined) updateData.status = facilityData.status;
    if (facilityData.organization_id !== undefined) updateData.organization_id = facilityData.organization_id;
    if (facilityData.country !== undefined) updateData.country = facilityData.country;
    if (facilityData.state !== undefined) updateData.state = facilityData.state;
    if (facilityData.city !== undefined) updateData.city = facilityData.city;
    if (facilityData.zipcode !== undefined) updateData.zipcode = facilityData.zipcode;
    if (facilityData.location_data !== undefined) updateData.location_data = facilityData.location_data;
    
    const { data, error } = await supabase
      .from('facilities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      address: data.address,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      status: mapFacilityStatusFromDb(data.status),
      organization_id: data.organization_id,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
      created_at: data.created_at,
      updated_at: data.updated_at,
      location_data: data.location_data
    };
  } catch (error) {
    console.error('Error updating facility:', error);
    throw error;
  }
}

/**
 * Delete a facility
 */
export async function deleteFacility(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
}

/**
 * Get facilities by organization ID
 */
export async function getFacilitiesByOrganization(organizationId: string): Promise<Facility[]> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');

    if (error) {
      throw error;
    }

    // Transform data to match Facility type
    return data.map(facility => ({
      id: facility.id,
      name: facility.name,
      description: facility.description,
      address: facility.address,
      contact_email: facility.contact_email,
      contact_phone: facility.contact_phone,
      status: mapFacilityStatusFromDb(facility.status),
      organization_id: facility.organization_id,
      country: facility.country,
      state: facility.state,
      city: facility.city,
      zipcode: facility.zipcode,
      created_at: facility.created_at,
      updated_at: facility.updated_at,
      location_data: facility.location_data
    }));
  } catch (error) {
    console.error('Error fetching facilities by organization:', error);
    throw error;
  }
}

// Alias functions for backward compatibility
export const fetchFacilities = getFacilities;
export const fetchFacilityById = getFacilityById;
export const fetchFacilitiesByOrganization = getFacilitiesByOrganization;
