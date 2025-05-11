
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getNonConformanceById, createNonConformance, updateNonConformance } from '@/services/nonConformanceService';
import { NonConformance, NCStatus, NCItemCategory, NCReasonCategory } from '@/types/non-conformance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { validateAndToast } from '@/lib/validation';

interface NCFormProps {
  id?: string;
  onClose?: () => void;
}

const NCForm: React.FC<NCFormProps> = ({ id, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [nonConformance, setNonConformance] = useState<Partial<NonConformance>>({});
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<Partial<NonConformance>>();
  
  // Item categories
  const itemCategories: NCItemCategory[] = [
    'Equipment',
    'Facility',
    'Finished Product',
    'Raw Material',
    'Packaging Materials',
    'Packaging',
    'Other'
  ];
  
  // Reason categories
  const reasonCategories: NCReasonCategory[] = [
    'Quality Issue',
    'Food Safety',
    'Damaged',
    'Process Deviation',
    'Foreign Material',
    'Expired',
    'Other'
  ];
  
  // Status options
  const statusOptions: NCStatus[] = [
    NCStatus.OnHold,
    NCStatus.InProgress,
    NCStatus.UnderReview,
    NCStatus.Resolved,
    NCStatus.Closed,
    NCStatus.Released,
    NCStatus.Disposed,
    NCStatus.Approved
  ];
  
  // Load existing non-conformance if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      
      getNonConformanceById(id)
        .then((data) => {
          setNonConformance(data);
          
          // Set form values
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as any, value);
          });
        })
        .catch((error) => {
          console.error('Error loading non-conformance:', error);
          toast.error('Failed to load non-conformance details');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, setValue]);
  
  const onSubmit = async (data: Partial<NonConformance>) => {
    // Validate form data
    const formSchema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      item_name: z.string().min(1, "Item name is required"),
      item_category: z.string().min(1, "Item category is required"),
      reason_category: z.string().min(1, "Reason category is required")
    });
    
    const validation = validateAndToast(formSchema, data, { title: 'Validation Error' });
    if (!validation.success) return;
    
    try {
      setLoading(true);
      
      if (id) {
        // Update existing non-conformance
        await updateNonConformance(id, data);
        toast.success('Non-conformance updated successfully');
      } else {
        // Create new non-conformance
        await createNonConformance(data);
        toast.success('Non-conformance created successfully');
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
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title"
              {...register('title', { required: true })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              defaultValue={nonConformance.status || 'On Hold'} 
              onValueChange={(value) => setValue('status', value)}
            >
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
            <Label htmlFor="item_name">Item Name</Label>
            <Input
              id="item_name"
              placeholder="Enter item name"
              {...register('item_name', { required: true })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item_category">Item Category</Label>
            <Select 
              defaultValue={nonConformance.item_category} 
              onValueChange={(value) => setValue('item_category', value)}
            >
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
            <Label htmlFor="reason_category">Reason Category</Label>
            <Select 
              defaultValue={nonConformance.reason_category} 
              onValueChange={(value) => setValue('reason_category', value)}
            >
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
          
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the non-conformance"
              rows={4}
              {...register('description')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason_details">Reason Details</Label>
            <Textarea
              id="reason_details"
              placeholder="Provide detailed explanation"
              rows={3}
              {...register('reason_details')}
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
            <Label htmlFor="units">Units</Label>
            <Input
              id="units"
              placeholder="Enter units (kg, liters, etc.)"
              {...register('units')}
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
    </Card>
  );
};

export default NCForm;
