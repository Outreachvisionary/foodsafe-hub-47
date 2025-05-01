
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckoutStatus } from '@/types/enums';
import { UserSquare, CheckSquare } from 'lucide-react';

export interface DocumentCheckoutActionsProps {
  status: CheckoutStatus; 
  checkedOutBy: string | null;
  isCurrentUser: boolean;
  onCheckout: () => void;
  onCheckin: () => void;
}

const DocumentCheckoutActions: React.FC<DocumentCheckoutActionsProps> = ({
  status,
  checkedOutBy,
  isCurrentUser,
  onCheckout,
  onCheckin,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {status === CheckoutStatus.Available ? (
        <Button onClick={onCheckout} className="w-full">
          <UserSquare className="h-4 w-4 mr-2" />
          Check Out
        </Button>
      ) : isCurrentUser ? (
        <Button onClick={onCheckin} className="w-full">
          <CheckSquare className="h-4 w-4 mr-2" />
          Check In
        </Button>
      ) : (
        <Button disabled className="w-full">
          <UserSquare className="h-4 w-4 mr-2" />
          Checked Out by {checkedOutBy || "Someone Else"}
        </Button>
      )}
    </div>
  );
};

export default DocumentCheckoutActions;
