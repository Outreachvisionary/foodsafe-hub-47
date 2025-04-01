
import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentNotification } from '@/types/document';
import { useDocuments } from '@/contexts/DocumentContext';
import { format, formatDistanceToNow } from 'date-fns';

interface DocumentNotificationCenterProps {
  notifications: DocumentNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const DocumentNotificationCenter: React.FC<DocumentNotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll
}) => {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const { documents } = useDocuments();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval_request':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'approval_overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'expiry_reminder':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approval_complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'approval_rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getFormattedTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  const handleClickNotification = (notification: DocumentNotification) => {
    // Mark as read
    onMarkAsRead(notification.id);
    
    // Find the document this notification is about
    const document = documents.find(doc => doc.id === notification.documentId);
    
    // We could navigate to the document details or perform other actions
    if (document) {
      console.log('Navigating to document:', document);
      // Navigation logic would go here
    }
    
    // Close popover
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 cursor-pointer hover:bg-muted/50 ${!notification.isRead ? 'bg-muted/30' : ''}`}
                  onClick={() => handleClickNotification(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{notification.documentTitle}</div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {getFormattedTimestamp(notification.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">No notifications</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default DocumentNotificationCenter;
