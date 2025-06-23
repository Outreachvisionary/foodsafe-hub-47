
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTraining } from '@/hooks/useTraining';

interface CreateTrainingSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTrainingSessionDialog: React.FC<CreateTrainingSessionDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { createTrainingSession } = useTraining();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    training_type: 'Mandatory',
    content: '',
    duration_minutes: 60,
    pass_threshold: 80,
    due_date: '',
    is_recurring: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.training_type || !formData.due_date) {
      return;
    }

    setLoading(true);
    try {
      await createTrainingSession({
        ...formData,
        created_by: 'current_user', // TODO: Get from auth context
        status: 'Active'
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        training_type: 'Mandatory',
        content: '',
        duration_minutes: 60,
        pass_threshold: 80,
        due_date: '',
        is_recurring: false
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating training session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Training Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Training session title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Training session description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="training_type">Training Type *</Label>
            <Select 
              value={formData.training_type} 
              onValueChange={(value) => setFormData({ ...formData, training_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select training type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mandatory">Mandatory</SelectItem>
                <SelectItem value="Optional">Optional</SelectItem>
                <SelectItem value="Refresher">Refresher</SelectItem>
                <SelectItem value="New Hire">New Hire</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass_threshold">Pass Threshold (%)</Label>
              <Input
                id="pass_threshold"
                type="number"
                value={formData.pass_threshold}
                onChange={(e) => setFormData({ ...formData, pass_threshold: parseInt(e.target.value) })}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date *</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Training Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Training materials, instructions, or content"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_recurring"
              checked={formData.is_recurring}
              onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
            />
            <Label htmlFor="is_recurring">Recurring Training</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Training Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrainingSessionDialog;
