
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Recall, RecallType, RecallStatus } from '@/types/traceability';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const recallSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  recall_type: z.enum(['Mock', 'Actual']),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled']),
  recall_reason: z.string().min(1, 'Recall reason is required'),
  corrective_actions: z.string().optional(),
  affected_products: z.any().optional(),
});

type RecallFormValues = z.infer<typeof recallSchema>;

interface RecallFormProps {
  initialData?: Partial<Recall>;
  onSubmit: (data: RecallFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const RecallForm: React.FC<RecallFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const form = useForm<RecallFormValues>({
    resolver: zodResolver(recallSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      recall_type: (initialData?.recall_type as RecallType) || 'Mock',
      status: (initialData?.status as RecallStatus) || 'Scheduled',
      recall_reason: initialData?.recall_reason || '',
      corrective_actions: initialData?.corrective_actions || '',
      affected_products: initialData?.affected_products || {},
    },
  });

  const handleSubmit = (values: RecallFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData?.id ? 'Edit Recall' : 'Create New Recall'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
                    <FormLabel>Recall Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recall type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mock">Mock</SelectItem>
                        <SelectItem value="Actual">Actual</SelectItem>
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
                  <FormLabel>Recall Reason</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter reason for recall" {...field} />
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
                    <Textarea placeholder="Enter detailed description (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="corrective_actions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corrective Actions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter corrective actions (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : initialData?.id ? 'Update Recall' : 'Create Recall'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RecallForm;
