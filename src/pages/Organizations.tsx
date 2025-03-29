
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Organizations: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the organization management page
    navigate('/organization');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to Organizations...</p>
      </div>
    </div>
  );
};

export default Organizations;
