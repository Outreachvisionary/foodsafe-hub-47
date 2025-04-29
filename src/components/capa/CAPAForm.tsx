
// Update the import at the top
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, LinkIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { CAPAPriority, CAPASource } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { toast } from 'sonner';

// Define form schema using Zod
const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  source: z.enum(['audit', 'haccp', 'supplier', 'complaint', 'traceability'], {
    required_error: 'Please select a source',
  }),
  sourceId: z.string().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low'], {
    required_error: 'Please select a priority',
  }),
  assignedTo: z.string().min(1, { message: 'Please assign to someone' }),
  department: z.string().min(1, { message: 'Please select a department' }),
  dueDate: z.date({
    required_error: 'Please select a due date',
  }),
  rootCause: z.string().optional(),
  correctiveAction: z.string().optional(),
  preventiveAction: z.string().optional(),
  fsma204Compliant: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CAPAFormProps {
  initialData?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const CAPAForm: React.FC<CAPAFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      source: initialData?.source || 'audit',
      sourceId: initialData?.sourceId || '',
      priority: initialData?.priority || 'medium',
      assignedTo: initialData?.assignedTo || '',
      department: initialData?.department || '',
      dueDate: initialData?.dueDate || new Date(),
      rootCause: initialData?.rootCause || '',
      correctiveAction: initialData?.correctiveAction || '',
      preventiveAction: initialData?.preventiveAction || '',
      fsma204Compliant: initialData?.fsma204Compliant || false,
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log('Form values:', values);
    onSubmit(values);
    toast.success(isEdit ? 'CAPA updated successfully' : 'CAPA created successfully');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit CAPA' : 'Create New CAPA'}</CardTitle>
        <CardDescription>
          {isEdit
            ? 'Update corrective and preventive action details'
            : 'Define a new corrective and preventive action plan'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter CAPA title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Concise description of the issue
                      </FormDescription>
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
                        <Textarea
                          placeholder="Detailed description of the issue"
                          className="min-h-[100px]"
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
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="audit">Audit</SelectItem>
                        <SelectItem value="haccp">HACCP</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="traceability">Traceability</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Reference ID</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="Reference ID" {...field} />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="ml-2"
                          onClick={() => {
                            toast.info('Link functionality would connect to related records');
                          }}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      ID from the source system (audit #, CCP, etc.)
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
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="Name or employee ID" {...field} />
                        <Button 
                          type="button"
                          variant="outline"
                          size="icon"
                          className="ml-2"
                          onClick={() => {
                            toast.info('User lookup functionality would open here');
                          }}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quality">Quality</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="sanitation">Sanitation</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="procurement">Procurement</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="rootCause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Root Cause Analysis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Identify the underlying cause of the issue"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        What caused the issue to occur?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="correctiveAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrective Action</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Steps to address the immediate issue"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How will you fix the current problem?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="preventiveAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preventive Action</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Steps to prevent recurrence"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How will you prevent this from happening again?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="fsma204Compliant"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>FSMA 204 Compliant</FormLabel>
                        <FormDescription>
                          This CAPA meets all FSMA 204 documentation requirements
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? 'Update CAPA' : 'Create CAPA'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CAPAForm;
