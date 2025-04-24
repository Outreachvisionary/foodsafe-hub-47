import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Check, XCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import NCDetailsHeader from './NCDetailsHeader';
import NCDetailsForm from './NCDetailsForm';
import NCActivities from './NCActivities';
import LinkedCAPAsList from '@/components/capa/LinkedCAPAsList';

interface NCDetailsProps {
  id: string;
  onClose: () => void;
}

interface LinkedCAPAsListProps {
  sourceId: string;
  sourceType: string;
  capas: any[];
  onCreateCAPAClick: () => void;
}

const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({ sourceId, sourceType, capas = [], onCreateCAPAClick }) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Linked CAPAs</h3>
        <Button onClick={onCreateCAPAClick} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Create CAPA
        </Button>
      </div>
      {capas.length > 0 ? (
        <div className="space-y-2">
          {capas.map((capa) => (
            <div key={capa.id} className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{capa.title}</h4>
                  <span className="text-sm text-gray-500">ID: {capa.id}</span>
                </div>
                <Badge variant={capa.status === 'Open' ? 'outline' : 'default'}>
                  {capa.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-gray-500">No CAPAs linked yet</p>
        </div>
      )}
    </div>
  );
};

const NCDetails: React.FC<NCDetailsProps> = ({ id, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [ncData, setNcData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showCreateCapaDialog, setShowCreateCapaDialog] = useState(false);

  useEffect(() => {
    const fetchNCDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('non_conformances')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setNcData(data);
      } catch (error) {
        console.error('Error fetching NC details:', error);
        toast.error('Failed to load non-conformance details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchNCDetails();
    }
  }, [id]);

  const handleDataUpdated = (updatedData: any) => {
    setNcData({...ncData, ...updatedData});
    toast.success('Non-conformance updated successfully');
  };
  
  const handleCreateCAPAClick = () => {
    setShowCreateCapaDialog(true);
  };
  
  const handleCAPACreated = (capaData: any) => {
    updateNCWithCAPAReference(capaData.id);
    setShowCreateCapaDialog(false);
  };
  
  const updateNCWithCAPAReference = async (capaId: string) => {
    try {
      const { data, error } = await supabase
        .from('non_conformances')
        .update({ capa_id: capaId })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setNcData(data);
      toast.success('Non-conformance linked to CAPA successfully');
    } catch (error) {
      console.error('Error updating NC with CAPA reference:', error);
      toast.error('Failed to link non-conformance to CAPA');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!ncData) {
    return (
      <div className="p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Non-conformance not found</h2>
        <p className="text-gray-600 mb-4">The non-conformance you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={onClose}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        <h1 className="text-2xl font-semibold flex-1 truncate">
          {ncData.title}
        </h1>
      </div>
      
      <NCDetailsHeader data={ncData} onDataUpdated={handleDataUpdated} />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="capas">CAPAs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <NCDetailsForm data={ncData} onSave={handleDataUpdated} />
        </TabsContent>
        
        <TabsContent value="activities" className="pt-4">
          <NCActivities nonConformanceId={id} />
        </TabsContent>
        
        <TabsContent value="capas" className="pt-4">
          <LinkedCAPAsList 
            sourceId={id}
            sourceType="non_conformance"
            capas={[]} // Pass an empty array or fetch linked CAPAs
            onCreateCAPAClick={() => handleCreateCAPAClick()}
          />
        </TabsContent>
      </Tabs>
      
      {showCreateCapaDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Create CAPA from Non-Conformance</h2>
            <p className="mb-4">This would open the CAPA creation dialog</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateCapaDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleCAPACreated({ id: 'placeholder-capa-id' });
              }}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NCDetails;
