
import { supabase } from '@/integrations/supabase/client';
import { Organization } from '@/types/organization';
import { Facility } from '@/types/facility';
import { RegulatoryStandard, FacilityStandard } from '@/types/regulatory';
import { toast } from '@/hooks/use-toast';

// Function to fetch facilities with proper type handling
export async function fetchFacilities(organizationId?: string, onlyAssigned: boolean = false) {
  try {
    console.log('Fetching facilities with params:', { organizationId, onlyAssigned });
    
    // Call the RPC function with correct parameters
    const { data, error } = await supabase
      .rpc('get_facilities', {
        p_organization_id: organizationId || null,
        p_only_assigned: onlyAssigned
      });
    
    if (error) {
      console.error('Error in fetchFacilities RPC call:', error);
      toast({
        title: "Failed to fetch facilities",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} facilities`);
    return data as Facility[];
  } catch (error: any) {
    console.error('Exception in fetchFacilities:', error);
    toast({
      title: "Error fetching facilities",
      description: error.message || "An unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
}

// Function to fetch organizations with proper type handling
export async function fetchOrganizations() {
  try {
    console.log('Fetching organizations...');
    
    // Call the RPC function
    const { data, error } = await supabase
      .rpc('get_organizations');
    
    if (error) {
      console.error('Error in fetchOrganizations RPC call:', error);
      toast({
        title: "Failed to fetch organizations",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} organizations`);
    return data as Organization[];
  } catch (error: any) {
    console.error('Exception in fetchOrganizations:', error);
    toast({
      title: "Error fetching organizations",
      description: error.message || "An unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
}

// Function to fetch regulatory standards
export async function fetchRegulatoryStandards() {
  try {
    console.log('Fetching regulatory standards...');
    
    // Call the RPC function
    const { data, error } = await supabase
      .rpc('get_regulatory_standards');
    
    if (error) {
      console.error('Error in fetchRegulatoryStandards RPC call:', error);
      toast({
        title: "Failed to fetch regulatory standards",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} regulatory standards`);
    return data as RegulatoryStandard[];
  } catch (error: any) {
    console.error('Exception in fetchRegulatoryStandards:', error);
    toast({
      title: "Error fetching regulatory standards",
      description: error.message || "An unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
}

// Function to fetch facility standards
export async function fetchFacilityStandards(facilityId: string) {
  try {
    console.log('Fetching facility standards for facility:', facilityId);
    
    // Call the RPC function with correct parameter
    const { data, error } = await supabase
      .rpc('get_facility_standards', {
        p_facility_id: facilityId
      });
    
    if (error) {
      console.error('Error in fetchFacilityStandards RPC call:', error);
      toast({
        title: "Failed to fetch facility standards",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} facility standards`);
    return data as FacilityStandard[];
  } catch (error: any) {
    console.error('Exception in fetchFacilityStandards:', error);
    toast({
      title: "Error fetching facility standards",
      description: error.message || "An unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
}
