
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    preferences: Record<string, any>;
  } | null;
  updateUserPreferences: (preferences: Record<string, any>) => void;
};

const defaultContext: UserContextType = {
  user: null,
  updateUserPreferences: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Simulated user data - would come from API in real app
  const [user, setUser] = useState({
    id: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    department: 'Quality Assurance',
    preferences: {
      theme: 'light',
      notifications: true,
      dashboardLayout: 'default',
    },
  });

  const updateUserPreferences = (preferences: Record<string, any>) => {
    setUser((prevUser) => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        ...preferences,
      },
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUserPreferences }}>
      {children}
    </UserContext.Provider>
  );
};
