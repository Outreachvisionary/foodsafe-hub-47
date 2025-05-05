
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Check, Download, Edit2, FileText, Pause, Play, Plus, RefreshCcw, Trash2, Users, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScheduledReport {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextRun: Date;
  lastRun: Date | null;
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  status: 'active' | 'paused';
}

const ScheduledReports = () => {
  const [schedules, setSchedules] = useState<ScheduledReport[]>([
    {
      id: '1',
      title: 'Monthly CAPA Status Report',
      frequency: 'monthly',
      nextRun: new Date(2025, 5, 15),
      lastRun: new Date(2025, 4, 15),
      format: 'pdf',
      recipients: ['quality@example.com', 'management@example.com'],
      status: 'active'
    },
    {
      id: '2',
      title: 'Weekly Training Compliance',
      frequency: 'weekly',
      nextRun: new Date(2025, 5, 7),
      lastRun: new Date(2025, 4, 30),
      format: 'excel',
      recipients: ['training@example.com', 'hr@example.com'],
      status: 'active'
    },
    {
      id: '3',
      title: 'Document Expiry Notifications',
      frequency: 'daily',
      nextRun: new Date(2025, 5, 6),
      lastRun: new Date(2025, 5, 5),
      format: 'pdf',
      recipients: ['document.control@example.com'],
      status: 'paused'
    },
    {
      id: '4',
      title: 'Quarterly Audit Summary',
      frequency: 'quarterly',
      nextRun: new Date(2025, 6, 1),
      lastRun: new Date(2025, 3, 1),
      format: 'pdf',
      recipients: ['audits@example.com', 'management@example.com'],
      status: 'active'
    }
  ]);
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRecipientsDialogOpen, setIsRecipientsDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledReport | null>(null);
  
  // New schedule form state
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    report: '',
    frequency: 'monthly',
    format: 'pdf',
    date: new Date(),
  });
  
  // Filter schedules based on status
  const filteredSchedules = filterStatus === 'all' 
    ? schedules 
    : schedules.filter(schedule => schedule.status === filterStatus);
  
  // Sample reports for dropdown
  const availableReports = [
    { id: 'report1', title: 'Training Compliance Report' },
    { id: 'report2', title: 'Document Status Report' },
    { id: 'report3', title: 'CAPA Overview Report' },
    { id: 'report4', title: 'Audit Findings Report' },
    { id: 'report5', title: 'Supplier Quality Report' },
  ];
  
  // Update schedule status
  const toggleScheduleStatus = (id: string) => {
    setSchedules(prev => prev.map(schedule => {
      if (schedule.id === id) {
        const newStatus = schedule.status === 'active' ? 'paused' : 'active';
        toast({
          title: `Schedule ${newStatus === 'active' ? 'activated' : 'paused'}`,
          description: `"${schedule.title}" has been ${newStatus === 'active' ? 'activated' : 'paused'}.`,
        });
        return { ...schedule, status: newStatus };
      }
      return schedule;
    }));
  };
  
  // Delete schedule
  const deleteSchedule = (id: string) => {
    const scheduleToDelete = schedules.find(schedule => schedule.id === id);
    if (scheduleToDelete) {
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      toast({
        title: "Schedule deleted",
        description: `"${scheduleToDelete.title}" has been removed from scheduled reports.`,
      });
    }
  };
  
  // View recipients
  const viewRecipients = (schedule: ScheduledReport) => {
    setSelectedSchedule(schedule);
    setIsRecipientsDialogOpen(true);
  };
  
  // Create new schedule
  const handleCreateSchedule = () => {
    if (!newSchedule.title || !newSchedule.report) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select a report to schedule.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = (schedules.length + 1).toString();
    
    setSchedules(prev => [...prev, {
      id: newId,
      title: newSchedule.title,
      frequency: newSchedule.frequency as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
      nextRun: newSchedule.date,
      lastRun: null,
      format: newSchedule.format as 'pdf' | 'excel' | 'csv',
      recipients: [],
      status: 'active'
    }]);
    
    setIsCreateDialogOpen(false);
    setNewSchedule({
      title: '',
      report: '',
      frequency: 'monthly',
      format: 'pdf',
      date: new Date(),
    });
    
    toast({
      title: "Schedule created",
      description: "Your report has been scheduled successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scheduled Reports</h3>
        
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Scheduled Report</DialogTitle>
                <DialogDescription>
                  Set up automatic generation and distribution of reports on a schedule
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-title">Schedule Title</Label>
                  <Input
                    id="schedule-title"
                    value={newSchedule.title}
                    onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                    placeholder="E.g., Monthly Compliance Report"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report">Select Report</Label>
                  <Select
                    value={newSchedule.report}
                    onValueChange={(value) => setNewSchedule({...newSchedule, report: value})}
                  >
                    <SelectTrigger id="report">
                      <SelectValue placeholder="Select a report" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableReports.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={newSchedule.frequency}
                      onValueChange={(value) => setNewSchedule({...newSchedule, frequency: value})}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="format">Output Format</Label>
                    <Select
                      value={newSchedule.format}
                      onValueChange={(value) => setNewSchedule({...newSchedule, format: value})}
                    >
                      <SelectTrigger id="format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>First Run Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newSchedule.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSchedule.date ? (
                          format(newSchedule.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSchedule.date}
                        onSelect={(date) => setNewSchedule({...newSchedule, date: date || new Date()})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateSchedule}>Create Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Format</TableHead>
                <TableHead className="text-center">Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No scheduled reports found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.title}</TableCell>
                    <TableCell className="capitalize">{schedule.frequency}</TableCell>
                    <TableCell>{format(schedule.nextRun, 'MMM d, yyyy')}</TableCell>
                    <TableCell className="uppercase">{schedule.format}</TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-1"
                        onClick={() => viewRecipients(schedule)}
                      >
                        <Users className="h-4 w-4" />
                        <span>{schedule.recipients.length}</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={schedule.status === 'active' ? "default" : "outline"}>
                        {schedule.status === 'active' ? 'Active' : 'Paused'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toggleScheduleStatus(schedule.id)}>
                          {schedule.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteSchedule(schedule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isRecipientsDialogOpen} onOpenChange={setIsRecipientsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Recipients</DialogTitle>
            <DialogDescription>
              Users who will receive "{selectedSchedule?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedSchedule?.recipients.length === 0 ? (
              <div className="text-center p-4 bg-muted rounded-md">
                <p className="text-muted-foreground">No recipients configured for this report</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedSchedule?.recipients.map((recipient, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{recipient}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex gap-2">
              <Input placeholder="Add recipient email" className="flex-1" />
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsRecipientsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledReports;
