
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarClock, 
  CheckCircle, 
  User2, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  FileText,
  X,
  Check,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface TrainingRecordItem {
  id: string;
  employee: string;
  employeeId: string;
  course: string;
  status: 'Completed' | 'In Progress' | 'Not Started' | 'Overdue' | 'Scheduled';
  dueDate: string;
  completionDate: string | null;
  score?: number;
  department?: string;
  avatar?: string;
}

const TrainingRecords = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<TrainingRecordItem[]>([
    {
      id: '1',
      employee: 'John Doe',
      employeeId: 'emp001',
      course: 'Food Safety Basics',
      status: 'Completed',
      dueDate: '2024-03-15',
      completionDate: '2024-03-10',
      score: 95,
      department: 'Production',
    },
    {
      id: '2',
      employee: 'Jane Smith',
      employeeId: 'emp002',
      course: 'HACCP Principles',
      status: 'In Progress',
      dueDate: '2024-04-01',
      completionDate: null,
      department: 'Quality',
    },
    {
      id: '3',
      employee: 'Alice Johnson',
      employeeId: 'emp003',
      course: 'GMP Training',
      status: 'Overdue',
      dueDate: '2024-02-28',
      completionDate: null,
      department: 'Production',
    },
    {
      id: '4',
      employee: 'Robert Wilson',
      employeeId: 'emp004',
      course: 'Allergen Management',
      status: 'Scheduled',
      dueDate: '2024-05-20',
      completionDate: null,
      department: 'Quality',
    },
    {
      id: '5',
      employee: 'Emily Davis',
      employeeId: 'emp005',
      course: 'Food Safety Basics',
      status: 'Completed',
      dueDate: '2024-02-10',
      completionDate: '2024-02-05',
      score: 88,
      department: 'Operations',
    },
    {
      id: '6',
      employee: 'Michael Brown',
      employeeId: 'emp006',
      course: 'Sanitation Procedures',
      status: 'Not Started',
      dueDate: '2024-05-15',
      completionDate: null,
      department: 'Production',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<TrainingRecordItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNewRecordDialogOpen, setIsNewRecordDialogOpen] = useState(false);
  
  // Form state for new record
  const [newRecord, setNewRecord] = useState({
    employee: '',
    employeeId: '',
    course: '',
    status: 'Not Started',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    department: '',
  });

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });
  
  const departments = Array.from(new Set(records.map(record => record.department).filter(Boolean) as string[]));

  const handleViewRecord = (record: TrainingRecordItem) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  const handleExportRecords = () => {
    toast({
      title: "Export Started",
      description: "Training records are being exported to CSV.",
    });
    // In a real app, this would trigger a CSV download
  };
  
  const handleImportRecords = () => {
    // In a real app, this would open a file picker dialog
    toast({
      title: "Import Feature",
      description: "This would open a file upload dialog in a real application.",
    });
  };

  const handleNewRecordSubmit = () => {
    const recordId = `rec${Math.floor(Math.random() * 10000)}`;
    
    const record: TrainingRecordItem = {
      id: recordId,
      employee: newRecord.employee,
      employeeId: newRecord.employeeId,
      course: newRecord.course,
      status: newRecord.status as 'Completed' | 'In Progress' | 'Not Started' | 'Overdue' | 'Scheduled',
      dueDate: newRecord.dueDate,
      completionDate: newRecord.status === 'Completed' ? format(new Date(), 'yyyy-MM-dd') : null,
      department: newRecord.department,
    };
    
    setRecords([...records, record]);
    setIsNewRecordDialogOpen(false);
    
    toast({
      title: "Record Created",
      description: `Training record for ${newRecord.employee} has been created.`,
    });
    
    // Reset the form
    setNewRecord({
      employee: '',
      employeeId: '',
      course: '',
      status: 'Not Started',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      department: '',
    });
  };

  const handleUpdateStatus = (id: string, newStatus: 'Completed' | 'In Progress' | 'Not Started' | 'Overdue' | 'Scheduled') => {
    const updatedRecords = records.map(record => {
      if (record.id === id) {
        return {
          ...record,
          status: newStatus,
          completionDate: newStatus === 'Completed' ? format(new Date(), 'yyyy-MM-dd') : record.completionDate
        };
      }
      return record;
    });
    
    setRecords(updatedRecords);
    
    // Update the selected record if it's currently being viewed
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord({
        ...selectedRecord,
        status: newStatus,
        completionDate: newStatus === 'Completed' ? format(new Date(), 'yyyy-MM-dd') : selectedRecord.completionDate
      });
    }
    
    toast({
      title: "Status Updated",
      description: `Training record status updated to ${newStatus}.`,
    });
  };

  // Generate status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      case 'Not Started':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Not Started</Badge>;
      case 'Overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Overdue</Badge>;
      case 'Scheduled':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Training Records</h2>
          <p className="text-muted-foreground">
            Manage and view employee training records
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportRecords}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImportRecords}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsNewRecordDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Training Records</CardTitle>
          <CardDescription>
            View and manage all training records in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <User2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Employee</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-2 opacity-20" />
                        <p>No training records found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={record.avatar || `https://avatar.vercel.sh/api/others/${record.employee}.png`} />
                            <AvatarFallback>{record.employee.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{record.employee}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.course}</TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell>{record.dueDate}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)}>
                            View
                          </Button>
                          <Select 
                            defaultValue={record.status}
                            onValueChange={(value) => handleUpdateStatus(
                              record.id, 
                              value as 'Completed' | 'In Progress' | 'Not Started' | 'Overdue' | 'Scheduled'
                            )}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Overdue">Overdue</SelectItem>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredRecords.length} of {records.length} records
          </div>
          <Button variant="outline" onClick={handleExportRecords}>
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
        </CardFooter>
      </Card>
      
      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Training Record Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected training record
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Employee</h4>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedRecord.avatar || `https://avatar.vercel.sh/api/others/${selectedRecord.employee}.png`} />
                            <AvatarFallback>{selectedRecord.employee.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedRecord.employee}</p>
                            <p className="text-xs text-muted-foreground">ID: {selectedRecord.employeeId}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Department</h4>
                        <p>{selectedRecord.department || 'Not assigned'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Status</h4>
                        {getStatusBadge(selectedRecord.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Course</h4>
                        <p className="font-medium">{selectedRecord.course}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Due Date</h4>
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                          <p>{selectedRecord.dueDate}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Completion Date</h4>
                        {selectedRecord.completionDate ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <p>{selectedRecord.completionDate}</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Not completed</p>
                        )}
                      </div>
                      
                      {selectedRecord.score !== undefined && (
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-1">Score</h4>
                          <p className="text-lg font-semibold">{selectedRecord.score}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="pt-4">
                <div className="space-y-4">
                  <div className="border rounded-md">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Created</span>
                        </div>
                        <span className="text-muted-foreground">{selectedRecord.dueDate}</span>
                      </div>
                    </div>
                    {selectedRecord.status === 'In Progress' && (
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Started</span>
                          </div>
                          <span className="text-muted-foreground">{selectedRecord.dueDate}</span>
                        </div>
                      </div>
                    )}
                    {selectedRecord.completionDate && (
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Completed</span>
                          </div>
                          <span className="text-muted-foreground">{selectedRecord.completionDate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {(!selectedRecord.completionDate || selectedRecord.status === 'Overdue') && (
                    <div className="text-center p-4">
                      <p className="text-sm text-muted-foreground">
                        {selectedRecord.status === 'Overdue' ? 'Training is overdue' : 'Training has not been completed yet'}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="materials" className="pt-4">
                <div className="text-center p-8 border rounded-md">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No training materials available</p>
                  <Button className="mt-4" variant="outline">Upload Materials</Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            {selectedRecord && selectedRecord.status !== 'Completed' && (
              <Button 
                onClick={() => {
                  handleUpdateStatus(selectedRecord.id, 'Completed');
                  setIsViewDialogOpen(false);
                }}
              >
                Mark as Completed
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Record Dialog */}
      <Dialog open={isNewRecordDialogOpen} onOpenChange={setIsNewRecordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Training Record</DialogTitle>
            <DialogDescription>
              Enter the details for the new training record
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="employee" className="text-sm font-medium">Employee Name</label>
                <Input 
                  id="employee"
                  value={newRecord.employee}
                  onChange={(e) => setNewRecord({...newRecord, employee: e.target.value})}
                  placeholder="Enter employee name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="employeeId" className="text-sm font-medium">Employee ID</label>
                <Input 
                  id="employeeId"
                  value={newRecord.employeeId}
                  onChange={(e) => setNewRecord({...newRecord, employeeId: e.target.value})}
                  placeholder="Enter employee ID"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="course" className="text-sm font-medium">Course</label>
                <Input 
                  id="course"
                  value={newRecord.course}
                  onChange={(e) => setNewRecord({...newRecord, course: e.target.value})}
                  placeholder="Enter course name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">Department</label>
                <Input 
                  id="department"
                  value={newRecord.department}
                  onChange={(e) => setNewRecord({...newRecord, department: e.target.value})}
                  placeholder="Enter department"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select 
                  value={newRecord.status}
                  onValueChange={(value) => setNewRecord({...newRecord, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                <Input 
                  id="dueDate"
                  type="date"
                  value={newRecord.dueDate}
                  onChange={(e) => setNewRecord({...newRecord, dueDate: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRecordDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleNewRecordSubmit}
              disabled={!newRecord.employee || !newRecord.course || !newRecord.dueDate}
            >
              Create Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingRecords;
