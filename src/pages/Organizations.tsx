
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Organizations: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the organization management page
    navigate('/organization');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-cc-teal">
      <div className="text-center">
        <img 
          src="/lovable-uploads/98c6dceb-0bcf-4c01-a92f-ce4f884cdcff.png" 
          alt="Compliance Core Logo" 
          className="h-16 mx-auto mb-4"
        />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cc-gold mx-auto"></div>
        <p className="text-cc-gold mt-4 font-display">Redirecting to Organizations...</p>
      </div>
    </div>
  );
};

export default Organizations;
