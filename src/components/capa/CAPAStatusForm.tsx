
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  Form, 
  FormControl, 
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
import { useToast } from '@/components/ui/use-toast';
import { CAPA } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { formatEnumValue } from '@/utils/typeAdapters';

interface CAPAStatusFormProps {
  capa: CAPA;
  onStatusUpdate: (updates: Partial<CAPA>) => Promise<void>;
}

// Define the form schema with zod
const formSchema = z.object({
  status: z.nativeEnum(CAPAStatus),
  comments: z.string().optional(),
  completion_date: z.date().optional().nullable(),
  verification_method: z.string().optional(),
  verified_by: z.string().optional(),
  effectiveness_rating: z.enum(['Not_Effective', 'Partially_Effective', 'Effective', 'Highly_Effective']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CAPAStatusForm: React.FC<CAPAStatusFormProps> = ({ capa, onStatusUpdate }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the available status transitions based on current status
  const getAvailableStatuses = (currentStatus: CAPAStatus): CAPAStatus[] => {
    switch (currentStatus) {
      case CAPAStatus.Open:
        return [CAPAStatus.Open, CAPAStatus.InProgress, CAPAStatus.OnHold, CAPAStatus.Rejected];
      case CAPAStatus.InProgress:
        return [CAPAStatus.InProgress, CAPAStatus.Completed, CAPAStatus.OnHold, CAPAStatus.Open];
      case CAPAStatus.Completed:
        return [CAPAStatus.Completed, CAPAStatus.PendingVerification, CAPAStatus.InProgress];
      case CAPAStatus.PendingVerification:
        return [CAPAStatus.PendingVerification, CAPAStatus.Verified, CAPAStatus.Rejected, CAPAStatus.InProgress];
      case CAPAStatus.Verified:
        return [CAPAStatus.Verified, CAPAStatus.Closed];
      case CAPAStatus.OnHold:
        return [CAPAStatus.OnHold, CAPAStatus.Open, CAPAStatus.InProgress, CAPAStatus.Rejected];
      case CAPAStatus.Rejected:
        return [CAPAStatus.Rejected, CAPAStatus.Open];
      case CAPAStatus.Closed:
        return [CAPAStatus.Closed];
      case CAPAStatus.Overdue:
        return [CAPAStatus.Overdue, CAPAStatus.InProgress, CAPAStatus.Completed];
      default:
        return Object.values(CAPAStatus);
    }
  };
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: capa.status,
      comments: '',
      completion_date: capa.completion_date ? new Date(capa.completion_date) : null,
      verification_method: capa.verification_method || '',
      verified_by: capa.verified_by || '',
      effectiveness_rating: capa.effectiveness_rating,
    }
  });
  
  // Watch the status field to show/hide conditional fields
  const watchStatus = form.watch('status');
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Create the updates object
      const updates: Partial<CAPA> = {
        status: data.status,
      };
      
      // Add conditional fields based on status
      if (data.status === CAPAStatus.Completed || data.status === CAPAStatus.PendingVerification) {
        updates.completion_date = data.completion_date?.toISOString();
      }
      
      if (data.status === CAPAStatus.PendingVerification || data.status === CAPAStatus.Verified) {
        updates.verification_method = data.verification_method;
        updates.verified_by = data.verified_by;
      }
      
      if (data.status === CAPAStatus.Verified || data.status === CAPAStatus.Closed) {
        updates.effectiveness_rating = data.effectiveness_rating;
      }
      
      // Update the CAPA status
      await onStatusUpdate(updates);
      
      toast({
        title: "Status updated",
        description: `CAPA status changed to ${formatEnumValue(data.status.toString())}`,
      });
      
      // Reset the comments field
      form.reset({ 
        ...data, 
        comments: '',
      });
    } catch (error) {
      console.error("Error updating CAPA status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update CAPA status",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show specific fields based on the selected status
  const showCompletionDate = watchStatus === CAPAStatus.Completed || 
                           watchStatus === CAPAStatus.PendingVerification || 
                           watchStatus === CAPAStatus.Verified || 
                           watchStatus === CAPAStatus.Closed;
                         
  const showVerificationFields = watchStatus === CAPAStatus.PendingVerification || 
                               watchStatus === CAPAStatus.Verified || 
                               watchStatus === CAPAStatus.Closed;
                             
  const showEffectivenessRating = watchStatus === CAPAStatus.Verified || 
                                watchStatus === CAPAStatus.Closed;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="capa-status-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as CAPAStatus)}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getAvailableStatuses(capa.status).map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatEnumValue(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show completion date field for relevant statuses */}
            {showCompletionDate && (
              <FormField
                control={form.control}
                name="completion_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value || undefined}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Show verification fields for relevant statuses */}
            {showVerificationFields && (
              <>
                <FormField
                  control={form.control}
                  name="verification_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Method</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe how this CAPA was verified" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="verified_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verified By</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select verifier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Quality Manager">Quality Manager</SelectItem>
                            <SelectItem value="Food Safety Director">Food Safety Director</SelectItem>
                            <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                            <SelectItem value="Plant Manager">Plant Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Show effectiveness rating for verified or closed statuses */}
            {showEffectivenessRating && (
              <FormField
                control={form.control}
                name="effectiveness_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effectiveness Rating</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select effectiveness rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not_Effective">Not Effective</SelectItem>
                          <SelectItem value="Partially_Effective">Partially Effective</SelectItem>
                          <SelectItem value="Effective">Effective</SelectItem>
                          <SelectItem value="Highly_Effective">Highly Effective</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Comments field always shown */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add comments about this status change"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="capa-status-form"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Updating...' : 'Update Status'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CAPAStatusForm;
