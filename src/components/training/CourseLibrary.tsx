import React, { useState, useEffect } from 'react';
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
  Trash,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/types/training'; // Assuming this type exists

// Constants instead of hardcoded arrays
const TRAINING_ROLES = ['Operator', 'Supervisor', 'Manager', 'Quality', 'Admin'];
const SPC_TOOLS = ['Control Charts', 'Histograms', 'Pareto Charts', 'Scatter Diagrams', 'Process Capability', 'Fishbone Diagrams'];

const CourseLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for data fetching
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // State for the new course form
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSpcRelated, setIsSpcRelated] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        setCourses(data || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load courses.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

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

  // Handle role selection
  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  // Handle tool selection
  const handleToolToggle = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool)
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  // Handle form submission
  const handleCreateCourse = async () => {
    // Implementation for creating a new course
    // Would call supabase to insert a new course
    setIsCreateDialogOpen(false);
    // Reset form state
    setIsSpcRelated(false);
    setSelectedRoles([]);
    setSelectedTools([]);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading courses...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="text-red-500 h-10 w-10 mb-2" />
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Course Library</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">
                  Course Title
                </label>
                <Input id="title" placeholder="Course Title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">
                  Description
                </label>
                <Textarea id="description" placeholder="Description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="course-type" className="text-right">
                  Course Type
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right">
                  Category
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="duration" className="text-right">
                  Duration (minutes)
                </label>
                <Input id="duration" type="number" min="0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="pass-threshold" className="text-right">
                  Pass Threshold (%)
                </label>
                <Input id="pass-threshold" type="number" min="0" max="100" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right pt-2">Target Roles</div>
                <div className="col-span-3">
                  <div className="grid grid-cols-2 gap-2">
                    {TRAINING_ROLES.map(role => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`role-${role}`} 
                          checked={selectedRoles.includes(role)} 
                          onCheckedChange={() => handleRoleToggle(role)}
                        />
                        <label htmlFor={`role-${role}`}>{role}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">SPC Related</div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="spc-related" 
                    checked={isSpcRelated} 
                    onCheckedChange={setIsSpcRelated} 
                  />
                  <label htmlFor="spc-related">This is an SPC-related course</label>
                </div>
              </div>
              {isSpcRelated && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="text-right pt-2">SPC Tools Used</div>
                  <div className="col-span-3">
                    <div className="grid grid-cols-2 gap-2">
                      {SPC_TOOLS.map(tool => (
                        <div key={tool} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tool-${tool}`} 
                            checked={selectedTools.includes(tool)} 
                            onCheckedChange={() => handleToolToggle(tool)}
                          />
                          <label htmlFor={`tool-${tool}`}>{tool}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateCourse}>Create Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="spc">SPC Courses</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="quality">Quality Tools</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Course Library</CardTitle>
              <CardDescription>
                Manage your organization's training courses and materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>

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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.type}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.category}</Badge>
                        </TableCell>
                        <TableCell>{formatDuration(course.duration)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${
                                  course.completionRate >= 80 ? 'bg-green-500' :
                                  course.completionRate >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${course.completionRate}%` }}
                              />
                            </div>
                            <span>{course.completionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(course.lastUpdated)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={course.status === 'Active' ? 'default' : 'secondary'}
                          >
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No courses found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {activeTab === 'spc' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">SPC Training Modules</h3>
              <p className="text-muted-foreground">
                Interactive training modules for Statistical Process Control skills
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SPCTrainingCard
                  title="Control Chart Builder"
                  description="Interactive module for learning how to build and interpret control charts"
                  icon={<BarChart2 className="h-6 w-6" />}
                  type="Interactive"
                />
                <SPCTrainingCard
                  title="Process Capability Calculator"
                  description="Tool for calculating Cp, Cpk, Pp, and Ppk"
                  icon={<Calculator className="h-6 w-6" />}
                  type="Tool"
                />
                <SPCTrainingCard
                  title="SPC Implementation Guide"
                  description="Step-by-step guide for implementing SPC in your facility"
                  icon={<FileText className="h-6 w-6" />}
                  type="Guide"
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
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
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <Badge variant="outline">{type}</Badge>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Open Module</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseLibrary;
