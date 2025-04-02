
import React from 'react';
import { Document } from '@/types/document';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, User, LockIcon, UnlockIcon } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface CheckoutStatusProps {
  document: Document;
  onCheckin?: () => void;
}

export const CheckoutStatus: React.FC<CheckoutStatusProps> = ({
  document,
  onCheckin
}) => {
  // Get checkout duration if available
  const checkoutDuration = document.checkout_timestamp 
    ? formatDistanceToNow(new Date(document.checkout_timestamp))
    : 'unknown duration';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="flex items-start">
              <FileText className="h-5 w-5 mr-2 mt-1 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">
                    {document.title}
                  </h4>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <LockIcon className="h-3 w-3" />
                    Checked Out
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {document.file_name}
                </p>
              </div>
            </div>
            
            <div className="mt-2 space-y-1">
              {document.checkout_user_id && (
                <div className="flex items-center text-sm">
                  <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span>
                    Checked out by <span className="font-medium">{document.checkout_user_id}</span>
                  </span>
                </div>
              )}
              
              {document.checkout_timestamp && (
                <div className="flex items-center text-sm">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span>
                    Checked out {checkoutDuration} ago
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    {`(${format(new Date(document.checkout_timestamp), 'PPp')})`}
                  </span>
                </div>
              )}
              
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="mr-2">
                  v{document.version}
                </Badge>
                <Badge variant="outline">
                  {document.category}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-center md:items-start">
            {onCheckin && (
              <Button 
                variant="outline" 
                onClick={onCheckin}
                className="flex items-center gap-1"
              >
                <UnlockIcon className="h-3.5 w-3.5" />
                Check In
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
