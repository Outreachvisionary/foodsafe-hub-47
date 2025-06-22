
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  BarChart3,
  AlertTriangle,
  Building,
  ClipboardList,
  MessageSquare,
  BoxesIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading while auth is being checked
  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const quickActions = [
    {
      title: 'Dashboard',
      description: 'View system overview and metrics',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'bg-blue-500'
    },
    {
      title: 'Documents',
      description: 'Manage quality documents',
      icon: FileText,
      href: '/documents',
      color: 'bg-green-500'
    },
    {
      title: 'CAPA',
      description: 'Corrective and Preventive Actions',
      icon: ClipboardList,
      href: '/capa',
      color: 'bg-orange-500'
    },
    {
      title: 'Non-Conformance',
      description: 'Track and manage non-conformances',
      icon: AlertTriangle,
      href: '/non-conformance',
      color: 'bg-red-500'
    },
    {
      title: 'Suppliers',
      description: 'Supplier management and evaluation',
      icon: Building,
      href: '/suppliers',
      color: 'bg-purple-500'
    },
    {
      title: 'Traceability',
      description: 'Product and component traceability',
      icon: BoxesIcon,
      href: '/traceability',
      color: 'bg-teal-500'
    },
    {
      title: 'Complaints',
      description: 'Customer complaint management',
      icon: MessageSquare,
      href: '/complaints',
      color: 'bg-pink-500'
    },
    {
      title: 'Facilities',
      description: 'Manage facility information',
      icon: Building,
      href: '/facilities',
      color: 'bg-cyan-500'
    },
    {
      title: 'Reports',
      description: 'Analytics and reporting',
      icon: BarChart3,
      href: '/reports',
      color: 'bg-indigo-500'
    },
    {
      title: 'Users',
      description: 'User management and roles',
      icon: Users,
      href: '/users',
      color: 'bg-gray-500'
    }
  ];

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Quality Management System
          </h1>
          <p className="text-muted-foreground text-lg">
            Streamline your quality processes with our comprehensive QMS platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.href} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(action.href)}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-4">
                    {action.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(action.href);
                    }}
                  >
                    Access Module
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Quick tips to help you get the most out of your QMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Document Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by uploading your existing quality documents and setting up approval workflows.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">User Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure user roles and permissions to ensure proper access control across your organization.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Process Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Link your CAPA, non-conformance, and audit processes for seamless quality management.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Reporting & Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up automated reports to track key quality metrics and compliance indicators.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Index;
