
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Complaint, ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types/complaint';
import { Plus } from 'lucide-react';

// Define the database schema compatible types
type DbComplaintCategory = 'quality' | 'safety' | 'packaging' | 'delivery' | 'other';
type DbComplaintStatus = 'new' | 'in-progress' | 'resolved' | 'closed' | 'reopened';

// Define values for select inputs
const complaintCategories: ComplaintCategory[] = ['quality', 'safety', 'packaging', 'delivery', 'other'];
const complaintPriorities: ComplaintPriority[] = ['low', 'medium', 'high', 'critical'];

// Map for converting between UI and DB values
const categoryMap: Record<ComplaintCategory, DbComplaintCategory> = {
  'quality': 'quality',
  'safety': 'safety',
  'packaging': 'packaging',
  'delivery': 'delivery',
  'other': 'other'
};

const statusMap: Record<ComplaintStatus, DbComplaintStatus> = {
  'new': 'new',
  'in-progress': 'in-progress',
  'resolved': 'resolved',
  'closed': 'closed',
  'reopened': 'reopened'
};

// Interface for database records
interface DbComplaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  reported_date: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  resolution_date?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_required?: boolean;
  capa_id?: string;
}

const ComplaintManagement: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState<Partial<Complaint>>({
    title: '',
    description: '',
    category: 'quality',
    status: 'new',
    priority: 'medium',
    customerName: '',
    customerContact: '',
    productInvolved: '',
    lotNumber: ''
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

      // Convert database schema to our complaint type
      const convertedComplaints: Complaint[] = (data || []).map((item: DbComplaint) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category as ComplaintCategory,
        status: item.status as ComplaintStatus,
        priority: (item.priority || 'medium') as ComplaintPriority,
        reportedDate: item.reported_date,
        assignedTo: item.assigned_to,
        createdBy: item.created_by,
        createdDate: item.created_at,
        updatedAt: item.updated_at,
        resolutionDate: item.resolution_date,
        customerName: item.customer_name,
        customerContact: item.customer_contact,
        productInvolved: item.product_involved,
        lotNumber: item.lot_number,
        capaRequired: item.capa_required || false,
        capaId: item.capa_id,
        source: 'customer'  // Default value if not in DB
      }));

      setComplaints(convertedComplaints);
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

      // Map our Complaint type to the database schema
      const complaintToSubmit = {
        title: newComplaint.title,
        description: newComplaint.description,
        category: categoryMap[newComplaint.category as ComplaintCategory],
        status: statusMap[newComplaint.status as ComplaintStatus],
        priority: newComplaint.priority,
        reported_date: new Date().toISOString(),
        created_by: 'current_user', // This should be dynamic based on auth user
        customer_name: newComplaint.customerName,
        customer_contact: newComplaint.customerContact,
        product_involved: newComplaint.productInvolved,
        lot_number: newComplaint.lotNumber,
        capa_required: false
      };

      const { data, error } = await supabase
        .from('complaints')
        .insert([complaintToSubmit])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        const newComplaintData = data[0] as DbComplaint;
        
        // Convert back to our type
        const convertedComplaint: Complaint = {
          id: newComplaintData.id,
          title: newComplaintData.title,
          description: newComplaintData.description,
          category: newComplaintData.category as ComplaintCategory,
          status: newComplaintData.status as ComplaintStatus,
          priority: (newComplaintData.priority || 'medium') as ComplaintPriority,
          reportedDate: newComplaintData.reported_date,
          assignedTo: newComplaintData.assigned_to,
          createdBy: newComplaintData.created_by,
          createdDate: newComplaintData.created_at,
          updatedAt: newComplaintData.updated_at,
          resolutionDate: newComplaintData.resolution_date,
          customerName: newComplaintData.customer_name,
          customerContact: newComplaintData.customer_contact,
          productInvolved: newComplaintData.product_involved,
          lotNumber: newComplaintData.lot_number,
          capaRequired: newComplaintData.capa_required || false,
          capaId: newComplaintData.capa_id,
          source: 'customer'  // Default value
        };
        
        setComplaints([convertedComplaint, ...complaints]);
      }
      
      toast.success('Complaint submitted successfully');
      setIsDialogOpen(false);
      setNewComplaint({
        title: '',
        description: '',
        category: 'quality',
        status: 'new',
        priority: 'medium',
        customerName: '',
        customerContact: '',
        productInvolved: '',
        lotNumber: ''
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
      case 'in-progress':
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
      case 'quality':
        return 'Product Quality';
      case 'safety':
        return 'Food Safety';
      case 'packaging':
        return 'Packaging';
      case 'delivery':
        return 'Delivery';
      case 'other':
        return 'Other';
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
                    <Label htmlFor="customerName" className="text-right">
                      Customer Name
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      className="col-span-3"
                      value={newComplaint.customerName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customerContact" className="text-right">
                      Customer Contact
                    </Label>
                    <Input
                      id="customerContact"
                      name="customerContact"
                      className="col-span-3"
                      value={newComplaint.customerContact}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productInvolved" className="text-right">
                      Product Involved
                    </Label>
                    <Input
                      id="productInvolved"
                      name="productInvolved"
                      className="col-span-3"
                      value={newComplaint.productInvolved}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lotNumber" className="text-right">
                      Lot Number
                    </Label>
                    <Input
                      id="lotNumber"
                      name="lotNumber"
                      className="col-span-3"
                      value={newComplaint.lotNumber}
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
                        {new Date(complaint.reportedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{complaint.customerName || 'N/A'}</TableCell>
                      <TableCell>{complaint.productInvolved || 'N/A'}</TableCell>
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
