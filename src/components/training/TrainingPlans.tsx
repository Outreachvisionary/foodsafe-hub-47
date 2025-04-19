
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { TrainingPlan, TrainingPriority } from '@/types/training';
import { useTrainingContext } from '@/contexts/TrainingContext';
import { PlusCircle, Edit, Trash2, Calendar, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

const TrainingPlans = () => {
  const { trainingPlans: plans, isLoading, createTrainingPlan: createPlan, deleteTrainingPlan: deletePlan } = useTrainingContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [planForm, setPlanForm] = useState<Omit<TrainingPlan, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    priority: 'medium',
    is_required: false,
    target_roles: [],
    courses: [],
    duration_days: 30,
    target_departments: [],
    status: 'Active',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_automated: false,
    automation_trigger: '',
    created_by: user?.id || 'system',
    related_standards: []
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlanForm({
      ...planForm,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (checked: boolean, name: string) => {
    setPlanForm({
      ...planForm,
      [name]: checked
    });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlanForm({
      ...planForm,
      [name]: parseInt(value, 10) || 0
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setPlanForm({
      ...planForm,
      [name]: value
    });
  };
  
  const handleSubmit = async () => {
    try {
      // Ensure all required fields are present
      if (!planForm.name || !planForm.description) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      await createPlan({
        name: planForm.name,
        description: planForm.description,
        priority: planForm.priority,
        is_required: planForm.is_required,
        target_roles: planForm.target_roles,
        courses: planForm.courses,
        duration_days: planForm.duration_days,
        target_departments: planForm.target_departments,
        status: planForm.status,
        start_date: planForm.start_date,
        end_date: planForm.end_date,
        is_automated: planForm.is_automated,
        automation_trigger: planForm.automation_trigger,
        created_by: user?.id || 'system',
        related_standards: planForm.related_standards || []
      });
      
      setIsDialogOpen(false);
      setPlanForm({
        name: '',
        description: '',
        priority: 'medium',
        is_required: false,
        target_roles: [],
        courses: [],
        duration_days: 30,
        target_departments: [],
        status: 'Active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_automated: false,
        automation_trigger: '',
        created_by: user?.id || 'system',
        related_standards: []
      });
      
      toast({
        title: "Success",
        description: "Training plan created successfully"
      });
    } catch (error) {
      console.error("Error creating training plan:", error);
      toast({
        title: "Error",
        description: "Failed to create training plan. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin mr-2" />
        <span>Loading training plans...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Training Plans</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Training Plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Training Plan</DialogTitle>
              <DialogDescription>
                Define a new training plan for your organization
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={planForm.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={planForm.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={planForm.priority as string}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration_days" className="text-right">
                  Duration (days)
                </Label>
                <Input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  value={String(planForm.duration_days || '')}
                  onChange={handleNumberChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start_date" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={planForm.start_date ? planForm.start_date.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={planForm.end_date ? planForm.end_date.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_required" className="text-right">
                  Is Required
                </Label>
                <Checkbox
                  id="is_required"
                  checked={!!planForm.is_required}
                  onCheckedChange={(checked) => handleCheckboxChange(!!checked, 'is_required')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target_roles" className="text-right">
                  Target Roles
                </Label>
                <Input
                  id="target_roles"
                  name="target_roles"
                  value={planForm.target_roles.join(', ')}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'target_roles',
                      value: e.target.value.split(',').map(role => role.trim())
                    }
                  } as React.ChangeEvent<HTMLInputElement>)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="courses" className="text-right">
                  Courses
                </Label>
                <Input
                  id="courses"
                  name="courses"
                  value={planForm.courses.join(', ')}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'courses',
                      value: e.target.value.split(',').map(course => course.trim())
                    }
                  } as React.ChangeEvent<HTMLInputElement>)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target_departments" className="text-right">
                  Target Departments
                </Label>
                <Input
                  id="target_departments"
                  name="target_departments"
                  value={planForm.target_departments.join(', ')}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'target_departments',
                      value: e.target.value.split(',').map(dept => dept.trim())
                    }
                  } as React.ChangeEvent<HTMLInputElement>)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="automation_trigger" className="text-right">
                  Automation Trigger
                </Label>
                <Input
                  id="automation_trigger"
                  name="automation_trigger"
                  value={planForm.automation_trigger}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground mb-4">No training plans found</p>
            <Button onClick={() => setIsDialogOpen(true)}>Create Your First Plan</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Priority:</span>
                    <span>{plan.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span>{plan.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Required:</span>
                    <span>{plan.is_required ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Courses:</span>
                    <span>{plan.courses.length}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingPlans;
