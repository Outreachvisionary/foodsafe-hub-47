
import React, { useEffect, useState } from 'react';
import { Complaint } from '@/types/complaint';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Timeline, TimelineItem } from '@/components/ui/timeline';
import { Calendar, Clock, FileText, MessageSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onStatusChange: (newStatus: string, comment: string) => Promise<void>;
  onClose: () => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, onStatusChange, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      await onStatusChange(newStatus, comment);
      setComment('');
      toast({
        title: 'Status Updated',
        description: `Complaint status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update complaint status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{complaint.title}</h2>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline">{complaint.category}</Badge>
            <Badge>{complaint.status}</Badge>
            {complaint.priority && (
              <Badge variant="outline" className="capitalize">{complaint.priority}</Badge>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resolution">Resolution</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{complaint.description}</p>

                  {complaint.product_involved && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Product Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium">Product:</div>
                        <div>{complaint.product_involved}</div>
                        {complaint.lot_number && (
                          <>
                            <div className="font-medium">Lot Number:</div>
                            <div>{complaint.lot_number}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline>
                    <TimelineItem title="Complaint Reported">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(complaint.reported_date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reported by: {complaint.created_by}
                        </div>
                      </div>
                    </TimelineItem>

                    {complaint.assigned_to && (
                      <TimelineItem title="Assigned for Investigation">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(complaint.updated_at)}
                          </div>
                          <div className="text-sm">
                            Assigned to: {complaint.assigned_to}
                          </div>
                        </div>
                      </TimelineItem>
                    )}

                    {complaint.resolution_date && (
                      <TimelineItem title="Complaint Resolved">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(complaint.resolution_date)}
                          </div>
                        </div>
                      </TimelineItem>
                    )}
                  </Timeline>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Customer Name</h4>
                      <p>{complaint.customer_name || 'Not provided'}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                      <p>{complaint.customer_contact || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {complaint.status === 'new' && (
                      <Button
                        onClick={() => handleStatusChange('in-progress')}
                        className="w-full justify-start"
                        disabled={loading}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Start Investigation
                      </Button>
                    )}
                    {complaint.status === 'in-progress' && (
                      <Button
                        onClick={() => handleStatusChange('resolved')}
                        className="w-full justify-start"
                        disabled={loading}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Resolved
                      </Button>
                    )}
                    {complaint.status === 'resolved' && (
                      <Button
                        onClick={() => handleStatusChange('closed')}
                        className="w-full justify-start"
                        disabled={loading}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Close Complaint
                      </Button>
                    )}
                    {complaint.status !== 'new' && complaint.status !== 'reopened' && (
                      <Button
                        onClick={() => handleStatusChange('reopened')}
                        variant="outline"
                        className="w-full justify-start"
                        disabled={loading}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Reopen Complaint
                      </Button>
                    )}
                    {!complaint.capa_required && complaint.status !== 'new' && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={loading}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create CAPA
                      </Button>
                    )}
                    {complaint.capa_id && (
                      <Button
                        variant="secondary"
                        className="w-full justify-start"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View CAPA
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resolution">
          {/* Resolution tab content */}
        </TabsContent>

        <TabsContent value="history">
          {/* History tab content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplaintDetails;
