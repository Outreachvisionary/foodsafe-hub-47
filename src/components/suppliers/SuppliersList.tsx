import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Truck, Star, Filter, FileCheck } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const SuppliersList: React.FC = () => {
  const {
    suppliers,
    isLoading,
    error,
    addSupplier,
    editSupplier
  } = useSuppliers();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    category: '',
    riskLevel: 'Low',
    country: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (supplier.business_type || supplier.category || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    supplier.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskBadgeStyle = (riskLevel?: string) => {
    switch ((riskLevel || 'medium').toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const resetNewSupplierForm = () => {
    setNewSupplier({
      name: '',
      category: '',
      riskLevel: 'Low',
      country: '',
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSupplier({
        name: newSupplier.name,
        business_type: newSupplier.category,
        risk_level: newSupplier.riskLevel,
        certification_status: 'Pending',
        country: newSupplier.country,
        contact_person: newSupplier.contactName,
        contact_email: newSupplier.contactEmail,
        contact_phone: newSupplier.contactPhone,
        status: 'Active'
      });
      setIsDialogOpen(false);
      resetNewSupplierForm();
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('Failed to add supplier');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      await editSupplier({ id: selectedSupplier.id, updates: selectedSupplier });
      setIsEditDialogOpen(false);
      toast.success('Supplier updated successfully');
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Failed to update supplier');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedSupplier) return;
    const { id, value } = e.target;
    setSelectedSupplier((prev: any) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setNewSupplier(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditSelectChange = (value: string, field: string) => {
    if (!selectedSupplier) return;
    setSelectedSupplier((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleViewSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsViewDialogOpen(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  if (error) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Error loading suppliers: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Suppliers Directory
        </CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search suppliers..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Enter the details for the new supplier. Once added, you can manage their documents and compliance information.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">Name</label>
                    <Input id="name" className="col-span-3" required value={newSupplier.name} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-right">Category</label>
                    <Input id="category" className="col-span-3" required value={newSupplier.category} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="country" className="text-right">Country</label>
                    <Input id="country" className="col-span-3" required value={newSupplier.country} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="riskLevel" className="text-right">Risk Level</label>
                    <Select value={newSupplier.riskLevel} onValueChange={(value) => handleSelectChange(value, 'riskLevel')}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="contactName" className="text-right">Contact Name</label>
                    <Input id="contactName" className="col-span-3" required value={newSupplier.contactName} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="contactEmail" className="text-right">Contact Email</label>
                    <Input id="contactEmail" type="email" className="col-span-3" required value={newSupplier.contactEmail} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="contactPhone" className="text-right">Contact Phone</label>
                    <Input id="contactPhone" className="col-span-3" required value={newSupplier.contactPhone} onChange={handleInputChange} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Supplier</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="py-[4px] px-0">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Certification Status</TableHead>
                <TableHead>Last Audit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier: any) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.business_type || supplier.category || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={getRiskBadgeStyle(supplier.risk_level)} variant="outline">
                        {supplier.risk_level || 'Medium'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{supplier.certification_status || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.last_audit_date ? new Date(supplier.last_audit_date).toLocaleDateString() : 'Not audited'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeStyle(supplier.status)} variant="outline">
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewSupplier(supplier)}>
                          <FileCheck className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditSupplier(supplier)}>
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No suppliers match your search criteria' : 'No suppliers found. Add your first supplier!'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              View complete information about this supplier
            </DialogDescription>
          </DialogHeader>
          
          {selectedSupplier && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Name:</span>
                      <span className="col-span-2 font-medium">{selectedSupplier.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Category:</span>
                      <span className="col-span-2">{selectedSupplier.business_type || selectedSupplier.category || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Country:</span>
                      <span className="col-span-2">{selectedSupplier.country}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Status:</span>
                      <span className="col-span-2">
                        <Badge className={getStatusBadgeStyle(selectedSupplier.status)}>
                          {selectedSupplier.status}
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Contact:</span>
                      <span className="col-span-2 font-medium">{selectedSupplier.contact_person || selectedSupplier.contact_name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="col-span-2">{selectedSupplier.contact_email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Phone:</span>
                      <span className="col-span-2">{selectedSupplier.contact_phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Compliance & Risk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Risk Level:</span>
                      <span className="col-span-2">
                        <Badge className={getRiskBadgeStyle(selectedSupplier.risk_level)} variant="outline">
                          {selectedSupplier.risk_level || 'Medium'} Risk
                        </Badge>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Certification:</span>
                      <span className="col-span-2">{selectedSupplier.certification_status || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Last Audit:</span>
                      <span className="col-span-2">
                        {selectedSupplier.last_audit_date ? new Date(selectedSupplier.last_audit_date).toLocaleDateString() : 'Not audited'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SuppliersList;