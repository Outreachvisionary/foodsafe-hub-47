
import React from 'react';
import { Document } from '@/types/document';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CheckoutStatusProps {
  document: Document;
  onCheckin: () => void;
}

export const CheckoutStatus: React.FC<CheckoutStatusProps> = ({ document, onCheckin }) => {
  const checkoutTime = document.checkout_timestamp ? 
    formatDistanceToNow(new Date(document.checkout_timestamp), { addSuffix: true }) : 
    'Unknown time';
  
  const isCurrentUserCheckout = document.checkout_user_id === 'current_user'; // In a real app, you'd compare with the actual user ID
  
  return (
    <Alert className={isCurrentUserCheckout ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}>
      <Lock className={`h-4 w-4 ${isCurrentUserCheckout ? "text-amber-500" : "text-red-500"}`} />
      <AlertTitle className={isCurrentUserCheckout ? "text-amber-800" : "text-red-800"}>
        Document is currently checked out
      </AlertTitle>
      <AlertDescription className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className={isCurrentUserCheckout ? "text-amber-700" : "text-red-700"}>
          {isCurrentUserCheckout ? 
            'You have checked out this document' :
            `This document is checked out by ${document.checkout_user_id}`
          }
          <div className="flex items-center mt-1 text-sm">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>Checked out {checkoutTime}</span>
          </div>
        </div>
        
        {isCurrentUserCheckout && (
          <Button variant="outline" size="sm" onClick={onCheckin} className="border-amber-300 hover:bg-amber-100">
            <Unlock className="h-3.5 w-3.5 mr-1.5" />
            Check In
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
