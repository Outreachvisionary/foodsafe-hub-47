
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

const Audits = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mock data - replace with actual data fetching
  const audits = [
    {
      id: '1',
      title: 'ISO 22000 Internal Audit',
      description: 'Annual internal audit for food safety management system',
      status: 'completed',
      auditType: 'Internal',
      auditor: 'Sarah Johnson',
      startDate: '2024-06-10',
      dueDate: '2024-06-15',
      completionDate: '2024-06-14',
      location: 'Production Facility A',
      findingsCount: 3,
      department: 'Quality Assurance'
    },
    {
      id: '2',
      title: 'HACCP Verification Audit',
      description: 'Quarterly verification of HACCP plan implementation',
      status: 'in-progress',
      auditType: 'Internal',
      auditor: 'Mike Wilson',
      startDate: '2024-06-18',
      dueDate: '2024-06-25',
      completionDate: null,
      location: 'Kitchen & Processing Area',
      findingsCount: 1,
      department: 'Production'
    },
    {
      id: '3',
      title: 'Supplier Audit - ABC Ingredients',
      description: 'On-site audit of key ingredient supplier',
      status: 'scheduled',
      auditType: 'External',
      auditor: 'John Smith',
      startDate: '2024-07-01',
      dueDate: '2024-07-03',
      completionDate: null,
      location: 'Supplier Facility',
      findingsCount: 0,
      department: 'Procurement'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Audits</h1>
              <p className="text-muted-foreground text-lg">
                Manage internal and external audits
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search audits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {audits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{audit.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {audit.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {getStatusIcon(audit.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(audit.status)}>
                      {audit.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {audit.auditType}
                    </Badge>
                    <Badge variant="secondary">
                      {audit.department}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{audit.auditor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{audit.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{audit.startDate} - {audit.dueDate}</span>
                    </div>
                    {audit.findingsCount > 0 && (
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        <span>{audit.findingsCount} findings</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      {audit.status === 'scheduled' ? 'Start' : 'Continue'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Audits;
