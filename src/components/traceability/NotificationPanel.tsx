
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { TraceabilityNotification, NotificationStatus } from '@/types/traceability';
import { toast } from 'sonner';

interface NotificationPanelProps {
  onSendNotification: (notificationData: Omit<TraceabilityNotification, 'id' | 'created_at' | 'sent_at' | 'status'>) => Promise<TraceabilityNotification | null>;
  notifications: TraceabilityNotification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  onSendNotification,
  notifications
}) => {
  const [isSending, setIsSending] = useState(false);
  const [recipientType, setRecipientType] = useState('supplier');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendNotification = async () => {
    if (!recipientEmail.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    try {
      const notificationData = {
        recall_id: undefined,
        subject,
        message,
        recipient_type: recipientType,
        recipient_email: recipientEmail,
        created_by: 'current_user'
      };

      const result = await onSendNotification(notificationData);
      if (result) {
        toast.success('Notification sent successfully');
        setRecipientEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: NotificationStatus | undefined) => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-800';
      case 'Delivered':
        return 'bg-blue-100 text-blue-800';
      case 'Read':
        return 'bg-purple-100 text-purple-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: NotificationStatus | undefined) => {
    switch (status) {
      case 'Sent':
      case 'Delivered':
      case 'Read':
        return <CheckCircle className="h-4 w-4" />;
      case 'Failed':
        return <AlertCircle className="h-4 w-4" />;
      case 'Pending':
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipient-type">Recipient Type</Label>
              <Select value={recipientType} onValueChange={setRecipientType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="retailer">Retailer</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="regulatory">Regulatory Authority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <Input
                id="recipient-email"
                type="email"
                placeholder="recipient@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Notification subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your notification message..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSendNotification} 
            disabled={isSending}
            className="w-full"
          >
            {isSending ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Notification
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No notifications sent yet</p>
              <p className="text-sm">Send your first notification to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{notification.subject}</h4>
                      <p className="text-sm text-gray-600">To: {notification.recipient_email}</p>
                    </div>
                    <Badge className={getStatusColor(notification.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(notification.status)}
                        {notification.status || 'Pending'}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{notification.message}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Sent: {new Date(notification.created_at || '').toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;
