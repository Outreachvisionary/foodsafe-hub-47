
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Video, 
  FileText, 
  BarChart2, 
  BookOpenCheck,
  Calculator,
  Pencil,
  Trash
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const CourseLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Sample courses data
  const courses = [
    {
      id: 'COURSE001',
      title: 'Food Safety Management Systems Overview',
      type: 'Online',
      category: 'Compliance',
      duration: 60,
      materials: 3,
      assignedCount: 24,
      completionRate: 78,
      lastUpdated: '2023-04-15',
      status: 'Active'
    },
    {
      id: 'COURSE002',
      title: 'HACCP Principles and Application',
      type: 'Classroom',
      category: 'Compliance',
      duration: 120,
      materials: 5,
      assignedCount: 18,
      completionRate: 65,
      lastUpdated: '2023-03-20',
      status: 'Active'
    },
    {
      id: 'COURSE003',
      title: 'SQF Implementation Training',
      type: 'Workshop',
      category: 'Compliance',
      duration: 240,
      materials: 8,
      assignedCount: 12,
      completionRate: 85,
      lastUpdated: '2023-05-01',
      status: 'Active'
    },
    {
      id: 'COURSE004',
      title: 'SPC Fundamentals',
      type: 'Online',
      category: 'SPC',
      duration: 90,
      materials: 4,
      assignedCount: 32,
      completionRate: 72,
      lastUpdated: '2023-05-10',
      status: 'Active'
    },
    {
      id: 'COURSE005',
      title: 'Control Chart Creation and Analysis',
      type: 'Online',
      category: 'SPC',
      duration: 75,
      materials: 6,
      assignedCount: 28,
      completionRate: 68,
      lastUpdated: '2023-04-28',
      status: 'Active'
    },
    {
      id: 'COURSE006',
      title: 'Process Capability Analysis',
      type: 'Workshop',
      category: 'SPC',
      duration: 180,
      materials: 7,
      assignedCount: 15,
      completionRate: 80,
      lastUpdated: '2023-05-05',
      status: 'Draft'
    },
    {
      id: 'COURSE007',
      title: 'Root Cause Analysis Tools',
      type: 'Online',
      category: 'Quality',
      duration: 120,
      materials: 5,
      assignedCount: 45,
      completionRate: 75,
      lastUpdated: '2023-04-15',
      status: 'Active'
    }
  ];
  
  // Filter courses based on activeTab and searchQuery
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'spc' && course.category === 'SPC') ||
      (activeTab === 'compliance' && course.category === 'Compliance') ||
      (activeTab === 'quality' && course.category === 'Quality') ||
      (activeTab === 'draft' && course.status === 'Draft');
      
    return matchesSearch && matchesTab;
  });
  
  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Library</h2>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Add a new course to the training library
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="title" className="text-sm font-medium">Course Title</label>
                    <Input id="title" placeholder="Enter course title" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Input id="description" placeholder="Enter course description" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="type" className="text-sm font-medium">Course Type</label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="classroom">Classroom</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="on-the-job">On-the-job</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="spc">SPC</SelectItem>
                        <SelectItem value="quality">Quality</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
                    <Input id="duration" type="number" min="1" placeholder="Enter duration" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="passThreshold" className="text-sm font-medium">Pass Threshold (%)</label>
                    <Input id="passThreshold" type="number" min="1" max="100" placeholder="e.g. 80" />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium">Target Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {['Operator', 'Supervisor', 'Manager', 'Quality', 'Admin'].map(role => (
                      <div key={role} className="flex items-center">
                        <input type="checkbox" id={`role-${role}`} className="mr-1" />
                        <label htmlFor={`role-${role}`} className="text-sm">{role}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="spc" />
                  <label htmlFor="spc" className="text-sm font-medium">This is an SPC-related course</label>
                </div>
                
                <div className="border rounded-md p-3 bg-gray-50">
                  <h3 className="text-sm font-medium mb-2">SPC Tools Used (if applicable)</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {['Control Charts', 'Histograms', 'Pareto Charts', 'Scatter Diagrams', 'Process Capability', 'Fishbone Diagrams'].map(tool => (
                      <div key={tool} className="flex items-center">
                        <input type="checkbox" id={`tool-${tool}`} className="mr-1" />
                        <label htmlFor={`tool-${tool}`} className="text-sm">{tool}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Course</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="spc">
            <BarChart2 className="h-4 w-4 mr-1" />
            SPC Courses
          </TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="quality">Quality Tools</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Course Library
              </CardTitle>
              <CardDescription>
                Manage your organization's training courses and materials
              </CardDescription>
              
              <div className="flex space-x-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50">
                            {course.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              course.category === 'SPC' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              course.category === 'Compliance' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-purple-50 text-purple-700 border-purple-200'
                            }
                          >
                            {course.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(course.duration)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  course.completionRate >= 80 ? 'bg-green-500' :
                                  course.completionRate >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${course.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{course.completionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(course.lastUpdated)}</TableCell>
                        <TableCell>
                          <Badge variant={course.status === 'Active' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No courses found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {activeTab === 'spc' && (
        <Card className="mt-6 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
              SPC Training Modules
            </CardTitle>
            <CardDescription>
              Interactive training modules for Statistical Process Control skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SPCTrainingCard
                title="Control Chart Simulator"
                description="Interactive tool to learn how control charts work with real-time feedback"
                icon={<BarChart2 className="h-5 w-5" />}
                type="Interactive"
              />
              
              <SPCTrainingCard
                title="Process Capability Calculator"
                description="Learn to calculate and interpret Cp, Cpk, Pp, and Ppk indices"
                icon={<Calculator className="h-5 w-5" />}
                type="Tool"
              />
              
              <SPCTrainingCard
                title="Root Cause Analysis"
                description="Step-by-step guide to identifying root causes of process variation"
                icon={<FileText className="h-5 w-5" />}
                type="Guide"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface SPCTrainingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'Interactive' | 'Tool' | 'Guide' | 'Video';
}

const SPCTrainingCard: React.FC<SPCTrainingCardProps> = ({ 
  title, 
  description,
  icon,
  type
}) => {
  return (
    <Card className="hover:border-blue-300 transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base flex items-center">
            <div className="bg-blue-100 p-1.5 rounded mr-2 text-blue-600">
              {icon}
            </div>
            {title}
          </CardTitle>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            {type}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          <BookOpenCheck className="h-4 w-4 mr-2" />
          Open Module
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseLibrary;
