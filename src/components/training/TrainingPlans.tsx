import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { TrainingPlan, TrainingPriority } from '@/types/training';
import { useTrainingContext } from '@/contexts/TrainingContext';

const TrainingPlans = () => {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<TrainingPlan>>({
    name: '',
    description: '',
    priority: 'medium',
    status: 'Active',
  });
  const { toast } = useToast();
  const { isLoading, createTrainingPlan } = useTrainingContext();

  const handleAddPlan = async () => {
    if (!newPlan.name?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Plan name is required.',
        variant: 'destructive',
      });
      return;
    }

    const createdPlan = await createTrainingPlan(newPlan);

    if (createdPlan) {
      setPlans([...plans, createdPlan]);
      setNewPlan({ name: '', description: '', priority: 'medium', status: 'Active' });
      setShowAddDialog(false);

      toast({
        title: 'Training Plan Added',
        description: 'New training plan has been added.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create training plan.',
        variant: 'destructive',
      });
    }
  };

  const handleAddRequirement = () => {
    setShowAddDialog(true);
  };

  const areAllRequirementsListed = () => {
    // This is a placeholder for a more sophisticated check
    // In a real system, you might check against regulatory requirements
    return plans.length >= 3;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training Plans</h2>
          <p className="text-muted-foreground">
            Manage training plans and assign them to roles and departments
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddRequirement}>
            <Plus className="mr-2 h-4 w-4" />
            Add Training Plan
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Training Plan</DialogTitle>
                <DialogDescription>
                  Enter details for the new training plan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="planName" className="text-sm font-medium">
                    Plan Name
                  </label>
                  <Input
                    id="planName"
                    value={newPlan.name || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    placeholder="Enter plan name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="planDescription" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="planDescription"
                    value={newPlan.description || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="Enter plan description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <Select
                      value={newPlan.priority || 'medium'}
                      onValueChange={(value) => setNewPlan({ ...newPlan, priority: value as TrainingPriority })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Select
                      value={newPlan.status || 'Active'}
                      onValueChange={(value) => setNewPlan({ ...newPlan, status: value as string })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPlan} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Plan'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!areAllRequirementsListed() && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">Missing Training Plans</p>
              <p className="text-sm text-amber-700">
                Your training plans may not include all required trainings for regulatory compliance.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {areAllRequirementsListed() && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">All Required Training Listed</p>
              <p className="text-sm text-green-700">
                Your training plans includes all necessary requirements for compliance.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Training Plans</CardTitle>
          <CardDescription>
            Manage training plans and assign them to roles and departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Plan Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.description}</TableCell>
                    <TableCell>{plan.priority}</TableCell>
                    <TableCell>{plan.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button variant="outline" className="mr-2">
          Cancel
        </Button>
        <Button>Save Plans</Button>
      </div>
    </div>
  );
};

export default TrainingPlans;
