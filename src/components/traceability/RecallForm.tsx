
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Recall } from '@/types/traceability';
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
import { Card, CardContent } from '@/components/ui/card';
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
  recall_reason: z.string().min(1, 'Recall reason is required'),
  corrective_actions: z.string().optional(),
  initiated_by: z.string().min(1, 'Initiator is required'),
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
      recall_type: (initialData?.recall_type as any) || 'Mock',
      recall_reason: initialData?.recall_reason || '',
      corrective_actions: initialData?.corrective_actions || '',
      initiated_by: initialData?.initiated_by || 'Current User',
    },
  });

  const handleSubmit = (values: RecallFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recall Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recall title" {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recall type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mock">Mock (Simulation)</SelectItem>
                      <SelectItem value="Actual">Actual (Real Recall)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recall_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recall Reason</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the reason for this recall" 
                      className="min-h-[80px]"
                      {...field} 
                    />
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter additional details about this recall" 
                      className="min-h-[80px]"
                      {...field} 
                    />
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
                  <FormLabel>Corrective Actions (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any corrective actions to be taken" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initiated_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initiated By</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Initiating...' : initialData?.id ? 'Update Recall' : 'Initiate Recall'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RecallForm;
