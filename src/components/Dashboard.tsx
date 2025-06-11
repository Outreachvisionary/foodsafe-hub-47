
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { useCAPAs } from '@/hooks/useCAPAs';
import { useNonConformances } from '@/hooks/useNonConformances';
import { useAuth } from '@/contexts/AuthContext';
import Layout from './Layout';

const Dashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const { documents, isLoading: documentsLoading } = useDocuments();
  const { capas, isLoading: capasLoading } = useCAPAs();
  const { nonConformances, isLoading: ncsLoading } = useNonConformances();

  const isLoading = documentsLoading || capasLoading || ncsLoading;

  // Calculate metrics
  const metrics = {
    totalDocuments: documents.length,
    draftDocuments: documents.filter(d => d.status === 'Draft').length,
    publishedDocuments: documents.filter(d => d.status === 'Published').length,
    totalCAPAs: capas.length,
    openCAPAs: capas.filter(c => c.status === 'Open').length,
    overdueCAPAs: capas.filter(c => new Date(c.due_date) < new Date() && c.status !== 'Completed').length,
    totalNCs: nonConformances.length,
    openNCs: nonConformances.filter(nc => nc.status === 'On Hold').length,
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Welcome Header */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || user?.email}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your quality management system
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold">{metrics.totalDocuments}</p>
                  <p className="text-xs text-green-600">
                    {metrics.publishedDocuments} published
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CAPAs</p>
                  <p className="text-2xl font-bold">{metrics.totalCAPAs}</p>
                  <p className="text-xs text-orange-600">
                    {metrics.openCAPAs} open
                  </p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Non-Conformances</p>
                  <p className="text-2xl font-bold">{metrics.totalNCs}</p>
                  <p className="text-xs text-red-600">
                    {metrics.openNCs} on hold
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue Items</p>
                  <p className="text-2xl font-bold">{metrics.overdueCAPAs}</p>
                  <p className="text-xs text-red-600">
                    Needs attention
                  </p>
                </div>
                <Clock className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={doc.status === 'Published' ? 'default' : 'secondary'}>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent CAPAs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {capas.slice(0, 5).map((capa) => (
                  <div key={capa.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{capa.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(capa.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        capa.status === 'Completed' ? 'default' : 
                        new Date(capa.due_date) < new Date() ? 'destructive' : 'secondary'
                      }
                    >
                      {capa.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>New Document</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Activity className="h-6 w-6" />
                <span>Create CAPA</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Report NC</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>Schedule Audit</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
