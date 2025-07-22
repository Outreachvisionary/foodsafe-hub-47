import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Suppliers = () => {
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

  // Mock supplier data
  const suppliers = [
    {
      id: '1',
      name: 'Premium Food Ingredients Ltd',
      category: 'Raw Materials',
      contact: 'John Smith',
      email: 'john@premiumfood.com',
      phone: '+1 (555) 123-4567',
      country: 'United States',
      status: 'approved',
      complianceScore: 95,
      riskLevel: 'low',
      lastAuditDate: '2023-11-15',
      nextAuditDate: '2024-11-15',
      standards: ['ISO 22000', 'HACCP', 'SQF'],
      products: ['Organic Flour', 'Natural Additives', 'Preservatives']
    },
    {
      id: '2',
      name: 'Global Packaging Solutions',
      category: 'Packaging',
      contact: 'Sarah Johnson',
      email: 'sarah@gps.com',
      phone: '+1 (555) 987-6543',
      country: 'Canada',
      status: 'approved',
      complianceScore: 88,
      riskLevel: 'low',
      lastAuditDate: '2023-09-20',
      nextAuditDate: '2024-09-20',
      standards: ['ISO 22000', 'BRC'],
      products: ['Food Containers', 'Labels', 'Wrapping Materials']
    },
    {
      id: '3',
      name: 'Regional Dairy Cooperative',
      category: 'Dairy Products',
      contact: 'Mike Wilson',
      email: 'mike@regionaldairy.com',
      phone: '+1 (555) 456-7890',
      country: 'United States',
      status: 'pending',
      complianceScore: 72,
      riskLevel: 'medium',
      lastAuditDate: '2023-08-10',
      nextAuditDate: '2024-08-10',
      standards: ['HACCP'],
      products: ['Milk', 'Cheese', 'Butter']
    },
    {
      id: '4',
      name: 'International Spice Trading',
      category: 'Spices & Seasonings',
      contact: 'Lisa Chen',
      email: 'lisa@spicetrade.com',
      phone: '+86 138-0013-8000',
      country: 'China',
      status: 'suspended',
      complianceScore: 58,
      riskLevel: 'high',
      lastAuditDate: '2023-06-05',
      nextAuditDate: '2024-12-01',
      standards: [],
      products: ['Spices', 'Herbs', 'Seasonings']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'status-success';
      case 'pending': return 'status-warning';
      case 'suspended': return 'status-error';
      default: return 'status-info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'suspended': return <AlertTriangle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-info';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Supplier Management</h1>
              <p className="text-muted-foreground text-lg">
                Manage supplier relationships and compliance status
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Suppliers Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Suppliers</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Compliance</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <Award className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border rounded-md bg-background"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{supplier.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {supplier.category}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {getStatusIcon(supplier.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status}
                    </Badge>
                    <Badge variant="outline" className={getRiskColor(supplier.riskLevel)}>
                      {supplier.riskLevel} risk
                    </Badge>
                    <Badge variant="secondary">
                      {supplier.country}
                    </Badge>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{supplier.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{supplier.phone}</span>
                    </div>
                  </div>

                  {/* Compliance Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compliance Score</span>
                      <span className={getComplianceColor(supplier.complianceScore)}>
                        {supplier.complianceScore}%
                      </span>
                    </div>
                    <Progress 
                      value={supplier.complianceScore} 
                      className="h-2"
                    />
                  </div>

                  {/* Standards */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Standards:</span>
                    <div className="flex flex-wrap gap-1">
                      {supplier.standards.length > 0 ? (
                        supplier.standards.map((standard) => (
                          <Badge key={standard} variant="secondary" className="text-xs">
                            {standard}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No standards</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Last Audit: {supplier.lastAuditDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Next Audit: {supplier.nextAuditDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Manage
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

export default Suppliers;