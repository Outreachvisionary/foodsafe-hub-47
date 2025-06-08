
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Complaint, UpdateComplaintRequest } from '@/types/complaint';
import { ComplaintStatus } from '@/types/enums';
import { formatEnumValue } from '@/utils/typeAdapters';
import { CalendarDays, User, Package, Hash } from 'lucide-react';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onUpdate: (updates: UpdateComplaintRequest) => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaint,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const [formData, setFormData] = useState({
    title: complaint.title,
    description: complaint.description,
    status: complaint.status,
    assigned_to: complaint.assigned_to || '',
    customer_name: complaint.customer_name || '',
    customer_contact: complaint.customer_contact || '',
    product_involved: complaint.product_involved || '',
    lot_number: complaint.lot_number || ''
  });

  useEffect(() => {
    setFormData({
      title: complaint.title,
      description: complaint.description,
      status: complaint.status,
      assigned_to: complaint.assigned_to || '',
      customer_name: complaint.customer_name || '',
      customer_contact: complaint.customer_contact || '',
      product_involved: complaint.product_involved || '',
      lot_number: complaint.lot_number || ''
    });
  }, [complaint]);

  const handleSave = () => {
    onUpdate({
      id: complaint.id,
      ...formData
    });
    onEditToggle();
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.New:
        return 'bg-blue-100 text-blue-800';
      case ComplaintStatus.Under_Investigation:
        return 'bg-yellow-100 text-yellow-800';
      case ComplaintStatus.Resolved:
        return 'bg-green-100 text-green-800';
      case ComplaintStatus.Closed:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Complaint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ComplaintStatus) => setFormData({ ...formData, status: value })}
              >
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
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                placeholder="Enter assignee name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_contact">Customer Contact</Label>
              <Input
                id="customer_contact"
                value={formData.customer_contact}
                onChange={(e) => setFormData({ ...formData, customer_contact: e.target.value })}
                placeholder="Enter contact information"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_involved">Product Involved</Label>
              <Input
                id="product_involved"
                value={formData.product_involved}
                onChange={(e) => setFormData({ ...formData, product_involved: e.target.value })}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot_number">Lot Number</Label>
              <Input
                id="lot_number"
                value={formData.lot_number}
                onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })}
                placeholder="Enter lot number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onEditToggle}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{complaint.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(complaint.status)}>
              {formatEnumValue(complaint.status)}
            </Badge>
            <Button variant="outline" size="sm" onClick={onEditToggle}>
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-600">{complaint.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                <span className="font-medium">Reported:</span> {new Date(complaint.reported_date).toLocaleDateString()}
              </span>
            </div>
            
            {complaint.assigned_to && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Assigned to:</span> {complaint.assigned_to}
                </span>
              </div>
            )}

            {complaint.customer_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Customer:</span> {complaint.customer_name}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {complaint.product_involved && (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Product:</span> {complaint.product_involved}
                </span>
              </div>
            )}

            {complaint.lot_number && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Lot Number:</span> {complaint.lot_number}
                </span>
              </div>
            )}

            {complaint.resolution_date && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Resolved:</span> {new Date(complaint.resolution_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Category: <span className="font-medium">{formatEnumValue(complaint.category)}</span></span>
            <span>Created by: <span className="font-medium">{complaint.created_by}</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintDetails;
