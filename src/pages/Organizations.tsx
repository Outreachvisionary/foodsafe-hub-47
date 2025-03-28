
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Organizations: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the organization management page
    navigate('/organization');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Organizations;
