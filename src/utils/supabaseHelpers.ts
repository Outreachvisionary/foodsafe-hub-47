
import { supabase } from '@/integrations/supabase/client';
import { Organization } from '@/types/organization';
import { Facility } from '@/types/facility';
import { RegulatoryStandard, FacilityStandard } from '@/types/regulatory';

// Function to fetch facilities with proper type handling
export async function fetchFacilities(organizationId?: string, onlyAssigned: boolean = false) {
  try {
    let query = supabase
      .from('temp_facilities') // This is a temporary view or function call
      .select('*')
      .eq('status', 'active');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as unknown as Facility[];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
}

// Function to fetch organizations with proper type handling
export async function fetchOrganizations() {
  try {
    const { data, error } = await supabase
      .from('temp_organizations') // This is a temporary view or function call
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    
    return data as unknown as Organization[];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}

// Function to fetch regulatory standards
export async function fetchRegulatoryStandards() {
  try {
    const { data, error } = await supabase
      .from('temp_regulatory_standards') // This is a temporary view or function call
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    
    return data as unknown as RegulatoryStandard[];
  } catch (error) {
    console.error('Error fetching regulatory standards:', error);
    throw error;
  }
}

// Function to fetch facility standards
export async function fetchFacilityStandards(facilityId: string) {
  try {
    const { data, error } = await supabase
      .from('temp_facility_standards') // This is a temporary view or function call
      .select(`
        *,
        regulatory_standards:temp_regulatory_standards(*)
      `)
      .eq('facility_id', facilityId);
    
    if (error) throw error;
    
    return data as unknown as FacilityStandard[];
  } catch (error) {
    console.error('Error fetching facility standards:', error);
    throw error;
  }
}
