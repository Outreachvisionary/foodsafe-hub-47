import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { 
  FileCheck, CalendarClock, ListChecks, ShieldCheck, Camera, Check, 
  Download, FilePlus, Filter, ClipboardList, FileText, Search, 
  PlusCircle, Calendar, AlertTriangle, Info, Clock, RefreshCw
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AuditDetailsDialog from '@/components/audits/AuditDetailsDialog';

const mockAudits = [
  {
    id: 'A001',
    title: 'SQF Internal Audit - Q2 2023',
    standard: 'SQF',
    status: 'Completed',
    scheduledDate: '2023-05-15',
    completedDate: '2023-05-17',
    assignedTo: 'John Doe',
    findings: 3,
  },
  {
    id: 'A002',
    title: 'HACCP Verification Audit',
    standard: 'HACCP',
    status: 'In Progress',
    scheduledDate: '2023-06-05',
    completedDate: null,
    assignedTo: 'Sarah Lee',
    findings: 0,
  },
  {
    id: 'A003',
    title: 'GMP Monthly Inspection',
    standard: 'ISO 22000',
    status: 'Scheduled',
    scheduledDate: '2023-06-20',
    completedDate: null,
    assignedTo: 'Mike Johnson',
    findings: 0,
  },
  {
    id: 'A004',
    title: 'BRC GS2 Pre-Assessment',
    standard: 'BRC GS2',
    status: 'Completed',
    scheduledDate: '2023-04-10',
    completedDate: '2023-04-12',
    assignedTo: 'Emily Chen',
    findings: 7,
  },
  {
    id: 'A005',
    title: 'FSSC 22000 Surveillance Audit',
    standard: 'FSSC 22000',
    status: 'Scheduled',
    scheduledDate: '2023-07-15',
    completedDate: null,
    assignedTo: 'Robert Kim',
    findings: 0,
  },
  {
    id: 'A006',
    title: 'SQF Mock Recall Exercise',
    standard: 'SQF',
    status: 'Due Soon',
    scheduledDate: '2023-07-30',
    completedDate: null,
    assignedTo: 'Unassigned',
    findings: 0,
    recurrence: 'Every 6 months',
    lastCompleted: '2023-01-30',
  },
  {
    id: 'A007',
    title: 'Food Defense Assessment',
    standard: 'SQF',
    status: 'Scheduled',
    scheduledDate: '2023-08-15',
    completedDate: null,
    assignedTo: 'John Doe',
    findings: 0,
    recurrence: 'Annual',
    lastCompleted: '2022-08-10',
  },
  {
    id: 'A008',
    title: 'Environmental Monitoring Verification',
    standard: 'FSSC 22000',
    status: 'Due Soon',
    scheduledDate: '2023-07-05',
    completedDate: null,
    assignedTo: 'Unassigned',
    findings: 0,
    recurrence: 'Quarterly',
    lastCompleted: '2023-04-05',
  }
];

const templateOptions = {
  'SQF': [
    'SQF Food Safety Audit',
    'SQF Food Quality Audit',
    'SQF System Elements',
    'SQF GMP Audit',
    'SQF Mock Recall Exercise',
    'SQF Food Defense Assessment',
    'SQF Crisis Management Drill',
  ],
  'ISO 22000': [
    'ISO 22000 Internal Audit',
    'ISO 22000 Management Review',
    'ISO 22000 Verification Activities',
    'ISO 22000 Risk Assessment',
    'ISO 22000 PRP Evaluation',
  ],
  'FSSC 22000': [
    'FSSC 22000 System Audit',
    'FSSC 22000 PRP Audit',
    'FSSC 22000 HACCP Plan Review',
    'FSSC 22000 Environmental Monitoring',
    'FSSC 22000 Food Fraud Mitigation',
    'FSSC 22000 Food Defense Plan Review',
  ],
  'HACCP': [
    'HACCP Plan Verification',
    'CCP Monitoring Audit',
    'Prerequisite Program Audit',
    'HACCP Team Meeting',
    'Validation of Critical Limits',
  ],
  'BRC GS2': [
    'BRC Senior Management Commitment',
    'BRC HACCP Plan Audit',
    'BRC Site Standards Audit',
    'BRC Product Control Audit',
    'BRC Allergen Management Assessment',
    'BRC Foreign Material Control Audit',
  ],
  'GMP': [
    'Personnel Practices',
    'Facility and Equipment',
    'Sanitation',
    'Pest Control Inspection',
    'Operational Controls',
  ]
};

const recommendedRecurrence = {
  'SQF Mock Recall Exercise': 'Every 6 months',
  'SQF Crisis Management Drill': 'Annual',
  'SQF Food Defense Assessment': 'Annual',
  'ISO 22000 Management Review': 'Annual',
  'FSSC 22000 Environmental Monitoring': 'Quarterly',
  'BRC Allergen Management Assessment': 'Quarterly',
  'HACCP Plan Verification': 'Annual',
};

const standardRequirements = {
  'SQF': [
    'Annual internal audits covering all SQF System elements',
    'Mock recall exercises every 6 months',
    'Food defense assessments annually',
    'Crisis management drills annually',
  ],
  'ISO 22000': [
    'Internal audits covering all ISO 22000 elements at planned intervals',
    'Management review meetings at planned intervals',
    'Verification of control measures',
    'Regular update of hazard analysis',
  ],
  'FSSC 22000': [
    'Internal audits covering all FSSC 22000 requirements',
    'Environmental monitoring program verification',
    'Food fraud vulnerability assessment annually',
    'Food defense assessment annually',
  ],
  'HACCP': [
    'Verification of HACCP plan at least annually',
    'Validation of critical limits',
    'Review of corrective actions',
    'Review of verification records',
  ],
  'BRC GS2': [
    'Internal audits covering all BRC requirements',
    'Supplier approval and performance monitoring',
    'Traceability exercises at least annually',
    'Documented root cause analysis for non-conformities',
  ]
};

const checklistCategories = {
  'SQF Food Safety Audit': [
    'Management Commitment',
    'Document Control',
    'Specifications and Supplier Approval',
    'Food Safety System',
    'Food Safety Plan - HACCP',
    'Product Identification',
    'Traceability',
    'Recall and Withdrawal',
    'Food Defense'
  ],
  'HACCP Plan Verification': [
    'Hazard Analysis',
    'CCP Determination',
    'Critical Limits',
    'Monitoring Procedures',
    'Corrective Actions',
    'Verification Procedures',
    'Record-Keeping'
  ],
  'SQF Mock Recall Exercise': [
    'Traceability System Effectiveness',
    'Communication Protocols',
    'Product Recovery Procedures',
    'Record Keeping',
    'Time to Complete Recall',
    'Percentage of Product Recovered',
    'Root Cause Analysis'
  ],
  'BRC Allergen Management Assessment': [
    'Allergen Risk Assessment',
    'Allergen Controls',
    'Cleaning Validation',
    'Staff Training',
    'Labeling Controls',
    'Supplier Management',
    'Allergen Testing Program'
  ],
  'FSSC 22000 Environmental Monitoring': [
    'Sampling Plan',
    'Testing Methods',
    'Corrective Actions',
    'Trend Analysis',
    'Zone Classification',
    'Pathogen Controls',
    'Verification Activities'
  ],
};

const InternalAudits = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('SQF');
  const [showRequirements, setShowRequirements] = useState(false);
  const [filterStandard, setFilterStandard] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isAuditDetailsOpen, setIsAuditDetailsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      standard: 'SQF',
      template: '',
      scheduledDate: '',
      assignedTo: '',
      notes: '',
      recurrence: 'One-time',
    }
  });

  const watchedTemplate = form.watch('template');
  
  useEffect(() => {
    if (watchedTemplate && recommendedRecurrence[watchedTemplate]) {
      form.setValue('recurrence', recommendedRecurrence[watchedTemplate]);
    }
  }, [watchedTemplate, form]);

  const filteredAudits = mockAudits.filter(audit => {
    const query = searchQuery.toLowerCase();
    const standardMatch = filterStandard === 'all' ? true : audit.standard === filterStandard;
    const statusMatch = filterStatus === 'all' ? true : audit.status === filterStatus;
    
    return (
      (audit.title.toLowerCase().includes(query) ||
       audit.standard.toLowerCase().includes(query) ||
       audit.status.toLowerCase().includes(query) ||
       (audit.assignedTo && audit.assignedTo.toLowerCase().includes(query))) &&
      standardMatch && statusMatch
    );
  });

  const upcomingAudits = filteredAudits.filter(audit => 
    audit.status === 'Scheduled' || audit.status === 'In Progress' || audit.status === 'Due Soon'
  );
  
  const completedAudits = filteredAudits.filter(audit => 
    audit.status === 'Completed'
  );

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    
    toast({
      title: "Audit Scheduled",
      description: `${data.title} has been scheduled for ${data.scheduledDate}`,
    });
    
    setIsNewAuditDialogOpen(false);
    form.reset();
  };

  const handleStandardChange = (value) => {
    setSelectedStandard(value);
    form.setValue('standard', value);
    form.setValue('template', '');
  };

  const getTemplateOptions = () => {
    return templateOptions[selectedStandard] || [];
  };

  const handleAutoSchedule = () => {
    toast({
      title: "Audits Auto-Scheduled",
      description: "Required audits have been automatically scheduled based on FSMS requirements",
    });
  };

  const handleViewAuditDetails = (audit) => {
    setSelectedAudit(audit);
    setIsAuditDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'In Progress':
        return 'text-blue-600 bg-blue-100';
      case 'Scheduled':
        return 'text-amber-600 bg-amber-100';
      case 'Due Soon':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Internal Audits & Inspections" 
        subtitle="Manage, schedule, and conduct internal audits across all food safety standards" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search audits..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={filterStandard} onValueChange={setFilterStandard}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Standards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Standards</SelectItem>
                {Object.keys(templateOptions).map(standard => (
                  <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Due Soon">Due Soon</SelectItem>
              </SelectContent>
            </Select>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleAutoSchedule}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Auto-Schedule</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically schedule required audits based on FSMS requirements</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Dialog open={isNewAuditDialogOpen} onOpenChange={setIsNewAuditDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Audit</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Audit</DialogTitle>
                  <DialogDescription>
                    Create a new audit or inspection based on a template or custom checklist.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audit Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Q2 SQF Internal Audit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="standard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Standard</FormLabel>
                            <Select 
                              value={field.value} 
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleStandardChange(value);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a standard" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.keys(templateOptions).map(standard => (
                                  <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="template"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Audit Template</FormLabel>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a template" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getTemplateOptions().map(template => (
                                  <SelectItem key={template} value={template}>{template}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scheduled Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type="date" {...field} />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assign To</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="recurrence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recurrence</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select recurrence" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="One-time">One-time</SelectItem>
                              <SelectItem value="Every 6 months">Every 6 months</SelectItem>
                              <SelectItem value="Quarterly">Quarterly</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {watchedTemplate && recommendedRecurrence[watchedTemplate] && (
                              <span className="text-amber-600 flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                {watchedTemplate} is typically {recommendedRecurrence[watchedTemplate].toLowerCase()}
                              </span>
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <textarea 
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                              placeholder="Any specific focus areas or instructions..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsNewAuditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Schedule Audit</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span>FSMS Standard Requirements</span>
                </CardTitle>
                <CardDescription>
                  Key audit and inspection requirements by food safety standard
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowRequirements(!showRequirements)}
              >
                {showRequirements ? 'Hide' : 'Show'} Requirements
              </Button>
            </div>
          </CardHeader>
          
          {showRequirements && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(standardRequirements).map((standard) => (
                  <Card key={standard} className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{standard}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="text-sm space-y-1">
                        {standardRequirements[standard].map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Clock className="h-3.5 w-3.5 text-fsms-blue mt-0.5 flex-shrink-0" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
        
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Upcoming ({upcomingAudits.length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Completed ({completedAudits.length})</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Audits & Inspections</CardTitle>
                <CardDescription>
                  Manage scheduled and in-progress audits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Recurrence</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAudits.length > 0 ? (
                      upcomingAudits.map((audit) => (
                        <TableRow key={audit.id}>
                          <TableCell className="font-medium">{audit.id}</TableCell>
                          <TableCell>{audit.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ShieldCheck className="h-4 w-4 mr-1 text-fsms-blue" />
                              {audit.standard}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                              {audit.status}
                            </span>
                          </TableCell>
                          <TableCell>{audit.scheduledDate}</TableCell>
                          <TableCell>{audit.assignedTo || 'Unassigned'}</TableCell>
                          <TableCell>
                            {audit.recurrence ? (
                              <span className="text-xs text-gray-500">{audit.recurrence}</span>
                            ) : (
                              <span className="text-xs text-gray-500">One-time</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                title="Start Audit"
                                onClick={() => handleViewAuditDetails(audit)}
                              >
                                <ListChecks className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                title="View Details"
                                onClick={() => handleViewAuditDetails(audit)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                          No upcoming audits found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Completed Audits & Inspections</CardTitle>
                <CardDescription>
                  Review completed audits and their findings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>Conducted By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedAudits.length > 0 ? (
                      completedAudits.map((audit) => (
                        <TableRow key={audit.id}>
                          <TableCell className="font-medium">{audit.id}</TableCell>
                          <TableCell>{audit.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ShieldCheck className="h-4 w-4 mr-1 text-fsms-blue" />
                              {audit.standard}
                            </div>
                          </TableCell>
                          <TableCell>{audit.completedDate}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${audit.findings > 0 ? 'text-amber-600 bg-amber-100' : 'text-green-600 bg-green-100'}`}>
                              {audit.findings} {audit.findings === 1 ? 'finding' : 'findings'}
                            </span>
                          </TableCell>
                          <TableCell>{audit.assignedTo}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                title="View Report"
                                onClick={() => handleViewAuditDetails(audit)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" title="Download Report">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                          No completed audits found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Audit Templates</CardTitle>
                <CardDescription>
                  Manage and customize audit templates for different standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <div className="flex space-x-3">
                    <Select 
                      value={selectedStandard}
                      onValueChange={setSelectedStandard}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a standard" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Standards</SelectItem>
                        {Object.keys(templateOptions).map(standard => (
                          <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="flex items-center gap-2">
                    <FilePlus className="h-4 w-4" />
                    <span>Create Template</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(selectedStandard ? templateOptions[selectedStandard] : []).map((template, index) => (
                    <Card key={index} className="hover:shadow-md transition-all duration-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-fsms-blue" />
                          {template}
                        </CardTitle>
                        <CardDescription className="text-xs flex items-center gap-1">
                          {selectedStandard}
                          {recommendedRecurrence[template] && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {recommendedRecurrence[template]}
                            </Badge>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500 mb-3">
                          {checklistCategories[template] ? (
                            <p>{checklistCategories[template].length} checklist categories</p>
                          ) : (
                            <p>Customizable audit template</p>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" className="text-xs">
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {selectedAudit && (
        <AuditDetailsDialog 
          audit={selectedAudit}
          isOpen={isAuditDetailsOpen}
          onClose={() => setIsAuditDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default InternalAudits;
