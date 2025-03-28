
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Clock, User, Tag, Box, CalendarDays, MessageSquare } from 'lucide-react';
import { Complaint } from '@/types/complaint';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';
import LinkedCAPAsList from '@/components/capa/LinkedCAPAsList';
import { toast } from 'sonner';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onBack: () => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, onBack }) => {
  const [showCreateCAPADialog, setShowCreateCAPADialog] = useState(false);
  
  const handleCAPACreated = (capaData: any) => {
    toast.success(`CAPA created for complaint: ${complaint.title}`);
    setShowCreateCAPADialog(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Complaints
        </Button>
        
        <CreateCAPADialog
          open={showCreateCAPADialog}
          onOpenChange={setShowCreateCAPADialog}
          onCAPACreated={handleCAPACreated}
          sourceData={{
            title: `Complaint: ${complaint.title}`,
            description: complaint.description,
            source: 'complaint',
            sourceId: complaint.id,
            priority: complaint.priority === 'Critical' ? 'critical' : 
                      complaint.priority === 'High' ? 'high' : 
                      complaint.priority === 'Medium' ? 'medium' : 'low'
          }}
          trigger={
            <Button>Create CAPA</Button>
          }
        />
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">{complaint.title}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <span>ID: {complaint.id}</span>
                <span className="mx-1">•</span>
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Reported {formatDistanceToNow(new Date(complaint.date), { addSuffix: true })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={
                complaint.status === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                complaint.status === 'Under Investigation' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-gray-100 text-gray-800 border-gray-200'
              }>
                {complaint.status}
              </Badge>
              
              <Badge variant="outline" className={
                complaint.priority === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
                complaint.priority === 'High' ? 'bg-orange-100 text-orange-800 border-orange-200' : 
                complaint.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-green-100 text-green-800 border-green-200'
              }>
                {complaint.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full md:w-auto mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="actions">Actions & CAPAs</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Description</h4>
                    <p className="text-sm">{complaint.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Category</h4>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span>{complaint.category}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Source</h4>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{complaint.source}</span>
                      </div>
                    </div>
                  </div>
                  
                  {complaint.product_involved && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Product Involved</h4>
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-gray-500" />
                        <span>{complaint.product_involved}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Assigned To</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{complaint.assignedTo}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Reported Date</h4>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <span>{new Date(complaint.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {complaint.resolution_date && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Resolution Date</h4>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <span>{new Date(complaint.resolution_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {complaint.customer_name && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Customer</h4>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{complaint.customer_name}</span>
                        {complaint.customer_contact && (
                          <span className="text-sm text-gray-500">({complaint.customer_contact})</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-6">
              <LinkedCAPAsList 
                sourceId={complaint.id} 
                sourceType="complaint"
                onCreateCAPAClick={() => setShowCreateCAPADialog(true)}
              />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Resolution Actions
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {complaint.resolution_details ? (
                    <div>
                      <p className="text-sm">{complaint.resolution_details}</p>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      No resolution details have been added yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="py-4 text-center text-gray-500">
                Activity history will be displayed here.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintDetails;
