
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { id: string; username: string; role: string } | null;
};

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  user: null,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string; role: string } | null>(null);

  const login = async (username: string, password: string) => {
    // In a real app, this would call an API endpoint
    // For now, we'll simulate a successful login with hardcoded values
    if (username && password) {
      setIsAuthenticated(true);
      setUser({ 
        id: 'user-123', 
        username, 
        role: 'admin' 
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
