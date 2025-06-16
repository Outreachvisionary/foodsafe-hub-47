
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Plus, ExternalLink } from 'lucide-react';
import { Complaint, UpdateComplaintRequest } from '@/types/complaint';
import ComplaintDetails from './ComplaintDetails';
import ComplaintCAPAGenerator from './ComplaintCAPAGenerator';
import { updateComplaint } from '@/services/complaintService';
import { formatDistanceToNow } from 'date-fns';
import { getComplaintStatusColor } from '@/utils/complaintUtils';

interface ComplaintDetailProps {
  complaint: Complaint;
  onBack: () => void;
  onUpdate: () => void;
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({
  complaint,
  onBack,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const handleUpdate = async (updates: UpdateComplaintRequest) => {
    try {
      await updateComplaint(updates.id, updates);
      onUpdate();
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const handleCAPAGenerated = () => {
    onUpdate();
    setActiveTab('capa');
  };

  const statusColors = getComplaintStatusColor(complaint.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Complaints
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{complaint.title}</h1>
            <p className="text-muted-foreground">
              Reported {formatDistanceToNow(new Date(complaint.reported_date), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
            {complaint.status.replace(/_/g, ' ')}
          </Badge>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="capa">CAPA Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <ComplaintDetails
            complaint={complaint}
            onUpdate={handleUpdate}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
          />
        </TabsContent>

        <TabsContent value="capa">
          <ComplaintCAPAGenerator
            complaint={complaint}
            onCAPAGenerated={handleCAPAGenerated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplaintDetail;
