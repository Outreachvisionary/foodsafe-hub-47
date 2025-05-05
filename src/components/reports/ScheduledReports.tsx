
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  FileText,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Trash,
  Users
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  schedule: string;
  lastRun: string | null;
  nextRun: string;
  status: 'active' | 'paused';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  reportType: string;
}

const ScheduledReports = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Monthly Training Compliance',
      description: 'Summary of training compliance across departments',
      schedule: 'Monthly (1st day)',
      lastRun: '2024-05-01',
      nextRun: '2024-06-01',
      status: 'active',
      recipients: ['quality@example.com', 'training@example.com'],
      format: 'pdf',
      reportType: 'Training'
    },
    {
      id: '2',
      name: 'Weekly Document Review Status',
      description: 'Status of documents under review',
      schedule: 'Weekly (Monday)',
      lastRun: '2024-05-06',
      nextRun: '2024-05-13',
      status: 'active',
      recipients: ['document.control@example.com'],
      format: 'excel',
      reportType: 'Documents'
    },
    {
      id: '3',
      name: 'Quarterly Audit Findings',
      description: 'Summary of audit findings by category',
      schedule: 'Quarterly',
      lastRun: '2024-04-01',
      nextRun: '2024-07-01',
      status: 'paused',
      recipients: ['management@example.com', 'qc@example.com'],
      format: 'pdf',
      reportType: 'Audits'
    },
    {
      id: '4',
      name: 'Daily Non-Conformance Report',
      description: 'New non-conformances in the last 24 hours',
      schedule: 'Daily',
      lastRun: '2024-05-07',
      nextRun: '2024-05-08',
      status: 'active',
      recipients: ['qa@example.com'],
      format: 'csv',
      reportType: 'Non-Conformances'
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentReport, setCurrentReport] = useState<ScheduledReport | null>(null);
  
  const [newReport, setNewReport] = useState<Partial<ScheduledReport>>({
    name: '',
    description: '',
    schedule: 'Weekly (Monday)',
    status: 'active',
    recipients: [],
    format: 'pdf',
    reportType: 'Training'
  });
  const [recipientEmail, setRecipientEmail] = useState('');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setCurrentReport(null);
    setNewReport({
      name: '',
      description: '',
      schedule: 'Weekly (Monday)',
      status: 'active',
      recipients: [],
      format: 'pdf',
      reportType: 'Training'
    });
    setRecipientEmail('');
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (report: ScheduledReport) => {
    setIsEditMode(true);
    setCurrentReport(report);
    setNewReport({
      name: report.name,
      description: report.description,
      schedule: report.schedule,
      status: report.status,
      recipients: [...report.recipients],
      format: report.format,
      reportType: report.reportType
    });
    setRecipientEmail('');
    setIsDialogOpen(true);
  };

  const handleAddRecipient = () => {
    if (!recipientEmail) return;
    
    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(recipientEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setNewReport({
      ...newReport,
      recipients: [...(newReport.recipients || []), recipientEmail]
    });
    setRecipientEmail('');
  };

  const handleRemoveRecipient = (email: string) => {
    setNewReport({
      ...newReport,
      recipients: newReport.recipients?.filter(r => r !== email) || []
    });
  };

  const handleToggleStatus = (reportId: string, newStatus: 'active' | 'paused') => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return { ...report, status: newStatus };
      }
      return report;
    });
    
    setReports(updatedReports);
    
    toast({
      title: `Report ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
      description: `Schedule has been ${newStatus === 'active' ? 'activated' : 'paused'} successfully`,
    });
  };

  const handleDelete = (reportId: string) => {
    setReports(reports.filter(report => report.id !== reportId));
    
    toast({
      title: "Report Deleted",
      description: "Scheduled report has been deleted successfully",
    });
  };

  const handleRunNow = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    
    toast({
      title: "Report Running",
      description: `"${report.name}" is being generated and will be sent shortly`,
    });
  };

  const handleSaveReport = () => {
    if (!newReport.name || !newReport.schedule) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!newReport.recipients || newReport.recipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one recipient email",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && currentReport) {
      // Update existing report
      const updatedReports = reports.map(report => {
        if (report.id === currentReport.id) {
          return {
            ...report,
            ...newReport,
            lastRun: report.lastRun,
            nextRun: report.nextRun
          } as ScheduledReport;
        }
        return report;
      });
      
      setReports(updatedReports);
      
      toast({
        title: "Report Updated",
        description: `"${newReport.name}" has been updated successfully`,
      });
    } else {
      // Create new report
      const today = new Date();
      let nextRun: Date;
      
      // Simple logic to calculate next run date based on schedule
      if (newReport.schedule?.startsWith('Daily')) {
        nextRun = new Date(today);
        nextRun.setDate(nextRun.getDate() + 1);
      } else if (newReport.schedule?.startsWith('Weekly')) {
        nextRun = new Date(today);
        nextRun.setDate(nextRun.getDate() + (7 - nextRun.getDay() + 1) % 7 + 1);
      } else if (newReport.schedule?.startsWith('Monthly')) {
        nextRun = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      } else {
        // Default to tomorrow
        nextRun = new Date(today);
        nextRun.setDate(nextRun.getDate() + 1);
      }
      
      const newId = (reports.length + 1).toString();
      const newReportEntry: ScheduledReport = {
        id: newId,
        name: newReport.name || `New Report ${newId}`,
        description: newReport.description || '',
        schedule: newReport.schedule || 'Weekly (Monday)',
        lastRun: null,
        nextRun: nextRun.toISOString().split('T')[0],
        status: newReport.status || 'active',
        recipients: newReport.recipients || [],
        format: newReport.format || 'pdf',
        reportType: newReport.reportType || 'Training'
      };
      
      setReports([...reports, newReportEntry]);
      
      toast({
        title: "Report Created",
        description: `"${newReportEntry.name}" has been scheduled successfully`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: 'active' | 'paused') => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Paused</Badge>
    );
  };

  const getFormatBadge = (format: 'pdf' | 'excel' | 'csv') => {
    switch (format) {
      case 'pdf':
        return <Badge className="bg-blue-100 text-blue-800">PDF</Badge>;
      case 'excel':
        return <Badge className="bg-green-100 text-green-800">Excel</Badge>;
      case 'csv':
        return <Badge className="bg-amber-100 text-amber-800">CSV</Badge>;
      default:
        return <Badge variant="outline">{format}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Scheduled Reports</h3>
          <p className="text-muted-foreground">Manage automated report delivery schedules</p>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schedules..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Schedules</CardTitle>
          <CardDescription>View and manage your scheduled reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Calendar className="h-8 w-8 mb-2" />
                        <p>No scheduled reports found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map(report => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div>
                          {report.name}
                          <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                          <Badge variant="outline" className="mt-1">{report.reportType}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{report.schedule}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {report.nextRun}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{getFormatBadge(report.format)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{report.recipients.length}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRunNow(report.id)}>
                              <Play className="h-4 w-4 mr-2" />
                              Run Now
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(report)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(
                              report.id, 
                              report.status === 'active' ? 'paused' : 'active'
                            )}>
                              {report.status === 'active' ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(report.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="text-sm text-muted-foreground">
            {filteredReports.length} schedule{filteredReports.length !== 1 ? 's' : ''} found
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Scheduled Report' : 'Create New Scheduled Report'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update the settings for this scheduled report'
                : 'Set up an automated schedule for report generation and delivery'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input 
                id="reportName" 
                placeholder="Enter report name"
                value={newReport.name || ''}
                onChange={(e) => setNewReport({...newReport, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportDescription">Description (optional)</Label>
              <Input 
                id="reportDescription" 
                placeholder="Enter report description"
                value={newReport.description || ''}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select 
                  value={newReport.reportType} 
                  onValueChange={(value) => setNewReport({...newReport, reportType: value})}
                >
                  <SelectTrigger id="reportType">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Documents">Documents</SelectItem>
                    <SelectItem value="Audits">Audits</SelectItem>
                    <SelectItem value="Non-Conformances">Non-Conformances</SelectItem>
                    <SelectItem value="CAPA">CAPA</SelectItem>
                    <SelectItem value="Suppliers">Suppliers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Select 
                  value={newReport.schedule} 
                  onValueChange={(value) => setNewReport({...newReport, schedule: value})}
                >
                  <SelectTrigger id="schedule">
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly (Monday)">Weekly (Monday)</SelectItem>
                    <SelectItem value="Weekly (Friday)">Weekly (Friday)</SelectItem>
                    <SelectItem value="Monthly (1st day)">Monthly (1st day)</SelectItem>
                    <SelectItem value="Monthly (15th day)">Monthly (15th day)</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Report Format</Label>
                <Select 
                  value={newReport.format} 
                  onValueChange={(value) => setNewReport({...newReport, format: value as 'pdf' | 'excel' | 'csv'})}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between space-y-0 pt-6">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable this schedule
                  </p>
                </div>
                <Switch 
                  id="active" 
                  checked={newReport.status === 'active'}
                  onCheckedChange={(checked) => 
                    setNewReport({...newReport, status: checked ? 'active' : 'paused'})
                  }
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Recipients</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter email address" 
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
                <Button type="button" onClick={handleAddRecipient}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add</span>
                </Button>
              </div>
              
              <div className="space-y-1">
                {(newReport.recipients || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No recipients added yet</p>
                ) : (
                  (newReport.recipients || []).map((email, index) => (
                    <div key={index} className="flex items-center justify-between py-1 px-2 rounded-md bg-muted">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{email}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveRecipient(email)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReport}>
              {isEditMode ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledReports;
