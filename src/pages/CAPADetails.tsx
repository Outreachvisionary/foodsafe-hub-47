
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CAPA, CAPAEffectivenessMetrics } from '@/types/capa';
import { fetchCAPAById, updateCAPA } from '@/services/capaService';
import CAPADetails from '@/components/capa/CAPADetails';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CAPAEffectivenessMonitor from '@/components/capa/CAPAEffectivenessMonitor';

const CAPADetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [capa, setCapa] = useState<CAPA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEffectivenessMonitor, setShowEffectivenessMonitor] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadCAPA = async () => {
      try {
        if (!id) {
          setError('No CAPA ID provided');
          setLoading(false);
          return;
        }

        const capaData = await fetchCAPAById(id);
        setCapa(capaData);
        
        // Show effectiveness monitor for closed CAPAs
        if (capaData.status === 'closed' || capaData.status === 'verified') {
          setShowEffectivenessMonitor(true);
        }
      } catch (err) {
        console.error('Error loading CAPA:', err);
        setError('Failed to load CAPA details');
        toast({
          title: 'Error',
          description: 'Failed to load CAPA details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCAPA();
  }, [id, toast]);

  const handleClose = () => {
    navigate('/capa');
  };

  const handleUpdate = (updatedCAPA: CAPA) => {
    setCapa(updatedCAPA);
    
    // Show effectiveness monitor if status changed to closed or verified
    if (updatedCAPA.status === 'closed' || updatedCAPA.status === 'verified') {
      setShowEffectivenessMonitor(true);
    }
    
    toast({
      title: 'CAPA Updated',
      description: 'CAPA details have been updated successfully',
    });
  };
  
  const handleEffectivenessUpdate = async (effectivenessData: CAPAEffectivenessMetrics) => {
    if (!capa || !id) return;
    
    try {
      // Update CAPA status to verified if effectiveness score is sufficient
      if (effectivenessData.score >= 85 && capa.status !== 'verified') {
        const updatedCAPA = await updateCAPA(id, {
          ...capa,
          status: 'verified'
        });
        
        setCapa(updatedCAPA);
        toast({
          title: 'CAPA Verified',
          description: 'CAPA has been marked as verified based on effectiveness assessment',
        });
      }
    } catch (error) {
      console.error('Error updating CAPA status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update CAPA status',
        variant: 'destructive',
      });
    }
  };
  
  const navigateToSource = () => {
    if (!capa || !capa.sourceReference || !capa.sourceReference.url) return;
    
    navigate(capa.sourceReference.url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="CAPA Details" 
        subtitle="View and manage corrective and preventive action details"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="mb-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CAPA List
          </Button>
          
          {capa?.sourceReference && capa.sourceReference.url && (
            <Button 
              variant="outline"
              onClick={navigateToSource}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              View {capa.sourceReference.type === 'complaint' ? 'Complaint' : 
                     capa.sourceReference.type === 'audit' ? 'Audit Finding' : 
                     capa.source.charAt(0).toUpperCase() + capa.source.slice(1)}
            </Button>
          )}
        </div>

        {loading ? (
          <Card className="p-8 flex justify-center items-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading CAPA details...</span>
          </Card>
        ) : error ? (
          <Card className="p-8 text-center text-red-500">
            {error}
          </Card>
        ) : capa ? (
          <div className="space-y-8">
            {capa.sourceReference && (
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">
                        This CAPA was created from a {capa.sourceReference.type}
                      </h3>
                      <p className="text-sm text-blue-600 mt-1">
                        {capa.sourceReference.title}
                      </p>
                      {capa.sourceReference.date && (
                        <p className="text-xs text-blue-500 mt-1">
                          Reported on {new Date(capa.sourceReference.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {capa.sourceReference.url && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={navigateToSource}
                        className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        View Source
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <CAPADetails
              capa={capa}
              onClose={handleClose}
              onUpdate={handleUpdate}
            />
            
            {showEffectivenessMonitor && (
              <CAPAEffectivenessMonitor
                capaId={capa.id}
                title={capa.title}
                implementationDate={capa.completedDate || capa.lastUpdated}
                onEffectivenessUpdate={handleEffectivenessUpdate}
              />
            )}
          </div>
        ) : (
          <Card className="p-8 text-center">
            CAPA not found
          </Card>
        )}
      </main>
    </div>
  );
};

export default CAPADetailsPage;
