
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NCDetailsForm from './NCDetailsForm';
import NCActivityTimeline from './NCActivityTimeline';
import NCAttachmentUploader from './NCAttachmentUploader';
import NCCAPAIntegration from './NCCAPAIntegration';
import NCDetailsHeader from './NCDetailsHeader';
import NCActionsPanel from './NCActionsPanel';

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
  const [ncData, setNcData] = useState({
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
        title={ncData.title} 
        id={ncData.id} 
        status={ncData.status} 
        reportedDate={ncData.reported_date}
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
              nonConformanceId={id}
              currentStatus={status} 
              onStatusChange={(newStatus) => {
                setNcData(prev => ({ ...prev, status: newStatus }));
              }}
            />
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default NCDetails;
