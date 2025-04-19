
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';
import { Complaint } from '@/types/complaint';
import { format } from 'date-fns';
import { ArrowLeft, AlertTriangle, FileCheck, MessageSquare, ClipboardList, CalendarCheck } from 'lucide-react';
import { Timeline, TimelineItem } from '@/components/ui/timeline';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onBack: () => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, onBack }) => {
  const [currentTab, setCurrentTab] = useState('details');

  const handleCAPACreated = (capaData: any) => {
    console.log('CAPA created:', capaData);
    // In a real implementation, you would update the UI or state to show the CAPA is linked
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>;
      case 'investigating':
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-800">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case 'product_quality':
      case 'quality':
        return <Badge className="bg-purple-100 text-purple-800">Product Quality</Badge>;
      case 'foreign_material':
      case 'safety':
        return <Badge className="bg-red-100 text-red-800">Foreign Material</Badge>;
      case 'packaging':
        return <Badge className="bg-blue-100 text-blue-800">Packaging</Badge>;
      case 'service':
      case 'delivery':
        return <Badge className="bg-green-100 text-green-800">Service</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Complaints
        </Button>
        
        <div className="flex items-center gap-2">
          {getStatusBadge(complaint.status)}
          {getCategoryBadge(complaint.category)}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{complaint.title}</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                Reported on {format(new Date(complaint.reportedDate), 'PP')} by {complaint.createdBy}
              </div>
            </div>
            <div className="flex gap-2">
              <CreateCAPADialog 
                onCAPACreated={handleCAPACreated}
                initialData={{
                  title: complaint.title,
                  description: complaint.description,
                  source: 'complaint',
                  sourceId: complaint.id,
                  priority: complaint.priority === 'critical' ? 'critical' : 
                            complaint.priority === 'high' ? 'high' : 
                            complaint.priority === 'medium' ? 'medium' : 'low'
                }}
              >
                <Button variant="outline" className="flex gap-1 items-center">
                  <FileCheck className="h-4 w-4" />
                  Create CAPA
                </Button>
              </CreateCAPADialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="details" className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="investigation" className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Investigation
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-1">
                <CalendarCheck className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Communication
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="mt-1 text-sm text-gray-700">{complaint.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Customer Information</h3>
                    <div className="mt-1 text-sm">
                      <p><span className="font-medium">Name:</span> {complaint.customerName || 'N/A'}</p>
                      <p><span className="font-medium">Contact:</span> {complaint.customerContact || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Product Information</h3>
                    <div className="mt-1 text-sm">
                      <p><span className="font-medium">Product:</span> {complaint.productInvolved || 'N/A'}</p>
                      <p><span className="font-medium">Lot Number:</span> {complaint.lotNumber || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Assigned To</h3>
                    <p className="mt-1 text-sm">{complaint.assignedTo || 'Unassigned'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Resolution Date</h3>
                    <p className="mt-1 text-sm">
                      {complaint.resolutionDate 
                        ? format(new Date(complaint.resolutionDate), 'PP') 
                        : 'Not resolved yet'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="investigation">
              {complaint.capaId ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center">
                    <FileCheck className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <h3 className="font-medium">CAPA Created</h3>
                      <p className="text-sm">This complaint has a CAPA associated with it.</p>
                      <Button variant="link" className="p-0 h-auto mt-1">View CAPA Details</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No investigation data</h3>
                  <p className="text-muted-foreground">
                    There is no CAPA or investigation associated with this complaint yet.
                  </p>
                  <div className="mt-4">
                    <CreateCAPADialog
                      onCAPACreated={handleCAPACreated}
                      initialData={{
                        title: complaint.title,
                        description: complaint.description,
                        source: 'complaint',
                        sourceId: complaint.id,
                        priority: complaint.priority === 'critical' ? 'critical' : 
                                  complaint.priority === 'high' ? 'high' : 
                                  complaint.priority === 'medium' ? 'medium' : 'low'
                      }}
                    >
                      <Button>Start Investigation / Create CAPA</Button>
                    </CreateCAPADialog>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="timeline">
              <Timeline>
                <TimelineItem 
                  title="Complaint Received"
                  date={format(new Date(complaint.reportedDate), 'PPp')}
                >
                  <p className="text-sm mt-1">
                    Complaint was recorded in the system by {complaint.createdBy}
                  </p>
                </TimelineItem>
                
                <TimelineItem 
                  title="Assigned for Investigation"
                  date={format(new Date(complaint.reportedDate), 'PPp')}
                >
                  <p className="text-sm mt-1">
                    Complaint was assigned to {complaint.assignedTo || 'Quality Team'}
                  </p>
                </TimelineItem>
                
                {complaint.resolutionDate && (
                  <TimelineItem 
                    title="Complaint Resolved"
                    date={format(new Date(complaint.resolutionDate), 'PPp')}
                    isLast
                  >
                    <p className="text-sm mt-1">
                      Resolution: Issue addressed and customer notified
                    </p>
                  </TimelineItem>
                )}
              </Timeline>
            </TabsContent>
            
            <TabsContent value="communication">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No communication records</h3>
                <p className="text-muted-foreground">
                  There are no customer communication records associated with this complaint.
                </p>
                <Button className="mt-4">Add Communication Record</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Last updated: {format(new Date(complaint.updatedAt || complaint.reportedDate), 'PPp')}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Update Status</Button>
            <Button>Close Complaint</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ComplaintDetails;
