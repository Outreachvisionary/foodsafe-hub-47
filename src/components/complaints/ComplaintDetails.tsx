
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Calendar, User, Tag, AlertTriangle, MessageCircle } from 'lucide-react';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';

interface ComplaintDetailsProps {
  complaint: any;
  onBack?: () => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, onBack }) => {
  const [showCAPADialog, setShowCAPADialog] = useState(false);
  
  const handleCAPACreated = (capaData: any) => {
    console.log('CAPA created:', capaData);
    // Handle the newly created CAPA
    // For example, update UI, show notification, etc.
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-amber-100 text-amber-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {onBack && (
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Complaints
        </Button>
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{complaint?.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={getStatusColor(complaint?.status)}>
                  {complaint?.status}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(complaint?.priority)}>
                  {complaint?.priority} Priority
                </Badge>
                <Badge variant="outline">
                  {complaint?.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                  {complaint?.description || 'No description provided'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">Date Reported:</span>
                  <span className="ml-2 text-gray-600">
                    {complaint?.date ? new Date(complaint.date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">Assigned To:</span>
                  <span className="ml-2 text-gray-600">{complaint?.assignedTo || 'Unassigned'}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <MessageCircle className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">Source:</span>
                  <span className="ml-2 text-gray-600">{complaint?.source || 'Unknown'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {complaint?.product_involved && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Product Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <div className="flex items-start">
                      <Tag className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-700 font-medium">Product: </span>
                        <span className="text-sm text-gray-600">{complaint.product_involved}</span>
                      </div>
                    </div>
                    
                    {complaint?.lot_number && (
                      <div className="flex items-start mt-2">
                        <Tag className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <span className="text-sm text-gray-700 font-medium">Lot Number: </span>
                          <span className="text-sm text-gray-600">{complaint.lot_number}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {complaint?.customer_name && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Customer Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <div className="flex items-start">
                      <User className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-700 font-medium">Name: </span>
                        <span className="text-sm text-gray-600">{complaint.customer_name}</span>
                      </div>
                    </div>
                    
                    {complaint?.customer_contact && (
                      <div className="flex items-start mt-2">
                        <MessageCircle className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <span className="text-sm text-gray-700 font-medium">Contact: </span>
                          <span className="text-sm text-gray-600">{complaint.customer_contact}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <CreateCAPADialog
                  onCAPACreated={handleCAPACreated}
                  initialData={{
                    title: complaint?.title,
                    description: complaint?.description,
                    source: 'complaint',
                    sourceId: complaint?.id,
                    priority: complaint?.priority || 'medium'
                  }}
                  trigger={
                    <Button>Create CAPA from Complaint</Button>
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintDetails;
