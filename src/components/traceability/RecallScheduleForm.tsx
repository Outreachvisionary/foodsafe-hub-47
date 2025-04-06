
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecallSchedule, RecallType } from '@/types/traceability';
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
import { Checkbox } from '@/components/ui/checkbox';

const recallScheduleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  recall_type: z.enum(['Mock', 'Actual']),
  is_recurring: z.boolean().default(false),
  one_time_date: z.string().optional(),
  recurrence_pattern: z.string().optional(),
  recurrence_interval: z.coerce.number().optional(),
  assigned_users: z.array(z.string()).optional(),
});

type RecallScheduleFormValues = z.infer<typeof recallScheduleSchema>;

interface RecallScheduleFormProps {
  initialData?: Partial<RecallSchedule>;
  onSubmit: (data: RecallScheduleFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const RecallScheduleForm: React.FC<RecallScheduleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const form = useForm<RecallScheduleFormValues>({
    resolver: zodResolver(recallScheduleSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      recall_type: (initialData?.recall_type as RecallType) || 'Mock',
      is_recurring: initialData?.is_recurring || false,
      one_time_date: initialData?.one_time_date ? new Date(initialData.one_time_date).toISOString().split('T')[0] : '',
      recurrence_pattern: initialData?.recurrence_pattern || '',
      recurrence_interval: initialData?.recurrence_interval || 1,
      assigned_users: initialData?.assigned_users || [],
    },
  });

  const isRecurring = form.watch('is_recurring');

  const handleSubmit = (values: RecallScheduleFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData?.id ? 'Edit Recall Schedule' : 'Create New Recall Schedule'}</CardTitle>
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
                    <Input placeholder="Enter schedule title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="is_recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Recurring Schedule
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Set this recall to repeat automatically
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {isRecurring ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recurrence_pattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurrence Pattern</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurrence_interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurrence Interval</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="one_time_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : initialData?.id ? 'Update Schedule' : 'Create Schedule'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RecallScheduleForm;
