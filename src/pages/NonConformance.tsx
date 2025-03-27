
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import NCList from '@/components/non-conformance/NCList';
import NCDetails from '@/components/non-conformance/NCDetails';
import AppLayout from '@/components/layout/AppLayout';

interface NCListProps {
  onSelectItem: (selectedId: string) => void;
}

const NonConformanceModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State to track if we're viewing details or list
  const [viewingDetails, setViewingDetails] = useState(!!id);
  
  const handleCreateNew = () => {
    navigate('/non-conformance/new');
  };
  
  return (
    <AppLayout 
      title="Non-Conformance Management" 
      subtitle="Track, manage, and resolve product and process non-conformances"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          {viewingDetails && (
            <Button 
              variant="outline" 
              onClick={() => {
                navigate('/non-conformance');
                setViewingDetails(false);
              }}
            >
              Back to List
            </Button>
          )}
        </div>
        
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Non-Conformance
        </Button>
      </div>
      
      {id && viewingDetails ? (
        <NCDetails id={id} />
      ) : (
        <NCList onSelectItem={(selectedId: string) => {
          navigate(`/non-conformance/${selectedId}`);
          setViewingDetails(true);
        }} />
      )}
    </AppLayout>
  );
};

export default NonConformanceModule;
