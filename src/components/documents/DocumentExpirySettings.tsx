
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { Document } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { documentWorkflowService, defaultExpiryNotificationDays } from '@/services/documentWorkflowService';

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
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    document.expiryDate ? new Date(document.expiryDate) : undefined
  );
  const [notificationDays, setNotificationDays] = useState<number[]>(
    document.customNotificationDays || defaultExpiryNotificationDays
  );
  const [newNotificationDay, setNewNotificationDay] = useState<string>('');

  const handleAddNotificationDay = () => {
    const days = parseInt(newNotificationDay);
    if (isNaN(days) || days <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a positive number of days",
        variant: "destructive"
      });
      return;
    }

    if (notificationDays.includes(days)) {
      toast({
        title: "Duplicate entry",
        description: "This notification period already exists",
        variant: "destructive"
      });
      return;
    }

    setNotificationDays([...notificationDays, days].sort((a, b) => b - a));
    setNewNotificationDay('');
  };

  const handleRemoveNotificationDay = (day: number) => {
    setNotificationDays(notificationDays.filter(d => d !== day));
  };

  const handleSave = () => {
    if (!expiryDate) {
      toast({
        title: "Expiry date required",
        description: "Please set an expiry date for the document",
        variant: "destructive"
      });
      return;
    }

    const updatedDocument = {
      ...document,
      expiryDate: expiryDate.toISOString(),
      customNotificationDays: notificationDays,
      updatedAt: new Date().toISOString()
    };

    onUpdate(updatedDocument);
    toast({
      title: "Settings updated",
      description: "Document expiry settings have been updated successfully",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Document Expiry Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!expiryDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : "Select expiry date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Notification Periods (Days before expiry)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {notificationDays.map(day => (
                <Badge key={day} variant="secondary" className="flex items-center gap-1">
                  {day} days
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 text-muted-foreground"
                    onClick={() => handleRemoveNotificationDay(day)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Days before expiry"
                value={newNotificationDay}
                onChange={(e) => setNewNotificationDay(e.target.value)}
                type="number"
                min="1"
              />
              <Button onClick={handleAddNotificationDay} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Add custom notification periods for when to receive reminders before document expiry.
            </p>
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
