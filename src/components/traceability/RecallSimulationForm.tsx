
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

const simulationSchema = z.object({
  duration: z.coerce.number().optional(),
  success_rate: z.coerce.number().min(0).max(100).optional(),
  bottlenecks: z.string().optional(),
  created_by: z.string().min(1, 'Creator is required'),
});

type SimulationFormValues = z.infer<typeof simulationSchema>;

interface RecallSimulationFormProps {
  recallId: string;
  onSubmit: (data: SimulationFormValues & { recall_id: string }) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const RecallSimulationForm: React.FC<RecallSimulationFormProps> = ({
  recallId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      duration: undefined,
      success_rate: undefined,
      bottlenecks: '',
      created_by: 'Current User',
    },
  });

  const handleSubmit = (values: SimulationFormValues) => {
    onSubmit({
      ...values,
      recall_id: recallId
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (seconds)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="How long did the simulation take?"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="success_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Success Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        max="100"
                        placeholder="Percentage of successful traces"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bottlenecks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bottlenecks (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any bottlenecks or issues identified during the simulation" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="created_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conducted By</FormLabel>
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
                {loading ? 'Saving...' : 'Save Simulation Results'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RecallSimulationForm;
