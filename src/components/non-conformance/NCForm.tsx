
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { NonConformance, NCItemCategory, NCReasonCategory, NCStatus } from '@/types/non-conformance';
import { 
  createNonConformance, 
  updateNonConformance, 
  fetchNonConformanceById 
} from '@/services/nonConformanceService';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface NCFormProps {
  id?: string; // If provided, we're editing an existing item
  isDialog?: boolean;
  onClose?: () => void;
  onSuccess?: (nc: NonConformance) => void;
}

const NCForm: React.FC<NCFormProps> = ({ id, isDialog, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<NonConformance>({
    defaultValues: {
      title: '',
      description: '',
      item_name: '',
      item_category: 'Other',
      reason_category: 'Other',
      reason_details: '',
      status: 'On Hold',
      created_by: 'current-user', // This should be the actual user ID in a real app
      reported_date: new Date().toISOString(),
      quantity: 0,
      quantity_on_hold: 0,
      units: ''
    }
  });

  useEffect(() => {
    const loadNonConformance = async () => {
      if (!id) {
        setInitialLoad(false);
        return;
      }

      try {
        setLoading(true);
        const ncData = await fetchNonConformanceById(id);
        
        // Reset form with loaded data
        form.reset(ncData);
      } catch (error) {
        console.error('Error loading non-conformance:', error);
        toast({
          title: 'Failed to load data',
          description: 'There was an error loading the non-conformance details.',
          variant: 'destructive',
        });
        
        // Navigate back on error
        if (!isDialog && onClose) {
          onClose();
        } else {
          navigate('/non-conformance');
        }
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadNonConformance();
  }, [id, form, navigate, onClose, isDialog, toast]);

  const onSubmit = async (data: NonConformance) => {
    try {
      setLoading(true);
      
      let result: NonConformance;
      
      if (id) {
        // Update existing non-conformance
        result = await updateNonConformance(id, {
          ...data,
          updated_at: new Date().toISOString()
        });
        
        toast({
          title: 'Updated successfully',
          description: 'The non-conformance has been updated successfully.'
        });
      } else {
        // Create new non-conformance
        // Ensure the description has a value even if empty
        const formattedData = {
          ...data,
          description: data.description || '',
          reported_date: new Date().toISOString()
        };
        
        result = await createNonConformance(formattedData);
        
        toast({
          title: 'Created successfully',
          description: 'The non-conformance has been created successfully.'
        });
      }
      
      if (onSuccess) {
        onSuccess(result);
      } else if (isDialog && onClose) {
        onClose();
      } else {
        navigate(`/non-conformance/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving non-conformance:', error);
      toast({
        title: 'Failed to save',
        description: 'There was an error saving the non-conformance.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Card className={isDialog ? '' : 'max-w-3xl mx-auto'}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {!isDialog && (
            <Button 
              variant="ghost" 
              onClick={() => onClose ? onClose() : navigate('/non-conformance')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle>{id ? 'Edit Non-Conformance' : 'Create Non-Conformance'}</CardTitle>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A concise title for the non-conformance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!id} // Only allow status change when editing
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['On Hold', 'Under Review', 'Released', 'Disposed'] as NCStatus[]).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current status of the non-conformance
                    </FormDescription>
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
                      placeholder="Provide a detailed description of the non-conformance" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed explanation of the non-conformance issue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="item_name"
                rules={{ required: 'Item name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Name of the non-conforming item
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="item_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      Identifier for the item if applicable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter total quantity"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Total quantity of affected items
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quantity_on_hold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity On Hold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter quantity on hold"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Quantity of items currently on hold
                    </FormDescription>
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
                      <Input
                        placeholder="e.g., kg, liters, pieces"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Unit of measurement for quantities
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="item_category"
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4 md:grid-cols-3"
                    >
                      {([
                        'Processing Equipment',
                        'Product Storage Tanks',
                        'Finished Products',
                        'Raw Products',
                        'Packaging Materials',
                        'Other'
                      ] as NCItemCategory[]).map((category) => (
                        <FormItem key={category} className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value={category} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">{category}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="reason_category"
                rules={{ required: 'Reason is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Non-Conformance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {([
                          'Contamination',
                          'Quality Issues',
                          'Regulatory Non-Compliance',
                          'Equipment Malfunction',
                          'Documentation Error',
                          'Process Deviation',
                          'Other'
                        ] as NCReasonCategory[]).map((reason) => (
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
                    <FormLabel>Additional Reason Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide additional details about the reason" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where the non-conformance was found
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter department" {...field} />
                    </FormControl>
                    <FormDescription>
                      Department responsible for the non-conformance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter assignee" {...field} />
                    </FormControl>
                    <FormDescription>
                      Person responsible for handling this non-conformance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Priority level for resolving this issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onClose ? onClose() : navigate('/non-conformance')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                id ? 'Update' : 'Create'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default NCForm;
