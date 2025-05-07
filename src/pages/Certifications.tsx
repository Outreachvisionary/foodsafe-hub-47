
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, CheckCircle, Clock, Download, FileCheck, FileWarning, Plus, UploadCloud } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MOCK_CERTIFICATIONS = [
  {
    id: '1',
    name: 'Global Food Safety Initiative (GFSI)',
    type: 'Food Safety',
    issuer: 'SGS',
    issuedDate: '2023-05-15',
    expiryDate: '2025-05-14',
    status: 'active',
    facility: 'Main Production Facility',
  },
  {
    id: '2',
    name: 'ISO 22000:2018',
    type: 'Food Safety Management',
    issuer: 'Bureau Veritas',
    issuedDate: '2022-07-20',
    expiryDate: '2025-07-19',
    status: 'active',
    facility: 'Main Production Facility',
  },
  {
    id: '3',
    name: 'FSSC 22000 v5.1',
    type: 'Food Safety System',
    issuer: 'DNV GL',
    issuedDate: '2023-02-10',
    expiryDate: '2026-02-09',
    status: 'active',
    facility: 'Processing Plant',
  },
  {
    id: '4',
    name: 'BRC Global Standard for Food Safety v8',
    type: 'Food Safety',
    issuer: 'NSF',
    issuedDate: '2021-11-05',
    expiryDate: '2023-11-04',
    status: 'expired',
    facility: 'Packaging Facility',
  },
  {
    id: '5',
    name: 'Organic Certification',
    type: 'Product Certification',
    issuer: 'USDA Organic',
    issuedDate: '2023-09-01',
    expiryDate: '2024-08-31',
    status: 'active',
    facility: 'Farming Operations',
  },
  {
    id: '6',
    name: 'Halal Certification',
    type: 'Religious Certification',
    issuer: 'Halal Authority',
    issuedDate: '2022-12-15',
    expiryDate: '2024-12-14',
    status: 'active',
    facility: 'Main Production Facility',
  },
  {
    id: '7',
    name: 'ISO 9001:2015',
    type: 'Quality Management',
    issuer: 'TÜV SÜD',
    issuedDate: '2021-05-10',
    expiryDate: '2024-05-09',
    status: 'renewal-due',
    facility: 'All Facilities',
  },
];

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'active':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
    case 'expired':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Expired</Badge>;
    case 'renewal-due':
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Renewal Due</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const CertificationCard = ({ certification }: { certification: any }) => {
  const daysToExpiry = Math.ceil(
    (new Date(certification.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const isExpiringSoon = daysToExpiry > 0 && daysToExpiry <= 90;
  const isExpired = daysToExpiry <= 0;
  
  return (
    <Card className={`
      ${isExpired ? 'border-red-200 bg-red-50' : ''} 
      ${isExpiringSoon && !isExpired ? 'border-amber-200 bg-amber-50' : ''}
    `}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{certification.name}</CardTitle>
            <CardDescription>{certification.type}</CardDescription>
          </div>
          {getStatusBadge(certification.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Issuer:</span>
            <span className="font-medium">{certification.issuer}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Facility:</span>
            <span className="font-medium">{certification.facility}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Issue Date:</span>
            <span className="font-medium">{new Date(certification.issuedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expiry Date:</span>
            <span className={`font-medium ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : ''}`}>
              {new Date(certification.expiryDate).toLocaleDateString()}
            </span>
          </div>
          {isExpiringSoon && !isExpired && (
            <div className="text-amber-600 text-sm flex items-center mt-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>{daysToExpiry} days until expiry</span>
            </div>
          )}
          {isExpired && (
            <div className="text-red-600 text-sm flex items-center mt-2">
              <FileWarning className="h-4 w-4 mr-1" />
              <span>Expired {Math.abs(daysToExpiry)} days ago</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Renew
        </Button>
      </CardFooter>
    </Card>
  );
};

const Certifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCertifications = MOCK_CERTIFICATIONS.filter(cert => {
    // Filter based on search term
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.facility.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter based on active tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && cert.status === "active";
    if (activeTab === "expiring") {
      const daysToExpiry = Math.ceil(
        (new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return matchesSearch && daysToExpiry > 0 && daysToExpiry <= 90;
    }
    if (activeTab === "expired") return matchesSearch && cert.status === "expired";
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <DashboardHeader
          title={
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              <span>Certifications</span>
            </div>
          }
          subtitle="Manage and monitor your organization's certifications and standards compliance"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UploadCloud size={16} />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Certification</DialogTitle>
              <DialogDescription>
                Upload a new certification or standard compliance document.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certification Name</Label>
                <Input id="name" placeholder="e.g. ISO 22000:2018" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Certification Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food-safety">Food Safety</SelectItem>
                    <SelectItem value="quality-management">Quality Management</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                    <SelectItem value="product-certification">Product Certification</SelectItem>
                    <SelectItem value="religious">Religious Certification</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input id="issueDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issuer">Certification Body/Issuer</Label>
                <Input id="issuer" placeholder="e.g. SGS, Bureau Veritas" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facility">Facility</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Production Facility</SelectItem>
                    <SelectItem value="processing">Processing Plant</SelectItem>
                    <SelectItem value="packaging">Packaging Facility</SelectItem>
                    <SelectItem value="farming">Farming Operations</SelectItem>
                    <SelectItem value="all">All Facilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document">Upload Certificate Document</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit">Upload Certificate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by:</span>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
              <TabsTrigger value="expiring" className="text-xs">Expiring Soon</TabsTrigger>
              <TabsTrigger value="expired" className="text-xs">Expired</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredCertifications.length === 0 ? (
        <div className="text-center py-10">
          <FileCheck className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No certifications found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No certifications match your current search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((cert) => (
            <CertificationCard key={cert.id} certification={cert} />
          ))}
        </div>
      )}
      
      <div className="mt-8 bg-secondary/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Calendar className="h-6 w-6 text-primary" />
          <span>Upcoming Certification Events</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center p-3 rounded-md bg-white border">
            <div className="bg-amber-100 text-amber-800 p-2 rounded-full mr-3">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">ISO 9001:2015 Expires in 30 days</p>
              <p className="text-sm text-muted-foreground">Renewal application should be submitted soon</p>
            </div>
            <Button variant="outline" size="sm">Take Action</Button>
          </div>
          
          <div className="flex items-center p-3 rounded-md bg-white border">
            <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">FSSC 22000 Surveillance Audit</p>
              <p className="text-sm text-muted-foreground">Scheduled for June 15, 2023</p>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
          
          <div className="flex items-center p-3 rounded-md bg-white border">
            <div className="bg-green-100 text-green-800 p-2 rounded-full mr-3">
              <Award className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">New Organic Certification Approved</p>
              <p className="text-sm text-muted-foreground">Document ready for download</p>
            </div>
            <Button variant="outline" size="sm">Download</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
