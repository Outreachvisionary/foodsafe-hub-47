
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
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Award,
  Calendar
} from 'lucide-react';

const Standards = () => {
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
  const standards = [
    {
      id: '1',
      name: 'ISO 22000',
      fullName: 'Food Safety Management Systems',
      authority: 'ISO',
      version: '2018',
      status: 'certified',
      complianceScore: 92,
      certificationDate: '2023-03-15',
      expiryDate: '2026-03-15',
      nextAudit: '2024-09-15',
      requirements: 45,
      completedRequirements: 42
    },
    {
      id: '2',
      name: 'HACCP',
      fullName: 'Hazard Analysis Critical Control Points',
      authority: 'FDA',
      version: '2020',
      status: 'compliant',
      complianceScore: 88,
      certificationDate: '2023-01-10',
      expiryDate: '2025-01-10',
      nextAudit: '2024-07-10',
      requirements: 32,
      completedRequirements: 28
    },
    {
      id: '3',
      name: 'SQF',
      fullName: 'Safe Quality Food',
      authority: 'SQFI',
      version: '9.0',
      status: 'in-progress',
      complianceScore: 65,
      certificationDate: null,
      expiryDate: null,
      nextAudit: '2024-08-01',
      requirements: 38,
      completedRequirements: 25
    },
    {
      id: '4',
      name: 'BRC',
      fullName: 'British Retail Consortium',
      authority: 'BRC',
      version: '8',
      status: 'expired',
      complianceScore: 78,
      certificationDate: '2022-02-20',
      expiryDate: '2024-02-20',
      nextAudit: '2024-12-01',
      requirements: 41,
      completedRequirements: 32
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'certified': return 'bg-green-100 text-green-800';
      case 'compliant': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'certified': return <Award className="h-4 w-4" />;
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Standards Compliance</h1>
              <p className="text-muted-foreground text-lg">
                Track compliance with regulatory and quality standards
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Standard
            </Button>
          </div>
        </div>

        {/* Standards Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Standards</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certified</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Compliance</p>
                  <p className="text-2xl font-bold">81%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
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
                    placeholder="Search standards..."
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
                  <option value="certified">Certified</option>
                  <option value="compliant">Compliant</option>
                  <option value="in-progress">In Progress</option>
                  <option value="expired">Expired</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {standards.map((standard) => (
            <Card key={standard.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{standard.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {standard.fullName}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {getStatusIcon(standard.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(standard.status)}>
                      {standard.status}
                    </Badge>
                    <Badge variant="outline">
                      {standard.authority}
                    </Badge>
                    <Badge variant="secondary">
                      v{standard.version}
                    </Badge>
                  </div>

                  {/* Compliance Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compliance Score</span>
                      <span className={getComplianceColor(standard.complianceScore)}>
                        {standard.complianceScore}%
                      </span>
                    </div>
                    <Progress 
                      value={standard.complianceScore} 
                      className="h-2"
                    />
                  </div>

                  {/* Requirements Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Requirements</span>
                      <span>{standard.completedRequirements}/{standard.requirements}</span>
                    </div>
                    <Progress 
                      value={(standard.completedRequirements / standard.requirements) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    {standard.certificationDate && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>Certified: {standard.certificationDate}</span>
                      </div>
                    )}
                    {standard.expiryDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {standard.expiryDate}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Next Audit: {standard.nextAudit}</span>
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

export default Standards;
