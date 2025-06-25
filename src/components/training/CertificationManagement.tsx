
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertCircle, Calendar as CalendarIcon, CheckCircle, Clock, FileText, Search, Shield, AlertTriangle, Bell } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCertifications } from '@/hooks/useCertifications';
import { useAuth } from '@/contexts/AuthContext';

const CertificationManagement = () => {
  const { user } = useAuth();
  const { 
    employeeCertifications, 
    createEmployeeCertification, 
    updateEmployeeCertification,
    isLoading 
  } = useCertifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState<Date | undefined>(undefined);
  const [reminderDays, setReminderDays] = useState('30');

  // Check if all certifications are up-to-date
  const hasExpiredCerts = employeeCertifications.some(cert => {
    const expiryTimestamp = new Date(cert.expiry_date).getTime();
    const currentTimestamp = new Date().getTime();
    return expiryTimestamp < currentTimestamp;
  });

  // Filter certifications based on search and status filter
  const filteredCertifications = employeeCertifications.filter((cert) => {
    const matchesSearch = 
      searchTerm === '' || 
      cert.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cert.certification_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuing_body.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter) {
      const expiryTimestamp = new Date(cert.expiry_date).getTime();
      const currentTimestamp = new Date().getTime();
      const daysToExpiry = Math.ceil((expiryTimestamp - currentTimestamp) / (1000 * 60 * 60 * 24));
      
      if (statusFilter === 'active' && (daysToExpiry <= 30 || daysToExpiry <= 0)) {
        matchesStatus = false;
      } else if (statusFilter === 'expiring' && (daysToExpiry > 30 || daysToExpiry <= 0)) {
        matchesStatus = false;
      } else if (statusFilter === 'expired' && daysToExpiry > 0) {
        matchesStatus = false;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  // Helper function to determine badge color based on status
  const getStatusBadge = (status: string, expiryDate: string) => {
    const expiryTimestamp = new Date(expiryDate).getTime();
    const currentTimestamp = new Date().getTime();
    const daysToExpiry = Math.ceil((expiryTimestamp - currentTimestamp) / (1000 * 60 * 60 * 24));

    if (status === 'Expired' || daysToExpiry <= 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (status === 'Active' && daysToExpiry <= 30) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Expiring Soon</Badge>;
    } else if (status === 'Active') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{status}</Badge>;
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const handleRenewCertification = () => {
    if (!selectedCertId || !newExpiryDate) return;
    
    updateEmployeeCertification({
      id: selectedCertId,
      updates: {
        status: 'Active' as const,
        expiry_date: format(newExpiryDate, 'yyyy-MM-dd'),
        issued_date: format(new Date(), 'yyyy-MM-dd'),
      }
    });
    
    setShowRenewalDialog(false);
    setNewExpiryDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Certification Management</h2>
          <p className="text-muted-foreground">
            Track and manage employee certifications and credentials
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {hasExpiredCerts && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Expired Certifications Found</AlertTitle>
          <AlertDescription>
            Some employees have expired certifications. Please review and take action to maintain compliance.
          </AlertDescription>
        </Alert>
      )}

      {!hasExpiredCerts && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>All Certifications Up-to-Date</AlertTitle>
          <AlertDescription>
            All employee certifications are current and valid.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Certification Tracking</CardTitle>
          <CardDescription>Monitor and manage certification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search certifications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading certifications...
                      </TableCell>
                    </TableRow>
                  ) : filteredCertifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No certifications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCertifications.map((cert) => {
                      const expiryDate = new Date(cert.expiry_date);
                      const currentDate = new Date();
                      const daysToExpiry = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <TableRow key={cert.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt={cert.employee_name} />
                                <AvatarFallback>{getInitials(cert.employee_name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{cert.employee_name}</div>
                                <div className="text-xs text-muted-foreground">{cert.department}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{cert.certification_name}</div>
                            <div className="text-xs text-muted-foreground">{cert.issuing_body} • {cert.certificate_number}</div>
                          </TableCell>
                          <TableCell>{new Date(cert.issued_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-start gap-1">
                              {new Date(cert.expiry_date).toLocaleDateString()}
                              {daysToExpiry <= 30 && daysToExpiry > 0 && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                              {daysToExpiry <= 0 && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(cert.status, cert.expiry_date)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCertId(cert.id || '');
                                  setShowReminderDialog(true);
                                }}
                              >
                                <Bell className="h-4 w-4" />
                                <span className="sr-only">Send Reminder</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCertId(cert.id || '');
                                  setShowRenewalDialog(true);
                                  
                                  // Set default new expiry date to one year from current expiry
                                  const currentExpiry = new Date(cert.expiry_date);
                                  const newExpiry = new Date(currentExpiry);
                                  newExpiry.setFullYear(newExpiry.getFullYear() + 1);
                                  setNewExpiryDate(newExpiry);
                                }}
                              >
                                <Shield className="h-4 w-4" />
                                <span className="sr-only">Renew</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Renewal Dialog */}
      <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Certification</DialogTitle>
            <DialogDescription>
              Update the certification with a new expiry date.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>New Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newExpiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newExpiryDate ? format(newExpiryDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newExpiryDate}
                    onSelect={setNewExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRenewCertification}
              disabled={!newExpiryDate}
            >
              Renew Certification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificationManagement;
