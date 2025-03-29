
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';

/**
 * Updates the user's profile picture, uploading it to storage and updating the profile
 * @param userId The user ID
 * @param base64Image Base64 encoded image data
 * @returns The updated user profile
 */
export const updateProfilePicture = async (userId: string, base64Image: string): Promise<UserProfile | null> => {
  try {
    // Convert base64 to a file
    const base64Data = base64Image.split(',')[1];
    const blob = base64ToBlob(base64Data, 'image/jpeg');
    const fileName = `${userId}_${Date.now()}.jpg`;
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('profiles')
      .upload(`avatars/${fileName}`, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });
    
    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('profiles')
      .getPublicUrl(`avatars/${fileName}`);
    
    // Update user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select()
      .single();
    
    if (profileError) {
      console.error('Error updating profile with new avatar:', profileError);
      throw profileError;
    }
    
    return profileData as UserProfile;
  } catch (error) {
    console.error('Error in updateProfilePicture:', error);
    throw error;
  }
};

/**
 * Helper function to convert base64 to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
}

/**
 * Fetches a user's profile data
 * @param userId The user ID to fetch
 * @returns Promise resolving to the user profile
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Updates a user's profile with new information
 * @param userId The user ID to update
 * @param updates The profile updates to apply
 * @returns Promise resolving to the updated profile
 */
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};
