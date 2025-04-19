
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTrainingContext } from '@/contexts/TrainingContext';

const TrainingMatrix = () => {
  const [roles, setRoles] = useState<string[]>(['Operator', 'Supervisor', 'Manager', 'Quality', 'Maintenance']);
  const [departments, setDepartments] = useState<string[]>(['Production', 'Quality', 'Maintenance', 'Logistics', 'R&D']);
  const [trainings, setTrainings] = useState<
    { id: string; name: string; isRequired: Record<string, Record<string, boolean>> }[]
  >([
    {
      id: '1',
      name: 'Food Safety Basics',
      isRequired: {
        Production: { Operator: true, Supervisor: true, Manager: true },
        Quality: { Operator: true, Supervisor: true, Manager: true },
        Maintenance: { Operator: true, Supervisor: true, Manager: true },
        Logistics: { Operator: true, Supervisor: true, Manager: true },
        'R&D': { Operator: true, Supervisor: true, Manager: true },
      },
    },
    {
      id: '2',
      name: 'GMP Training',
      isRequired: {
        Production: { Operator: true, Supervisor: true, Manager: true },
        Quality: { Operator: true, Supervisor: true, Manager: true },
        Maintenance: { Operator: false, Supervisor: true, Manager: true },
        Logistics: { Operator: false, Supervisor: false, Manager: true },
        'R&D': { Operator: true, Supervisor: true, Manager: true },
      },
    },
    {
      id: '3',
      name: 'HACCP Principles',
      isRequired: {
        Production: { Operator: false, Supervisor: true, Manager: true },
        Quality: { Operator: true, Supervisor: true, Manager: true },
        Maintenance: { Operator: false, Supervisor: false, Manager: true },
        Logistics: { Operator: false, Supervisor: false, Manager: true },
        'R&D': { Operator: true, Supervisor: true, Manager: true },
      },
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTraining, setNewTraining] = useState({ name: '', department: '', role: '' });
  const { toast } = useToast();
  const { isLoading } = useTrainingContext();

  const handleRequirementChange = (trainingId: string, department: string, role: string, isRequired: boolean) => {
    setTrainings(
      trainings.map((training) => {
        if (training.id === trainingId) {
          // Create a deep copy of the isRequired object
          const updatedIsRequired = { ...training.isRequired };
          
          // Initialize department if it doesn't exist
          if (!updatedIsRequired[department]) {
            updatedIsRequired[department] = {};
          }
          
          // Set the new value
          updatedIsRequired[department][role] = isRequired;
          
          return { ...training, isRequired: updatedIsRequired };
        }
        return training;
      })
    );
  };

  const handleAddTraining = () => {
    if (!newTraining.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Training name is required.',
        variant: 'destructive',
      });
      return;
    }

    const newId = (trainings.length + 1).toString();
    const newTrainingEntry = {
      id: newId,
      name: newTraining.name,
      isRequired: {} as Record<string, Record<string, boolean>>,
    };

    // Initialize all departments and roles to false
    departments.forEach((dept) => {
      newTrainingEntry.isRequired[dept] = {};
      roles.forEach((role) => {
        newTrainingEntry.isRequired[dept][role] = false;
      });
    });

    // If specific department and role were selected, set that one to true
    if (newTraining.department && newTraining.role) {
      newTrainingEntry.isRequired[newTraining.department][newTraining.role] = true;
    }

    setTrainings([...trainings, newTrainingEntry]);
    setNewTraining({ name: '', department: '', role: '' });
    setShowAddDialog(false);
    
    toast({
      title: 'Training Added',
      description: 'New training requirement has been added to the matrix.',
    });
  };

  const handleAddRequirement = () => {
    setShowAddDialog(true);
  };

  const areAllRequirementsListed = () => {
    // This is a placeholder for a more sophisticated check
    // In a real system, you might check against regulatory requirements
    return trainings.length >= 3;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training Matrix</h2>
          <p className="text-muted-foreground">
            Define training requirements by role and department
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddRequirement}>
            <Plus className="mr-2 h-4 w-4" />
            Add Training Requirement
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Training Requirement</DialogTitle>
                <DialogDescription>
                  Enter details for the new training requirement.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="trainingName" className="text-sm font-medium">
                    Training Name
                  </label>
                  <Input
                    id="trainingName"
                    value={newTraining.name}
                    onChange={(e) => setNewTraining({ ...newTraining, name: e.target.value })}
                    placeholder="Enter training name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-medium">
                      Department (Optional)
                    </label>
                    <Select
                      value={newTraining.department}
                      onValueChange={(value) => setNewTraining({ ...newTraining, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      Role (Optional)
                    </label>
                    <Select
                      value={newTraining.role}
                      onValueChange={(value) => setNewTraining({ ...newTraining, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Roles</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTraining}>Add Requirement</Button>
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
              <p className="font-medium text-amber-800">Missing Training Requirements</p>
              <p className="text-sm text-amber-700">
                Your training matrix may not include all required trainings for regulatory compliance.
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
                Your training matrix includes all necessary requirements for compliance.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Training Requirements Matrix</CardTitle>
          <CardDescription>
            Define which trainings are required for each role and department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Training</TableHead>
                  {departments.map((dept) => (
                    <TableHead key={dept} colSpan={roles.length} className="text-center">
                      {dept}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow>
                  <TableHead></TableHead>
                  {departments.map((dept) =>
                    roles.map((role) => (
                      <TableHead key={`${dept}-${role}`} className="text-xs font-medium text-center">
                        {role}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings.map((training) => (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.name}</TableCell>
                    {departments.map((dept) =>
                      roles.map((role) => (
                        <TableCell key={`${training.id}-${dept}-${role}`} className="text-center">
                          <Checkbox
                            checked={training.isRequired[dept]?.[role] || false}
                            onCheckedChange={(checked) =>
                              handleRequirementChange(
                                training.id,
                                dept,
                                role,
                                checked as boolean
                              )
                            }
                          />
                        </TableCell>
                      ))
                    )}
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
        <Button>Save Matrix</Button>
      </div>
    </div>
  );
};

export default TrainingMatrix;
