
import React from 'react';
import { Document } from '@/types/document';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, CheckCircle, XCircle, MessageSquare, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowDocumentCardProps {
  document: Document;
  showApprovalButtons?: boolean;
  showExpiryActions?: boolean;
  isPersonal?: boolean;
}

export const WorkflowDocumentCard: React.FC<WorkflowDocumentCardProps> = ({
  document,
  showApprovalButtons = false,
  showExpiryActions = false,
  isPersonal = false
}) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const { toast } = useToast();

  // Calculate time since pending
  const pendingSince = document.pending_since 
    ? formatDistanceToNow(new Date(document.pending_since))
    : 'unknown time';

  // Calculate days until expiry
  const getExpiryInfo = () => {
    if (!document.expiry_date) return null;
    
    const expiryDate = new Date(document.expiry_date);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      formattedDate: format(expiryDate, 'PPP'),
      daysRemaining: diffDays,
      isExpiringSoon: diffDays <= 30 && diffDays > 0,
      isExpired: diffDays <= 0
    };
  };

  const expiryInfo = document.expiry_date ? getExpiryInfo() : null;

  const handleApprove = () => {
    toast({
      title: "Document Approved",
      description: `You have approved "${document.title}"`,
    });
    setIsApproveDialogOpen(false);
    setApproveComment('');
  };

  const handleReject = () => {
    toast({
      title: "Document Rejected",
      description: `You have rejected "${document.title}"`,
    });
    setIsRejectDialogOpen(false);
    setRejectReason('');
  };

  const handleRenew = () => {
    toast({
      title: "Document Renewal Initiated",
      description: `Renewal process started for "${document.title}"`,
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="flex items-start">
              <FileText className="h-5 w-5 mr-2 mt-1 text-primary" />
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h4 className="font-medium">
                    {document.title}
                  </h4>
                  {document.status === 'Pending Approval' && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Pending Approval
                    </Badge>
                  )}
                  {expiryInfo?.isExpiringSoon && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Expiring Soon
                    </Badge>
                  )}
                  {expiryInfo?.isExpired && (
                    <Badge variant="destructive">
                      Expired
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {document.description || 'No description available'}
                </p>
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              {document.pending_since && (
                <div className="flex items-center text-sm">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Pending for: </span>
                  <span className="ml-1">{pendingSince}</span>
                </div>
              )}
              
              {expiryInfo && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Expires: </span>
                  <span className="ml-1">{expiryInfo.formattedDate}</span>
                  <span className={`ml-2 ${
                    expiryInfo.isExpired ? 'text-red-500' :
                    expiryInfo.isExpiringSoon ? 'text-amber-500' : ''
                  }`}>
                    {expiryInfo.isExpired 
                      ? '(Expired)' 
                      : `(${expiryInfo.daysRemaining} days remaining)`
                    }
                  </span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline">
                  v{document.version}
                </Badge>
                <Badge variant="outline">
                  {document.category}
                </Badge>
                {document.tags && document.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col gap-2 justify-end">
            {showApprovalButtons && (
              <>
                <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Document</DialogTitle>
                      <DialogDescription>
                        You are approving "{document.title}". Add your comments below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        value={approveComment}
                        onChange={(e) => setApproveComment(e.target.value)}
                        placeholder="Optional approval comments"
                        className="min-h-[100px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                        Approve Document
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Document</DialogTitle>
                      <DialogDescription>
                        You are rejecting "{document.title}". Please provide a reason.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection (required)"
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleReject} 
                        variant="destructive"
                        disabled={!rejectReason.trim()}
                      >
                        Reject Document
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  Comment
                </Button>
              </>
            )}
            
            {showExpiryActions && (
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleRenew}
              >
                <Calendar className="h-4 w-4" />
                Renew
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
