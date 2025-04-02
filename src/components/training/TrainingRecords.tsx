import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainingStatus, ExtendedTrainingRecord } from '@/types/training';
import { CalendarClock, CheckSquare, Award, Clock, FileText, AlertCircle, BarChart, PlusCircle, Search, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTrainingRecords } from '@/hooks/useTrainingRecords';
import { useToast } from '@/hooks/use-toast';

const TrainingRecords: React.FC = () => {
  const { records, loading, updateTrainingRecord, stats } = useTrainingRecords();
  const { toast } = useToast();
  
  const [selectedRecord, setSelectedRecord] = useState<ExtendedTrainingRecord | null>(null);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter records based on search query and status
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = 
        record.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.courseName && record.courseName.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesStatus = 
        filterStatus === 'all' || 
        record.status.toLowerCase() === filterStatus.toLowerCase();
        
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, filterStatus]);

  // Get status badge
  const getStatusBadge = (status: TrainingStatus) => {
    switch(status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case "Overdue":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </Badge>
        );
      case "Not Started":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Not Started
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle sending reminder for overdue training
  const handleSendReminder = async (record: ExtendedTrainingRecord) => {
    toast({
      title: "Reminder Sent",
      description: `Training reminder sent to ${record.employee_name}`,
    });
    
    // Update the record with a note about the reminder
    const now = new Date().toISOString();
    const noteText = record.notes 
      ? `${record.notes}\nReminder sent on ${new Date().toLocaleDateString()}` 
      : `Reminder sent on ${new Date().toLocaleDateString()}`;
      
    await updateTrainingRecord(record.id, { notes: noteText });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3">Loading training records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Award className="h-6 w-6 mr-2" />
            Training Records
          </h2>
          <p className="text-muted-foreground">
            Track employee training progress and compliance
          </p>
        </div>
        <Button className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Training Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckSquare className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgressCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Not Started</p>
              <p className="text-2xl font-bold text-gray-600">{stats.notStartedCount}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <CalendarClock className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdueCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by employee or course..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="not started">Not Started</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="records" className="w-full">
          <TabsList>
            <TabsTrigger value="records" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Records Table
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="records">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.employee_name}</TableCell>
                          <TableCell>{record.courseName}</TableCell>
                          <TableCell>{new Date(record.assigned_date || '').toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{new Date(record.due_date).toLocaleDateString()}</span>
                              {record.status === "Overdue" && (
                                <span className="text-xs text-red-600">
                                  Overdue by {Math.floor((new Date().getTime() - new Date(record.due_date).getTime()) / (1000 * 60 * 60 * 24))} days
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{record.completion_date ? new Date(record.completion_date).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            {record.score ? (
                              <span className={`font-medium ${record.score >= (record.pass_threshold || 0) ? "text-green-600" : "text-red-600"}`}>
                                {record.score}%
                              </span>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRecord(record);
                                setIsRecordDialogOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                          {loading ? "Loading training records..." : "No training records found matching your criteria"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Training Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-10">
                  Training analytics visualizations would appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Training Record Details Dialog */}
      {selectedRecord && (
        <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Training Record Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Training Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-sm text-gray-500">Course</Label>
                    <p className="font-medium">{selectedRecord.courseName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Instructor</Label>
                    <p>{selectedRecord.instructorName || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Assigned Date</Label>
                    <p>{new Date(selectedRecord.assigned_date || '').toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Due Date</Label>
                    <p>{new Date(selectedRecord.due_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Completion Date</Label>
                    <p>{selectedRecord.completion_date ? new Date(selectedRecord.completion_date).toLocaleDateString() : "Not completed"}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Assessment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-500">Employee</Label>
                    <p className="font-medium">{selectedRecord.employee_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Employee ID</Label>
                    <p>{selectedRecord.employee_id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm text-gray-500">Score</Label>
                      <p className="font-bold text-xl">
                        {selectedRecord.score ? `${selectedRecord.score}%` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Pass Threshold</Label>
                      <p>{selectedRecord.pass_threshold ? `${selectedRecord.pass_threshold}%` : "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Result</Label>
                    {selectedRecord.score && selectedRecord.pass_threshold ? (
                      selectedRecord.score >= selectedRecord.pass_threshold ? (
                        <Badge className="bg-green-600">PASS</Badge>
                      ) : (
                        <Badge variant="destructive">FAIL</Badge>
                      )
                    ) : (
                      <p>Not assessed</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Notes</Label>
                    <Textarea 
                      readOnly 
                      value={selectedRecord.notes || "No notes available"} 
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter className="sm:justify-between">
              {selectedRecord.status !== "Completed" && (
                <Button 
                  className="flex items-center" 
                  variant="outline"
                  onClick={() => handleSendReminder(selectedRecord)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Send Reminder
                </Button>
              )}
              <Button onClick={() => setIsRecordDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TrainingRecords;
