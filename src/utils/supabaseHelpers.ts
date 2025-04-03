
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { Organization } from '@/types/organization';
import { Facility } from '@/types/facility';
import { RegulatoryStandard, FacilityStandard } from '@/types/regulatory';
import { toast } from '@/hooks/use-toast';

// Helper to handle fetch errors consistently
const handleFetchError = (functionName: string, error: any) => {
  console.error(`Error in ${functionName}:`, error);
  toast({
    title: `Failed to fetch ${functionName.replace('fetch', '').toLowerCase()}`,
    description: error.message || "An unknown error occurred",
    variant: "destructive"
  });
  throw error;
};

// Function to retry failed supabase queries
const withRetry = async <T>(
  operation: () => Promise<T>,
  functionName: string,
  maxRetries = 2,
  initialDelay = 500
): Promise<T> => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} for ${functionName}...`);
        // Check connection before retry
        const connectionStatus = await checkSupabaseConnection();
        if (!connectionStatus.success) {
          console.warn(`Connection check failed before retry ${attempt}: ${connectionStatus.error}`);
        }
      }
      
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt} failed for ${functionName}:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Waiting ${delay}ms before next retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`All ${maxRetries} retries failed for ${functionName}`);
  throw lastError;
};

// Function to fetch facilities with proper type handling and retries
export async function fetchFacilities(organizationId?: string, onlyAssigned: boolean = false) {
  const functionName = 'fetchFacilities';
  console.log(`${functionName} called with params:`, { organizationId, onlyAssigned });
  
  try {
    const result = await withRetry(
      async () => {
        console.log(`Executing ${functionName} RPC call...`);
        const { data, error } = await supabase
          .rpc('get_facilities', {
            p_organization_id: organizationId || null,
            p_only_assigned: onlyAssigned
          });
          
        if (error) {
          console.error(`Error in ${functionName} RPC call:`, error);
          throw error;
        }
        
        console.log(`${functionName} successful, retrieved ${data?.length || 0} records`);
        return data as Facility[];
      },
      functionName
    );
    
    return result;
  } catch (error: any) {
    console.error(`Exception in ${functionName}:`, error);
    toast({
      title: "Error fetching facilities",
      description: error.message || "A network or server error occurred",
      variant: "destructive"
    });
    return [];
  }
}

// Function to fetch organizations with proper type handling and retries
export async function fetchOrganizations() {
  const functionName = 'fetchOrganizations';
  console.log(`${functionName} called`);
  
  try {
    const result = await withRetry(
      async () => {
        console.log(`Executing ${functionName} RPC call...`);
        const { data, error } = await supabase
          .rpc('get_organizations');
          
        if (error) {
          console.error(`Error in ${functionName} RPC call:`, error);
          throw error;
        }
        
        console.log(`${functionName} successful, retrieved ${data?.length || 0} records`);
        return data as Organization[];
      },
      functionName
    );
    
    return result;
  } catch (error: any) {
    console.error(`Exception in ${functionName}:`, error);
    toast({
      title: "Error fetching organizations",
      description: error.message || "A network or server error occurred",
      variant: "destructive"
    });
    return [];
  }
}

// Function to fetch regulatory standards with retries
export async function fetchRegulatoryStandards() {
  const functionName = 'fetchRegulatoryStandards';
  console.log(`${functionName} called`);
  
  try {
    const result = await withRetry(
      async () => {
        console.log(`Executing ${functionName} RPC call...`);
        const { data, error } = await supabase
          .rpc('get_regulatory_standards');
          
        if (error) {
          console.error(`Error in ${functionName} RPC call:`, error);
          throw error;
        }
        
        console.log(`${functionName} successful, retrieved ${data?.length || 0} records`);
        return data as RegulatoryStandard[];
      },
      functionName
    );
    
    return result;
  } catch (error: any) {
    console.error(`Exception in ${functionName}:`, error);
    toast({
      title: "Error fetching regulatory standards",
      description: error.message || "A network or server error occurred",
      variant: "destructive"
    });
    return [];
  }
}

// Function to fetch facility standards with retries
export async function fetchFacilityStandards(facilityId: string) {
  const functionName = 'fetchFacilityStandards';
  console.log(`${functionName} called for facility: ${facilityId}`);
  
  try {
    const result = await withRetry(
      async () => {
        console.log(`Executing ${functionName} RPC call...`);
        const { data, error } = await supabase
          .rpc('get_facility_standards', {
            p_facility_id: facilityId
          });
          
        if (error) {
          console.error(`Error in ${functionName} RPC call:`, error);
          throw error;
        }
        
        console.log(`${functionName} successful, retrieved ${data?.length || 0} records`);
        return data as FacilityStandard[];
      },
      functionName
    );
    
    return result;
  } catch (error: any) {
    console.error(`Exception in ${functionName}:`, error);
    toast({
      title: "Error fetching facility standards",
      description: error.message || "A network or server error occurred",
      variant: "destructive"
    });
    return [];
  }
}

// Export a function to check database connection status
export async function checkDatabaseConnection() {
  return await checkSupabaseConnection();
}
