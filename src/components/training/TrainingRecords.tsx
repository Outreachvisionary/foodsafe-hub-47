
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CalendarClock, 
  Download, 
  FileDigit, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrainingStatus, TrainingRecord } from '@/types/training';

const TrainingRecords: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Sample training records data
  const trainingRecords: TrainingRecord[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      courseId: 'COURSE001',
      courseName: 'Food Safety Management Systems Overview',
      assignedDate: '2023-03-15',
      dueDate: '2023-04-15',
      completionDate: '2023-04-10',
      status: 'Completed',
      score: 92,
      passThreshold: 80,
      certificationIssued: true,
      instructorName: 'Dr. Sarah Johnson',
      notes: 'Excellent performance in practical assessment',
      relatedStandards: ['ISO 22000', 'FSSC 22000']
    },
    {
      id: '2',
      employeeId: 'EMP002',
      courseId: 'COURSE002',
      courseName: 'HACCP Principles and Application',
      assignedDate: '2023-04-01',
      dueDate: '2023-05-01',
      status: 'In Progress',
      passThreshold: 75,
      instructorName: 'Michael Chen',
      relatedStandards: ['HACCP']
    },
    {
      id: '3',
      employeeId: 'EMP003',
      courseId: 'COURSE003',
      courseName: 'SQF Implementation Training',
      assignedDate: '2023-03-10',
      dueDate: '2023-04-10',
      status: 'Overdue',
      passThreshold: 70,
      instructorName: 'Lisa Brown',
      relatedStandards: ['SQF']
    },
    {
      id: '4',
      employeeId: 'EMP004',
      courseId: 'COURSE004',
      courseName: 'Internal Auditor Training',
      assignedDate: '2023-02-15',
      dueDate: '2023-03-15',
      completionDate: '2023-03-12',
      status: 'Completed',
      score: 88,
      passThreshold: 75,
      certificationIssued: true,
      instructorName: 'Robert Garcia',
      relatedStandards: ['ISO 9001', 'ISO 22000']
    },
    {
      id: '5',
      employeeId: 'EMP005',
      courseId: 'COURSE005',
      courseName: 'BRC Global Standard for Food Safety',
      assignedDate: '2023-04-01',
      dueDate: '2023-05-01',
      status: 'Not Started',
      passThreshold: 80,
      instructorName: 'Jennifer Wilson',
      relatedStandards: ['BRC GS2']
    },
    {
      id: '6',
      employeeId: 'EMP001',
      courseId: 'COURSE006',
      courseName: 'Food Defense & FSMA Overview',
      assignedDate: '2023-03-20',
      dueDate: '2023-04-20',
      completionDate: '2023-04-18',
      status: 'Completed',
      score: 78,
      passThreshold: 75,
      certificationIssued: false,
      instructorName: 'Thomas Lee',
      notes: 'Passed but needs improvement in vulnerability assessment',
      relatedStandards: ['FSMA']
    },
    {
      id: '7',
      employeeId: 'EMP002',
      courseId: 'COURSE007',
      courseName: 'Allergen Management',
      assignedDate: '2023-04-05',
      dueDate: '2023-05-05',
      status: 'In Progress',
      passThreshold: 80,
      instructorName: 'Amanda Martinez',
      relatedStandards: ['SQF', 'BRC GS2']
    }
  ];
  
  // Filter records based on search query and status filter
  const filteredRecords = trainingRecords.filter(record => {
    const matchesSearch = 
      record.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.instructorName && record.instructorName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Status badge component
  const StatusBadge: React.FC<{ status: TrainingStatus }> = ({ status }) => {
    let bgColor, textColor, icon;
    
    switch (status) {
      case 'Completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
        break;
      case 'In Progress':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        icon = <Clock className="w-3 h-3 mr-1" />;
        break;
      case 'Overdue':
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        icon = <XCircle className="w-3 h-3 mr-1" />;
        break;
      case 'Not Started':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
        icon = <AlertCircle className="w-3 h-3 mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
        icon = <AlertCircle className="w-3 h-3 mr-1" />;
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        {status}
      </span>
    );
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search records, employees, courses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Training Record</DialogTitle>
                <DialogDescription>
                  Create a new training record for an employee
                </DialogDescription>
              </DialogHeader>
              
              {/* Form will go here */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="employee" className="text-sm font-medium">Employee</label>
                    <Select>
                      <SelectTrigger id="employee">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMP001">John Doe (EMP001)</SelectItem>
                        <SelectItem value="EMP002">Jane Smith (EMP002)</SelectItem>
                        <SelectItem value="EMP003">Robert Johnson (EMP003)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="course" className="text-sm font-medium">Course</label>
                    <Select>
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COURSE001">Food Safety Management</SelectItem>
                        <SelectItem value="COURSE002">HACCP Principles</SelectItem>
                        <SelectItem value="COURSE003">SQF Implementation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="assignedDate" className="text-sm font-medium">Assigned Date</label>
                    <Input id="assignedDate" type="date" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="instructor" className="text-sm font-medium">Instructor</label>
                  <Input id="instructor" placeholder="Instructor name" />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Input id="notes" placeholder="Add notes" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit">Save Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center">
            <FileDigit className="h-5 w-5 mr-2 text-blue-500" />
            Training Records
          </CardTitle>
          <CardDescription>
            Manage and track all employee training activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.courseName}</TableCell>
                    <TableCell>{record.employeeId}</TableCell>
                    <TableCell>{formatDate(record.assignedDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarClock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {formatDate(record.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(record.completionDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell>
                      {record.score ? (
                        <span className={record.score >= (record.passThreshold || 0) ? 'text-green-600' : 'text-red-600'}>
                          {record.score}%
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No training records found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingRecords;
