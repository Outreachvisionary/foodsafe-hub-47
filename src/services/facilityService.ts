import { supabase } from '@/integrations/supabase/client';
import { Facility as FacilityType } from '@/types/facility';

// Renamed to FacilityType to avoid naming conflict

export interface FacilityWithOrganization extends FacilityType {
  organizationName?: string;
}

export async function getFacilities(): Promise<FacilityType[]> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
    
    // Map database columns to our Facility type
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      address: item.address || '',
      contactEmail: item.contact_email || '',
      contactPhone: item.contact_phone || '',
      status: item.status || 'active',
      organizationId: item.organization_id || null,
      country: item.country || '',
      state: item.state || '',
      city: item.city || '',
      zipcode: item.zipcode || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error in getFacilities:', error);
    throw error;
  }
}

export async function getFacilityById(id: string): Promise<FacilityType | null> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching facility by ID:', error);
      return null;
    }

    // Map database columns to our Facility type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      address: data.address || '',
      contactEmail: data.contact_email || '',
      contactPhone: data.contact_phone || '',
      status: data.status || 'active',
      organizationId: data.organization_id || null,
      country: data.country || '',
      state: data.state || '',
      city: data.city || '',
      zipcode: data.zipcode || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in getFacilityById:', error);
    return null;
  }
}

export async function createFacility(facility: Omit<FacilityType, 'id' | 'createdAt' | 'updatedAt'>): Promise<FacilityType> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert([
        {
          name: facility.name,
          description: facility.description,
          address: facility.address,
          contact_email: facility.contactEmail,
          contact_phone: facility.contactPhone,
          status: facility.status,
          organization_id: facility.organizationId,
          country: facility.country,
          state: facility.state,
          city: facility.city,
          zipcode: facility.zipcode,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating facility:', error);
      throw error;
    }

    // Map database columns to our Facility type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      address: data.address || '',
      contactEmail: data.contact_email || '',
      contactPhone: data.contact_phone || '',
      status: data.status || 'active',
      organizationId: data.organization_id || null,
      country: data.country || '',
      state: data.state || '',
      city: data.city || '',
      zipcode: data.zipcode || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in createFacility:', error);
    throw error;
  }
}

export async function updateFacility(id: string, updates: Partial<FacilityType>): Promise<FacilityType | null> {
  try {
    const updateObject: { [key: string]: any } = {};
    if (updates.name !== undefined) updateObject.name = updates.name;
    if (updates.description !== undefined) updateObject.description = updates.description;
    if (updates.address !== undefined) updateObject.address = updates.address;
    if (updates.contactEmail !== undefined) updateObject.contact_email = updates.contactEmail;
    if (updates.contactPhone !== undefined) updateObject.contact_phone = updates.contactPhone;
    if (updates.status !== undefined) updateObject.status = updates.status;
    if (updates.organizationId !== undefined) updateObject.organization_id = updates.organizationId;
	  if (updates.country !== undefined) updateObject.country = updates.country;
    if (updates.state !== undefined) updateObject.state = updates.state;
    if (updates.city !== undefined) updateObject.city = updates.city;
    if (updates.zipcode !== undefined) updateObject.zipcode = updates.zipcode;

    const { data, error } = await supabase
      .from('facilities')
      .update(updateObject)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating facility:', error);
      return null;
    }

    // Map database columns to our Facility type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      address: data.address || '',
      contactEmail: data.contact_email || '',
      contactPhone: data.contact_phone || '',
      status: data.status || 'active',
      organizationId: data.organization_id || null,
      country: data.country || '',
      state: data.state || '',
      city: data.city || '',
      zipcode: data.zipcode || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in updateFacility:', error);
    return null;
  }
}

export async function deleteFacility(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting facility:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFacility:', error);
    return false;
  }
}
