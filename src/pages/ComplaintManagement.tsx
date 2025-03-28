
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, AlertTriangle, CheckCircle, Clock, Ban, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Complaint, ComplaintStatus, ComplaintCategory, ComplaintPriority, ComplaintSource } from '@/types/complaint';
import ComplaintDetails from '@/components/complaints/ComplaintDetails';

// Mock data for complaints
const mockComplaints: Complaint[] = [
  {
    id: 'C-2023-001',
    date: '2023-10-15',
    category: 'Food Safety',
    description: 'Foreign object found in packaged product',
    source: 'Consumer',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'C-2023-002',
    date: '2023-10-10',
    category: 'Quality',
    description: 'Product color variation from standard',
    source: 'Internal QA',
    status: 'Resolved',
    priority: 'Medium',
    assignedTo: 'Michael Chen',
  },
  {
    id: 'C-2023-003',
    date: '2023-09-28',
    category: 'Regulatory',
    description: 'Allergen not declared on label',
    source: 'Retailer',
    status: 'Under Investigation',
    priority: 'Critical',
    assignedTo: 'Emily Williams',
  },
  {
    id: 'C-2023-004',
    date: '2023-09-25',
    category: 'Food Safety',
    description: 'Potential pathogen contamination reported',
    source: 'Laboratory Test',
    status: 'In Progress',
    priority: 'Critical',
    assignedTo: 'David Rodriguez',
  },
  {
    id: 'C-2023-005',
    date: '2023-09-20',
    category: 'Quality',
    description: 'Product texture inconsistency',
    source: 'Consumer',
    status: 'Resolved',
    priority: 'Low',
    assignedTo: 'Sarah Johnson',
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color;
  let icon;
  
  switch (status) {
    case 'Resolved':
      color = 'bg-green-100 text-green-800 border-green-200';
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case 'In Progress':
      color = 'bg-blue-100 text-blue-800 border-blue-200';
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case 'Under Investigation':
      color = 'bg-amber-100 text-amber-800 border-amber-200';
      icon = <AlertTriangle className="h-3 w-3 mr-1" />;
      break;
    case 'Closed':
      color = 'bg-gray-100 text-gray-800 border-gray-200';
      icon = <Ban className="h-3 w-3 mr-1" />;
      break;
    default:
      color = 'bg-gray-100 text-gray-800 border-gray-200';
      icon = null;
  }
  
  return (
    <Badge variant="outline" className={`${color} flex items-center`}>
      {icon}
      {status}
    </Badge>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  let color;
  
  switch (priority) {
    case 'Critical':
      color = 'bg-red-100 text-red-800 border-red-200';
      break;
    case 'High':
      color = 'bg-orange-100 text-orange-800 border-orange-200';
      break;
    case 'Medium':
      color = 'bg-amber-100 text-amber-800 border-amber-200';
      break;
    case 'Low':
      color = 'bg-green-100 text-green-800 border-green-200';
      break;
    default:
      color = 'bg-gray-100 text-gray-800 border-gray-200';
  }
  
  return (
    <Badge variant="outline" className={color}>
      {priority}
    </Badge>
  );
};

// New Complaint form
const NewComplaintForm = ({ onSubmitSuccess }: { onSubmitSuccess: () => void }) => {
  const form = useForm({
    defaultValues: {
      category: '',
      description: '',
      source: '',
      priority: 'Medium',
      assignedTo: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log('New complaint submitted:', data);
    toast.success('New complaint created successfully!');
    onSubmitSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="">Select a category</option>
                  <option value="Food Safety">Food Safety</option>
                  <option value="Quality">Quality</option>
                  <option value="Regulatory">Regulatory</option>
                  <option value="Other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea 
                  className="w-full flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Detailed description of the complaint"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <select 
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select a source</option>
                    <option value="Consumer">Consumer</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Internal QA">Internal QA</option>
                    <option value="Laboratory Test">Laboratory Test</option>
                    <option value="Regulatory Agency">Regulatory Agency</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <select 
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To</FormLabel>
              <FormControl>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="">Select an assignee</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Michael Chen">Michael Chen</option>
                  <option value="Emily Williams">Emily Williams</option>
                  <option value="David Rodriguez">David Rodriguez</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit">Submit Complaint</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

// Main complaint management component
const ComplaintManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewComplaintDialogOpen, setIsNewComplaintDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  // Filter complaints based on search term
  const filteredComplaints = mockComplaints.filter(complaint => 
    complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };
  
  if (selectedComplaint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader 
          title="Complaint Details" 
          subtitle="View and manage detailed complaint information" 
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ComplaintDetails 
            complaint={selectedComplaint} 
            onBack={() => setSelectedComplaint(null)} 
          />
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Complaint Management" 
        subtitle="Track, manage, and resolve customer complaints with our CAPA workflow system." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="active" className="w-full animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="active">Active Complaints</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="all">All Complaints</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search complaints..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Dialog open={isNewComplaintDialogOpen} onOpenChange={setIsNewComplaintDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Complaint
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Complaint</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new complaint. Fields marked with * are required.
                    </DialogDescription>
                  </DialogHeader>
                  <NewComplaintForm onSubmitSuccess={() => setIsNewComplaintDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <TabsContent value="active">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Complaints</CardTitle>
                <CardDescription>
                  Showing {filteredComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length} active complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints
                      .filter(complaint => complaint.status !== 'Resolved' && complaint.status !== 'Closed')
                      .map(complaint => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.id}</TableCell>
                          <TableCell>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                          <TableCell>{complaint.category}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-xs truncate">
                            {complaint.description}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={complaint.status} />
                          </TableCell>
                          <TableCell>
                            <PriorityBadge priority={complaint.priority} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{complaint.assignedTo}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewComplaint(complaint)}
                            >
                              View <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Resolved Complaints</CardTitle>
                <CardDescription>
                  Showing {filteredComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length} resolved complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints
                      .filter(complaint => complaint.status === 'Resolved' || complaint.status === 'Closed')
                      .map(complaint => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.id}</TableCell>
                          <TableCell>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                          <TableCell>{complaint.category}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-xs truncate">
                            {complaint.description}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={complaint.status} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{complaint.assignedTo}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewComplaint(complaint)}
                            >
                              View <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Complaints</CardTitle>
                <CardDescription>
                  Showing {filteredComplaints.length} total complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.map(complaint => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{complaint.id}</TableCell>
                        <TableCell>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                        <TableCell>{complaint.category}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {complaint.description}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={complaint.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={complaint.priority} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{complaint.assignedTo}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewComplaint(complaint)}
                          >
                            View <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ComplaintManagement;
