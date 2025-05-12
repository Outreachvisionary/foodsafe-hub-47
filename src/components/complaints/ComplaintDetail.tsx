
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Complaint } from '@/types/complaint';
import { ComplaintStatus, ComplaintPriority } from '@/types/enums';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { updateComplaint, updateComplaintStatus, fetchComplaintActivities, createCAPAFromComplaint } from '@/services/complaintService';
import { getComplaintStatusColor } from '@/utils/complaintUtils';
import { ArrowLeft, Calendar, Clock, FilePlus, LinkIcon, ExternalLink, UserCheck, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ComplaintDetailProps {
  complaint: Complaint;
  onBack: () => void;
  onUpdate: () => void;
}

const updateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  assigned_to: z.string().optional(),
  customer_name: z.string().min(1, "Customer name is required"),
  customer_contact: z.string().optional(),
  product_involved: z.string().optional(),
  lot_number: z.string().optional(),
  priority: z.string(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

export const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ 
  complaint,
  onBack,
  onUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false);
  const [isCAPAModalOpen, setIsCAPAModalOpen] = useState(false);
  const [userId, setUserId] = useState("user-1"); // In a real app, this would come from auth context
  
  const statusColors = getComplaintStatusColor(complaint.status);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      title: complaint.title,
      description: complaint.description,
      assigned_to: complaint.assigned_to || "",
      customer_name: complaint.customer_name,
      customer_contact: complaint.customer_contact || "",
      product_involved: complaint.product_involved || "",
      lot_number: complaint.lot_number || "",
      priority: complaint.priority,
    },
  });

  useEffect(() => {
    loadActivities();
  }, [complaint.id]);

  const loadActivities = async () => {
    try {
      setIsActivitiesLoading(true);
      const data = await fetchComplaintActivities(complaint.id);
      setActivities(data);
    } catch (error) {
      console.error("Error loading activities:", error);
      toast({
        title: "Failed to load activity history",
        description: "There was an error fetching the complaint activities.",
        variant: "destructive",
      });
    } finally {
      setIsActivitiesLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      await updateComplaintStatus(complaint.id, newStatus as ComplaintStatus, userId);
      toast({
        title: "Status updated",
        description: `Complaint status changed to ${newStatus.replace(/_/g, " ")}.`,
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Failed to update status",
        description: "There was an error updating the complaint status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UpdateFormValues) => {
    try {
      setIsLoading(true);
      await updateComplaint(complaint.id, {
        ...data,
        priority: data.priority as ComplaintPriority,
      });
      setIsEditing(false);
      toast({
        title: "Complaint updated",
        description: "The complaint details have been updated successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating complaint:", error);
      toast({
        title: "Failed to update complaint",
        description: "There was an error updating the complaint details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCAPA = async () => {
    try {
      setIsLoading(true);
      await createCAPAFromComplaint(complaint.id, userId);
      setIsCAPAModalOpen(false);
      toast({
        title: "CAPA created",
        description: "A CAPA action has been created from this complaint.",
      });
      onUpdate();
    } catch (error) {
      console.error("Error creating CAPA:", error);
      toast({
        title: "Failed to create CAPA",
        description: "There was an error creating a CAPA from this complaint.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to complaints
        </Button>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
              
              {!complaint.capa_id && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm" className="flex items-center">
                      <FilePlus className="mr-1 h-4 w-4" /> Create CAPA
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Create a CAPA from this complaint?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will create a new CAPA action item based on this customer complaint. The CAPA will be linked to this complaint record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCreateCAPA} disabled={isLoading}>
                        {isLoading ? (
                          <>Creating CAPA...</>
                        ) : (
                          <>Create CAPA</>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel Editing
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Complaint Details</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Complaint Details</CardTitle>
                <div className="flex items-center mt-1">
                  <Badge className={`${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                    {complaint.status.replace(/_/g, " ")}
                  </Badge>
                  
                  <Badge variant={complaint.priority === "Critical" || complaint.priority === "High" ? "destructive" : "outline"} className="ml-2">
                    {complaint.priority}
                  </Badge>
                  
                  <Badge variant="secondary" className="ml-2">
                    {complaint.category.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>

              {!isEditing && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Change Status</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Complaint Status</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {Object.values(ComplaintStatus).map((status) => (
                        <Button
                          key={status}
                          variant={complaint.status === status ? "default" : "outline"}
                          onClick={() => handleStatusChange(status)}
                          disabled={isLoading || complaint.status === status}
                          className="justify-start"
                        >
                          {status.replace(/_/g, " ")}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            
            <CardContent className="pt-2">
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Textarea rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(ComplaintPriority).map((priority) => (
                                  <SelectItem key={priority} value={priority}>
                                    {priority}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="assigned_to"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned To</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <h3 className="text-lg font-medium">Customer Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customer_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customer_contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer Contact</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <h3 className="text-lg font-medium">Product Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="product_involved"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lot_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lot Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-xl">{complaint.title}</h3>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Complaint Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">Reported Date:</span>
                          <span className="ml-2 font-medium">
                            {format(new Date(complaint.reported_date), 'PPP')}
                          </span>
                        </div>
                        {complaint.assigned_to && (
                          <div className="flex items-center text-sm">
                            <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Assigned To:</span>
                            <span className="ml-2 font-medium">{complaint.assigned_to}</span>
                          </div>
                        )}
                        {complaint.resolution_date && (
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Resolution Date:</span>
                            <span className="ml-2 font-medium">
                              {format(new Date(complaint.resolution_date), 'PPP')}
                            </span>
                          </div>
                        )}
                        {complaint.capa_id && (
                          <div className="flex items-center text-sm">
                            <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Linked CAPA:</span>
                            <Button 
                              variant="link" 
                              className="ml-1 p-0 h-auto text-sm"
                              onClick={() => window.open(`/capa/${complaint.capa_id}`, '_blank')}
                            >
                              View CAPA <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Customer Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="text-muted-foreground">Customer:</span>
                          <span className="ml-2 font-medium">{complaint.customer_name}</span>
                        </div>
                        {complaint.customer_contact && (
                          <div className="flex items-center text-sm">
                            <span className="text-muted-foreground">Contact:</span>
                            <span className="ml-2 font-medium">{complaint.customer_contact}</span>
                          </div>
                        )}
                      </div>
                      
                      {(complaint.product_involved || complaint.lot_number) && (
                        <>
                          <h4 className="font-medium mb-2 mt-4">Product Information</h4>
                          <div className="space-y-2">
                            {complaint.product_involved && (
                              <div className="flex items-center text-sm">
                                <span className="text-muted-foreground">Product:</span>
                                <span className="ml-2 font-medium">{complaint.product_involved}</span>
                              </div>
                            )}
                            {complaint.lot_number && (
                              <div className="flex items-center text-sm">
                                <span className="text-muted-foreground">Lot Number:</span>
                                <span className="ml-2 font-medium">{complaint.lot_number}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {complaint.status === "New" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-800">New Complaint</h4>
                        <p className="text-sm text-yellow-700">
                          This complaint has not been reviewed yet. Change the status to "Under Investigation" to start working on it.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {isActivitiesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{activity.action_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(activity.performed_at), 'PPp')}
                        </div>
                      </div>
                      <p className="text-sm">{activity.description}</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        By: {activity.performed_by}
                      </div>
                      {activity.old_status && activity.new_status && (
                        <div className="mt-2 flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {activity.old_status.replace(/_/g, " ")}
                          </Badge>
                          <ArrowRight className="h-4 w-4 mx-1" />
                          <Badge>
                            {activity.new_status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No activities have been recorded for this complaint yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplaintDetail;
