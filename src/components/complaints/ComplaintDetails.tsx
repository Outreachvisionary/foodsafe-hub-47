import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, MessageSquare, AlertTriangle, Package } from 'lucide-react';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import LinkedCAPAsList from '@/components/capa/LinkedCAPAsList';
import { useToast } from '@/components/ui/use-toast';
import { updateComplaintStatus } from '@/services/complaintService';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onUpdate?: (updatedComplaint: Complaint) => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Under_Investigation':
        return 'bg-amber-100 text-amber-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Reopened':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: ComplaintStatus) => {
    if (newStatus === complaint.status) return;
    
    try {
      setIsUpdating(true);
      const updatedComplaint = await updateComplaintStatus(complaint.id, newStatus);
      
      toast({
        title: 'Status Updated',
        description: `Complaint status changed to ${newStatus.replace('_', ' ')}`,
      });
      
      if (onUpdate) {
        onUpdate(updatedComplaint);
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update complaint status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{complaint.title}</CardTitle>
            <div className="flex items-center mt-2 space-x-2">
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status.replace('_', ' ')}
              </Badge>
              <span className="text-sm text-gray-500">
                ID: {complaint.id.substring(0, 8)}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="related">Related CAPAs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p>{complaint.category.replace('_', ' ')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                <p>{complaint.priority}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reported Date</h3>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  {new Date(complaint.reported_date).toLocaleDateString()}
                </p>
              </div>
              {complaint.resolution_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Resolution Date</h3>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    {new Date(complaint.resolution_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                <p className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  {complaint.created_by}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                <p>{complaint.assigned_to || 'Unassigned'}</p>
              </div>
              
              {complaint.customer_name && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  <p>{complaint.customer_name}</p>
                </div>
              )}
              
              {complaint.customer_contact && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                  <p>{complaint.customer_contact}</p>
                </div>
              )}
              
              {complaint.product_involved && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product</h3>
                  <p className="flex items-center">
                    <Package className="h-4 w-4 mr-1 text-gray-500" />
                    {complaint.product_involved}
                  </p>
                </div>
              )}
              
              {complaint.lot_number && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Lot Number</h3>
                  <p>{complaint.lot_number}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p>{complaint.description}</p>
              </div>
            </div>
            
            {complaint.resolution_details && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Resolution Details</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p>{complaint.resolution_details}</p>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isUpdating || complaint.status === 'New'}
                  onClick={() => handleStatusChange('New')}
                >
                  New
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isUpdating || complaint.status === 'Under_Investigation'}
                  onClick={() => handleStatusChange('Under_Investigation')}
                >
                  Under Investigation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isUpdating || complaint.status === 'Resolved'}
                  onClick={() => handleStatusChange('Resolved')}
                >
                  Resolved
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isUpdating || complaint.status === 'Closed'}
                  onClick={() => handleStatusChange('Closed')}
                >
                  Closed
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isUpdating || complaint.status === 'Reopened'}
                  onClick={() => handleStatusChange('Reopened')}
                >
                  Reopened
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="related">
            <LinkedCAPAsList 
              capaIds={complaint.capa_id ? [complaint.capa_id] : []} 
              emptyMessage="No CAPAs linked to this complaint"
              onCreateCAPAClick={() => console.log('Create CAPA from complaint', complaint.id)}
            />
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Activity history will be displayed here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComplaintDetails;
