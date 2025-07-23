import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/ui/enhanced-loading';
import { ArrowLeft, Edit, FileText, Calendar, MapPin, User, Clock, AlertCircle } from 'lucide-react';
import { fetchAuditById, fetchAuditFindings, type Audit, type AuditFinding } from '@/services/realAuditService';
import { format } from 'date-fns';
import DashboardHeader from '@/components/DashboardHeader';

const AuditDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAuditDetails(id);
    }
  }, [id]);

  const loadAuditDetails = async (auditId: string) => {
    try {
      setLoading(true);
      const [auditData, findingsData] = await Promise.all([
        fetchAuditById(auditId),
        fetchAuditFindings(auditId)
      ]);
      
      if (!auditData) {
        setError('Audit not found');
        return;
      }
      
      setAudit(auditData);
      setFindings(findingsData);
    } catch (err) {
      setError('Failed to load audit details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Major':
        return 'bg-orange-100 text-orange-800';
      case 'Minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'Observation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
        <DashboardHeader title="Audit Details" subtitle="Loading audit information..." />
        <LoadingState isLoading={true}>
          <div></div>
        </LoadingState>
      </>
    );
  }

  if (error || !audit) {
    return (
      <>
        <DashboardHeader title="Audit Details" subtitle="Error loading audit" />
        <div className="container max-w-6xl mx-auto py-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-4">{error || 'Audit not found'}</p>
              <Button onClick={() => navigate('/audits')}>
                Back to Audits
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Audit Details" subtitle={audit.title} />
      <div className="container max-w-6xl mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/audits')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Audits
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/audits/edit/${audit.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Audit
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Audit Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{audit.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{audit.audit_type}</span>
                  </div>
                  {audit.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{audit.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(audit.status)}>
                {audit.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  <span>{audit.assigned_to}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(audit.start_date), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(audit.due_date), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Findings</p>
                <div className="flex items-center gap-2 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{findings.length}</span>
                </div>
              </div>
            </div>
            
            {audit.description && (
              <div className="mt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{audit.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Details */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="findings">Findings ({findings.length})</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created By</p>
                    <p>{audit.created_by}</p>
                  </div>
                  {audit.department && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Department</p>
                      <p>{audit.department}</p>
                    </div>
                  )}
                  {audit.related_standard && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Related Standard</p>
                      <p>{audit.related_standard}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p>{format(new Date(audit.created_at), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{audit.status === 'Completed' ? '100%' : audit.status === 'In Progress' ? '50%' : '0%'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${audit.status === 'Completed' ? 100 : audit.status === 'In Progress' ? 50 : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{findings.length}</p>
                        <p className="text-sm text-muted-foreground">Total Findings</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{findings.filter(f => f.status === 'Open').length}</p>
                        <p className="text-sm text-muted-foreground">Open Findings</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="findings">
            <Card>
              <CardHeader>
                <CardTitle>Audit Findings</CardTitle>
              </CardHeader>
              <CardContent>
                {findings.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-muted-foreground">No findings recorded for this audit</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {findings.map((finding) => (
                      <div key={finding.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-medium">{finding.description}</p>
                            {finding.evidence && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Evidence: {finding.evidence}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Badge className={getSeverityColor(finding.severity)}>
                              {finding.severity}
                            </Badge>
                            <Badge variant="outline">
                              {finding.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            {finding.assigned_to && (
                              <span>Assigned to: {finding.assigned_to}</span>
                            )}
                            {finding.due_date && (
                              <span>Due: {format(new Date(finding.due_date), 'MMM d, yyyy')}</span>
                            )}
                          </div>
                          <span>Created: {format(new Date(finding.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist">
            <Card>
              <CardHeader>
                <CardTitle>Audit Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-muted-foreground">Audit checklist functionality will be implemented here</p>
                  <Button className="mt-4" variant="outline">
                    Start Checklist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Audit History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-medium">Audit Created</p>
                      <p className="text-sm text-muted-foreground">
                        Created by {audit.created_by} on {format(new Date(audit.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  {audit.completion_date && (
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="font-medium">Audit Completed</p>
                        <p className="text-sm text-muted-foreground">
                          Completed on {format(new Date(audit.completion_date), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AuditDetailsPage;