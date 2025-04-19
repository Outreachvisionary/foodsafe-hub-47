import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, CalendarRange, Users, Trash2, Edit, Pencil, Save, X } from 'lucide-react';
import { TrainingPlan, EmployeeRole, Department, TrainingPriority } from '@/types/training';
import { useTrainingPlans } from '@/hooks/useTrainingPlans';
import { toast } from '@/components/ui/use-toast';

// Fix property names and types in the mock data
const mockPlans: TrainingPlan[] = [
  {
    id: '1',
    name: 'Food Safety Fundamentals',
    description: 'Core training for all food handling staff',
    targetRoles: ['operator', 'supervisor', 'manager'],
    target_roles: ['operator', 'supervisor', 'manager'],
    targetDepartments: ['production', 'quality', 'maintenance'],
    target_departments: ['production', 'quality', 'maintenance'],
    coursesIncluded: ['course-1', 'course-2', 'course-3'],
    courses: ['course-1', 'course-2', 'course-3'],
    durationDays: 14,
    duration_days: 14,
    isRequired: true,
    is_required: true,
    priority: 'high',
    status: 'Active',
    startDate: '2023-01-01',
    start_date: '2023-01-01',
    endDate: '2023-12-31',
    end_date: '2023-12-31',
    isAutomated: false,
    is_automated: false,
    automationTrigger: null,
    automation_trigger: null,
    createdBy: 'Admin',
    created_by: 'Admin',
    created_at: '2023-01-01T08:00:00Z',
    updated_at: '2023-01-15T10:30:00Z',
    relatedStandards: ['ISO 22000', 'HACCP'],
    related_standards: ['ISO 22000', 'HACCP']
  },
  {
    id: '2',
    name: 'GMP Training Program',
    description: 'Good Manufacturing Practices training for production personnel',
    targetRoles: ['operator', 'supervisor', 'quality'],
    target_roles: ['operator', 'supervisor', 'quality'],
    targetDepartments: ['production', 'quality'],
    target_departments: ['production', 'quality'],
    coursesIncluded: ['course-4', 'course-5'],
    courses: ['course-4', 'course-5'],
    durationDays: 7,
    duration_days: 7,
    isRequired: true,
    is_required: true,
    priority: 'medium',
    status: 'Active',
    startDate: '2023-02-01',
    start_date: '2023-02-01',
    endDate: '2023-12-31',
    end_date: '2023-12-31',
    isAutomated: true,
    is_automated: true,
    automationTrigger: 'onboarding',
    automation_trigger: 'onboarding',
    createdBy: 'Admin',
    created_by: 'Admin',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-20T14:15:00Z',
    relatedStandards: ['FDA Part 117', 'FSMA'],
    related_standards: ['FDA Part 117', 'FSMA']
  },
  {
    id: '3',
    name: 'FSMA Compliance Training',
    description: 'Comprehensive FSMA compliance training for all personnel',
    targetRoles: ['operator', 'supervisor', 'manager', 'quality'],
    target_roles: ['operator', 'supervisor', 'manager', 'quality'],
    targetDepartments: ['production', 'quality', 'r&d', 'logistics'],
    target_departments: ['production', 'quality', 'r&d', 'logistics'],
    coursesIncluded: ['course-7', 'course-8', 'course-9'],
    courses: ['course-7', 'course-8', 'course-9'],
    durationDays: 21,
    duration_days: 21,
    isRequired: true,
    is_required: true,
    priority: 'high',
    status: 'Active',
    startDate: '2023-03-01',
    start_date: '2023-03-01',
    endDate: '2023-12-31',
    end_date: '2023-12-31',
    isAutomated: false,
    is_automated: false,
    automationTrigger: null,
    automation_trigger: null,
    createdBy: 'Admin',
    created_by: 'Admin',
    created_at: '2023-02-15T09:30:00Z',
    updated_at: '2023-03-01T11:45:00Z',
    relatedStandards: ['FSMA', 'Preventive Controls'],
    related_standards: ['FSMA', 'Preventive Controls'],
    recurringSchedule: {
      frequency: 'annual',
      interval: 1,
      startDate: '2023-03-01'
    }
  }
];

const TrainingPlans = () => {
  const [plans, setPlans] = useState<TrainingPlan[]>(mockPlans);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<TrainingPlan | null>(null);
  const { createTrainingPlan, updateTrainingPlan } = useTrainingPlans();
  const { toast } = useToast();

  const handleEdit = (plan: TrainingPlan) => {
    setIsEditing(true);
    setEditedPlan({ ...plan });
  };

  const handleSave = async () => {
    if (!editedPlan) return;

    // Update the training plan using the hook
    const success = await updateTrainingPlan(editedPlan.id, editedPlan);

    if (success) {
      // Update local state
      setPlans(plans.map(plan => plan.id === editedPlan.id ? editedPlan : plan));
      setIsEditing(false);
      setEditedPlan(null);
      toast({
        title: 'Success',
        description: 'Training plan updated successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update training plan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPlan(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPlan(prev => ({
      ...prev,
      [name]: value
    } as TrainingPlan));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Training Plans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing && editedPlan?.id === plan.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editedPlan.name}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing && editedPlan?.id === plan.id ? (
                      <textarea
                        name="description"
                        value={editedPlan.description || ''}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{plan.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing && editedPlan?.id === plan.id ? (
                      <input
                        type="text"
                        name="targetRoles"
                        value={(editedPlan.targetRoles || []).join(', ')}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{(plan.targetRoles || []).join(', ')}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing && editedPlan?.id === plan.id ? (
                      <select
                        name="priority"
                        value={editedPlan.priority}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    ) : (
                      <Badge
                        className="ml-2 text-xs"
                        variant={
                          plan.priority === 'high' ? 'destructive' : plan.priority === 'medium' ? 'secondary' : 'outline'
                        }
                      >
                        {plan.priority}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing && editedPlan?.id === plan.id ? (
                      <select
                        name="status"
                        value={editedPlan.status}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                      </select>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {plan.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {isEditing && editedPlan?.id === plan.id ? (
                      <>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(plan)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingPlans;
