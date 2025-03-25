
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Document } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { CalendarRange, AlertCircle, Calendar, Bell, Trash } from 'lucide-react';

interface DocumentExpirySettingsProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (document: Document) => void;
}

const DocumentExpirySettings: React.FC<DocumentExpirySettingsProps> = ({
  document,
  open,
  onOpenChange,
  onUpdate
}) => {
  const { toast } = useToast();
  const [expiryDate, setExpiryDate] = useState<string>(
    document.expiry_date ? new Date(document.expiry_date).toISOString().split('T')[0] : ''
  );
  const [customNotifications, setCustomNotifications] = useState<boolean>(
    document.custom_notification_days ? document.custom_notification_days.length > 0 : false
  );
  const [notificationDays, setNotificationDays] = useState<number[]>(
    document.custom_notification_days || [30, 60, 90]
  );
  const [currentDay, setCurrentDay] = useState<number>(30);

  const handleSave = () => {
    // Validate expiry date
    if (!expiryDate) {
      toast({
        title: "Expiry date required",
        description: "Please set an expiry date for the document",
        variant: "destructive"
      });
      return;
    }
    
    const updatedDoc = {
      ...document,
      expiry_date: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      custom_notification_days: customNotifications ? notificationDays : [],
      updated_at: new Date().toISOString()
    };

    onUpdate(updatedDoc);
    
    toast({
      title: "Expiry settings saved",
      description: "Document expiry settings have been updated successfully",
    });
  };

  const handleRemoveNotification = (day: number) => {
    setNotificationDays(notificationDays.filter(d => d !== day));
  };

  const handleAddNotification = () => {
    if (!notificationDays.includes(currentDay)) {
      setNotificationDays([...notificationDays, currentDay].sort((a, b) => a - b));
    }
  };

  // Calculate days until expiry
  const calculateDaysUntilExpiry = () => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    const millisecondsDiff = expiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(millisecondsDiff / (1000 * 60 * 60 * 24));
    
    return daysDiff;
  };

  const daysUntilExpiry = calculateDaysUntilExpiry();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5" />
            Document Expiry Settings
          </DialogTitle>
          <DialogDescription>
            Set expiry date and configure notification reminders
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="document-title">Document</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              <p className="font-medium">{document.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                {document.file_name} • Version {document.version}
              </p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                className="flex-shrink-0"
                onClick={() => {
                  // Set to 1 year from today
                  const date = new Date();
                  date.setFullYear(date.getFullYear() + 1);
                  setExpiryDate(date.toISOString().split('T')[0]);
                }}
              >
                + 1 Year
              </Button>
            </div>
            
            {daysUntilExpiry !== null && (
              <div className={`flex items-center gap-2 text-sm mt-1 ${
                daysUntilExpiry < 0 ? 'text-red-600' : 
                daysUntilExpiry < 30 ? 'text-amber-600' : 
                'text-green-600'
              }`}>
                {daysUntilExpiry < 0 ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>Expired {Math.abs(daysUntilExpiry)} days ago</span>
                  </>
                ) : daysUntilExpiry === 0 ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>Expires today</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    <span>Expires in {daysUntilExpiry} days</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom-notifications"
                checked={customNotifications}
                onCheckedChange={(checked) => setCustomNotifications(!!checked)}
              />
              <Label htmlFor="custom-notifications" className="cursor-pointer">
                Enable custom notification schedule
              </Label>
            </div>
            
            {customNotifications && (
              <div className="space-y-4 border-l-2 pl-4 border-gray-200">
                <div className="space-y-2">
                  <Label>Current Notifications</Label>
                  <div className="flex flex-wrap gap-2">
                    {notificationDays.length > 0 ? (
                      notificationDays.map(day => (
                        <div key={day} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <Bell className="h-3 w-3 mr-1" />
                          <span className="text-sm">{day} days</span>
                          <button
                            onClick={() => handleRemoveNotification(day)}
                            className="ml-2 text-blue-400 hover:text-blue-700"
                          >
                            <Trash className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No custom notifications configured</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Add notification reminder</Label>
                      <span className="text-sm font-medium">{currentDay} days before expiry</span>
                    </div>
                    <Slider
                      value={[currentDay]}
                      min={1}
                      max={180}
                      step={1}
                      onValueChange={(value) => setCurrentDay(value[0])}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddNotification}
                    disabled={notificationDays.includes(currentDay)}
                    className="w-full"
                  >
                    Add {currentDay}-day Reminder
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentExpirySettings;
