
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  Mail, 
  Users, 
  Plus,
  Copy,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ScheduledReportProps {}

const ScheduledReports: React.FC<ScheduledReportProps> = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCreateSchedule = () => {
    toast({
      title: "Scheduled Report Created",
      description: "Your scheduled report has been created and will run as configured."
    });
    setIsCreateDialogOpen(false);
  };
  
  const handleDeleteSchedule = (id: string) => {
    toast({
      title: "Schedule Deleted",
      description: "The scheduled report has been deleted."
    });
  };
  
  const handleToggleSchedule = (id: string, isEnabled: boolean) => {
    toast({
      title: isEnabled ? "Schedule Enabled" : "Schedule Disabled",
      description: isEnabled 
        ? "The scheduled report has been enabled and will run as configured." 
        : "The scheduled report has been disabled and will not run until re-enabled."
    });
  };
  
  // Sample scheduled reports
  const scheduledReports = [
    {
      id: 'sr-1',
      name: 'Weekly Document Compliance',
      description: 'Summary of document statuses and expiring documents',
      frequency: 'Weekly',
      day: 'Monday',
      time: '08:00 AM',
      recipients: 'Quality Team, Management',
      lastRun: '2023-08-28',
      nextRun: '2023-09-04',
      status: 'active',
      format: 'PDF',
      type: 'document'
    },
    {
      id: 'sr-2',
      name: 'Monthly CAPA Status Report',
      description: 'Overview of CAPA statuses, closure rates, and effectiveness',
      frequency: 'Monthly',
      day: '1st',
      time: '09:00 AM',
      recipients: 'Executive Team, Department Heads',
      lastRun: '2023-08-01',
      nextRun: '2023-09-01',
      status: 'active',
      format: 'Excel',
      type: 'capa'
    },
    {
      id: 'sr-3',
      name: 'Quarterly Audit Summary',
      description: 'Summary of all audits, findings, and CAPA closure rates',
      frequency: 'Quarterly',
      day: '1st of Quarter',
      time: '10:00 AM',
      recipients: 'Board, Executive Team',
      lastRun: '2023-07-01',
      nextRun: '2023-10-01',
      status: 'active',
      format: 'PDF',
      type: 'audit'
    },
    {
      id: 'sr-4',
      name: 'Training Gap Analysis',
      description: 'Analysis of training compliance and certification status',
      frequency: 'Monthly',
      day: '15th',
      time: '08:00 AM',
      recipients: 'HR, Department Heads',
      lastRun: '2023-08-15',
      nextRun: '2023-09-15',
      status: 'inactive',
      format: 'Excel',
      type: 'training'
    }
  ];
  
  // Get icon for report type
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'capa':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'audit':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'training':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <BarChart className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scheduled Reports</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Scheduled Report</DialogTitle>
              <DialogDescription>
                Configure automatic generation and distribution of reports
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="schedule-name">Schedule Name</Label>
                  <Input id="schedule-name" placeholder="Enter schedule name" />
                </div>
                
                <div>
                  <Label htmlFor="report-template">Report Template</Label>
                  <Select>
                    <SelectTrigger id="report-template">
                      <SelectValue placeholder="Select report template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doc-expiry">Document Expiry Summary</SelectItem>
                      <SelectItem value="capa-status">CAPA Status Report</SelectItem>
                      <SelectItem value="audit-findings">Audit Findings Summary</SelectItem>
                      <SelectItem value="training-compliance">Training Compliance</SelectItem>
                      <SelectItem value="custom">Custom Report...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="day">Day</Label>
                    <Select defaultValue="monday">
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="first-day">1st of Month</SelectItem>
                        <SelectItem value="last-day">Last Day of Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Select defaultValue="0800">
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0600">06:00 AM</SelectItem>
                      <SelectItem value="0800">08:00 AM</SelectItem>
                      <SelectItem value="1000">10:00 AM</SelectItem>
                      <SelectItem value="1200">12:00 PM</SelectItem>
                      <SelectItem value="1400">02:00 PM</SelectItem>
                      <SelectItem value="1600">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="format">Report Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Recipients</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recipient-quality" defaultChecked />
                      <Label htmlFor="recipient-quality">Quality Team</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recipient-management" defaultChecked />
                      <Label htmlFor="recipient-management">Management Team</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recipient-department" />
                      <Label htmlFor="recipient-department">Department Heads</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recipient-board" />
                      <Label htmlFor="recipient-board">Board Members</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="custom-recipients">Additional Email Recipients</Label>
                  <Textarea 
                    id="custom-recipients" 
                    placeholder="Enter email addresses separated by commas" 
                    className="h-20"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="notify-failures" defaultChecked />
                  <Label htmlFor="notify-failures">
                    Notify administrators if report generation fails
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSchedule}>
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getReportTypeIcon(report.type)}
                      <div className="ml-2">
                        <div className="font-medium">{report.name}</div>
                        <div className="text-xs text-gray-500">{report.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{report.frequency}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {report.day} at {report.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{report.nextRun}</div>
                    <div className="text-xs text-gray-500">
                      Last: {report.lastRun}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="truncate max-w-[120px]">{report.recipients}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {report.format}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                      {report.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toast({
                          title: "Run Now",
                          description: `${report.name} is being generated immediately.`
                        })}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleToggleSchedule(report.id, report.status !== 'active')}
                      >
                        {report.status === 'active' 
                          ? <PauseIcon className="h-4 w-4" /> 
                          : <PlayIcon className="h-4 w-4" />
                        }
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toast({
                          title: "Edit Schedule",
                          description: "Editing scheduled reports will be available soon."
                        })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteSchedule(report.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule History</CardTitle>
          <CardDescription>
            Recent report generation history and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-md">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <div className="font-medium">Weekly Document Compliance</div>
                  <div className="text-xs text-gray-600">Generated successfully on Aug 28, 2023 at 08:02 AM</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-md">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <div className="font-medium">Training Gap Analysis</div>
                  <div className="text-xs text-gray-600">Generated successfully on Aug 15, 2023 at 08:01 AM</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <div className="font-medium">Monthly CAPA Status Report</div>
                  <div className="text-xs text-gray-600">Failed to generate on Aug 01, 2023 at 09:00 AM</div>
                  <div className="text-xs text-red-500 mt-1">Error: Database connection timeout</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Custom Play icon component
const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

// Custom Pause icon component
const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

// Custom Play icon component
const Play = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export default ScheduledReports;
