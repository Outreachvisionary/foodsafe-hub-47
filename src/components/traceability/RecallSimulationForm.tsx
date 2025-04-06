
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecallSimulation } from '@/types/traceability';
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
import { Slider } from '@/components/ui/slider';

const simulationSchema = z.object({
  recall_id: z.string().min(1, 'Recall ID is required'),
  duration: z.coerce.number().optional(),
  success_rate: z.coerce.number().min(0).max(100).optional(),
  bottlenecks: z.string().optional(),
  results: z.any().optional(),
});

type SimulationFormValues = z.infer<typeof simulationSchema>;

interface RecallSimulationFormProps {
  recallId: string;
  onSubmit: (data: SimulationFormValues) => void;
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
      recall_id: recallId,
      duration: 60,
      success_rate: 85,
      bottlenecks: '',
      results: {},
    },
  });

  const handleSubmit = (values: SimulationFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Run Mock Recall Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (seconds)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="success_rate"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Success Rate: {value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[value]}
                      onValueChange={(vals) => onChange(vals[0])}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bottlenecks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bottlenecks/Issues</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter any bottlenecks or issues encountered (optional)" {...field} />
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
                {loading ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RecallSimulationForm;
