
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart2, FileText, CheckCircle2, AlertCircle, Table, Workflow, 
  Link, Calendar, Settings, RefreshCw, BadgeCheck, Database
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ModuleIntegrationProps {
  onNavigateToModule: (path: string) => void;
}

type IntegrationModule = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  availableReports: string[];
  isConfigured: boolean;
};

const ModuleIntegration: React.FC<ModuleIntegrationProps> = ({ onNavigateToModule }) => {
  const [activeTab, setActiveTab] = useState<string>('configured');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  
  const modules: IntegrationModule[] = [
    {
      id: 'documents',
      name: 'Documents',
      description: 'Document control system integration',
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      path: 'documents',
      availableReports: [
        'Document Status Summary',
        'Expiring Documents',
        'Revision History',
        'Document Usage Analytics'
      ],
      isConfigured: true
    },
    {
      id: 'training',
      name: 'Training',
      description: 'Training management system integration',
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      path: 'training',
      availableReports: [
        'Compliance Overview',
        'Employee Training Matrix',
        'Due/Overdue Training',
        'Certification Status'
      ],
      isConfigured: true
    },
    {
      id: 'capa',
      name: 'CAPA',
      description: 'Corrective and preventive actions integration',
      icon: <CheckCircle2 className="h-8 w-8 text-yellow-500" />,
      path: 'capa',
      availableReports: [
        'CAPA Status Overview',
        'Root Cause Analysis Trends',
        'Effectiveness Ratings',
        'Time to Resolution'
      ],
      isConfigured: true
    },
    {
      id: 'audits',
      name: 'Audits',
      description: 'Audit management system integration',
      icon: <AlertCircle className="h-8 w-8 text-red-500" />,
      path: 'audits',
      availableReports: [
        'Audit Schedule',
        'Findings Breakdown',
        'Compliance Trends',
        'Audit KPIs'
      ],
      isConfigured: false
    },
    {
      id: 'nc',
      name: 'Non-Conformance',
      description: 'Non-conformance tracking integration',
      icon: <AlertCircle className="h-8 w-8 text-purple-500" />,
      path: 'non-conformance',
      availableReports: [
        'Non-Conformance Summary',
        'Status Distribution',
        'Resolution Time Metrics',
        'NC by Category'
      ],
      isConfigured: false
    },
    {
      id: 'suppliers',
      name: 'Suppliers',
      description: 'Supplier management integration',
      icon: <Link className="h-8 w-8 text-indigo-500" />,
      path: 'supplier-management',
      availableReports: [
        'Supplier Risk Overview',
        'Compliance Status',
        'Performance Metrics',
        'Audit Summary'
      ],
      isConfigured: false
    },
  ];
  
  // Filter modules based on configuration status
  const configuredModules = modules.filter(module => module.isConfigured);
  const unconfiguredModules = modules.filter(module => !module.isConfigured);
  
  // Function to toggle module configuration status
  const toggleModuleConfiguration = (moduleId: string) => {
    // In a real app, this would update settings in a backend
    toast({
      title: "Integration status updated",
      description: `Module integration has been ${modules.find(m => m.id === moduleId)?.isConfigured ? 'disabled' : 'enabled'}.`,
    });
  };
  
  // Function to navigate to selected module
  const handleNavigateToModule = (path: string) => {
    onNavigateToModule(path);
    toast({
      title: "Navigating to module",
      description: "Redirecting to the selected module section.",
    });
  };
  
  // Function to handle settings updates
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your integration settings have been saved successfully.",
    });
  };
  
  // Function to refresh module data
  const refreshModuleData = (moduleId: string) => {
    toast({
      title: "Data refreshed",
      description: `${modules.find(m => m.id === moduleId)?.name} data has been refreshed.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Module Integration</h3>
        <Button onClick={saveSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="configured">Configured Modules</TabsTrigger>
          <TabsTrigger value="available">Available Modules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configured">
          {configuredModules.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Configured Modules</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't configured any modules for integration with reports yet.
                  </p>
                  <Button onClick={() => setActiveTab('available')}>
                    Explore Available Modules
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {configuredModules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {module.icon}
                        <div>
                          <CardTitle>{module.name}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={`enable-${module.id}`}>Integration Status</Label>
                        <Switch
                          id={`enable-${module.id}`}
                          defaultChecked={module.isConfigured}
                          onCheckedChange={() => toggleModuleConfiguration(module.id)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`autorefresh-${module.id}`}>Auto-refresh Reports</Label>
                        <Switch id={`autorefresh-${module.id}`} defaultChecked />
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => refreshModuleData(module.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                        <Button size="sm" onClick={() => handleNavigateToModule(module.path)}>
                          Open Module
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available">
          {unconfiguredModules.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">All Modules Configured</h3>
                  <p className="text-muted-foreground mb-4">
                    Great job! You've configured all available modules for integration.
                  </p>
                  <Button onClick={() => setActiveTab('configured')}>
                    View Configured Modules
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {unconfiguredModules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {module.icon}
                        <div>
                          <CardTitle>{module.name}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure this module to access {module.availableReports.length} specialized reports.
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={`enable-${module.id}`}>Enable Integration</Label>
                        <Switch
                          id={`enable-${module.id}`}
                          defaultChecked={module.isConfigured}
                          onCheckedChange={() => toggleModuleConfiguration(module.id)}
                        />
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={() => handleNavigateToModule(module.path)}>
                          Configure Module
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedModuleId && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Module Configuration Details</CardTitle>
            <CardDescription>
              Configure how this module integrates with the reporting system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data-refresh">Data Refresh Interval</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="data-refresh">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention</Label>
                <Select defaultValue="1year">
                  <SelectTrigger id="data-retention">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="90days">90 Days</SelectItem>
                    <SelectItem value="180days">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Available Reports</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {modules.find(m => m.id === selectedModuleId)?.availableReports.map((report, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <Checkbox id={`report-${index}`} />
                    <Label htmlFor={`report-${index}`}>{report}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Advanced Settings</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-metadata" defaultChecked />
                  <Label htmlFor="include-metadata">Include Metadata</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="historical-data" defaultChecked />
                  <Label htmlFor="historical-data">Include Historical Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-schedule" />
                  <Label htmlFor="auto-schedule">Auto-schedule Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notify-changes" />
                  <Label htmlFor="notify-changes">Notify on Data Changes</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleIntegration;
