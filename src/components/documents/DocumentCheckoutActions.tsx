
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock } from 'lucide-react';
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
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    
    fetchUser();
  }, []);

  const handleCheckout = async () => {
    try {
      if (!currentUser) throw new Error('User not authenticated');

      await checkoutDocument(document.id, currentUser.id);
      toast({
        title: "Document Checked Out",
        description: "You can now edit this document",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Checkout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = async () => {
    try {
      if (!currentUser) throw new Error('User not authenticated');

      await checkinDocument(document.id, currentUser.id, checkInComment);
      setIsCheckInDialogOpen(false);
      setCheckInComment('');
      toast({
        title: "Document Checked In",
        description: "Document has been successfully checked in",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Check-in Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fix the checkout status comparison
  const isCheckedOut = document.checkout_status === 'Checked Out';
  const isCurrentUserCheckout = document.checkout_user_id === currentUser?.id;

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
