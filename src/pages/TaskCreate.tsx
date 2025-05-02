
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CheckSquare, Calendar, Link as LinkIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// Define the form schema with zod
const formSchema = z.object({
  // Task Details
  title: z.string().min(3, { message: "Task title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  taskType: z.enum([
    'Corrective Action',
    'Preventive Action',
    'Document Review',
    'Audit Preparation',
    'Training Task',
    'Verification Activity',
    'Monitoring Task',
    'Maintenance Task',
    'Other'
  ]),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
  status: z.enum(['Not Started', 'In Progress', 'Under Review', 'Completed', 'Deferred']),
  
  // Assignment & Scheduling
  assignee: z.enum([
    'Quality Manager',
    'Food Safety Coordinator',
    'Production Manager',
    'Maintenance Supervisor',
    'Sanitation Lead',
    'HACCP Team',
    'Training Coordinator',
    'Regulatory Affairs'
  ]),
  dueDate: z.date(),
  
  // Related Items
  relatedTo: z.string().optional(),
});

type TaskFormValues = z.infer<typeof formSchema>;

export default function TaskCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define form with default values
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      taskType: 'Document Review',
      priority: 'Medium',
      status: 'Not Started',
      assignee: 'Quality Manager',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date 7 days from now
      relatedTo: '',
    },
  });

  // Form submission handler
  async function onSubmit(data: TaskFormValues) {
    try {
      // Show loading state
      setIsSubmitting(true);

      // Here we would typically integrate with API to save the task
      // This is a mock API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Display success notification
      toast({
        title: "Task created successfully",
        description: `${data.title} has been assigned to ${data.assignee}`,
        variant: "success",
      });
      
      // Navigate to the tasks list
      navigate('/tasks');
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error creating task",
        description: "There was a problem saving your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to handle draft saving
  const saveAsDraft = () => {
    form.setValue('status', 'Not Started');
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Task</h1>
          <p className="text-muted-foreground mt-1">Define a task and assign it to team members</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/tasks')}>Cancel</Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSection title="Task Details" icon={<CheckSquare className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Title */}
              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Description */}
              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter task description" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Task Type */}
              <FormField
                control={form.control}
                name="taskType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Task Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Corrective Action">Corrective Action</SelectItem>
                        <SelectItem value="Preventive Action">Preventive Action</SelectItem>
                        <SelectItem value="Document Review">Document Review</SelectItem>
                        <SelectItem value="Audit Preparation">Audit Preparation</SelectItem>
                        <SelectItem value="Training Task">Training Task</SelectItem>
                        <SelectItem value="Verification Activity">Verification Activity</SelectItem>
                        <SelectItem value="Monitoring Task">Monitoring Task</SelectItem>
                        <SelectItem value="Maintenance Task">Maintenance Task</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Critical">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                            Critical
                          </div>
                        </SelectItem>
                        <SelectItem value="High">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
                            High
                          </div>
                        </SelectItem>
                        <SelectItem value="Medium">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                            Medium
                          </div>
                        </SelectItem>
                        <SelectItem value="Low">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Low
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Deferred">Deferred</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <FormSection title="Assignment & Scheduling" icon={<User className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assignee */}
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Assignee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Quality Manager">Quality Manager</SelectItem>
                        <SelectItem value="Food Safety Coordinator">Food Safety Coordinator</SelectItem>
                        <SelectItem value="Production Manager">Production Manager</SelectItem>
                        <SelectItem value="Maintenance Supervisor">Maintenance Supervisor</SelectItem>
                        <SelectItem value="Sanitation Lead">Sanitation Lead</SelectItem>
                        <SelectItem value="HACCP Team">HACCP Team</SelectItem>
                        <SelectItem value="Training Coordinator">Training Coordinator</SelectItem>
                        <SelectItem value="Regulatory Affairs">Regulatory Affairs</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel required>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a due date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <FormSection title="Related Items" icon={<LinkIcon className="h-5 w-5" />}>
            <div>
              {/* Related To */}
              <FormField
                control={form.control}
                name="relatedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Link to other items (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="audit-001">Audit #001: Monthly GMP Audit</SelectItem>
                        <SelectItem value="doc-123">Document #123: HACCP Plan</SelectItem>
                        <SelectItem value="nc-456">Non-Conformance #456: Equipment Failure</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <div className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate('/tasks')}
            >
              Cancel
            </Button>
            <div className="space-x-2">
              <Button 
                variant="secondary" 
                type="button"
                onClick={saveAsDraft}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Task..." : "Create Task"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
