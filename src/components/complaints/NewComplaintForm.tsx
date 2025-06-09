
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComplaintCategory } from '@/types/complaint';
import { CreateComplaintRequest } from '@/types/complaint';

interface NewComplaintFormProps {
  onSubmit: (data: CreateComplaintRequest) => void;
  onCancel: () => void;
}

const NewComplaintForm: React.FC<NewComplaintFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ComplaintCategory.Product_Quality,
    customer_name: '',
    customer_contact: '',
    product_involved: '',
    lot_number: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      created_by: 'current-user' // TODO: Get from auth context
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Complaint</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter complaint title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter detailed description of the complaint"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: ComplaintCategory) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ComplaintCategory.Product_Quality}>Product Quality</SelectItem>
                <SelectItem value={ComplaintCategory.Food_Safety}>Food Safety</SelectItem>
                <SelectItem value={ComplaintCategory.Service}>Service</SelectItem>
                <SelectItem value={ComplaintCategory.Delivery}>Delivery</SelectItem>
                <SelectItem value={ComplaintCategory.Packaging}>Packaging</SelectItem>
                <SelectItem value={ComplaintCategory.Labeling}>Labeling</SelectItem>
                <SelectItem value={ComplaintCategory.Other}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_contact">Customer Contact</Label>
              <Input
                id="customer_contact"
                value={formData.customer_contact}
                onChange={(e) => handleInputChange('customer_contact', e.target.value)}
                placeholder="Enter phone or email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_involved">Product Involved</Label>
              <Input
                id="product_involved"
                value={formData.product_involved}
                onChange={(e) => handleInputChange('product_involved', e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot_number">Lot Number</Label>
              <Input
                id="lot_number"
                value={formData.lot_number}
                onChange={(e) => handleInputChange('lot_number', e.target.value)}
                placeholder="Enter lot number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Create Complaint
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewComplaintForm;
