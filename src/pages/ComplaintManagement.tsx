
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Complaint, ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types/complaint';

// Define enumerated types for dropdown options
const complaintStatuses: ComplaintStatus[] = ['new', 'investigating', 'resolved', 'closed'];
const complaintCategories: ComplaintCategory[] = ['food_safety', 'product_quality', 'foreign_material', 'packaging', 'service'];
const complaintPriorities: ComplaintPriority[] = ['low', 'medium', 'high', 'critical'];

const ComplaintManagement: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState<Partial<Complaint>>({
    title: '',
    description: '',
    category: 'food_safety',
    status: 'new',
    priority: 'medium',
    customer_name: '',
    customer_contact: '',
    product_involved: '',
    lot_number: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('reported_date', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!newComplaint.title || !newComplaint.description || !newComplaint.category) {
        toast.error('Please fill all required fields');
        return;
      }

      // Add user info and timestamps
      const complaintToSubmit = {
        ...newComplaint,
        reported_date: new Date().toISOString(),
        created_by: 'current_user', // This should be dynamic based on auth user
      };

      const { data, error } = await supabase
        .from('complaints')
        .insert([complaintToSubmit])
        .select()
        .single();

      if (error) throw error;
      
      setComplaints([data, ...complaints]);
      toast.success('Complaint submitted successfully');
      setIsDialogOpen(false);
      setNewComplaint({
        title: '',
        description: '',
        category: 'food_safety',
        status: 'new',
        priority: 'medium',
        customer_name: '',
        customer_contact: '',
        product_involved: '',
        lot_number: ''
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint');
    }
  };

  const getStatusBadgeColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'investigating':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'resolved':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-50 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: ComplaintCategory) => {
    switch (category) {
      case 'food_safety':
        return 'Food Safety';
      case 'product_quality':
        return 'Product Quality';
      case 'foreign_material':
        return 'Foreign Material';
      case 'packaging':
        return 'Packaging';
      case 'service':
        return 'Service';
      default:
        return category;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Complaint Management</CardTitle>
              <CardDescription>
                Track and manage customer complaints
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Complaint
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register New Complaint</DialogTitle>
                  <DialogDescription>
                    Enter the details of the customer complaint
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title*
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      className="col-span-3"
                      value={newComplaint.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description*
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      className="col-span-3"
                      value={newComplaint.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category*
                    </Label>
                    <Select
                      value={newComplaint.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {getCategoryLabel(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select
                      value={newComplaint.priority}
                      onValueChange={(value) => handleSelectChange('priority', value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintPriorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer_name" className="text-right">
                      Customer Name
                    </Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      className="col-span-3"
                      value={newComplaint.customer_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer_contact" className="text-right">
                      Customer Contact
                    </Label>
                    <Input
                      id="customer_contact"
                      name="customer_contact"
                      className="col-span-3"
                      value={newComplaint.customer_contact}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product_involved" className="text-right">
                      Product Involved
                    </Label>
                    <Input
                      id="product_involved"
                      name="product_involved"
                      className="col-span-3"
                      value={newComplaint.product_involved}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lot_number" className="text-right">
                      Lot Number
                    </Label>
                    <Input
                      id="lot_number"
                      name="lot_number"
                      className="col-span-3"
                      value={newComplaint.lot_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleSubmit}>
                    Submit Complaint
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading complaints...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Reported Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No complaints found
                    </TableCell>
                  </TableRow>
                ) : (
                  complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell>{getCategoryLabel(complaint.category)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadgeColor(complaint.status)}
                        >
                          {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(complaint.reported_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{complaint.customer_name || 'N/A'}</TableCell>
                      <TableCell>{complaint.product_involved || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintManagement;
