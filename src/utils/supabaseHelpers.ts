
import { supabase } from '@/integrations/supabase/client';
import { Organization } from '@/types/organization';
import { Facility } from '@/types/facility';
import { RegulatoryStandard, FacilityStandard } from '@/types/regulatory';

// Function to fetch facilities with proper type handling
export async function fetchFacilities(organizationId?: string, onlyAssigned: boolean = false) {
  try {
    const { data, error } = await supabase
      .rpc('get_facilities', {
        p_organization_id: organizationId || null,
        p_only_assigned: onlyAssigned
      });
    
    if (error) throw error;
    
    return data as Facility[];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
}

// Function to fetch organizations with proper type handling
export async function fetchOrganizations() {
  try {
    const { data, error } = await supabase
      .rpc('get_organizations');
    
    if (error) throw error;
    
    return data as Organization[];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}

// Function to fetch regulatory standards
export async function fetchRegulatoryStandards() {
  try {
    const { data, error } = await supabase
      .rpc('get_regulatory_standards');
    
    if (error) throw error;
    
    return data as RegulatoryStandard[];
  } catch (error) {
    console.error('Error fetching regulatory standards:', error);
    throw error;
  }
}

// Function to fetch facility standards
export async function fetchFacilityStandards(facilityId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_facility_standards', {
        p_facility_id: facilityId
      });
    
    if (error) throw error;
    
    return data as FacilityStandard[];
  } catch (error) {
    console.error('Error fetching facility standards:', error);
    throw error;
  }
}
