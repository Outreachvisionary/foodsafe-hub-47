
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Search, Truck, Star, Filter, FileCheck } from 'lucide-react';

// Sample data for suppliers
const sampleSuppliers = [
  { 
    id: 1, 
    name: 'Organic Farms Co.', 
    category: 'Raw Materials', 
    riskLevel: 'Low', 
    complianceScore: 92,
    lastAudit: '2023-11-15',
    status: 'Approved'
  },
  { 
    id: 2, 
    name: 'Premium Packaging Inc.', 
    category: 'Packaging', 
    riskLevel: 'Medium', 
    complianceScore: 87,
    lastAudit: '2023-10-22',
    status: 'Approved'
  },
  { 
    id: 3, 
    name: 'Global Ingredients Ltd.', 
    category: 'Ingredients', 
    riskLevel: 'High', 
    complianceScore: 76,
    lastAudit: '2023-12-05',
    status: 'Probation'
  },
  { 
    id: 4, 
    name: 'EcoClean Solutions', 
    category: 'Sanitation', 
    riskLevel: 'Low', 
    complianceScore: 95,
    lastAudit: '2023-09-30',
    status: 'Approved'
  },
  { 
    id: 5, 
    name: 'QuickShip Logistics', 
    category: 'Transportation', 
    riskLevel: 'Medium', 
    complianceScore: 83,
    lastAudit: '2023-11-28',
    status: 'Approved'
  },
];

const SuppliersList: React.FC = () => {
  const [suppliers, setSuppliers] = useState(sampleSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskBadgeStyle = (riskLevel: string) => {
    switch(riskLevel.toLowerCase()) {
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
    switch(status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'probation':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'suspended':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

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
          <Dialog>
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">Name</label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="category" className="text-right">Category</label>
                  <Input id="category" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="riskLevel" className="text-right">Risk Level</label>
                  <Input id="riskLevel" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Supplier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
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
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>
                  <Badge className={getRiskBadgeStyle(supplier.riskLevel)} variant="outline">
                    {supplier.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{supplier.complianceScore}%</span>
                    {supplier.complianceScore >= 90 && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{supplier.lastAudit}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(supplier.status)} variant="outline">
                    {supplier.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileCheck className="h-4 w-4 mr-1" /> View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SuppliersList;
