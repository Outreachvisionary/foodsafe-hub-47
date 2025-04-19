
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

// This hook provides easy access to the authentication context
export const useAuth = () => useContext(AuthContext);

export default useAuth;
