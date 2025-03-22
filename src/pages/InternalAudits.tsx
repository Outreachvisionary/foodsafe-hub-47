
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FileCheck, CalendarClock, ListChecks, ShieldCheck, Camera, Check, Download, FilePlus, Filter, ClipboardList, FileText, Search, PlusCircle, Calendar } from 'lucide-react';

// Mock data for audits
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
];

// Template options for each standard
const templateOptions = {
  'SQF': [
    'SQF Food Safety Audit',
    'SQF Food Quality Audit',
    'SQF System Elements',
    'SQF GMP Audit',
  ],
  'ISO 22000': [
    'ISO 22000 Internal Audit',
    'ISO 22000 Management Review',
    'ISO 22000 Verification Activities',
  ],
  'FSSC 22000': [
    'FSSC 22000 System Audit',
    'FSSC 22000 PRP Audit',
    'FSSC 22000 HACCP Plan Review',
  ],
  'HACCP': [
    'HACCP Plan Verification',
    'CCP Monitoring Audit',
    'Prerequisite Program Audit',
  ],
  'BRC GS2': [
    'BRC Senior Management Commitment',
    'BRC HACCP Plan Audit',
    'BRC Site Standards Audit',
    'BRC Product Control Audit',
  ],
  'GMP': [
    'Personnel Practices',
    'Facility and Equipment',
    'Sanitation',
    'Pest Control Inspection',
  ]
};

// Checklist categories for each template
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
  ]
};

const InternalAudits = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('SQF');

  const form = useForm({
    defaultValues: {
      title: '',
      standard: 'SQF',
      template: '',
      scheduledDate: '',
      assignedTo: '',
    }
  });

  const filteredAudits = mockAudits.filter(audit => {
    const query = searchQuery.toLowerCase();
    return (
      audit.title.toLowerCase().includes(query) ||
      audit.standard.toLowerCase().includes(query) ||
      audit.status.toLowerCase().includes(query) ||
      audit.assignedTo.toLowerCase().includes(query)
    );
  });

  const upcomingAudits = filteredAudits.filter(audit => 
    audit.status === 'Scheduled' || audit.status === 'In Progress'
  );
  
  const completedAudits = filteredAudits.filter(audit => 
    audit.status === 'Completed'
  );

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    setIsNewAuditDialogOpen(false);
    form.reset();
  };

  const handleStandardChange = (e) => {
    const standard = e.target.value;
    setSelectedStandard(standard);
    form.setValue('standard', standard);
    form.setValue('template', '');
  };

  const getTemplateOptions = () => {
    return templateOptions[selectedStandard] || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'In Progress':
        return 'text-blue-600 bg-blue-100';
      case 'Scheduled':
        return 'text-amber-600 bg-amber-100';
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
          
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            
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
                      <FormItem>
                        <FormLabel>Standard</FormLabel>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={selectedStandard}
                          onChange={handleStandardChange}
                        >
                          {Object.keys(templateOptions).map(standard => (
                            <option key={standard} value={standard}>{standard}</option>
                          ))}
                        </select>
                      </FormItem>
                      
                      <FormField
                        control={form.control}
                        name="template"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Audit Template</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                                {...field}
                              >
                                <option value="">Select a template</option>
                                {getTemplateOptions().map(template => (
                                  <option key={template} value={template}>{template}</option>
                                ))}
                              </select>
                            </FormControl>
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
                          <TableCell>{audit.assignedTo}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon" title="Start Audit">
                                <ListChecks className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" title="View Details">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
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
                              <Button variant="outline" size="icon" title="View Report">
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
                    <select 
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={selectedStandard}
                      onChange={(e) => setSelectedStandard(e.target.value)}
                    >
                      <option value="">All Standards</option>
                      {Object.keys(templateOptions).map(standard => (
                        <option key={standard} value={standard}>{standard}</option>
                      ))}
                    </select>
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
                        <CardDescription className="text-xs">{selectedStandard}</CardDescription>
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
    </div>
  );
};

export default InternalAudits;
