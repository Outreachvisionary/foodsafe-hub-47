import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter,
  Download,
  Award,
  Shield
} from 'lucide-react';
import enhancedTrainingService, { TrainingCompliance, TrainingCompetency } from '@/services/enhancedTrainingService';
import { useToast } from '@/hooks/use-toast';

const TrainingComplianceTracker: React.FC = () => {
  const [compliance, setCompliance] = useState<TrainingCompliance[]>([]);
  const [competencies, setCompetencies] = useState<TrainingCompetency[]>([]);
  const [gfsiCompliance, setGfsiCompliance] = useState({ compliant: 0, total: 0, percentage: 0 });
  const [expiringCertifications, setExpiringCertifications] = useState<TrainingCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      const [
        complianceData,
        competenciesData,
        gfsiData,
        expiringData
      ] = await Promise.all([
        enhancedTrainingService.getTrainingCompliance(),
        enhancedTrainingService.getTrainingCompetencies(),
        enhancedTrainingService.getGFSICompliance(),
        enhancedTrainingService.getExpiringCertifications(30)
      ]);

      setCompliance(complianceData);
      setCompetencies(competenciesData);
      setGfsiCompliance(gfsiData);
      setExpiringCertifications(expiringData);
    } catch (error) {
      console.error('Error loading compliance data:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const filteredCompliance = compliance.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const generateComplianceReport = () => {
    // This would generate a downloadable compliance report
    toast({
      title: "Report Generated",
      description: "Training compliance report has been generated"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GFSI Compliance</p>
                <p className="text-2xl font-bold">{gfsiCompliance.percentage}%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={gfsiCompliance.percentage} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliant</p>
                <p className="text-2xl font-bold text-green-600">
                  {compliance.filter(c => c.status === 'compliant').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {compliance.filter(c => c.status === 'overdue').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiring (30d)</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {expiringCertifications.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compliance" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
            <TabsTrigger value="competencies">GFSI Competencies</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Certifications</TabsTrigger>
          </TabsList>
          
          <Button onClick={generateComplianceReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Training Compliance Status</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="compliant">Compliant</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCompliance.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">Employee: {item.employee_id}</h4>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1 capitalize">{item.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Competency:</span> {item.competency_id}
                          </div>
                          {item.last_training_date && (
                            <div>
                              <span className="font-medium">Last Training:</span>{' '}
                              {new Date(item.last_training_date).toLocaleDateString()}
                            </div>
                          )}
                          {item.next_required_date && (
                            <div>
                              <span className="font-medium">Next Due:</span>{' '}
                              {new Date(item.next_required_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        {item.compliance_score && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Compliance Score</span>
                              <span>{item.compliance_score}%</span>
                            </div>
                            <Progress value={item.compliance_score} className="mt-1" />
                          </div>
                        )}
                        
                        {item.notes && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Notes:</span> {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredCompliance.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No compliance records found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competencies">
          <Card>
            <CardHeader>
              <CardTitle>GFSI Required Competencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competencies.map((competency) => (
                  <div key={competency.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{competency.name}</h4>
                          {competency.is_mandatory && (
                            <Badge variant="secondary">
                              <Award className="h-3 w-3 mr-1" />
                              Mandatory
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {competency.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Category:</span> {competency.category}
                          </div>
                          <div>
                            <span className="font-medium">Validity:</span> {competency.validity_period_months} months
                          </div>
                          <div>
                            <span className="font-medium">Required for:</span>{' '}
                            {competency.required_for_roles.join(', ')}
                          </div>
                          {competency.gfsi_requirement && (
                            <div>
                              <span className="font-medium">GFSI Ref:</span> {competency.gfsi_requirement}
                            </div>
                          )}
                        </div>
                        
                        {competency.assessment_criteria.length > 0 && (
                          <div className="mt-3">
                            <span className="font-medium text-sm">Assessment Criteria:</span>
                            <ul className="mt-1 space-y-1">
                              {competency.assessment_criteria.map((criteria, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  • {criteria}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle>Expiring Certifications (Next 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringCertifications.map((item) => (
                  <div key={item.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <h4 className="font-medium">Employee: {item.employee_id}</h4>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Expiring Soon
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Competency:</span> {item.competency_id}
                          </div>
                          <div>
                            <span className="font-medium">Expires:</span>{' '}
                            {item.next_required_date && new Date(item.next_required_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        Schedule Renewal
                      </Button>
                    </div>
                  </div>
                ))}
                
                {expiringCertifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    No certifications expiring in the next 30 days.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingComplianceTracker;