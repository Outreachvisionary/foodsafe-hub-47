
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { ComplaintCategory, ComplaintStatus, ComplaintPriority, mapComplaintToDb } from '@/types/complaint';

const ComplaintManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [productInvolved, setProductInvolved] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Product Quality');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [capaRequired, setCapaRequired] = useState(false);
  
  useEffect(() => {
    fetchComplaints();
  }, []);
  
  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('reported_date', { ascending: false });
      
      if (error) throw error;
      
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch complaints',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateComplaint = async () => {
    try {
      const newComplaint = mapComplaintToDb({
        title,
        description,
        category: category as ComplaintCategory,
        status: 'New' as ComplaintStatus,
        priority: priority as ComplaintPriority,
        reportedDate: new Date().toISOString(),
        createdBy: 'admin', // Should be the current user in a real app
        customerName,
        customerContact,
        productInvolved,
        lotNumber,
        capaRequired
      });
      
      const { data, error } = await supabase
        .from('complaints')
        .insert(newComplaint)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Complaint created successfully',
      });
      
      setIsCreateOpen(false);
      fetchComplaints();
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error creating complaint:', error);
      toast({
        title: 'Error',
        description: 'Failed to create complaint',
        variant: 'destructive',
      });
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCustomerName('');
    setCustomerContact('');
    setProductInvolved('');
    setLotNumber('');
    setCategory('Product Quality');
    setPriority('Medium');
    setCapaRequired(false);
  };
  
  const getStatusBadgeVariant = (status: ComplaintStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700';
      case 'Under Investigation':
        return 'bg-amber-100 text-amber-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'Closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getPriorityBadgeVariant = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-blue-100 text-blue-700';
      case 'High':
        return 'bg-amber-100 text-amber-700';
      case 'Urgent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const categoryLabels: Record<ComplaintCategory, string> = {
    'Product Quality': 'Product Quality',
    'Foreign Material': 'Foreign Material',
    'Packaging': 'Packaging',
    'Labeling': 'Labeling',
    'Customer Service': 'Customer Service',
    'Other': 'Other'
  };
  
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Complaint Management"
        subtitle="Track and manage customer complaints"
      />
      
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Complaints</h2>
          <Button onClick={() => setIsCreateOpen(true)}>
            Create Complaint
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No complaints found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create Your First Complaint
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reported Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeVariant(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadgeVariant(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{complaint.customer_name || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(complaint.reported_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/complaints/${complaint.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Complaint</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the complaint"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the complaint"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as ComplaintCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product Quality">Product Quality</SelectItem>
                    <SelectItem value="Foreign Material">Foreign Material</SelectItem>
                    <SelectItem value="Packaging">Packaging</SelectItem>
                    <SelectItem value="Labeling">Labeling</SelectItem>
                    <SelectItem value="Customer Service">Customer Service</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as ComplaintPriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name of the customer"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="customerContact">Customer Contact</Label>
              <Input
                id="customerContact"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="Email or phone number"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="productInvolved">Product Involved</Label>
                <Input
                  id="productInvolved"
                  value={productInvolved}
                  onChange={(e) => setProductInvolved(e.target.value)}
                  placeholder="Product name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="lotNumber">Lot Number</Label>
                <Input
                  id="lotNumber"
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  placeholder="Product lot number"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="capaRequired"
                checked={capaRequired}
                onCheckedChange={(checked) => setCapaRequired(checked === true)}
              />
              <Label htmlFor="capaRequired" className="text-sm">
                Requires CAPA (Corrective and Preventive Action)
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateComplaint}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintManagement;
