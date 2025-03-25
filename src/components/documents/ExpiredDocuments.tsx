
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Document as AppDocument } from '@/types/document';
import { useDocuments } from '@/contexts/DocumentContext';
import DocumentExpirySettings from './DocumentExpirySettings';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import { CalendarClock, Search, AlertTriangle, Filter, Clock, ExternalLink, Calendar, RotateCcw } from 'lucide-react';

const ExpiredDocuments: React.FC = () => {
  const { appDocuments, updateDocument } = useDocuments();
  const [selectedDocument, setSelectedDocument] = useState<AppDocument | null>(null);
  const [showExpirySettings, setShowExpirySettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Get all unique categories from documents
  const categories = Array.from(new Set(appDocuments.map(doc => doc.category)));

  // Filter documents based on search query, status, and category
  const filteredDocuments = appDocuments.filter(doc => {
    const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
    const isExpiringSoon = doc.expiryDate && !isExpired && 
      (new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 30;
    
    const matchesStatus = 
      (filterStatus === 'expired' && isExpired) ||
      (filterStatus === 'expiring' && isExpiringSoon) ||
      (filterStatus === 'all' && (isExpired || isExpiringSoon));
      
    const matchesCategory = 
      filterCategory === 'all' || doc.category === filterCategory;
      
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
    return matchesSearch && matchesStatus && matchesCategory && (isExpired || isExpiringSoon);
  });

  const expiredCount = appDocuments.filter(doc => 
    doc.expiryDate && new Date(doc.expiryDate) < new Date()
  ).length;

  const expiringSoonCount = appDocuments.filter(doc => {
    if (!doc.expiryDate) return false;
    const expiryDate = new Date(doc.expiryDate);
    const now = new Date();
    const daysToExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry > 0 && daysToExpiry <= 30;
  }).length;

  const handleExpiryUpdate = (updatedDoc: AppDocument) => {
    updateDocument(updatedDoc);
    setShowExpirySettings(false);
  };

  const calculateDaysToExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysToExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry < 0) {
      return `Expired ${Math.abs(daysToExpiry)} days ago`;
    } else if (daysToExpiry === 0) {
      return 'Expires today';
    } else {
      return `Expires in ${daysToExpiry} days`;
    }
  };

  const renewDocument = (doc: AppDocument) => {
    // Set new expiry date to 1 year from current date
    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
    
    const updatedDoc = {
      ...doc,
      expiryDate: newExpiryDate.toISOString(),
      status: doc.status === 'Expired' ? 'Published' : doc.status,
      updatedAt: new Date().toISOString()
    };
    
    updateDocument(updatedDoc);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <CalendarClock className="mr-2 h-6 w-6" />
            Expiring Documents
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage documents that are expired or about to expire
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-red-800">Expired Documents</h3>
                <p className="text-3xl font-bold mt-2 text-red-900">{expiredCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-amber-800">Expiring Soon</h3>
                <p className="text-3xl font-bold mt-2 text-amber-900">{expiringSoonCount}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents Requiring Attention</CardTitle>
          <CardDescription>
            Manage expired documents and those approaching their expiry date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => {
                  const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
                  
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100">
                          {doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'N/A'}
                          </span>
                          {doc.expiryDate && (
                            <span className={`text-xs ${isExpired ? 'text-red-500' : 'text-amber-500'}`}>
                              {calculateDaysToExpiry(doc.expiryDate)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isExpired ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Expired
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Expiring Soon
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>v{doc.version}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowPreview(true);
                            }}
                            className="flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowExpirySettings(true);
                            }}
                            className="flex items-center"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Edit Expiry
                          </Button>
                          <Button 
                            variant={isExpired ? "default" : "outline"}
                            size="sm"
                            onClick={() => renewDocument(doc)}
                            className="flex items-center"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Renew
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No expired or expiring documents found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document preview dialog */}
      <DocumentPreviewDialog 
        document={selectedDocument} 
        open={showPreview} 
        onOpenChange={setShowPreview} 
      />

      {/* Document expiry settings dialog */}
      {selectedDocument && (
        <DocumentExpirySettings 
          document={selectedDocument}
          open={showExpirySettings}
          onOpenChange={setShowExpirySettings}
          onUpdate={handleExpiryUpdate}
        />
      )}
    </div>
  );
};

export default ExpiredDocuments;
