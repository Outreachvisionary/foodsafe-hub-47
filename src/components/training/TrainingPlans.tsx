import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Clock, Settings, Users, Calendar, Zap, FileCode, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TrainingPlan, EmployeeRole, Department, TrainingPriority } from '@/types/training';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const TrainingPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [automationEnabled, setAutomationEnabled] = useState(false);
  // Add states for data fetching
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Add useEffect to fetch data
  useEffect(() => {
    const fetchTrainingPlans = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('training_plans')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        setTrainingPlans(data || []);
      } catch (err) {
        console.error('Error fetching training plans:', err);
        setError('Failed to load training plans. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load training plans.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainingPlans();
  }, []);

  // Filter training plans based on the active tab
  const filteredPlans = trainingPlans.filter(plan => {
    if (activeTab === 'all') return true;
    if (activeTab === 'automated') return plan.isAutomated;
    if (activeTab === 'manual') return !plan.isAutomated;
    if (activeTab === 'active') return plan.status === 'Active';
    if (activeTab === 'draft') return plan.status === 'Draft';
    return true;
  });

  // Add loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading training plans...</span>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="text-red-500 h-10 w-10 mb-2" />
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Now rebuilding the original return statement based on available information
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Training Plans</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Training Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Training Plan</DialogTitle>
              <DialogDescription>
                Create a new training plan for your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input id="name" placeholder="Training Plan Name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">
                  Description
                </label>
                <Input id="description" placeholder="Description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="target-roles" className="text-right">
                  Target Roles
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="automation" className="text-right">
                  Automation
                </label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="automation" checked={automationEnabled} onCheckedChange={setAutomationEnabled} />
                  <label htmlFor="automation">{automationEnabled ? 'Enabled' : 'Disabled'}</label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="automated">Automated</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{plan.name}</span>
                      <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Duration: {plan.durationDays} days</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Roles: {plan.targetRoles.join(', ')}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Start: {new Date(plan.startDate).toLocaleDateString()}</span>
                      </div>
                      {plan.isAutomated && (
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                          <span>Automated: {plan.automationTrigger}</span>
                        </div>
                      )}
                      {plan.relatedStandards && plan.relatedStandards.length > 0 && (
                        <div className="flex items-center">
                          <FileCode className="h-4 w-4 mr-2" />
                          <span>Standards: {plan.relatedStandards.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center h-48">
                <p className="text-muted-foreground">No training plans found matching your criteria.</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create a Training Plan
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingPlans;
