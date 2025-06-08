
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, User } from 'lucide-react';
import { CheckoutStatus } from '@/types/enums';

interface DocumentCheckoutActionsProps {
  status: CheckoutStatus;
  checkedOutBy?: string;
  isCurrentUser: boolean;
  onCheckout: () => void;
  onCheckin: () => void;
}

const DocumentCheckoutActions: React.FC<DocumentCheckoutActionsProps> = ({
  status,
  checkedOutBy,
  isCurrentUser,
  onCheckout,
  onCheckin
}) => {
  if (status === CheckoutStatus.Available) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onCheckout}
      >
        <Lock className="h-4 w-4 mr-2" />
        Check Out
      </Button>
    );
  }

  if (status === CheckoutStatus.CheckedOut) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <User className="h-3 w-3" />
          Checked out by {checkedOutBy}
        </Badge>
        {isCurrentUser && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCheckin}
          >
            <Unlock className="h-4 w-4 mr-2" />
            Check In
          </Button>
        )}
      </div>
    );
  }

  if (status === CheckoutStatus.Locked) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <Lock className="h-3 w-3" />
        Locked
      </Badge>
    );
  }

  return null;
};

export default DocumentCheckoutActions;
