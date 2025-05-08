
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { updateNonConformance } from '@/services/nonConformanceService';
import { NonConformance } from '@/types/non-conformance';
import { z } from 'zod';
import { validateAndToast, ValidationSchemas } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the validation schema for NonConformance details
const ncDetailsSchema = z.object({
  title: ValidationSchemas.required.min(3, "Title must be at least 3 characters"),
  item_name: ValidationSchemas.required,
  item_category: ValidationSchemas.required,
  reason_category: ValidationSchemas.required,
  priority: ValidationSchemas.required,
  risk_level: z.string().optional(),
  description: z.string().optional(),
  reason_details: z.string().optional(),
  resolution_details: z.string().optional(),
  quantity: ValidationSchemas.positiveNumber.optional(),
  quantity_on_hold: ValidationSchemas.positiveNumber.optional(),
  units: z.string().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
  assigned_to: z.string().optional(),
});

type NCDetailsFormValues = z.infer<typeof ncDetailsSchema>;

interface NCDetailsFormProps {
  data: NonConformance;
  onSave: (updatedData: Partial<NonConformance>) => void;
}

const NCDetailsForm: React.FC<NCDetailsFormProps> = ({ data, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<NCDetailsFormValues>({
    resolver: zodResolver(ncDetailsSchema),
    defaultValues: {
      title: data.title || '',
      item_name: data.item_name || '',
      item_category: data.item_category as string || '',
      reason_category: data.reason_category as string || '',
      priority: data.priority || '',
      risk_level: data.risk_level as string || '',
      description: data.description || '',
      reason_details: data.reason_details || '',
      resolution_details: data.resolution_details || '',
      quantity: data.quantity || undefined,
      quantity_on_hold: data.quantity_on_hold || undefined,
      units: data.units || '',
      location: data.location || '',
      department: data.department || '',
      assigned_to: data.assigned_to || '',
    },
  });

  const handleSubmit = async (values: NCDetailsFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user ID - in a real app, this would come from auth context
      const userId = data.created_by || 'system';
      
      // Call the update service
      await updateNonConformance(data.id, values, userId);
      
      // Notify parent component
      onSave(values);
      
      toast.success('Non-conformance details updated successfully');
    } catch (error) {
      console.error('Error updating non-conformance:', error);
      toast.error('Failed to update non-conformance details');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Use string literals for item categories
  const itemCategories = [
    'Equipment',
    'Facility',
    'Finished Product',
    'Raw Material',
    'Packaging Materials',
    'Packaging',
    'Other'
  ];
  
  // Use string literals for reason categories
  const reasonCategories = [
    'Quality Issue',
    'Food Safety',
    'Damaged',
    'Process Deviation',
    'Foreign Material',
    'Expired',
    'Other'
  ];
  
  const priorities = ['Critical', 'High', 'Medium', 'Low'];
  const riskLevels = ['High', 'Moderate', 'Low'];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="item_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Item Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel required>Item Category</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Reason Category</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {reasonCategories.map(reason => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Priority</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map(priority => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="risk_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <FormControl>
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          {riskLevels.map(level => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Details & Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
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
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="units"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="reason_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="resolution_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolution Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NCDetailsForm;
