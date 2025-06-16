
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { NonConformance } from '@/types/non-conformance';
import { useNonConformances, useNonConformance } from '@/hooks/useNonConformances';

interface NCFormProps {
  id?: string;
  onClose?: () => void;
  onSave?: (nc: NonConformance) => void;
}

const NCForm: React.FC<NCFormProps> = ({ id, onClose, onSave }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { createNonConformance, updateNonConformance } = useNonConformances();
  const { data: existingNC } = useNonConformance(id || '');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<Partial<NonConformance>>();
  
  // Item categories
  const itemCategories = [
    'Processing Equipment',
    'Product Storage Tanks',
    'Finished Products',
    'Raw Products',
    'Packaging Materials',
    'Other'
  ];
  
  // Reason categories
  const reasonCategories = [
    'Contamination',
    'Quality Issues',
    'Regulatory Non-Compliance',
    'Equipment Malfunction',
    'Documentation Error',
    'Process Deviation',
    'Other'
  ];
  
  // Status options
  const statusOptions = [
    'On Hold',
    'Under Review',
    'Released',
    'Disposed'
  ];
  
  // Load existing data if editing
  useEffect(() => {
    if (existingNC) {
      reset(existingNC);
    }
  }, [existingNC, reset]);
  
  const onSubmit = async (data: Partial<NonConformance>) => {
    try {
      setLoading(true);
      
      if (id) {
        // Update existing non-conformance
        updateNonConformance({ id, updates: data });
      } else {
        // Create new non-conformance
        createNonConformance({
          ...data,
          created_by: 'Current User', // In real app, get from auth context
          status: data.status || 'On Hold'
        });
      }
      
      // Close the form
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving non-conformance:', error);
      toast.error('Failed to save non-conformance');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? 'Edit Non-Conformance' : 'Create New Non-Conformance'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter a title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item_name">Item Name *</Label>
              <Input
                id="item_name"
                placeholder="Enter item name"
                {...register('item_name', { required: 'Item name is required' })}
              />
              {errors.item_name && <p className="text-sm text-red-500">{errors.item_name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item_category">Item Category *</Label>
              <Select onValueChange={(value) => setValue('item_category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {itemCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason_category">Reason Category *</Label>
              <Select onValueChange={(value) => setValue('reason_category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasonCategories.map((reason) => (
                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input
                id="assigned_to"
                placeholder="Enter assignee"
                {...register('assigned_to')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                {...register('location')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                placeholder="Enter quantity"
                {...register('quantity', { valueAsNumber: true })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity_on_hold">Quantity On Hold</Label>
              <Input
                id="quantity_on_hold"
                type="number"
                min="0"
                placeholder="Enter quantity on hold"
                {...register('quantity_on_hold', { valueAsNumber: true })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Enter department"
                {...register('department')}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the non-conformance"
                rows={4}
                {...register('description')}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason_details">Reason Details</Label>
              <Textarea
                id="reason_details"
                placeholder="Provide detailed explanation"
                rows={3}
                {...register('reason_details')}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : id ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NCForm;
