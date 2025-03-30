
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3, ClipboardList } from 'lucide-react';
import NCList from '@/components/non-conformance/NCList';
import NCDetails from '@/components/non-conformance/NCDetails';
import { toast } from 'sonner';

const NonConformanceModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [viewingDetails, setViewingDetails] = useState(!!id);

  // Ensure viewingDetails matches with URL
  useEffect(() => {
    setViewingDetails(!!id);
  }, [id]);
  
  // Handle errors from the non-conformance module
  useEffect(() => {
    const handleErrors = () => {
      try {
        // This is a simple check to ensure the module loads properly
        if (document.getElementById('nc-module-container')) {
          console.log('Non-conformance module loaded successfully');
        }
      } catch (error) {
        console.error('Error in non-conformance module:', error);
        toast.error('There was an issue loading the non-conformance module. Please refresh the page.');
      }
    };
    
    handleErrors();
  }, []);
  
  const handleCreateNew = () => {
    navigate('/non-conformance/new');
  };
  
  const handleSelectItem = (selectedId: string) => {
    navigate(`/non-conformance/${selectedId}`);
    setViewingDetails(true);
  };
  
  return (
    <div id="nc-module-container" className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Non-Conformance Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Track, manage, and resolve product and process non-conformances
        </p>
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
              className="hover:border-accent hover:text-accent transition-colors"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          )}
          
          {!viewingDetails && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/non-conformance/dashboard')}
              className="hover:border-primary hover:text-primary transition-colors"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              View Dashboard
            </Button>
          )}
        </div>
        
        <Button 
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-accent to-primary text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Non-Conformance
        </Button>
      </div>
      
      <div className="bg-gradient-to-br from-white to-accent/5 border border-border/60 rounded-lg shadow-md overflow-hidden">
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
