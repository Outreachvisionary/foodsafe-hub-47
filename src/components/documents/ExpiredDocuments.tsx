
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  CalendarX, 
  Clock, 
  Search, 
  Filter,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExpiredDocument {
  id: string;
  title: string;
  category: string;
  expiryDate: string;
  status: 'Expired' | 'Expiring Soon';
  daysRemaining: number;
  owner: string;
}

const expiredDocuments: ExpiredDocument[] = [
  {
    id: '1',
    title: 'SQF Certificate - Main Plant',
    category: 'Certificate',
    expiryDate: '2023-10-05',
    status: 'Expired',
    daysRemaining: -10,
    owner: 'John Doe'
  },
  {
    id: '2',
    title: 'Pest Control Service Agreement',
    category: 'Supplier Documentation',
    expiryDate: '2023-10-10',
    status: 'Expired',
    daysRemaining: -5,
    owner: 'Sarah Johnson'
  },
  {
    id: '3',
    title: 'Food Defense Plan',
    category: 'SOP',
    expiryDate: '2023-10-12',
    status: 'Expired',
    daysRemaining: -3,
    owner: 'Mike Brown'
  }
];

const expiringDocuments: ExpiredDocument[] = [
  {
    id: '4',
    title: 'HACCP Plan - Cooking Process',
    category: 'HACCP Plan',
    expiryDate: '2023-10-28',
    status: 'Expiring Soon',
    daysRemaining: 13,
    owner: 'Jane Smith'
  },
  {
    id: '5',
    title: 'Water Testing Program',
    category: 'SOP',
    expiryDate: '2023-10-25',
    status: 'Expiring Soon',
    daysRemaining: 10,
    owner: 'John Doe'
  },
  {
    id: '6',
    title: 'ISO 22000 Certificate',
    category: 'Certificate',
    expiryDate: '2023-11-05',
    status: 'Expiring Soon',
    daysRemaining: 21,
    owner: 'Sarah Johnson'
  },
  {
    id: '7',
    title: 'Supplier XYZ Quality Agreement',
    category: 'Supplier Documentation',
    expiryDate: '2023-11-10',
    status: 'Expiring Soon',
    daysRemaining: 26,
    owner: 'Mike Brown'
  }
];

const ExpiredDocuments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredExpired = expiredDocuments.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' ? true : doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const filteredExpiring = expiringDocuments.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' ? true : doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search documents by title or owner..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="SOP">SOPs</SelectItem>
                <SelectItem value="Policy">Policies</SelectItem>
                <SelectItem value="Form">Forms</SelectItem>
                <SelectItem value="Certificate">Certificates</SelectItem>
                <SelectItem value="Audit Report">Audit Reports</SelectItem>
                <SelectItem value="HACCP Plan">HACCP Plans</SelectItem>
                <SelectItem value="Training Material">Training Materials</SelectItem>
                <SelectItem value="Supplier Documentation">Supplier Docs</SelectItem>
                <SelectItem value="Risk Assessment">Risk Assessments</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">More Filters</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="expired">
          <TabsList className="mb-4">
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <CalendarX className="h-4 w-4" />
              <span>Expired Documents</span>
              <Badge className="ml-1 bg-red-100 text-red-800 hover:bg-red-100">{expiredDocuments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="expiring" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Expiring Soon</span>
              <Badge className="ml-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{expiringDocuments.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="expired">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpired.length > 0 ? (
                    filteredExpired.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            {doc.title}
                          </div>
                        </TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>{doc.owner}</TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {new Date(doc.expiryDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800" variant="outline">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Expired
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No expired documents found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="expiring">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Remaining</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpiring.length > 0 ? (
                    filteredExpiring.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            {doc.title}
                          </div>
                        </TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>{doc.owner}</TableCell>
                        <TableCell>{new Date(doc.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800" variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {doc.daysRemaining} days
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No documents expiring soon found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpiredDocuments;
