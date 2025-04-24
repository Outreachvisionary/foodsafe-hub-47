
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, History } from 'lucide-react';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Document } from '@/types/document';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface DocumentCheckoutActionsProps {
  document: Document;
  onUpdate: () => void;
}

export const DocumentCheckoutActions: React.FC<DocumentCheckoutActionsProps> = ({ document, onUpdate }) => {
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = React.useState(false);
  const [checkInComment, setCheckInComment] = React.useState('');
  const { checkoutDocument, checkinDocument } = useDocumentService();
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await checkoutDocument(document.id, user.id);
      toast({
        title: "Document Checked Out",
        description: "You can now edit this document",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await checkinDocument(document.id, user.id, checkInComment);
      setIsCheckInDialogOpen(false);
      setCheckInComment('');
      toast({
        title: "Document Checked In",
        description: "Document has been successfully checked in",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Check-in Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isCheckedOut = document.checkout_status === 'Checked_Out';
  const { data: { user } } = await supabase.auth.getUser();
  const isCurrentUserCheckout = document.checkout_user_id === user?.id;

  return (
    <>
      {!isCheckedOut ? (
        <Button
          onClick={handleCheckout}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Lock className="h-4 w-4" />
          Check Out
        </Button>
      ) : (
        isCurrentUserCheckout && (
          <Button
            onClick={() => setIsCheckInDialogOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Unlock className="h-4 w-4" />
            Check In
          </Button>
        )
      )}

      <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Describe the changes you made..."
              value={checkInComment}
              onChange={(e) => setCheckInComment(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckInDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckIn}>
              Check In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
