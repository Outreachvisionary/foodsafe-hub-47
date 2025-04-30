
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileCheck, FileLock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentService } from '@/hooks/useDocumentService';

interface DocumentCheckoutActionsProps {
  documentId: string;
  userId: string;
  isCheckedOut: boolean;
  checkedOutBy?: string;
  onCheckoutStatusChange: () => void;
}

const DocumentCheckoutActions: React.FC<DocumentCheckoutActionsProps> = ({
  documentId,
  userId,
  isCheckedOut,
  checkedOutBy,
  onCheckoutStatusChange,
}) => {
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkinDialogOpen, setCheckinDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const documentService = useDocumentService();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      await documentService.checkoutDocument(documentId, userId, 'User Name'); // Adding a placeholder user name
      toast({
        title: 'Document Checked Out',
        description: 'You now have exclusive editing access to this document.',
      });
      onCheckoutStatusChange();
      setCheckoutDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Checkout Failed',
        description: 'Could not check out the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    try {
      setLoading(true);
      await documentService.checkinDocument(documentId, userId, 'User Name', comment); // Adding a placeholder user name
      toast({
        title: 'Document Checked In',
        description: 'Your changes have been saved and the document is now available for others.',
      });
      onCheckoutStatusChange();
      setCheckinDialogOpen(false);
      setComment('');
    } catch (error) {
      toast({
        title: 'Check-in Failed',
        description: 'Could not check in the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Cannot check out if the document is already checked out by someone else
  const canCheckout = !isCheckedOut || checkedOutBy === userId;

  return (
    <div>
      {!isCheckedOut ? (
        <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <FileLock className="h-4 w-4 mr-2" />
              Check Out
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check Out Document</DialogTitle>
              <DialogDescription>
                Checking out this document will give you exclusive editing rights. Others will be able to view but not modify it until you check it back in.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCheckoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCheckout} disabled={loading}>
                Check Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : checkedOutBy === userId ? (
        <Dialog open={checkinDialogOpen} onOpenChange={setCheckinDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <FileCheck className="h-4 w-4 mr-2" />
              Check In
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check In Document</DialogTitle>
              <DialogDescription>
                Add any comments about the changes you made before checking in the document.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Describe your changes (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setCheckinDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCheckin} disabled={loading}>
                Check In
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button variant="outline" size="sm" disabled className="flex items-center">
          <FileLock className="h-4 w-4 mr-2" />
          Checked Out
        </Button>
      )}
    </div>
  );
};

export default DocumentCheckoutActions;
