
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      // Get the return URL from the query string or default to dashboard
      const params = new URLSearchParams(location.search);
      const returnUrl = params.get('returnUrl') || '/dashboard';
      console.log('User is authenticated, redirecting to:', returnUrl);
      navigate(returnUrl);
    }
  }, [user, loading, navigate, location.search]);

  return { isAuthenticated: !!user, isLoading: loading };
}
