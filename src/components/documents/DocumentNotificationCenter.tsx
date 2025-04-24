
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertCircle, Clock, CalendarDays } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';

const DocumentNotificationCenter = () => {
  const { documents } = useDocument();
  
  // Calculate notifications based on documents
  const notifications = [
    {
      id: '1',
      title: 'Document Approval Requested',
      message: 'HACCP Plan v2.0 requires your approval',
      type: 'approval_request',
      date: new Date().toISOString(),
      isRead: false,
    },
    {
      id: '2',
      title: 'Document Expiring Soon',
      message: 'Supplier Certification #4532 expires in 14 days',
      type: 'expiration_warning',
      date: new Date().toISOString(),
      isRead: true,
    }
  ];
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval_request':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'expiration_warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'rejection':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Bell className="mr-2 h-5 w-5 text-primary" />
          Document Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer ${notification.isRead ? '' : 'bg-blue-50'}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${notification.isRead ? 'text-gray-700' : 'text-black'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(notification.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Bell className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p>No notifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentNotificationCenter;
