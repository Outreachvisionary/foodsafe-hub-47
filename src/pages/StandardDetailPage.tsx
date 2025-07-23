import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Shield, 
  Award, 
  Building, 
  FileText, 
  Calendar,
  ExternalLink,
  Plus,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Settings
} from 'lucide-react';
import { useRegulatoryStandard, useFacilityStandards } from '@/hooks/useStandards';
import { COMPLIANCE_COLORS } from '@/types/standards';
import { LoadingState } from '@/components/ui/enhanced-loading';
import { format } from 'date-fns';

const StandardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: standard, isLoading: isLoadingStandard } = useRegulatoryStandard(id || '');
  const { data: facilityStandards = [], isLoading: isLoadingFacilities } = useFacilityStandards();

  // Filter facility standards for this regulatory standard
  const relatedFacilityStandards = facilityStandards.filter(
    fs => fs.standard_id === id
  );

  const getComplianceStats = () => {
    const total = relatedFacilityStandards.length;
    const certified = relatedFacilityStandards.filter(fs => fs.compliance_status === 'Certified').length;
    const compliant = relatedFacilityStandards.filter(fs => fs.compliance_status === 'Compliant').length;
    const inProgress = relatedFacilityStandards.filter(fs => fs.compliance_status === 'In Progress').length;
    const nonCompliant = relatedFacilityStandards.filter(fs => fs.compliance_status === 'Non-Compliant').length;
    
    return { total, certified, compliant, inProgress, nonCompliant };
  };

  const stats = getComplianceStats();

  if (isLoadingStandard) {
    return (
      <div className="container max-w-6xl mx-auto py-6">
        <LoadingState isLoading={true}>
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </LoadingState>
      </div>
    );
  }

  if (!standard) {
    return (
      <div className="container max-w-6xl mx-auto py-6">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-4">Standard not found</p>
            <Button onClick={() => navigate('/standards')}>
              Back to Standards
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/standards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Standards
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{standard.name}</h1>
            <p className="text-muted-foreground">{standard.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/standards/edit/${standard.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Standard
          </Button>
          <Button onClick={() => navigate('/standards/assign')}>
            <Plus className="h-4 w-4 mr-2" />
            Assign to Facility
          </Button>
        </div>
      </div>

      {/* Standard Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {standard.name}
              </CardTitle>
              <p className="text-muted-foreground mt-1">{standard.description}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{standard.authority}</Badge>
              {standard.version && <Badge variant="secondary">v{standard.version}</Badge>}
              {standard.is_mandatory && <Badge variant="destructive">Mandatory</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-blue-600">Facilities</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{stats.certified}</p>
              <p className="text-sm text-green-600">Certified</p>
            </div>
            
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">{stats.compliant}</p>
              <p className="text-sm text-emerald-600">Compliant</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              <p className="text-sm text-orange-600">In Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facilities">Facilities ({stats.total})</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Standard Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Authority</p>
                    <p>{standard.authority}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Version</p>
                    <p>{standard.version || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p>{standard.category || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scope</p>
                    <p>{standard.scope || 'N/A'}</p>
                  </div>
                </div>

                {standard.geographical_scope && standard.geographical_scope.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Geographical Scope</p>
                    <div className="flex flex-wrap gap-2">
                      {standard.geographical_scope.map((region, index) => (
                        <Badge key={index} variant="outline">{region}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {standard.industry_sectors && standard.industry_sectors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Industry Sectors</p>
                    <div className="flex flex-wrap gap-2">
                      {standard.industry_sectors.map((sector, index) => (
                        <Badge key={index} variant="secondary">{sector}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {standard.documentation_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Documentation</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={standard.documentation_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Documentation
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.total === 0 ? (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No facilities assigned yet</p>
                      <Button onClick={() => navigate('/standards/assign')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Assign to Facility
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Certified</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(stats.certified / stats.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.certified}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Compliant</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${(stats.compliant / stats.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.compliant}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">In Progress</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.inProgress}</span>
                        </div>
                      </div>
                      
                      {stats.nonCompliant > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Non-Compliant</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: `${(stats.nonCompliant / stats.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{stats.nonCompliant}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>Facility Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingState isLoading={isLoadingFacilities}>
                {relatedFacilityStandards.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No facilities assigned to this standard</p>
                    <Button onClick={() => navigate('/standards/assign')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign to Facility
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {relatedFacilityStandards.map((facilityStandard) => {
                      const colors = COMPLIANCE_COLORS[facilityStandard.compliance_status as keyof typeof COMPLIANCE_COLORS] || COMPLIANCE_COLORS['Not Started'];
                      
                      return (
                        <div key={facilityStandard.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{facilityStandard.facility_name || 'Unknown Facility'}</h4>
                              <p className="text-sm text-muted-foreground">{facilityStandard.facility_address}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {facilityStandard.compliance_score && (
                                <div className="text-center">
                                  <p className="text-lg font-bold">{facilityStandard.compliance_score}%</p>
                                  <p className="text-xs text-muted-foreground">Score</p>
                                </div>
                              )}
                              <Badge className={`${colors.bg} ${colors.text} ${colors.border} border`}>
                                {facilityStandard.compliance_status}
                              </Badge>
                            </div>
                          </div>
                          
                          {(facilityStandard.certification_date || facilityStandard.expiry_date) && (
                            <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                              {facilityStandard.certification_date && (
                                <div>
                                  <p className="text-muted-foreground">Certified</p>
                                  <p>{format(new Date(facilityStandard.certification_date), 'MMM d, yyyy')}</p>
                                </div>
                              )}
                              {facilityStandard.expiry_date && (
                                <div>
                                  <p className="text-muted-foreground">Expires</p>
                                  <p>{format(new Date(facilityStandard.expiry_date), 'MMM d, yyyy')}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </LoadingState>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Standard Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Requirements management coming soon</p>
                <p className="text-sm text-muted-foreground">This will show detailed requirements for the standard</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle>Related Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No audits found for this standard</p>
                <p className="text-sm text-muted-foreground">Audits related to this standard will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No documents linked to this standard</p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Link Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StandardDetailPage;