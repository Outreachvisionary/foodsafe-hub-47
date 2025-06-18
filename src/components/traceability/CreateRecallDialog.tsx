
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { useTraceability } from '@/hooks/useTraceability';

const recallSchema = z.object({
  title: z.string().min(1, 'Recall title is required'),
  description: z.string().optional(),
  recall_type: z.enum(['Mock', 'Actual']), // Remove 'Test' for now to match database
  recall_reason: z.string().min(1, 'Recall reason is required'),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled']).default('Scheduled'),
});

type RecallFormValues = z.infer<typeof recallSchema>;

const CreateRecallDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { addRecall, loading } = useTraceability();

  const form = useForm<RecallFormValues>({
    resolver: zodResolver(recallSchema),
    defaultValues: {
      title: '',
      description: '',
      recall_type: 'Mock',
      recall_reason: '',
      status: 'Scheduled',
    },
  });

  const onSubmit = async (values: RecallFormValues) => {
    // Ensure all required fields are present
    const recallData = {
      title: values.title,
      recall_type: values.recall_type,
      recall_reason: values.recall_reason,
      initiated_by: 'Current User', // Should be actual user
      status: values.status,
      description: values.description || '',
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
          <AlertTriangle className="h-4 w-4 mr-2" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recall_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recall Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recall type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mock">Mock Recall</SelectItem>
                        <SelectItem value="Actual">Actual Recall</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recall_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recall Reason *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the reason for this recall" {...field} />
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
                    <Textarea placeholder="Enter additional details about the recall" {...field} />
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
