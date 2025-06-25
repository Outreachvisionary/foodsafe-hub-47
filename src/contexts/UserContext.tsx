
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user';

interface UserContextType {
  user: User | null;
  profile?: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading, signOut } = useAuth();

  const refreshUser = async () => {
    // This would trigger a refresh of user data
    // For now, we'll use the auth context's user
  };

  const contextValue: UserContextType = {
    user: user ? {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email || '',
      name: user.user_metadata?.full_name || user.email || '',
      avatar_url: user.user_metadata?.avatar_url,
      role: user.user_metadata?.role || 'User',
      department: user.user_metadata?.department || '',
      organization_id: user.user_metadata?.organization_id,
      assigned_facility_ids: user.user_metadata?.facility_ids || [],
      preferences: user.user_metadata?.preferences || {},
      status: 'active'
    } : null,
    profile: user ? {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email || '',
      name: user.user_metadata?.full_name || user.email || '',
      avatar_url: user.user_metadata?.avatar_url,
      role: user.user_metadata?.role || 'User',
      department: user.user_metadata?.department || '',
      organization_id: user.user_metadata?.organization_id,
      assigned_facility_ids: user.user_metadata?.facility_ids || [],
      preferences: user.user_metadata?.preferences || {},
      status: 'active'
    } : null,
    loading,
    refreshUser,
    signOut
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
