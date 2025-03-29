
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

const Organizations: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the proper organization management page
    navigate('/organizations/management');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <LoadingOverlay message="Redirecting to Organizations..." />
    </div>
  );
};

export default Organizations;
