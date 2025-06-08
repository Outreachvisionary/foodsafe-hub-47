
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, UserCheck } from 'lucide-react';
import { CheckoutStatus } from '@/types/enums';

interface DocumentCheckoutActionsProps {
  status: CheckoutStatus;
  checkedOutBy?: string;
  isCurrentUser?: boolean;
  onCheckout?: () => void;
  onCheckin?: () => void;
  disabled?: boolean;
}

const DocumentCheckoutActions: React.FC<DocumentCheckoutActionsProps> = ({
  status,
  checkedOutBy,
  isCurrentUser = false,
  onCheckout,
  onCheckin,
  disabled = false
}) => {
  const getStatusDisplay = () => {
    switch (status) {
      case CheckoutStatus.Available:
        return {
          text: 'Available',
          color: 'text-green-600',
          icon: <Unlock className="h-4 w-4" />
        };
      case CheckoutStatus.Checked_Out:
        return {
          text: isCurrentUser ? 'Checked out by you' : `Checked out by ${checkedOutBy}`,
          color: isCurrentUser ? 'text-blue-600' : 'text-red-600',
          icon: <Lock className="h-4 w-4" />
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-600',
          icon: <Lock className="h-4 w-4" />
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 text-sm ${statusDisplay.color}`}>
        {statusDisplay.icon}
        <span>{statusDisplay.text}</span>
      </div>
      
      {status === CheckoutStatus.Available && onCheckout && (
        <Button
          size="sm"
          variant="outline"
          onClick={onCheckout}
          disabled={disabled}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Check Out
        </Button>
      )}
      
      {status === CheckoutStatus.Checked_Out && isCurrentUser && onCheckin && (
        <Button
          size="sm"
          variant="outline"
          onClick={onCheckin}
          disabled={disabled}
        >
          <Unlock className="h-4 w-4 mr-2" />
          Check In
        </Button>
      )}
    </div>
  );
};

export default DocumentCheckoutActions;
