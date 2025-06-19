import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Truck, Star, Filter, FileCheck } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Supplier } from '@/types/supplier';
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
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
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

  const filteredSuppliers = suppliers.filter(supplier => supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) || supplier.country.toLowerCase().includes(searchQuery.toLowerCase()));
  const getRiskBadgeStyle = (riskScore: number) => {
    const riskLevel = riskScore >= 85 ? 'Low' : riskScore >= 70 ? 'Medium' : 'High';
    switch (riskLevel.toLowerCase()) {
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
      const risk_score = newSupplier.riskLevel === 'Low' ? 90 : newSupplier.riskLevel === 'Medium' ? 80 : 65;
      await addSupplier({
        name: newSupplier.name,
        category: newSupplier.category,
        risk_score,
        compliance_status: 'Pending',
        country: newSupplier.country,
        contact_name: newSupplier.contactName,
        contact_email: newSupplier.contactEmail,
        contact_phone: newSupplier.contactPhone,
        products: [],
        status: 'Pending',
        last_audit_date: undefined
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
      await editSupplier(selectedSupplier.id, selectedSupplier);
      setIsEditDialogOpen(false);
      toast.success('Supplier updated successfully');
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Failed to update supplier');
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      id,
      value
    } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [id]: value
    }));
  };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedSupplier) return;
    const {
      id,
      value
    } = e.target;
    setSelectedSupplier(prev => ({
      ...prev!,
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
    setSelectedSupplier(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };
  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewDialogOpen(true);
  };
  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  if (error) {
    return <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Error loading suppliers: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>;
  }

  return <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Suppliers Directory
        </CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search suppliers..." className="pl-8 w-[250px]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                    <Select value={newSupplier.riskLevel} onValueChange={value => handleSelectChange(value, 'riskLevel')}>
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
        {isLoading ? <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div> : <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Compliance Score</TableHead>
                <TableHead>Last Audit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length > 0 ? filteredSuppliers.map(supplier => <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.category}</TableCell>
                    <TableCell>
                      <Badge className={getRiskBadgeStyle(supplier.risk_score)} variant="outline">
                        {supplier.risk_score >= 85 ? 'Low' : supplier.risk_score >= 70 ? 'Medium' : 'High'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{supplier.risk_score}%</span>
                        {supplier.risk_score >= 90 && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
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
                  </TableRow>) : <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No suppliers match your search criteria' : 'No suppliers found. Add your first supplier!'}
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>}
      </CardContent>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              View complete information about this supplier
            </DialogDescription>
          </DialogHeader>
          
          {selectedSupplier && <div className="space-y-6">
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
                      <span className="col-span-2">{selectedSupplier.category}</span>
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
                      <span className="col-span-2 font-medium">{selectedSupplier.contact_name}</span>
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
                      <span className="text-gray-500">Risk Score:</span>
                      <span className="col-span-2">
                        {selectedSupplier.risk_score}% - 
                        <Badge className={getRiskBadgeStyle(selectedSupplier.risk_score)} variant="outline">
                          {selectedSupplier.risk_score >= 85 ? 'Low' : selectedSupplier.risk_score >= 70 ? 'Medium' : 'High'} Risk
                        </Badge>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Compliance:</span>
                      <span className="col-span-2">{selectedSupplier.compliance_status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Last Audit:</span>
                      <span className="col-span-2">
                        {selectedSupplier.last_audit_date ? new Date(selectedSupplier.last_audit_date).toLocaleDateString() : 'Not audited'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Standards:</span>
                      <div className="col-span-2">
                        {selectedSupplier.fsmsStandards && selectedSupplier.fsmsStandards.length > 0 ? <div className="flex flex-wrap gap-2">
                            {selectedSupplier.fsmsStandards.map((standard, idx) => <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                                {standard.name} {standard.certified ? '(Certified)' : ''}
                              </Badge>)}
                          </div> : <span className="text-gray-400">No standards registered</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Products:</span>
                      <div className="col-span-2">
                        {selectedSupplier.products && selectedSupplier.products.length > 0 ? <div className="flex flex-wrap gap-2">
                            {selectedSupplier.products.map((product, idx) => <Badge key={idx} variant="outline">
                                {product}
                              </Badge>)}
                          </div> : <span className="text-gray-400">No products listed</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedSupplier && <Button onClick={() => {
            setIsViewDialogOpen(false);
            handleEditSupplier(selectedSupplier);
          }}>
                Edit Supplier
              </Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier information
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">Name</label>
                  <Input id="name" className="col-span-3" required value={selectedSupplier.name} onChange={handleEditInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="category" className="text-right">Category</label>
                  <Input id="category" className="col-span-3" required value={selectedSupplier.category} onChange={handleEditInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="country" className="text-right">Country</label>
                  <Input id="country" className="col-span-3" required value={selectedSupplier.country} onChange={handleEditInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="status" className="text-right">Status</label>
                  <Select value={selectedSupplier.status} onValueChange={value => handleEditSelectChange(value, 'status')}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="contactName" className="text-right">Contact Name</label>
                  <Input id="contactName" className="col-span-3" required value={selectedSupplier.contact_name} onChange={handleEditInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="contactEmail" className="text-right">Contact Email</label>
                  <Input id="contactEmail" type="email" className="col-span-3" required value={selectedSupplier.contact_email} onChange={handleEditInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="contactPhone" className="text-right">Contact Phone</label>
                  <Input id="contactPhone" className="col-span-3" required value={selectedSupplier.contact_phone} onChange={handleEditInputChange} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Supplier</Button>
              </DialogFooter>
            </form>}
        </DialogContent>
      </Dialog>
    </Card>;
};
export default SuppliersList;
