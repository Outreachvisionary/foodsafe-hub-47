
import React, { useState, useEffect } from 'react';
import { useTrainingContext } from '@/contexts/TrainingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrainingPlan, TrainingPriority } from '@/types/training';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const TrainingPlans = () => {
  const { trainingPlans, isLoading, createTrainingPlan } = useTrainingContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<TrainingPlan>>({
    name: '',
    description: '',
    priority: 'medium',
    is_required: false,
    target_roles: [],
    courses: [],
    duration_days: 30,
    target_departments: []
  });

  const handleCreatePlan = async () => {
    try {
      // Validate required fields
      if (!newPlan.name) {
        toast.error('Plan name is required');
        return;
      }

      // Add required fields that might be missing
      const planToCreate = {
        name: newPlan.name,
        description: newPlan.description || '',
        priority: (newPlan.priority || 'medium') as TrainingPriority,
        is_required: Boolean(newPlan.is_required),
        target_roles: newPlan.target_roles || [],
        courses: newPlan.courses || [],
        duration_days: newPlan.duration_days || 30,
        target_departments: newPlan.target_departments || [],
        status: 'Active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_automated: false,
        related_standards: []
      };

      await createTrainingPlan(planToCreate);
      toast.success('Training plan created successfully');
      setIsDialogOpen(false);
      // Reset form
      setNewPlan({
        name: '',
        description: '',
        priority: 'medium',
        is_required: false,
        target_roles: [],
        courses: [],
        duration_days: 30,
        target_departments: []
      });
    } catch (error) {
      console.error('Error creating training plan:', error);
      toast.error('Failed to create training plan');
    }
  };

  if (isLoading) {
    return <div>Loading training plans...</div>;
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
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={newPlan.priority as string}
                  onValueChange={(value) => setNewPlan({ ...newPlan, priority: value as TrainingPriority })}
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
                <Label htmlFor="durationDays" className="text-right">
                  Duration (days)
                </Label>
                <Input
                  id="durationDays"
                  type="number"
                  value={newPlan.duration_days}
                  onChange={(e) => setNewPlan({ ...newPlan, duration_days: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlan}>Create Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {trainingPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground mb-4">No training plans found</p>
            <Button onClick={() => setIsDialogOpen(true)}>Create Your First Plan</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingPlans.map((plan) => (
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
