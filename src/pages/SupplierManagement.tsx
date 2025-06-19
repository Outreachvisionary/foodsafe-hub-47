
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Plus,
  RefreshCcw,
  Search,
  Filter,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  FileText
} from 'lucide-react';

const SupplierManagement = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('suppliers');

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

  // Enhanced mock data
  const suppliers = [
    {
      id: '1',
      name: 'Fresh Produce Co.',
      category: 'Raw Materials',
      status: 'Approved',
      riskLevel: 'Low',
      riskScore: 85,
      country: 'United States',
      contactName: 'John Smith',
      contactEmail: 'john@freshproduce.com',
      contactPhone: '+1 (555) 123-4567',
      productsSupplied: ['Organic Vegetables', 'Fresh Fruits', 'Herbs'],
      lastAuditDate: '2024-03-15',
      nextAuditDate: '2024-09-15',
      complianceScore: 92,
      certifications: ['USDA Organic', 'GAP Certified'],
      yearEstablished: 1995,
      annualVolume: '$2.5M'
    },
    {
      id: '2',
      name: 'Pacific Seafood Ltd.',
      category: 'Proteins',
      status: 'Under Review',
      riskLevel: 'Medium',
      riskScore: 72,
      country: 'Canada',
      contactName: 'Sarah Johnson',
      contactEmail: 'sarah@pacificseafood.ca',
      contactPhone: '+1 (604) 987-6543',
      productsSupplied: ['Wild Salmon', 'Sustainable Tuna', 'Shellfish'],
      lastAuditDate: '2024-01-20',
      nextAuditDate: '2024-07-20',
      complianceScore: 78,
      certifications: ['MSC Certified', 'ASC Certified'],
      yearEstablished: 2001,
      annualVolume: '$1.8M'
    },
    {
      id: '3',
      name: 'Global Spices Inc.',
      category: 'Ingredients',
      status: 'Pending Approval',
      riskLevel: 'High',
      riskScore: 45,
      country: 'India',
      contactName: 'Raj Patel',
      contactEmail: 'raj@globalspices.in',
      contactPhone: '+91 98765 43210',
      productsSupplied: ['Turmeric', 'Black Pepper', 'Cardamom'],
      lastAuditDate: null,
      nextAuditDate: '2024-08-01',
      complianceScore: 65,
      certifications: ['ISO 22000'],
      yearEstablished: 1987,
      annualVolume: '$850K'
    },
    {
      id: '4',
      name: 'Premium Packaging Solutions',
      category: 'Packaging',
      status: 'Approved',
      riskLevel: 'Low',
      riskScore: 88,
      country: 'Germany',
      contactName: 'Klaus Mueller',
      contactEmail: 'klaus@premiumpack.de',
      contactPhone: '+49 30 12345678',
      productsSupplied: ['Food Grade Containers', 'Labels', 'Protective Packaging'],
      lastAuditDate: '2024-02-10',
      nextAuditDate: '2024-08-10',
      complianceScore: 95,
      certifications: ['BRC Packaging', 'ISO 9001'],
      yearEstablished: 1975,
      annualVolume: '$3.2M'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Pending Approval': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Under Review': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Pending Approval': return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const supplierStats = {
    totalSuppliers: suppliers.length,
    approvedSuppliers: suppliers.filter(s => s.status === 'Approved').length,
    underReview: suppliers.filter(s => s.status === 'Under Review').length,
    pendingApproval: suppliers.filter(s => s.status === 'Pending Approval').length,
    highRisk: suppliers.filter(s => s.riskLevel === 'High').length,
    averageScore: Math.round(suppliers.reduce((acc, s) => acc + s.riskScore, 0) / suppliers.length)
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Supplier Management</h1>
              <p className="text-muted-foreground text-lg">
                Manage supplier relationships, assess risks, and track compliance
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="suppliers">All Suppliers</TabsTrigger>
            <TabsTrigger value="approval">Approval Process</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="space-y-6">
            {/* Supplier Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Suppliers</p>
                      <p className="text-2xl font-bold">{supplierStats.totalSuppliers}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold">{supplierStats.approvedSuppliers}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                      <p className="text-2xl font-bold">{supplierStats.underReview}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{supplierStats.pendingApproval}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                      <p className="text-2xl font-bold">{supplierStats.highRisk}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                      <p className="text-2xl font-bold">{supplierStats.averageScore}</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
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
                      className="px-3 py-2 border rounded-md"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Rejected">Rejected</option>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{supplier.name}</CardTitle>
                        <CardDescription>
                          {supplier.category} • Est. {supplier.yearEstablished}
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
                        <Badge className={getRiskColor(supplier.riskLevel)}>
                          {supplier.riskLevel} Risk
                        </Badge>
                        <Badge variant="outline">
                          {supplier.country}
                        </Badge>
                      </div>

                      {/* Risk Score */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Risk Score</span>
                          <span className={supplier.riskScore >= 80 ? 'text-green-600' : 
                                         supplier.riskScore >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                            {supplier.riskScore}/100
                          </span>
                        </div>
                        <Progress 
                          value={supplier.riskScore} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{supplier.contactName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{supplier.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{supplier.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>{supplier.annualVolume} annual volume</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Products Supplied:</p>
                        <div className="flex flex-wrap gap-1">
                          {supplier.productsSupplied.slice(0, 2).map((product, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                          {supplier.productsSupplied.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{supplier.productsSupplied.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Profile
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
          </TabsContent>

          <TabsContent value="approval">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Approval Process</CardTitle>
                <CardDescription>Manage supplier approval workflows and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Approval workflow management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Dashboard</CardTitle>
                <CardDescription>Monitor and assess supplier risks across various categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Risk assessment tools coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance Metrics</CardTitle>
                <CardDescription>Track supplier performance, delivery times, and quality metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Performance analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default SupplierManagement;
