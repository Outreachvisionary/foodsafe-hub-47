import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Plus, 
  Clock, 
  Settings, 
  Users, 
  Calendar, 
  Zap,
  FileCode,
  AlertCircle 
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TrainingPlan, EmployeeRole, Department, TrainingPriority } from '@/types/training';
import { Badge } from '@/components/ui/badge';

const TrainingPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [automationEnabled, setAutomationEnabled] = useState(false);
  
  // Sample training plans
  const trainingPlans: TrainingPlan[] = [
    {
      id: '1',
      name: 'New Employee Orientation',
      description: 'Basic training for all new employees covering company policies, safety protocols, and quality standards.',
      courses: ['COURSE001', 'COURSE002', 'COURSE003'],
      coursesIncluded: ['COURSE001', 'COURSE002', 'COURSE003'],
      targetRoles: ['line-worker', 'supervisor', 'manager'],
      targetDepartments: ['production', 'quality', 'maintenance'],
      durationDays: 5,
      priority: 'high',
      isRequired: true,
      startDate: '2023-05-01',
      endDate: '2023-05-05',
      status: 'Active',
      created_by: 'admin',
      createdDate: '2023-04-15',
      relatedStandards: ['ISO 9001', 'GMP'],
      isAutomated: true,
      automationTrigger: 'NewHire',
      recurringSchedule: {
        frequency: 'annual',
        interval: 1,
        startDate: '2023-07-01'
      }
    },
    {
      id: '2',
      name: 'SPC Fundamentals',
      description: 'Training on Statistical Process Control methods, tools and applications',
      courses: ['COURSE004', 'COURSE005'],
      coursesIncluded: ['COURSE004', 'COURSE005'],
      targetRoles: ['line-worker', 'supervisor', 'quality'],
      targetDepartments: ['production', 'quality'],
      durationDays: 3,
      isRequired: false,
      priority: 'medium',
      startDate: '2023-06-01',
      endDate: '2023-06-03',
      status: 'Draft',
      created_by: 'admin',
      createdDate: '2023-05-10',
      relatedStandards: ['ISO 9001'],
      isAutomated: false
    },
    {
      id: '3',
      name: 'Annual GMP Refresher',
      description: 'Mandatory annual refresher training on Good Manufacturing Practices',
      courses: ['COURSE006'],
      coursesIncluded: ['COURSE006'],
      targetRoles: ['line-worker', 'supervisor', 'manager', 'quality'],
      targetDepartments: ['production', 'quality', 'operations', 'administration'],
      durationDays: 1,
      isRequired: true,
      priority: 'high',
      startDate: '2023-07-01',
      endDate: '2023-07-01',
      status: 'Active',
      created_by: 'admin',
      createdDate: '2023-06-15',
      relatedStandards: ['ISO 9001', 'GMP', 'FSSC 22000'],
      isAutomated: true,
      automationTrigger: 'RecurringTraining',
      recurringSchedule: {
        frequency: 'annual',
        interval: 1,
        startDate: '2023-07-01'
      }
    }
  ];
  
  // Filter training plans based on the active tab
  const filteredPlans = trainingPlans.filter(plan => {
    if (activeTab === 'all') return true;
    if (activeTab === 'automated') return plan.isAutomated;
    if (activeTab === 'manual') return !plan.isAutomated;
    if (activeTab === 'active') return plan.status === 'Active';
    if (activeTab === 'draft') return plan.status === 'Draft';
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Plans</h2>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Automation Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Training Automation Settings</DialogTitle>
                <DialogDescription>
                  Configure automated training assignments and notifications
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Training Automation</h3>
                    <p className="text-sm text-muted-foreground">Automatically assign training based on triggers</p>
                  </div>
                  <Switch 
                    checked={automationEnabled} 
                    onCheckedChange={setAutomationEnabled} 
                  />
                </div>
                
                <div className="space-y-4 mt-2">
                  <h3 className="font-medium">Automation Triggers</h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <AutomationTriggerOption 
                      title="New Hire Onboarding" 
                      description="Automatically assign onboarding training to new employees"
                      icon={<Users className="h-4 w-4" />}
                    />
                    
                    <AutomationTriggerOption 
                      title="Role Changes" 
                      description="Assign training when employee roles or departments change"
                      icon={<Users className="h-4 w-4" />}
                    />
                    
                    <AutomationTriggerOption 
                      title="Document Updates" 
                      description="Trigger training when SOPs or work instructions are updated"
                      icon={<FileCode className="h-4 w-4" />}
                    />
                    
                    <AutomationTriggerOption 
                      title="Recurring Training" 
                      description="Schedule recurring training based on certification validity"
                      icon={<Calendar className="h-4 w-4" />}
                    />
                    
                    <AutomationTriggerOption 
                      title="Remediation" 
                      description="Auto-assign retraining when employees fail assessments"
                      icon={<AlertCircle className="h-4 w-4" />}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-2">
                  <h3 className="font-medium">Notification Settings</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In-App Notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manager Escalation for Overdue Training</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save Settings</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Training Plan</DialogTitle>
                <DialogDescription>
                  Design a new training plan and set up automation rules
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="name" className="text-sm font-medium">Plan Name</label>
                    <Input id="name" placeholder="Enter training plan name" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Input id="description" placeholder="Describe the purpose of this training plan" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <Select>
                      <SelectTrigger id="priority">
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
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="duration" className="text-sm font-medium">Duration (Days)</label>
                    <Input id="duration" type="number" min="1" placeholder="Enter duration" />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium">Target Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {['line-worker', 'supervisor', 'manager'].map(role => (
                      <div key={role} className="flex items-center">
                        <input type="checkbox" id={`role-${role}`} className="mr-1" />
                        <label htmlFor={`role-${role}`} className="text-sm">{role}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium">Courses</label>
                  <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span>Food Safety Management Systems Overview</span>
                      <input type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span>HACCP Principles and Application</span>
                      <input type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span>SQF Implementation Training</span>
                      <input type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span>SPC Fundamentals</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="automation" />
                  <label htmlFor="automation" className="text-sm font-medium">Enable Automation</label>
                </div>
                
                <div className="border rounded-md p-3 bg-gray-50">
                  <h3 className="text-sm font-medium mb-2">Automation Settings</h3>
                  
                  <div className="grid gap-2">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="trigger" className="text-sm">Trigger</label>
                      <Select>
                        <SelectTrigger id="trigger">
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newhire">New Hire</SelectItem>
                          <SelectItem value="rolechange">Role Change</SelectItem>
                          <SelectItem value="docupdate">Document Update</SelectItem>
                          <SelectItem value="recurring">Recurring Training</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="frequency" className="text-sm">Recurrence (if applicable)</label>
                      <Select>
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="biannually">Biannually</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="automated">
            <Zap className="h-4 w-4 mr-1" />
            Automated
          </TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map(plan => (
              <TrainingPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AutomationTriggerOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AutomationTriggerOption: React.FC<AutomationTriggerOptionProps> = ({ 
  title, 
  description, 
  icon 
}) => {
  return (
    <div className="flex items-start space-x-2 border rounded-md p-2">
      <div className="pt-0.5">{icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch />
    </div>
  );
};

interface TrainingPlanCardProps {
  plan: TrainingPlan;
}

const TrainingPlanCard: React.FC<TrainingPlanCardProps> = ({ plan }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          <div className="flex space-x-1">
            {plan.isAutomated && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                Auto
              </Badge>
            )}
            <StatusBadge status={plan.status} />
          </div>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Start:</span> {formatDate(plan.startDate)}
            </div>
            <div>
              <span className="text-muted-foreground">End:</span> {formatDate(plan.endDate)}
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{plan.durationDays} day{plan.durationDays !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {plan.targetRoles.slice(0, 3).map((role, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {role}
              </Badge>
            ))}
            {plan.targetRoles.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{plan.targetRoles.length - 3} more
              </Badge>
            )}
          </div>
          
          {plan.isAutomated && plan.automationTrigger && (
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span>Trigger: </span>
              <span className="ml-1 font-medium">
                {plan.automationTrigger === 'NewHire' ? 'New Hire' : 
                 plan.automationTrigger === 'RoleChange' ? 'Role Change' : 
                 plan.automationTrigger === 'DocumentUpdate' ? 'Document Update' : 
                 plan.automationTrigger === 'RecurringTraining' ? 'Recurring Training' : 
                 'Custom'}
              </span>
            </div>
          )}
          
          {plan.recurringSchedule && (
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {plan.recurringSchedule.frequency}: Every {plan.recurringSchedule.interval} 
                {plan.recurringSchedule.frequency === 'Annually' ? ' year' : 
                 plan.recurringSchedule.frequency === 'Monthly' ? ' month' : 
                 ' time(s)'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm">Details</Button>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-gray-100 text-gray-700 border-gray-200';
  
  switch (status) {
    case 'Active':
      bgColor = 'bg-green-50 text-green-700 border-green-200';
      break;
    case 'Draft':
      bgColor = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Completed':
      bgColor = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Cancelled':
      bgColor = 'bg-red-50 text-red-700 border-red-200';
      break;
    default:
      break;
  }
  
  return (
    <Badge variant="outline" className={bgColor}>
      {status}
    </Badge>
  );
};

export default TrainingPlans;
