
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, CheckSquare, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Document } from '@/types/document';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/UserContext';
import { checkoutDocument, checkinDocument } from '@/hooks/useDocumentService';
import { useToast } from '@/components/ui/use-toast';
import { CheckoutStatus } from '@/types/enums';
import { isCheckoutStatus } from '@/utils/typeAdapters';

interface DocumentCheckoutActionsProps {
  document: Document;
  onDocumentUpdate?: (updatedDoc: Document) => void;
  disabled?: boolean;
  compact?: boolean;
}

const DocumentCheckoutActions: React.FC<DocumentCheckoutActionsProps> = ({
  document,
  onDocumentUpdate,
  disabled = false,
  compact = false
}) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [showCheckinDialog, setShowCheckinDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkinComment, setCheckinComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to check out a document",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const updatedDoc = await checkoutDocument(document.id, user.id);
      if (onDocumentUpdate && updatedDoc) {
        onDocumentUpdate(updatedDoc);
      }
      toast({
        title: "Document Checked Out",
        description: "You can now edit this document"
      });
      setShowCheckoutDialog(false);
    } catch (error) {
      console.error("Error checking out document:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error checking out the document",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const updatedDoc = await checkinDocument(document.id, checkinComment);
      if (onDocumentUpdate && updatedDoc) {
        onDocumentUpdate(updatedDoc);
      }
      toast({
        title: "Document Checked In",
        description: "Document has been successfully checked in"
      });
      setCheckinComment('');
      setShowCheckinDialog(false);
    } catch (error) {
      console.error("Error checking in document:", error);
      toast({
        title: "Checkin Failed",
        description: "There was an error checking in the document",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isCheckedOut = isCheckoutStatus(document.checkout_status || CheckoutStatus.Available, CheckoutStatus.CheckedOut);
  
  const isCheckedOutByCurrentUser = isCheckedOut && 
    user && 
    document.checkout_user_id === user.id;

  if (compact) {
    if (isCheckedOutByCurrentUser) {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCheckinDialog(true)}
            disabled={disabled || loading}
            className="gap-1"
          >
            <CheckSquare className="h-4 w-4" />
            <span className="hidden md:inline">Check In</span>
          </Button>
          
          {showCheckinDialog && (
            <CheckInDialog 
              open={showCheckinDialog}
              onOpenChange={setShowCheckinDialog}
              comment={checkinComment}
              onCommentChange={setCheckinComment}
              onConfirm={handleCheckin}
              loading={loading}
            />
          )}
        </>
      );
    } else if (isCheckedOut) {
      return (
        <Button 
          variant="outline" 
          size="sm"
          disabled={true}
          className="gap-1 text-amber-600"
        >
          <Lock className="h-4 w-4" />
          <span className="hidden md:inline">Checked Out</span>
        </Button>
      );
    } else {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCheckoutDialog(true)}
            disabled={disabled || loading}
            className="gap-1"
          >
            <Unlock className="h-4 w-4" />
            <span className="hidden md:inline">Check Out</span>
          </Button>
          
          {showCheckoutDialog && (
            <CheckoutDialog 
              open={showCheckoutDialog}
              onOpenChange={setShowCheckoutDialog}
              onConfirm={handleCheckout}
              loading={loading}
            />
          )}
        </>
      );
    }
  }

  if (isCheckedOutByCurrentUser) {
    return (
      <>
        <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
          <CheckSquare className="h-4 w-4" />
          <span>You have checked out this document</span>
        </div>
        <Button 
          onClick={() => setShowCheckinDialog(true)}
          disabled={disabled || loading}
          className="w-full"
        >
          Check In Document
        </Button>
        
        {showCheckinDialog && (
          <CheckInDialog 
            open={showCheckinDialog}
            onOpenChange={setShowCheckinDialog}
            comment={checkinComment}
            onCommentChange={setCheckinComment}
            onConfirm={handleCheckin}
            loading={loading}
          />
        )}
      </>
    );
  } else if (isCheckedOut) {
    return (
      <div className="border rounded-md p-3 bg-amber-50">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Document is checked out</span>
        </div>
        <p className="text-sm mt-1">
          This document is currently checked out by {document.checkout_user_name || "another user"}.
        </p>
      </div>
    );
  } else {
    return (
      <>
        <Button 
          onClick={() => setShowCheckoutDialog(true)}
          disabled={disabled || loading}
          className="w-full"
        >
          Check Out Document
        </Button>
        
        {showCheckoutDialog && (
          <CheckoutDialog 
            open={showCheckoutDialog}
            onOpenChange={setShowCheckoutDialog}
            onConfirm={handleCheckout}
            loading={loading}
          />
        )}
      </>
    );
  }
};

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

const CheckInDialog: React.FC<CheckInDialogProps> = ({
  open,
  onOpenChange,
  comment,
  onCommentChange,
  onConfirm,
  loading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check In Document</DialogTitle>
          <DialogDescription>
            Check in this document to release it for others to edit.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm font-medium mb-1" htmlFor="checkin-comment">
            Check In Comment
          </label>
          <Textarea
            id="checkin-comment"
            placeholder="Describe the changes you made"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Checking In..." : "Check In"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  loading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check Out Document</DialogTitle>
          <DialogDescription>
            Checking out this document will prevent others from making changes until you check it back in.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Checking Out..." : "Check Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentCheckoutActions;
