
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import NCDetailsHeader from './NCDetailsHeader';
import NCItemDetails from './NCItemDetails';
import NCStatusInfo from './NCStatusInfo';
import NCActionsPanel from './NCActionsPanel';
import NCActivityTimeline from './NCActivityTimeline';
import NCAttachmentUploader from './NCAttachmentUploader';
import NCIntegrationsList from './NCIntegrationsList';
import nonConformanceService from '@/services/nonConformanceService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { NonConformance, NCStatus } from '@/types/non-conformance';

interface NCDetailsProps {
  id: string;
  onClose: () => void;
}

const NCDetails: React.FC<NCDetailsProps> = ({ id, onClose }) => {
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  
  const [ncData, setNcData] = useState<NonConformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the non-conformance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching NC details for ID:', id);
        
        const { data, error } = await supabase
          .from('non_conformances')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        console.log('NC data retrieved:', data);
        setNcData(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching non-conformance:', err);
        setError(err.message || 'Failed to load non-conformance details');
        toast.error('Failed to load non-conformance details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleEditNC = () => {
    console.log('Edit NC clicked for ID:', id);
    navigate(`/non-conformance/edit/${id}`);
  };
  
  const handleGenerateCapa = async () => {
    try {
      console.log('Generating CAPA for NC ID:', id);
      
      // Create new CAPA record
      const { data: capaData, error: capaError } = await supabase
        .from('capa_actions')
        .insert({
          title: `CAPA for ${ncData?.title || 'Non-Conformance'}`,
          description: ncData?.description || '',
          source: 'non_conformance',
          source_id: id,
          priority: ncData?.priority || 'medium',
          created_by: ncData?.created_by || 'system',
          assigned_to: ncData?.assigned_to || ncData?.created_by || 'system',
          department: ncData?.department,
          status: 'Open',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        })
        .select()
        .single();
      
      if (capaError) throw capaError;
      
      console.log('CAPA created:', capaData);
      
      // Update the non-conformance with the CAPA ID
      const { error: updateError } = await supabase
        .from('non_conformances')
        .update({ capa_id: capaData.id })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Update local state
      setNcData({
        ...ncData,
        capa_id: capaData.id
      } as NonConformance);
      
      toast.success('CAPA generated successfully');
      
      // Use the nonConformanceService to record this activity
      await nonConformanceService.createNCActivity({
        non_conformance_id: id,
        action: 'CAPA generated',
        performed_by: ncData?.assigned_to || 'system'
      });
      
      uiToast({
        title: "CAPA Generated",
        description: "Corrective and Preventive Action has been created",
      });
    } catch (err: any) {
      console.error('Error generating CAPA:', err);
      toast.error('Failed to generate CAPA');
      uiToast({
        title: "CAPA Generation Failed",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleViewCapa = () => {
    if (ncData?.capa_id) {
      console.log('Navigating to CAPA details for ID:', ncData.capa_id);
      navigate(`/capa/${ncData.capa_id}`);
    }
  };
  
  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error || !ncData) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-red-600">Error Loading Details</h3>
        <p className="mt-2 text-gray-600">{error || 'Failed to load non-conformance details'}</p>
        <Button onClick={onClose} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <NCDetailsHeader 
        nonConformance={ncData}
        onBackClick={onClose}
        onStatusChange={async (newStatus: NCStatus) => {
          try {
            await nonConformanceService.updateNCStatus(id, newStatus, ncData.created_by);
            setNcData({
              ...ncData,
              status: newStatus
            });
          } catch (error) {
            console.error('Error updating status:', error);
          }
        }}
        onEdit={handleEditNC}
        onCreateCapa={handleGenerateCapa}
        onViewCapa={ncData.capa_id ? handleViewCapa : undefined}
      />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <NCItemDetails nonConformance={ncData} />
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-4">
              <NCActivityTimeline nonConformanceId={id} />
            </TabsContent>
            
            <TabsContent value="attachments" className="mt-4">
              <NCAttachmentUploader nonConformanceId={id} />
            </TabsContent>
            
            <TabsContent value="integrations" className="mt-4">
              <NCIntegrationsList nonConformanceId={id} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <NCStatusInfo nonConformance={ncData} />
          
          <NCActionsPanel 
            id={id}
            title={ncData.title}
            description={ncData.description || ''}
            category={ncData.item_category}
            severity={ncData.risk_level || ''}
            capaId={ncData.capa_id}
            onEdit={handleEditNC}
            onGenerateCapa={handleGenerateCapa}
            onViewCapa={handleViewCapa}
          />
        </div>
      </div>
    </div>
  );
};

export default NCDetails;
