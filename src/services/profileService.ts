
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches user profile by user ID
 * @param userId User ID to fetch profile for
 * @returns User profile or null if not found
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Exception in fetchUserProfile:', error);
    return null;
  }
};

/**
 * Updates a user profile with new data
 * @param userId User ID of the profile to update
 * @param updates Update data for the profile
 * @returns Updated profile or null if update fails
 */
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    console.log('Updating profile for user:', userId);
    console.log('Updates:', JSON.stringify(updates));
    
    // Remove any properties that don't belong in the profiles table
    const cleanUpdates = { ...updates };
    
    // Remove email as it's not stored in profiles table
    if ('email' in cleanUpdates) {
      delete cleanUpdates.email;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(cleanUpdates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
    
    return data as UserProfile;
  } catch (error) {
    console.error('Exception in updateUserProfile:', error);
    toast({
      title: "Update error",
      description: "An unexpected error occurred while updating your profile",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Updates assigned facilities for a user
 * @param userId User ID to update
 * @param facilityIds Array of facility IDs to assign to user
 * @returns Success status
 */
export const updateUserFacilities = async (
  userId: string,
  facilityIds: string[]
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ assigned_facility_ids: facilityIds })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user facilities:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateUserFacilities:', error);
    return false;
  }
};

/**
 * Updates user organization
 * @param userId User ID to update
 * @param organizationId Organization ID to assign
 * @returns Success status
 */
export const updateUserOrganization = async (
  userId: string,
  organizationId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ organization_id: organizationId })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user organization:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateUserOrganization:', error);
    return false;
  }
};

export default {
  fetchUserProfile,
  updateUserProfile,
  updateUserFacilities,
  updateUserOrganization
};
