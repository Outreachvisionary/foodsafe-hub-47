
// src/pages/NonConformance.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3 } from 'lucide-react';
import NCList from '@/components/non-conformance/NCList';
import NCDetails from '@/components/non-conformance/NCDetails';

const NonConformanceModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [viewingDetails, setViewingDetails] = useState(!!id);

  // Ensure viewingDetails matches with URL
  useEffect(() => {
    setViewingDetails(!!id);
  }, [id]);
  
  const handleCreateNew = () => {
    navigate('/non-conformance/new');
  };
  
  const handleSelectItem = (selectedId: string) => {
    navigate(`/non-conformance/${selectedId}`);
    setViewingDetails(true);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Non-Conformance Management</h1>
        <p className="text-gray-600 mt-1">Track, manage, and resolve product and process non-conformances</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
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
          
          {!viewingDetails && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/non-conformance/dashboard')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              View Dashboard
            </Button>
          )}
        </div>
        
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Non-Conformance
        </Button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {id && viewingDetails ? (
          <NCDetails id={id} onClose={() => {
            navigate('/non-conformance');
            setViewingDetails(false);
          }} />
        ) : (
          <NCList onSelectItem={handleSelectItem} />
        )}
      </div>
    </div>
  );
};

export default NonConformanceModule;
