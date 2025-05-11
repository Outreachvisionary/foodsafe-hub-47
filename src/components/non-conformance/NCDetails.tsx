
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NCDetailsForm from './NCDetailsForm';
import NCActivityTimeline from './NCActivityTimeline';
import NCAttachmentUploader from './NCAttachmentUploader';
import NCCAPAIntegration from './NCCAPAIntegration';
import NCDetailsHeader from './NCDetailsHeader';
import NCActionsPanel from './NCActionsPanel';
import { NonConformance } from '@/types/non-conformance';

interface NCDetailsProps {
  id: string;
  title: string;
  status: string;
  description?: string;
  itemName: string;
  itemCategory: string;
  reportedDate: string;
  createdBy: string;
  assignedTo?: string;
  reviewDate?: string | null;
  resolutionDate?: string | null;
  quantity?: number;
  quantityOnHold?: number;
  units?: string;
  reasonCategory?: string;
  reasonDetails?: string;
  resolution?: string | null;
}

const NCDetails: React.FC<NCDetailsProps> = ({
  id,
  title,
  status,
  description,
  itemName,
  itemCategory,
  reportedDate,
  createdBy,
  assignedTo,
  reviewDate,
  resolutionDate,
  quantity,
  quantityOnHold,
  units,
  reasonCategory,
  reasonDetails,
  resolution,
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [ncData, setNcData] = useState<Partial<NonConformance>>({
    id,
    title,
    status,
    description,
    item_name: itemName,
    item_category: itemCategory,
    reported_date: reportedDate,
    created_by: createdBy,
    assigned_to: assignedTo,
    review_date: reviewDate,
    resolution_date: resolutionDate,
    quantity,
    quantity_on_hold: quantityOnHold,
    units,
    reason_category: reasonCategory,
    reason_details: reasonDetails,
    resolution_details: resolution,
  });
  
  const handleDetailsUpdate = (updatedData: Partial<any>) => {
    setNcData(prev => ({ ...prev, ...updatedData }));
  };
  
  return (
    <div className="space-y-6">
      <NCDetailsHeader 
        nonConformance={{
          id: ncData.id || '',
          title: ncData.title || '',
          status: ncData.status || '',
          reported_date: ncData.reported_date || '',
          created_at: ncData.reported_date || '',
          updated_at: ncData.reported_date || '',
          item_name: ncData.item_name || '',
          item_category: ncData.item_category || ''
        } as NonConformance}
      />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="capa">CAPA</TabsTrigger>
        </TabsList>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <TabsContent value="details">
              <NCDetailsForm data={ncData as any} onSave={handleDetailsUpdate} />
            </TabsContent>
            
            <TabsContent value="activities">
              <NCActivityTimeline nonConformanceId={id} />
            </TabsContent>
            
            <TabsContent value="attachments">
              <NCAttachmentUploader nonConformanceId={id} />
            </TabsContent>
            
            <TabsContent value="capa">
              <NCCAPAIntegration nonConformanceId={id} />
            </TabsContent>
          </div>
          
          <div className="md:col-span-1">
            <NCActionsPanel
              id={id}
              title={title}
              onEdit={() => console.log('Edit NC:', id)}
              onGenerateCapa={() => console.log('Generate CAPA for NC:', id)}
              onViewCapa={ncData.capa_id ? () => console.log('View CAPA:', ncData.capa_id) : undefined}
            />
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default NCDetails;
