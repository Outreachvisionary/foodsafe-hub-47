import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { NonConformance } from '@/types/non-conformance';
import { useNonConformances } from '@/hooks/useNonConformances';
import { toast } from 'sonner';

const ncEditSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  item_name: z.string().min(1, 'Item name is required'),
  item_category: z.string().min(1, 'Item category is required'),
  reason_category: z.string().min(1, 'Reason category is required'),
  reason_details: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().optional(),
  risk_level: z.string().optional(),
  assigned_to: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  quantity: z.number().optional(),
  quantity_on_hold: z.number().optional(),
  units: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type NCEditFormData = z.infer<typeof ncEditSchema>;

interface NCEditFormProps {
  nonConformance: NonConformance;
  onSave: () => void;
  onCancel: () => void;
}

const NCEditForm: React.FC<NCEditFormProps> = ({ nonConformance, onSave, onCancel }) => {
  const { updateNonConformance, isUpdating } = useNonConformances();

  const form = useForm<NCEditFormData>({
    resolver: zodResolver(ncEditSchema),
    defaultValues: {
      title: nonConformance.title || '',
      description: nonConformance.description || '',
      item_name: nonConformance.item_name || '',
      item_category: nonConformance.item_category || '',
      reason_category: nonConformance.reason_category || '',
      reason_details: nonConformance.reason_details || '',
      status: nonConformance.status || '',
      priority: nonConformance.priority || '',
      risk_level: nonConformance.risk_level || '',
      assigned_to: nonConformance.assigned_to || '',
      department: nonConformance.department || '',
      location: nonConformance.location || '',
      quantity: nonConformance.quantity || undefined,
      quantity_on_hold: nonConformance.quantity_on_hold || undefined,
      units: nonConformance.units || '',
      tags: nonConformance.tags || [],
    },
  });

  const itemCategories = [
    'Processing Equipment',
    'Product Storage Tanks', 
    'Finished Products',
    'Raw Products',
    'Packaging Materials',
    'Other'
  ];

  const reasonCategories = [
    'Contamination',
    'Quality Issues',
    'Regulatory Non-Compliance',
    'Equipment Malfunction',
    'Documentation Error',
    'Process Deviation',
    'Other'
  ];

  const statusOptions = [
    'On Hold',
    'Under Investigation',
    'Under Review',
    'Approved for Use',
    'Released',
    'Disposed',
    'Resolved',
    'Closed'
  ];

  const priorityOptions = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ];

  const riskLevels = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ];

  const onSubmit = async (data: NCEditFormData) => {
    try {
      await updateNonConformance({ 
        id: nonConformance.id!, 
        updates: {
          ...data,
          updated_at: new Date().toISOString()
        }
      });
      toast.success('Non-conformance updated successfully');
      onSave();
    } catch (error) {
      console.error('Error updating non-conformance:', error);
      toast.error('Failed to update non-conformance');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Non-Conformance</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the non-conformance"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="risk_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {riskLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Item & Issue Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Item & Issue Details</h3>
                
                <FormField
                  control={form.control}
                  name="item_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="item_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {itemCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reasonCategories.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide detailed explanation"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Enter quantity"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity_on_hold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity on Hold</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Enter quantity on hold"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="assigned_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter assignee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="units"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter units (e.g., kg, pieces, liters)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NCEditForm;