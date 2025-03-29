
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';

const Organizations: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the organization management page
    navigate('/organization');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <Loading message="Redirecting to Organizations..." />
    </div>
  );
};

export default Organizations;
