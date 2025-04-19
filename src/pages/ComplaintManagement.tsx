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

type ComplaintSource = 'Consumer' | 'Retailer' | 'Internal QA' | 'Laboratory Test' | 'Regulatory Agency';

const mockComplaints: Complaint[] = [
  {
    id: 'comp-001',
    title: 'Foreign material in product',
    description: 'Customer reported finding small plastic piece in product',
    category: 'safety',
    status: 'in-progress',
    priority: 'high',
    source: 'customer',
    reportedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'John Smith',
    createdBy: 'Customer Service',
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: 'Jane Doe',
    customerContact: 'jane.doe@example.com',
    productInvolved: 'Premium Chocolate Bar',
    lotNumber: 'LOT-2023-0568',
    capaRequired: true
  },
  {
    id: 'comp-002',
    title: 'Mislabeled allergen information',
    description: 'Retailer detected missing allergen warning on packaging',
    category: 'quality',
    status: 'resolved',
    priority: 'medium',
    source: 'retailer',
    reportedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Sarah Johnson',
    createdBy: 'Quality Manager',
    createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionNotes: 'Packaging updated with correct allergen information, affected batches recalled',
    productInvolved: 'Granola Bars',
    lotNumber: 'LOT-2023-0429',
    capaRequired: true
  },
  {
    id: 'comp-003',
    title: 'Taste deviation from standard',
    description: 'Internal testing identified flavor profile inconsistency',
    category: 'quality',
    status: 'in-progress',
    priority: 'critical',
    source: 'internal',
    reportedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Michael Wong',
    createdBy: 'R&D Department',
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    productInvolved: 'Fruit Flavored Yogurt',
    lotNumber: 'LOT-2023-0612',
    capaRequired: false
  },
  {
    id: 'comp-004',
    title: 'Damaged packaging during shipping',
    description: 'Multiple units received with torn packaging',
    category: 'quality',
    status: 'in-progress',
    priority: 'critical',
    source: 'distributor',
    reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Lisa Chen',
    createdBy: 'Distribution Center',
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    productInvolved: 'Protein Snack Pack',
    lotNumber: 'LOT-2023-0598',
    capaRequired: true
  },
  {
    id: 'comp-005',
    title: 'Underfilled product container',
    description: 'Consumer reported package containing less product than labeled',
    category: 'quality',
    status: 'resolved',
    priority: 'low',
    source: 'consumer',
    reportedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Robert Jackson',
    createdBy: 'Customer Service',
    createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionNotes: 'Filling equipment calibrated, quality checks increased',
    customerName: 'Sam Wilson',
    customerContact: 'sam.wilson@example.com',
    productInvolved: 'Organic Trail Mix',
    lotNumber: 'LOT-2023-0483',
    capaRequired: false
  }
];

function getDisplayStatus(status: ComplaintStatus): string {
  switch (status) {
    case 'new': return 'New';
    case 'investigating': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    default: return status;
  }
}

function getDisplayCategory(category: ComplaintCategory): string {
  switch (category) {
    case 'product_quality': return 'Quality';
    case 'foreign_material': return 'Food Safety';
    case 'packaging': return 'Regulatory';
    case 'service': return 'Service';
    case 'delivery': return 'Delivery';
    case 'other': return 'Other';
    default: return category;
  }
}

const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  let color;
  let icon;
  const displayStatus = getDisplayStatus(status);
  
  switch (status) {
    case 'resolved':
      color = 'bg-green-100 text-green-800 border-green-200';
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case 'investigating':
      color = 'bg-blue-100 text-blue-800 border-blue-200';
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case 'new':
      color = 'bg-amber-100 text-amber-800 border-amber-200';
      icon = <AlertTriangle className="h-3 w-3 mr-1" />;
      break;
    case 'closed':
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
      {displayStatus}
    </Badge>
  );
};

const PriorityBadge = ({ priority }: { priority: ComplaintPriority }) => {
  let color;
  const displayPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
  
  switch (priority) {
    case 'critical':
      color = 'bg-red-100 text-red-800 border-red-200';
      break;
    case 'high':
      color = 'bg-orange-100 text-orange-800 border-orange-200';
      break;
    case 'medium':
      color = 'bg-amber-100 text-amber-800 border-amber-200';
      break;
    case 'low':
      color = 'bg-green-100 text-green-800 border-green-200';
      break;
    default:
      color = 'bg-gray-100 text-gray-800 border-gray-200';
  }
  
  return (
    <Badge variant="outline" className={color}>
      {displayPriority}
    </Badge>
  );
};

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

const ComplaintManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewComplaintDialogOpen, setIsNewComplaintDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  const filteredComplaints = mockComplaints.filter(complaint => 
    complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDisplayCategory(complaint.category).toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  Showing {filteredComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length} active complaints
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
                      .filter(complaint => complaint.status !== 'resolved' && complaint.status !== 'closed')
                      .map(complaint => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.id}</TableCell>
                          <TableCell>{new Date(complaint.reportedDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getDisplayCategory(complaint.category)}</TableCell>
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
                  Showing {filteredComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length} resolved complaints
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
                      .filter(complaint => complaint.status === 'resolved' || complaint.status === 'closed')
                      .map(complaint => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.id}</TableCell>
                          <TableCell>{new Date(complaint.reportedDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getDisplayCategory(complaint.category)}</TableCell>
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
                        <TableCell>{new Date(complaint.reportedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getDisplayCategory(complaint.category)}</TableCell>
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
