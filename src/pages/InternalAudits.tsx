
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NestedTabs } from '@/components/ui/nested-tabs';
import { 
  Badge, 
  Input, 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Textarea,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  ScrollArea
} from '@/components/ui';
import { 
  FileCheck, CalendarClock, ListChecks, ShieldCheck, Camera, Check, 
  Download, FilePlus, Filter, ClipboardList, FileText, Search, 
  PlusCircle, Calendar as CalendarIcon, AlertTriangle, Info, Clock, RefreshCw,
  ChevronDown, Pencil, X, Upload
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AuditDetailsDialog from '@/components/audits/AuditDetailsDialog';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ExpiringCertificationsCard from '@/components/training/dashboard/ExpiringCertificationsCard';
import { useAudits } from '@/hooks/useAudits';

// Define the audit form schema
const auditFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  standard: z.string().min(1, { message: "Standard is required." }),
  audit_type: z.string().min(1, { message: "Audit type is required." }),
  scheduledDate: z.date({ required_error: "Scheduled date is required." }),
  assignedTo: z.string().min(1, { message: "Assigned auditor is required." }),
  department: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

type AuditFormValues = z.infer<typeof auditFormSchema>;

// Define the finding form schema
const findingFormSchema = z.object({
  description: z.string().min(3, { message: "Description must be at least 3 characters." }),
  severity: z.enum(["Minor", "Major", "Critical"], { required_error: "Severity is required." }),
  assigned_to: z.string().optional(),
  evidence: z.string().optional(),
});

type FindingFormValues = z.infer<typeof findingFormSchema>;

const InternalAudits: React.FC = () => {
  const { toast } = useToast();
  const [isCreateAuditOpen, setIsCreateAuditOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFindingDialogOpen, setIsFindingDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAuditId, setActiveAuditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [isCalendarView, setIsCalendarView] = useState(false);
  
  const {
    audits,
    selectedAudit,
    findings,
    loading,
    loadAudits,
    loadAudit,
    loadFindings,
    addAudit,
    editAudit,
    removeAudit,
    addFinding,
    editFinding,
    removeFinding,
    exportReport,
    setSelectedAudit
  } = useAudits();

  // Create Audit Form
  const auditForm = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      title: '',
      standard: '',
      audit_type: '',
      department: '',
      location: '',
      description: '',
    },
  });

  // Create Finding Form
  const findingForm = useForm<FindingFormValues>({
    resolver: zodResolver(findingFormSchema),
    defaultValues: {
      description: '',
      severity: 'Minor',
      assigned_to: '',
      evidence: '',
    },
  });

  // Handle view audit details
  const handleViewAudit = async (auditId: string) => {
    const audit = await loadAudit(auditId);
    if (audit) {
      setActiveAuditId(auditId);
      setIsDialogOpen(true);
    }
  };

  // Create a new audit
  const handleCreateAudit = async (values: AuditFormValues) => {
    const newAudit = {
      title: values.title,
      standard: values.standard,
      status: 'Scheduled' as const,
      scheduledDate: format(values.scheduledDate, 'yyyy-MM-dd'),
      completedDate: null,
      assignedTo: values.assignedTo,
      findings: 0,
      audit_type: values.audit_type,
      department: values.department,
      location: values.location,
      description: values.description,
    };

    const result = await addAudit(newAudit);
    if (result) {
      setIsCreateAuditOpen(false);
      auditForm.reset();
      toast({
        title: "Audit Created",
        description: "The audit has been scheduled successfully.",
      });
    }
  };

  // Create a new finding
  const handleCreateFinding = async (values: FindingFormValues) => {
    if (!activeAuditId) return;

    const newFinding = {
      audit_id: activeAuditId,
      description: values.description,
      severity: values.severity as 'Minor' | 'Major' | 'Critical',
      status: 'Open' as const,
      assigned_to: values.assigned_to,
      evidence: values.evidence,
    };

    const result = await addFinding(newFinding);
    if (result) {
      setIsFindingDialogOpen(false);
      findingForm.reset();
      toast({
        title: "Finding Added",
        description: "The finding has been recorded successfully.",
      });
    }
  };

  // Handle schedule audit
  const handleScheduleAudit = () => {
    setIsCreateAuditOpen(true);
  };

  // Handle add finding
  const handleAddFinding = () => {
    if (!activeAuditId) {
      toast({
        title: "No Audit Selected",
        description: "Please select an audit before adding a finding.",
        variant: "destructive",
      });
      return;
    }
    setIsFindingDialogOpen(true);
  };

  // Handle export report
  const handleExportReport = async (format: 'pdf' | 'excel' = 'pdf') => {
    if (!activeAuditId) {
      toast({
        title: "No Audit Selected",
        description: "Please select an audit before exporting a report.",
        variant: "destructive",
      });
      return;
    }

    const result = await exportReport(activeAuditId, format);
    if (result) {
      toast({
        title: "Report Exported",
        description: `The audit report has been exported as ${format.toUpperCase()}.`,
      });
    }
  };

  // Handle filtering audits
  const filteredAudits = audits.filter(audit => {
    // Apply search filter
    const matchesSearch = audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          audit.standard.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(audit.status);
    
    return matchesSearch && matchesStatus;
  });

  // Use nested tabs for sections
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FileCheck className="h-4 w-4" />,
    },
    {
      id: 'audits',
      label: 'Audits',
      icon: <ClipboardList className="h-4 w-4" />,
      children: [
        {
          id: 'scheduled',
          label: 'Scheduled',
          icon: <CalendarClock className="h-4 w-4" />,
        },
        {
          id: 'in-progress',
          label: 'In Progress',
          icon: <Clock className="h-4 w-4" />,
        },
        {
          id: 'completed',
          label: 'Completed',
          icon: <Check className="h-4 w-4" />,
        },
      ],
    },
    {
      id: 'findings',
      label: 'Findings',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  // On tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Toggle between list and calendar view
  const handleToggleView = () => {
    setIsCalendarView(!isCalendarView);
  };

  // Close the audit details dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setActiveAuditId(null);
    setSelectedAudit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Audits & Inspections</h1>
          <p className="text-gray-600 mt-1">Manage all your internal and external audit programs</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleToggleView}>
            {isCalendarView ? 
              <ClipboardList className="mr-2 h-4 w-4" /> : 
              <Calendar className="mr-2 h-4 w-4" />
            }
            {isCalendarView ? 'List View' : 'Calendar View'}
          </Button>
          <Button onClick={handleScheduleAudit}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Audit
          </Button>
        </div>
      </div>
      
      <NestedTabs 
        tabs={tabs} 
        onTabChange={handleTabChange}
        defaultValue="dashboard"
      >
        {/* Dashboard Content */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Upcoming Audits</CardTitle>
                <CardDescription>Next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {filteredAudits.filter(a => a.status === 'Scheduled' || a.status === 'Due Soon').length}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4 text-blue-500" />
                  <span>
                    {filteredAudits.filter(a => a.status === 'Scheduled' || a.status === 'Due Soon').length > 0 ? 
                      `Next: ${filteredAudits.filter(a => a.status === 'Scheduled' || a.status === 'Due Soon')[0].title} - ${filteredAudits.filter(a => a.status === 'Scheduled' || a.status === 'Due Soon')[0].scheduledDate}` : 
                      'No upcoming audits'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Open Findings</CardTitle>
                <CardDescription>Requiring action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {findings.filter(f => f.status === 'Open').length}
                </div>
                <div className="flex items-center text-sm">
                  <AlertTriangle className="mr-1 h-4 w-4 text-red-500" />
                  <span>
                    {findings.filter(f => f.severity === 'Critical' && f.status === 'Open').length} critical, 
                    {' '}{findings.filter(f => f.severity === 'Major' && f.status === 'Open').length} major, 
                    {' '}{findings.filter(f => f.severity === 'Minor' && f.status === 'Open').length} minor
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <ExpiringCertificationsCard
              count={3}
              onViewAll={() => {
                // Navigate to certification page
                console.log("Navigate to certifications view");
              }}
              onScheduleAudit={(cert) => {
                // Pre-fill audit form with certification details
                auditForm.setValue('title', `${cert.name} Certification Audit - ${cert.employee}`);
                auditForm.setValue('standard', cert.name);
                auditForm.setValue('audit_type', 'Certification');
                // Set date to two weeks from now
                const twoWeeksFromNow = new Date();
                twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
                auditForm.setValue('scheduledDate', twoWeeksFromNow);
                setIsCreateAuditOpen(true);
              }}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Activity</CardTitle>
              <CardDescription>Last 5 audit activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredAudits.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No audit activities found
                  </div>
                ) : (
                  filteredAudits.slice(0, 5).map((audit, index) => {
                    let icon;
                    if (audit.status === 'Completed') {
                      icon = <Check className="h-5 w-5 text-green-500" />;
                    } else if (audit.status === 'In Progress') {
                      icon = <Clock className="h-5 w-5 text-blue-500" />;
                    } else if (audit.status === 'Scheduled') {
                      icon = <Calendar className="h-5 w-5 text-purple-500" />;
                    } else {
                      icon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
                    }
                    
                    return (
                      <div key={index} className="flex items-start">
                        <div className="mr-4 mt-0.5">
                          {icon}
                        </div>
                        <div>
                          <p className="font-medium">{audit.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {audit.status === 'Completed' 
                              ? `Completed: ${audit.completedDate}` 
                              : `Scheduled: ${audit.scheduledDate}`} by {audit.assignedTo}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Scheduled Audits Content */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Audits</CardTitle>
                  <CardDescription>Upcoming and planned audits</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleToggleView}>
                  {isCalendarView ? <ClipboardList className="mr-2 h-4 w-4" /> : <Calendar className="mr-2 h-4 w-4" />}
                  {isCalendarView ? 'List View' : 'Calendar View'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search audits..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter Status
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes('Scheduled')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, 'Scheduled']);
                        } else {
                          setStatusFilter(statusFilter.filter(s => s !== 'Scheduled'));
                        }
                      }}
                    >
                      Scheduled
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes('In Progress')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, 'In Progress']);
                        } else {
                          setStatusFilter(statusFilter.filter(s => s !== 'In Progress'));
                        }
                      }}
                    >
                      In Progress
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes('Completed')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, 'Completed']);
                        } else {
                          setStatusFilter(statusFilter.filter(s => s !== 'Completed'));
                        }
                      }}
                    >
                      Completed
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes('Due Soon')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, 'Due Soon']);
                        } else {
                          setStatusFilter(statusFilter.filter(s => s !== 'Due Soon'));
                        }
                      }}
                    >
                      Due Soon
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {isCalendarView ? (
                <div className="border rounded-md p-4">
                  <div className="text-center text-muted-foreground">
                    <p>Calendar view will be implemented here.</p>
                    <p className="text-sm mt-2">Showing {filteredAudits.length} audits</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Audit Type</TableHead>
                        <TableHead>Standard</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Auditor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex justify-center">
                              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredAudits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            No audits found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAudits.map((audit) => (
                          <TableRow key={audit.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewAudit(audit.id)}>
                            <TableCell className="font-medium">{audit.audit_type || audit.title}</TableCell>
                            <TableCell>{audit.standard}</TableCell>
                            <TableCell>{audit.scheduledDate}</TableCell>
                            <TableCell>{audit.assignedTo}</TableCell>
                            <TableCell>
                              {audit.status === 'Scheduled' && <Badge>Scheduled</Badge>}
                              {audit.status === 'In Progress' && <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>}
                              {audit.status === 'Completed' && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
                              {audit.status === 'Due Soon' && <Badge variant="destructive">Due Soon</Badge>}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={(e) => {
                                e.stopPropagation();
                                handleViewAudit(audit.id);
                              }}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* In Progress Audits Content */}
        <TabsContent value="in-progress">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>In-Progress Audits</CardTitle>
                  <CardDescription>Currently active audits</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit Type</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Auditor</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAudits
                        .filter(audit => audit.status === 'In Progress')
                        .map((audit) => (
                          <TableRow key={audit.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{audit.audit_type || audit.title}</TableCell>
                            <TableCell>{audit.standard}</TableCell>
                            <TableCell>{audit.scheduledDate}</TableCell>
                            <TableCell>{audit.assignedTo}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{audit.findings}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewAudit(audit.id)}>
                                  View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => {
                                  setActiveAuditId(audit.id);
                                  handleAddFinding();
                                }}>
                                  Add Finding
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                    {!loading && filteredAudits.filter(audit => audit.status === 'In Progress').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No audits currently in progress
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Completed Audits Content */}
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Completed Audits</CardTitle>
                  <CardDescription>Review past audit results</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit Type</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Auditor</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>Report</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAudits
                        .filter(audit => audit.status === 'Completed')
                        .map((audit) => (
                          <TableRow key={audit.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{audit.audit_type || audit.title}</TableCell>
                            <TableCell>{audit.standard}</TableCell>
                            <TableCell>{audit.completedDate}</TableCell>
                            <TableCell>{audit.assignedTo}</TableCell>
                            <TableCell>
                              <Badge variant={audit.findings > 0 ? "outline" : "secondary"} className={
                                audit.findings > 0 ? "bg-amber-100 text-amber-800" : ""
                              }>
                                {audit.findings}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs flex items-center"
                                  onClick={() => handleExportReport('pdf')}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  PDF
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs flex items-center"
                                  onClick={() => handleExportReport('excel')}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Excel
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleViewAudit(audit.id)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                    {!loading && filteredAudits.filter(audit => audit.status === 'Completed').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No completed audits found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Findings Content */}
        <TabsContent value="findings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Findings</CardTitle>
                  <CardDescription>Track and resolve audit findings</CardDescription>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Finding</TableHead>
                      <TableHead>Audit</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : findings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No findings have been recorded
                        </TableCell>
                      </TableRow>
                    ) : (
                      findings.map((finding) => {
                        const relatedAudit = audits.find(a => a.id === finding.audit_id);
                        
                        return (
                          <TableRow key={finding.id} className="hover:bg-gray-50">
                            <TableCell className="max-w-md truncate">
                              {finding.description}
                            </TableCell>
                            <TableCell>{relatedAudit?.title || 'Unknown'}</TableCell>
                            <TableCell>
                              <Badge variant={
                                finding.severity === 'Critical' ? 'destructive' :
                                finding.severity === 'Major' ? 'default' : 'outline'
                              }>
                                {finding.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={finding.status === 'Closed' ? 'outline' : 'secondary'} className={
                                finding.status === 'Closed' ? "bg-green-100 text-green-800" : ""
                              }>
                                {finding.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{finding.assigned_to || 'Unassigned'}</TableCell>
                            <TableCell>{finding.created_at ? new Date(finding.created_at).toLocaleDateString() : 'Unknown'}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    // View finding details
                                    handleViewAudit(finding.audit_id);
                                  }}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    // Create CAPA from finding
                                    toast({
                                      title: "Create CAPA",
                                      description: "Creating CAPA from finding",
                                    });
                                  }}
                                >
                                  Create CAPA
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Content */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Reports</CardTitle>
                  <CardDescription>Analytics and trend reports</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary Report</SelectItem>
                      <SelectItem value="findings">Findings Analysis</SelectItem>
                      <SelectItem value="compliance">Compliance Rate</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Audit Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p>Audit status chart will be displayed here</p>
                        <p className="text-xs mt-2">
                          Scheduled: {audits.filter(a => a.status === 'Scheduled').length} |
                          In Progress: {audits.filter(a => a.status === 'In Progress').length} |
                          Completed: {audits.filter(a => a.status === 'Completed').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Findings by Severity</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p>Findings severity chart will be displayed here</p>
                        <p className="text-xs mt-2">
                          Critical: {findings.filter(f => f.severity === 'Critical').length} |
                          Major: {findings.filter(f => f.severity === 'Major').length} |
                          Minor: {findings.filter(f => f.severity === 'Minor').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recently Generated Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Audit</TableHead>
                        <TableHead>Generated Date</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No reports have been generated yet
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </NestedTabs>
      
      {/* Create Audit Dialog */}
      <Dialog open={isCreateAuditOpen} onOpenChange={setIsCreateAuditOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Schedule New Audit</DialogTitle>
            <DialogDescription>
              Create a new audit schedule. Fill out the information below to get started.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...auditForm}>
            <form onSubmit={auditForm.handleSubmit(handleCreateAudit)} className="space-y-4">
              <FormField
                control={auditForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audit Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Annual SQF Internal Audit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={auditForm.control}
                  name="standard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select standard" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SQF">SQF</SelectItem>
                          <SelectItem value="FSSC 22000">FSSC 22000</SelectItem>
                          <SelectItem value="BRC">BRC</SelectItem>
                          <SelectItem value="ISO 9001">ISO 9001</SelectItem>
                          <SelectItem value="HACCP">HACCP</SelectItem>
                          <SelectItem value="GMP">GMP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={auditForm.control}
                  name="audit_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audit Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Internal">Internal</SelectItem>
                          <SelectItem value="External">External</SelectItem>
                          <SelectItem value="Certification">Certification</SelectItem>
                          <SelectItem value="Supplier">Supplier</SelectItem>
                          <SelectItem value="Mock Recall">Mock Recall</SelectItem>
                          <SelectItem value="Gap Assessment">Gap Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={auditForm.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Scheduled Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={auditForm.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select auditor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="John Smith">John Smith</SelectItem>
                          <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                          <SelectItem value="Robert Williams">Robert Williams</SelectItem>
                          <SelectItem value="External - TÜV">External - TÜV</SelectItem>
                          <SelectItem value="Amanda Lee">Amanda Lee</SelectItem>
                          <SelectItem value="David Chen">David Chen</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={auditForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Production">Production</SelectItem>
                          <SelectItem value="Quality">Quality</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                          <SelectItem value="All Departments">All Departments</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={auditForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Main Production">Main Production</SelectItem>
                          <SelectItem value="Packaging">Packaging</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                          <SelectItem value="All Facilities">All Facilities</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={auditForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description of the audit"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional. Provide additional details about the audit scope.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsCreateAuditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Audit</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Finding Dialog */}
      <Dialog open={isFindingDialogOpen} onOpenChange={setIsFindingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Audit Finding</DialogTitle>
            <DialogDescription>
              Record a new finding for this audit.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...findingForm}>
            <form onSubmit={findingForm.handleSubmit(handleCreateFinding)} className="space-y-4">
              <FormField
                control={findingForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finding Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the non-conformance or observation"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={findingForm.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Minor">Minor</SelectItem>
                        <SelectItem value="Major">Major</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={findingForm.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to someone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="Robert Williams">Robert Williams</SelectItem>
                        <SelectItem value="Amanda Lee">Amanda Lee</SelectItem>
                        <SelectItem value="David Chen">David Chen</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Optional. Assign someone to address this finding.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={findingForm.control}
                name="evidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evidence</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide evidence or additional details"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional. Describe the evidence that supports this finding.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4">
                <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Drag & drop evidence files here</p>
                  <p className="text-xs text-muted-foreground">or</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    Upload Files
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsFindingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Finding</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Audit Details Dialog */}
      {selectedAudit && (
        <AuditDetailsDialog
          audit={selectedAudit}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default InternalAudits;
