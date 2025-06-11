
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface UserRole {
  id: string;
  user_id: string;
  role_name: string;
  permissions?: string[];
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Mock data for now - in a real app, this would fetch from the database
        setUserRole({
          id: '1',
          user_id: user.id,
          role_name: 'Admin',
          permissions: ['read', 'write', 'delete']
        });
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError('Failed to fetch user role');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return {
    userRole,
    loading,
    error
  };
};

export default useUserRole;
