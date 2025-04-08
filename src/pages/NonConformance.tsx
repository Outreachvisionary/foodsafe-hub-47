import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3 } from 'lucide-react';
import NCList from '@/components/non-conformance/NCList';
import NCDetails from '@/components/non-conformance/NCDetails';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';

const NonConformanceModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [viewingDetails, setViewingDetails] = useState(!!id);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    console.log('NonConformance page loaded with ID:', id);
    setViewingDetails(!!id);
  }, [id]);
  
  useEffect(() => {
    const channel = supabase
      .channel('public:non_conformances')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'non_conformances' }, 
        (payload) => {
          console.log('Realtime update:', payload);
          setRefreshTrigger(prev => prev + 1);
          
          const eventType = payload.eventType;
          if (eventType === 'UPDATE') {
            toast.info('A non-conformance record was updated');
          } else if (eventType === 'INSERT') {
            toast.info('A new non-conformance record was created');
          } else if (eventType === 'DELETE') {
            toast.info('A non-conformance record was deleted');
            if (id && payload.old && payload.old.id === id) {
              navigate('/non-conformance');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, navigate]);
  
  useEffect(() => {
    try {
      console.log('Loading non-conformance module, ID:', id);
      
      if (document.getElementById('nc-module-container')) {
        console.log('Non-conformance module loaded successfully');
        setLoadError(null);
      }
    } catch (error) {
      console.error('Error in non-conformance module:', error);
      setLoadError('There was an issue loading the non-conformance module');
      toast.error('There was an issue loading the non-conformance module. Please refresh the page.');
    }
  }, [id]);
  
  const handleCreateNew = () => {
    console.log("Creating new non-conformance");
    navigate('/non-conformance/new');
  };
  
  const handleViewDashboard = () => {
    console.log("Navigating to dashboard");
    navigate('/non-conformance/dashboard');
  };
  
  const handleSelectItem = (selectedId: string) => {
    console.log("Selecting item with ID:", selectedId);
    navigate(`/non-conformance/${selectedId}`);
    setViewingDetails(true);
  };
  
  if (loadError) {
    return (
      <div className="space-y-6 p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error Loading Non-Conformance Module</h1>
        <p className="text-gray-700">{loadError}</p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    );
  }
  
  return (
    <div id="nc-module-container" className="space-y-6 p-6 animate-fade-in">
      {!viewingDetails && (
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            onClick={handleViewDashboard}
            className="hover:border-primary hover:text-primary transition-colors"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            View Dashboard
          </Button>
          
          <Button 
            onClick={handleCreateNew}
            className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Non-Conformance
          </Button>
        </div>
      )}
      
      <div className="bg-gradient-to-br from-white to-accent/5 border border-border/60 rounded-lg shadow-md overflow-hidden">
        {id && viewingDetails ? (
          <NCDetails 
            id={id} 
            onClose={() => {
              navigate('/non-conformance');
              setViewingDetails(false);
            }} 
          />
        ) : (
          <NCList 
            onSelectItem={handleSelectItem} 
            key={`nc-list-${refreshTrigger}`} // Force re-render on updates
          />
        )}
      </div>
    </div>
  );
};

export default NonConformanceModule;
