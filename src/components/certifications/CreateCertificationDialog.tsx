
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCertifications } from '@/hooks/useCertifications';
import { useAuth } from '@/contexts/AuthContext';

interface CreateCertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCertificationDialog: React.FC<CreateCertificationDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const { createCertification } = useCertifications();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    issuing_body: '',
    validity_period_months: 12,
    required_score: '',
    category: 'General',
    is_required: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createCertification({
      ...formData,
      required_score: formData.required_score ? Number(formData.required_score) : undefined,
      created_by: user?.email || 'system'
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      issuing_body: '',
      validity_period_months: 12,
      required_score: '',
      category: 'General',
      is_required: false
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Certification</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Certification Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issuing_body">Issuing Body *</Label>
              <Input
                id="issuing_body"
                value={formData.issuing_body}
                onChange={(e) => setFormData({ ...formData, issuing_body: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Quality">Quality</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validity_period">Validity Period (months)</Label>
              <Input
                id="validity_period"
                type="number"
                value={formData.validity_period_months}
                onChange={(e) => setFormData({ ...formData, validity_period_months: Number(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="required_score">Required Score (%)</Label>
              <Input
                id="required_score"
                type="number"
                value={formData.required_score}
                onChange={(e) => setFormData({ ...formData, required_score: e.target.value })}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_required"
              checked={formData.is_required}
              onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
            />
            <Label htmlFor="is_required">Required Certification</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Certification</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCertificationDialog;
