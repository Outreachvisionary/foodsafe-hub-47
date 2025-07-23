
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Complaint, ComplaintStatus, ComplaintCategory } from '@/types/complaint';
import { useComplaints } from '@/hooks/useComplaints';

interface ComplaintEditDialogProps {
  complaint: Complaint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ComplaintEditDialog: React.FC<ComplaintEditDialogProps> = ({
  complaint,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { updateComplaint, isUpdating } = useComplaints();
  const [formData, setFormData] = useState({
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    status: complaint.status,
    customer_name: complaint.customer_name || '',
    customer_contact: complaint.customer_contact || '',
    product_involved: complaint.product_involved || '',
    lot_number: complaint.lot_number || '',
    assigned_to: complaint.assigned_to || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateComplaint({
      id: complaint.id,
      updates: formData
    });
    onSuccess();
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Complaint</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ComplaintCategory.Product_Quality}>Product Quality</SelectItem>
                  <SelectItem value={ComplaintCategory.Food_Safety}>Food Safety</SelectItem>
                  <SelectItem value={ComplaintCategory.Packaging}>Packaging</SelectItem>
                  <SelectItem value={ComplaintCategory.Foreign_Material}>Foreign Material</SelectItem>
                  <SelectItem value={ComplaintCategory.Labeling}>Labeling</SelectItem>
                  <SelectItem value={ComplaintCategory.Other}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ComplaintStatus.New}>New</SelectItem>
                  <SelectItem value={ComplaintStatus.Under_Investigation}>Under Investigation</SelectItem>
                  <SelectItem value={ComplaintStatus.Resolved}>Resolved</SelectItem>
                  <SelectItem value={ComplaintStatus.Closed}>Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input
                id="assigned_to"
                value={formData.assigned_to}
                onChange={(e) => handleInputChange('assigned_to', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_contact">Customer Contact</Label>
              <Input
                id="customer_contact"
                value={formData.customer_contact}
                onChange={(e) => handleInputChange('customer_contact', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_involved">Product Involved</Label>
              <Input
                id="product_involved"
                value={formData.product_involved}
                onChange={(e) => handleInputChange('product_involved', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot_number">Lot Number</Label>
              <Input
                id="lot_number"
                value={formData.lot_number}
                onChange={(e) => handleInputChange('lot_number', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Complaint'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintEditDialog;
