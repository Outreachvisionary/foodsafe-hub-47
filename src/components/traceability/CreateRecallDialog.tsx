
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useRecalls } from '@/hooks/useTraceability';

const recallSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  product_name: z.string().min(1, 'Product name is required'),
  batch_numbers: z.string().min(1, 'At least one batch number is required'),
  reason: z.string().min(1, 'Reason is required'),
  status: z.string().default('In Progress'),
});

type RecallFormValues = z.infer<typeof recallSchema>;

const CreateRecallDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { loading, addRecall } = useRecalls();

  const form = useForm<RecallFormValues>({
    resolver: zodResolver(recallSchema),
    defaultValues: {
      title: '',
      product_name: '',
      batch_numbers: '',
      reason: '',
      status: 'In Progress',
    },
  });

  const onSubmit = async (values: RecallFormValues) => {
    const recallData = {
      title: values.title,
      product_name: values.product_name,
      batch_numbers: values.batch_numbers.split(',').map(s => s.trim()),
      reason: values.reason,
      status: values.status,
      created_by: 'Current User', // Should be actual user
    };

    const result = await addRecall(recallData);
    if (result) {
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create Recall
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Recall</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recall Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recall title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batch_numbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Numbers *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch numbers (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter recall reason" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Recall'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecallDialog;
