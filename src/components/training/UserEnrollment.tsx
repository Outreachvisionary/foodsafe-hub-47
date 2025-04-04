
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, CheckCircle, Users, AlertCircle, Search, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Operator', department: 'Production', completedCourses: ['1', '2'] },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Supervisor', department: 'Quality', completedCourses: ['1'] },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Manager', department: 'Production', completedCourses: ['1', '2', '3'] },
  { id: '4', name: 'Sarah Brown', email: 'sarah@example.com', role: 'Operator', department: 'Maintenance', completedCourses: [] },
  { id: '5', name: 'David Wilson', email: 'david@example.com', role: 'Quality', department: 'Quality', completedCourses: ['1', '3'] },
];

const mockCourses = [
  { id: '1', name: 'Food Safety Basics', department: 'All', role: 'All', duration: '2 hours' },
  { id: '2', name: 'GMP Training', department: 'Production', role: 'Operator', duration: '4 hours' },
  { id: '3', name: 'HACCP Principles', department: 'Quality', role: 'All', duration: '8 hours' },
  { id: '4', name: 'Allergen Management', department: 'All', role: 'Supervisor', duration: '3 hours' },
  { id: '5', name: 'Food Defense', department: 'All', role: 'All', duration: '2 hours' },
];

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const UserEnrollment = () => {
  const [users, setUsers] = useState(mockUsers);
  const [courses, setCourses] = useState(mockCourses);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'completed' | 'warning'>('idle');
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  
  const { toast } = useToast();

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === '' || 
      user.department === departmentFilter;
    
    const matchesRole = 
      roleFilter === '' || 
      user.role === roleFilter;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectCourse = (courseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    }
  };

  const handleEnrollUsers = () => {
    if (selectedUsers.length === 0 || selectedCourses.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one user and one course",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would make an API call
    // For this example, we'll just show a success message
    toast({
      title: "Enrollment Completed",
      description: `Enrolled ${selectedUsers.length} users in ${selectedCourses.length} courses`,
    });

    setEnrollmentStatus('completed');
    setShowEnrollmentDialog(false);
  };

  const checkAllRequiredTrainingAssigned = () => {
    // For demonstration, let's say all users need Food Safety Basics
    const requiredCourseId = '1';
    const usersWithoutRequired = users.filter(user => !user.completedCourses.includes(requiredCourseId));
    return usersWithoutRequired.length === 0;
  };

  useEffect(() => {
    setEnrollmentStatus(checkAllRequiredTrainingAssigned() ? 'completed' : 'warning');
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Enrollment</h2>
          <p className="text-muted-foreground">
            Assign users to training courses based on roles and departments
          </p>
        </div>
        <Dialog open={showEnrollmentDialog} onOpenChange={setShowEnrollmentDialog}>
          <DialogTrigger asChild>
            <Button disabled={selectedUsers.length === 0}>
              <Users className="mr-2 h-4 w-4" />
              Enroll Users
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Confirm Enrollment</DialogTitle>
              <DialogDescription>
                Enroll selected users in training courses
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Selected Users ({selectedUsers.length})</h3>
                <div className="border rounded-md p-2 max-h-[100px] overflow-y-auto">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <div key={userId} className="text-sm py-1">
                        {user.name} ({user.role}, {user.department})
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Select Courses</h3>
                <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                  {courses.map(course => (
                    <div key={course.id} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`course-${course.id}`}
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={(checked) => 
                          handleSelectCourse(course.id, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`course-${course.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {course.name} ({course.duration})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEnrollmentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEnrollUsers} disabled={selectedCourses.length === 0}>
                Confirm Enrollment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {enrollmentStatus === 'warning' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incomplete Training Assignments</AlertTitle>
          <AlertDescription>
            Some users have not been assigned all required training courses. Please review and update assignments.
          </AlertDescription>
        </Alert>
      )}

      {enrollmentStatus === 'completed' && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>All Required Training Assigned</AlertTitle>
          <AlertDescription>
            All users have been assigned their required training courses.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Select users to enroll in training courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Quality">Quality</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="Operator">Operator</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Quality">Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]">
                      <Checkbox 
                        onCheckedChange={(checked) => handleSelectAllUsers(checked as boolean)} 
                        checked={
                          filteredUsers.length > 0 && 
                          selectedUsers.length === filteredUsers.length
                        }
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => 
                              handleSelectUser(user.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.completedCourses.length > 0 ? (
                              user.completedCourses.map((courseId) => {
                                const course = courses.find(c => c.id === courseId);
                                return course ? (
                                  <Badge key={courseId} variant="outline" className="text-xs">
                                    {course.name}
                                  </Badge>
                                ) : null;
                              })
                            ) : (
                              <span className="text-muted-foreground text-xs">No courses</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.completedCourses.includes('1') ? (
                            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Check className="mr-1 h-3 w-3" />
                              Required Complete
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Missing Required
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserEnrollment;
