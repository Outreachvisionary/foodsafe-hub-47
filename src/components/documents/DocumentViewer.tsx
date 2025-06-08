
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Download, AlertCircle, UserCog, Clock, Calendar, Tag, Eye, ArrowDownToLine, Edit, RotateCw } from 'lucide-react';
import { Document, DocumentVersion, DocumentActivity } from '@/types/document';
import { DocumentStatus, CheckoutStatus } from '@/types/enums';
import DocumentComments from './DocumentComments';
import DocumentCheckoutActions from './DocumentCheckoutActions';
import DocumentVersionHistory from './DocumentVersionHistory';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface DocumentViewerProps {
  document: Document;
  onCheckout?: (document: Document) => void;
  onCheckin?: (document: Document) => void;
  onVersionSelect?: (version: DocumentVersion) => void;
  onUpdateStatus?: (document: Document, status: DocumentStatus) => void;
  currentUserId: string;
  currentUserName: string;
  canEdit?: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onCheckout,
  onCheckin,
  onVersionSelect,
  onUpdateStatus,
  currentUserId,
  currentUserName,
  canEdit = false,
}) => {
  const { toast } = useToast();
  const [activeVersion, setActiveVersion] = useState<DocumentVersion | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [activities, setActivities] = useState<DocumentActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<DocumentStatus | null>(null);
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    // In a real application, would fetch all versions and initial active version
    const mockVersions: DocumentVersion[] = [
      {
        id: '1',
        document_id: document.id,
        version: 2,
        version_number: 2,
        version_type: "major",
        file_name: document.file_name,
        file_path: document.file_path || '',
        file_size: document.file_size,
        created_at: document.updated_at,
        created_by: document.created_by,
        change_summary: 'Updated with new regulatory requirements',
        is_binary_file: false
      },
      {
        id: '2',
        document_id: document.id,
        version: 1,
        version_number: 1,
        version_type: "major",
        file_name: document.file_name,
        file_path: document.file_path || '',
        file_size: document.file_size,
        created_at: document.created_at,
        created_by: document.created_by,
        change_summary: 'Initial version',
        is_binary_file: false
      }
    ];
    
    setVersions(mockVersions);
    setActiveVersion(mockVersions[0]);
    
    // Mock activities
    const mockActivities: DocumentActivity[] = [
      {
        id: '1',
        document_id: document.id,
        action: 'view',
        user_id: 'user1',
        user_name: 'John Doe',
        user_role: 'Manager',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        document_id: document.id,
        action: 'download',
        user_id: 'user2',
        user_name: 'Jane Smith',
        user_role: 'Quality Assurance',
        timestamp: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    
    setActivities(mockActivities);
  }, [document]);

  const handleDownload = () => {
    toast({
      title: 'Download started',
      description: `Downloading ${document.file_name}`,
    });
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout(document);
    }
  };

  const handleCheckin = () => {
    if (onCheckin) {
      onCheckin(document);
    }
  };

  const handleVersionSelect = (version: DocumentVersion) => {
    setActiveVersion(version);
    if (onVersionSelect) {
      onVersionSelect(version);
    }
  };

  const handleUpdateStatus = () => {
    if (newStatus && onUpdateStatus) {
      setLoading(true);
      
      // Simulating API call
      setTimeout(() => {
        onUpdateStatus(document, newStatus);
        
        toast({
          title: 'Status updated',
          description: `Document status changed to ${newStatus.toString().replace('_', ' ')}`,
        });
        
        setShowStatusDialog(false);
        setStatusNote('');
        setNewStatus(null);
        setLoading(false);
      }, 1000);
    }
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  const truncateDescription = (text: string | undefined, maxLength: number = 150): string => {
    if (!text) return 'No description available.';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getStatusColor = (status: DocumentStatus): string => {
    switch (status) {
      case DocumentStatus.Draft:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case DocumentStatus.PendingReview:
      case DocumentStatus.PendingApproval:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case DocumentStatus.Approved:
      case DocumentStatus.Published:
        return 'bg-green-100 text-green-800 border-green-200';
      case DocumentStatus.Rejected:
        return 'bg-red-100 text-red-800 border-red-200';
      case DocumentStatus.Archived:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case DocumentStatus.Expired:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Document Preview */}
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <CardTitle className="text-xl">{document.title}</CardTitle>
                <CardDescription className="mt-1">
                  {document.file_name} • Version {activeVersion?.version || document.version}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(document.status)} font-normal`}>
                {document.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-md p-4 min-h-[300px]">
              {/* This would be the actual document preview in a real app */}
              <div className="flex flex-col items-center justify-center h-full">
                <div className="p-6 border rounded bg-white mb-4 w-full text-center">
                  <p className="text-muted-foreground">Document Preview</p>
                  <p className="text-sm text-muted-foreground mt-2">This is a placeholder for document content.</p>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  {document.file_type === 'application/pdf' ? 
                    'PDF preview would appear here' : 
                    'Document preview would appear here'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {showFullDescription 
                  ? document.description || 'No description available.' 
                  : truncateDescription(document.description)}
                {document.description && document.description.length > 150 && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </Button>
                )}
              </p>
            </div>
            
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {document.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4 flex-wrap gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              {canEdit && (
                <DocumentCheckoutActions
                  status={document.checkout_status || CheckoutStatus.Available}
                  checkedOutBy={document.checkout_user_name}
                  isCurrentUser={document.checkout_user_id === currentUserId}
                  onCheckout={handleCheckout}
                  onCheckin={handleCheckin}
                />
              )}
            </div>
            
            {canEdit && onUpdateStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusDialog(true)}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Document Info */}
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Category</p>
                <p>{document.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">File Type</p>
                <p>{document.file_type || 'Unknown'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Created By</p>
                <div className="flex items-center gap-1">
                  <UserCog className="h-3.5 w-3.5 text-muted-foreground" />
                  <p>{document.created_by}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Created On</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <p>{formatDate(document.created_at)}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Last Updated</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <p>{formatDate(document.updated_at)}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">File Size</p>
                <p>{(document.file_size / 1024).toFixed(2)} KB</p>
              </div>
              {document.expiry_date && (
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground">Expires On</p>
                  <div className="flex items-center gap-1">
                    <AlertCircle className={`h-3.5 w-3.5 ${new Date(document.expiry_date) < new Date() ? 'text-red-500' : 'text-muted-foreground'}`} />
                    <p className={new Date(document.expiry_date) < new Date() ? 'text-red-500 font-medium' : ''}>
                      {formatDate(document.expiry_date)}
                      {new Date(document.expiry_date) < new Date() && ' (Expired)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">Recent Activity</h3>
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    {activity.action === 'view' ? (
                      <Eye className="h-3.5 w-3.5 text-blue-500" />
                    ) : activity.action === 'download' ? (
                      <ArrowDownToLine className="h-3.5 w-3.5 text-green-500" />
                    ) : activity.action === 'edit' ? (
                      <Edit className="h-3.5 w-3.5 text-amber-500" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-gray-500" />
                    )}
                    <span>
                      {activity.user_name} {activity.action}ed
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {activities.length > 3 && (
                <Button variant="link" size="sm" className="p-0 h-auto">
                  View all activities
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="comments">
        <TabsList>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
        </TabsList>
        <TabsContent value="comments">
          <DocumentComments 
            documentId={document.id} 
            currentUserId={currentUserId} 
            currentUserName={currentUserName}
          />
        </TabsContent>
        <TabsContent value="versions">
          <DocumentVersionHistory 
            versions={versions} 
            onVersionSelect={handleVersionSelect} 
            currentDocId={document.id} 
          />
        </TabsContent>
      </Tabs>
      
      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Document Status</DialogTitle>
            <DialogDescription>
              Change the status of this document to reflect its current stage in the workflow.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <div>
                <Badge className={`${getStatusColor(document.status)} font-normal`}>
                  {document.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <select
                id="status"
                className="w-full border border-gray-300 rounded-md p-2"
                value={newStatus || ''}
                onChange={(e) => setNewStatus(e.target.value as DocumentStatus)}
              >
                <option value="">Select status</option>
                {Object.values(DocumentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note">Status Note (Optional)</Label>
              <Input
                id="note"
                placeholder="Add a note about this status change"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus} 
              disabled={!newStatus || loading}
            >
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentViewer;
