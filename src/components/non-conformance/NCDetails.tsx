import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NonConformance, NCActivity, NCAttachment } from '@/types/non-conformance';
import { 
  fetchNonConformanceById, 
  fetchNCActivities, 
  fetchNCAttachments,
  update_nc_status,
  createNCActivity,
  linkNCToCapa
} from '@/services/nonConformanceService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Trash2, 
  FileText,
  User,
  Calendar,
  Tag,
  ListChecks,
  MessageSquare,
  Paperclip,
  Building,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import NCAttachmentUploader from './NCAttachmentUploader';
import NCActivityTimeline from './NCActivityTimeline';
import NCIntegrationsList from './NCIntegrationsList';

interface NCDetailsProps {
  id: string;
  onClose: () => void;
}

const NCDetails: React.FC<NCDetailsProps> = ({ id, onClose }) => {
  const [nonConformance, setNonConformance] = useState<NonConformance | null>(null);
  const [activities, setActivities] = useState<NCActivity[]>([]);
  const [attachments, setAttachments] = useState<NCAttachment[]>([]);
  const [statusComment, setStatusComment] = useState('');
  const [capaId, setCapaId] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [capaDialogOpen, setCapaDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<NonConformance['status'] | null>(null);
  const [activityComment, setActivityComment] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const ncData = await fetchNonConformanceById(id);
        setNonConformance(ncData);
        
        const activitiesData = await fetchNCActivities(id);
        setActivities(activitiesData);
        
        const attachmentsData = await fetchNCAttachments(id);
        setAttachments(attachmentsData);
      } catch (error) {
        console.error('Error loading non-conformance details:', error);
        toast({
          title: 'Failed to load details',
          description: 'There was an error loading the non-conformance details.',
          variant: 'destructive',
        });
        onClose(); // Navigate back on error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, onClose, toast]);

  const handleStatusChange = async () => {
    if (!nonConformance || !selectedStatus) return;
    
    try {
      const currentStatus = nonConformance.status;
      const updatedNC = await update_nc_status(
        id, 
        selectedStatus, 
        currentStatus,
        'current-user', // This should be the actual user ID in a real app
        statusComment
      );
      
      setNonConformance(updatedNC);
      
      // Refresh activities
      const activitiesData = await fetchNCActivities(id);
      setActivities(activitiesData);
      
      toast({
        title: 'Status updated',
        description: `Status changed from ${currentStatus} to ${selectedStatus}`,
      });
      
      setStatusDialogOpen(false);
      setStatusComment('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Failed to update status',
        description: 'There was an error updating the non-conformance status.',
        variant: 'destructive',
      });
    }
  };

  const handleAddActivity = async () => {
    if (!activityComment.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please enter a comment to add an activity.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await createNCActivity({
        non_conformance_id: id,
        action: 'Comment added',
        comments: activityComment,
        performed_by: 'current-user', // This should be the actual user ID in a real app
      });
      
      // Refresh activities
      const activitiesData = await fetchNCActivities(id);
      setActivities(activitiesData);
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been added to the activity log.',
      });
      
      setActivityComment('');
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: 'Failed to add comment',
        description: 'There was an error adding your comment.',
        variant: 'destructive',
      });
    }
  };

  const handleLinkCapa = async () => {
    if (!capaId.trim()) {
      toast({
        title: 'CAPA ID required',
        description: 'Please enter a CAPA ID to link.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await linkNCToCapa(id, capaId);
      
      // Refresh non-conformance data
      const ncData = await fetchNonConformanceById(id);
      setNonConformance(ncData);
      
      toast({
        title: 'CAPA linked',
        description: 'The CAPA has been linked to this non-conformance.',
      });
      
      setCapaDialogOpen(false);
      setCapaId('');
    } catch (error) {
      console.error('Error linking CAPA:', error);
      toast({
        title: 'Failed to link CAPA',
        description: 'There was an error linking the CAPA to this non-conformance.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: NonConformance['status']) => {
    switch (status) {
      case 'On Hold':
        return (
          <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1 text-sm px-3 py-1">
            <AlertTriangle className="h-4 w-4" />
            On Hold
          </Badge>
        );
      case 'Under Review':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 text-sm px-3 py-1">
            <Clock className="h-4 w-4" />
            Under Review
          </Badge>
        );
      case 'Released':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 text-sm px-3 py-1">
            <CheckCircle className="h-4 w-4" />
            Released
          </Badge>
        );
      case 'Disposed':
        return (
          <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1 text-sm px-3 py-1">
            <Trash2 className="h-4 w-4" />
            Disposed
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!nonConformance) {
    return (
      <div className="text-center p-10">
        <h3 className="text-lg font-medium">Item not found</h3>
        <p className="text-gray-500 mt-2">
          The non-conformance item you're looking for doesn't exist.
        </p>
        <Button onClick={onClose} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div className="flex items-center gap-2">
          {getStatusBadge(nonConformance.status)}
          <Button 
            variant="outline"
            onClick={() => navigate(`/non-conformance/edit/${id}`)}
          >
            Edit
          </Button>
          <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button>Change Status</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Non-Conformance Status</DialogTitle>
                <DialogDescription>
                  Update the status of this non-conformance item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  {(['On Hold', 'Under Review', 'Released', 'Disposed'] as NonConformance['status'][]).map((status) => (
                    <Button
                      key={status}
                      variant={selectedStatus === status ? 'default' : 'outline'}
                      className={selectedStatus === status ? '' : 'border-2'}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status === 'On Hold' && <AlertTriangle className="h-4 w-4 mr-2" />}
                      {status === 'Under Review' && <Clock className="h-4 w-4 mr-2" />}
                      {status === 'Released' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {status === 'Disposed' && <Trash2 className="h-4 w-4 mr-2" />}
                      {status}
                    </Button>
                  ))}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status-comments">Comments</Label>
                  <Textarea
                    id="status-comments"
                    placeholder="Add comments about this status change..."
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusChange} disabled={!selectedStatus}>
                  Update Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">{nonConformance.title}</CardTitle>
            <CardDescription>
              Reported on {new Date(nonConformance.reported_date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                Description
              </h3>
              <p className="mt-1 text-gray-700">
                {nonConformance.description || 'No description provided.'}
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  Item Name
                </h3>
                <p className="mt-1 text-gray-700">{nonConformance.item_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-gray-500" />
                  Item Category
                </h3>
                <p className="mt-1 text-gray-700">{nonConformance.item_category}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  Reason
                </h3>
                <p className="mt-1 text-gray-700">{nonConformance.reason_category}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  Reason Details
                </h3>
                <p className="mt-1 text-gray-700">
                  {nonConformance.reason_details || 'No details provided.'}
                </p>
              </div>
              
              {nonConformance.location && (
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Location
                  </h3>
                  <p className="mt-1 text-gray-700">{nonConformance.location}</p>
                </div>
              )}
              
              {nonConformance.department && (
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    Department
                  </h3>
                  <p className="mt-1 text-gray-700">{nonConformance.department}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Created By
                </h3>
                <p className="mt-1 text-gray-700">{nonConformance.created_by}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Reported Date
                </h3>
                <p className="mt-1 text-gray-700">
                  {new Date(nonConformance.reported_date).toLocaleDateString()}
                </p>
              </div>
              
              {nonConformance.assigned_to && (
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Assigned To
                  </h3>
                  <p className="mt-1 text-gray-700">{nonConformance.assigned_to}</p>
                </div>
              )}
              
              {nonConformance.review_date && (
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Review Date
                  </h3>
                  <p className="mt-1 text-gray-700">
                    {new Date(nonConformance.review_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {nonConformance.resolution_date && (
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Resolution Date
                  </h3>
                  <p className="mt-1 text-gray-700">
                    {new Date(nonConformance.resolution_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            {nonConformance.resolution_details && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Resolution Details
                  </h3>
                  <p className="mt-1 text-gray-700">{nonConformance.resolution_details}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => setStatusDialogOpen(true)}>
                Change Status
              </Button>
              
              <Dialog open={capaDialogOpen} onOpenChange={setCapaDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Link to CAPA
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Link to CAPA</DialogTitle>
                    <DialogDescription>
                      Link this non-conformance to a Corrective Action/Preventive Action.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="capa-id">CAPA ID</Label>
                      <Input
                        id="capa-id"
                        placeholder="Enter CAPA ID"
                        value={capaId}
                        onChange={(e) => setCapaId(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCapaDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleLinkCapa}>
                      Link CAPA
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full" onClick={() => navigate(`/non-conformance/edit/${id}`)}>
                Edit Details
              </Button>
            </CardContent>
          </Card>
          
          {nonConformance.capa_id && (
            <Card>
              <CardHeader>
                <CardTitle>Linked CAPA</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="link"
                  onClick={() => navigate(`/capa/${nonConformance.capa_id}`)}
                  className="p-0"
                >
                  View CAPA #{nonConformance.capa_id.slice(0, 8)}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities">Activity Log</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                View the history of activities for this non-conformance item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NCActivityTimeline activities={activities} />
              
              <div className="mt-6 space-y-2">
                <Label htmlFor="activity-comment">Add Comment</Label>
                <Textarea
                  id="activity-comment"
                  placeholder="Add a comment to the activity log..."
                  value={activityComment}
                  onChange={(e) => setActivityComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleAddActivity} className="mt-2">
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attachments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>
                Manage documents, images, and other files related to this non-conformance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NCAttachmentUploader 
                nonConformanceId={id} 
                onSuccess={() => {
                  // Refresh attachments list after upload
                  fetchNCAttachments(id).then(data => setAttachments(data));
                }} 
              />
              
              <div className="mt-6">
                {attachments.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-md">
                    <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No attachments yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload documents, images, or other files related to this non-conformance.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                          <div>
                            <p className="font-medium text-sm">{attachment.file_name}</p>
                            <p className="text-xs text-gray-500">
                              {Math.round(attachment.file_size / 1024)} KB · 
                              Uploaded by {attachment.uploaded_by} · 
                              {attachment.uploaded_at && new Date(attachment.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="mt-6">
          <NCIntegrationsList nonConformanceId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NCDetails;
