import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComplaintCategory } from '@/types/enums';
import { Complaint, CreateComplaintRequest } from '@/types/complaint';

const complaintSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.nativeEnum(ComplaintCategory, { errorMap: () => ({ message: 'Please select a category' }) }),
  customer_name: z.string().optional(),
  customer_contact: z.string().optional(),
  product_involved: z.string().optional(),
  lot_number: z.string().optional(),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

interface ComplaintFormProps {
  complaint?: Complaint;
  onSubmit: (data: CreateComplaintRequest | Partial<Complaint>) => Promise<void>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({
  complaint,
  onSubmit,
  isSubmitting,
  mode
}) => {
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: complaint?.title || '',
      description: complaint?.description || '',
      category: complaint?.category || ComplaintCategory.Other,
      customer_name: complaint?.customer_name || '',
      customer_contact: complaint?.customer_contact || '',
      product_involved: complaint?.product_involved || '',
      lot_number: complaint?.lot_number || '',
    },
  });

  const handleSubmit = async (values: ComplaintFormValues) => {
    if (mode === 'edit' && complaint) {
      await onSubmit({
        id: complaint.id,
        ...values,
      });
    } else {
      await onSubmit({
        ...values,
        created_by: 'current-user', // This should come from auth context
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Log New Complaint' : 'Edit Complaint'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Complaint Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the complaint" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ComplaintCategory.Product_Quality}>Product Quality</SelectItem>
                        <SelectItem value={ComplaintCategory.Food_Safety}>Food Safety</SelectItem>
                        <SelectItem value={ComplaintCategory.Foreign_Material}>Foreign Material</SelectItem>
                        <SelectItem value={ComplaintCategory.Packaging}>Packaging</SelectItem>
                        <SelectItem value={ComplaintCategory.Delivery}>Delivery</SelectItem>
                        <SelectItem value={ComplaintCategory.Service}>Service</SelectItem>
                        <SelectItem value={ComplaintCategory.Labeling}>Labeling</SelectItem>
                        <SelectItem value={ComplaintCategory.Other}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer or company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Email or phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="product_involved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Involved</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name or code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lot_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot/Batch Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Lot or batch number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed information about the complaint, including what happened, when it occurred, and any relevant circumstances..."
                        rows={6}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  mode === 'create' ? 'Log Complaint' : 'Update Complaint'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;