import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Award,
  Calendar,
  TrendingUp 
} from 'lucide-react';

interface ComplianceRequirement {
  id: string;
  standard: 'SQF' | 'BRC' | 'FSSC22000' | 'GFSI' | 'FDA' | 'USDA' | 'HACCP';
  clause: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'not-applicable';
  evidence: string[];
  lastReview: string;
  nextReview: string;
  responsiblePerson: string;
}

interface CAPAComplianceTrackerProps {
  capaId: string;
  currentCompliance?: ComplianceRequirement[];
  onUpdate: (compliance: ComplianceRequirement[]) => void;
}

const CAPAComplianceTracker: React.FC<CAPAComplianceTrackerProps> = ({
  capaId,
  currentCompliance = [],
  onUpdate
}) => {
  const [compliance, setCompliance] = useState<ComplianceRequirement[]>(
    currentCompliance.length > 0 ? currentCompliance : [
      {
        id: '1',
        standard: 'SQF',
        clause: '2.5.3',
        requirement: 'Corrective and preventive action system documented and implemented',
        status: 'pending',
        evidence: [],
        lastReview: '',
        nextReview: '',
        responsiblePerson: ''
      },
      {
        id: '2',
        standard: 'BRC',
        clause: '1.1.3',
        requirement: 'Non-conformities identified and corrected',
        status: 'pending',
        evidence: [],
        lastReview: '',
        nextReview: '',
        responsiblePerson: ''
      },
      {
        id: '3',
        standard: 'FSSC22000',
        clause: '10.2',
        requirement: 'Nonconformity and corrective action procedures',
        status: 'pending',
        evidence: [],
        lastReview: '',
        nextReview: '',
        responsiblePerson: ''
      },
      {
        id: '4',
        standard: 'HACCP',
        clause: 'Principle 5',
        requirement: 'Corrective actions when monitoring indicates deviation',
        status: 'pending',
        evidence: [],
        lastReview: '',
        nextReview: '',
        responsiblePerson: ''
      }
    ]
  );

  const [selectedStandard, setSelectedStandard] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'not-applicable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'non-compliant': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStandardIcon = (standard: string) => {
    switch (standard) {
      case 'SQF': return <Award className="h-4 w-4 text-blue-600" />;
      case 'BRC': return <Shield className="h-4 w-4 text-green-600" />;
      case 'FSSC22000': return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case 'HACCP': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const updateComplianceStatus = (id: string, newStatus: ComplianceRequirement['status']) => {
    const updated = compliance.map(item =>
      item.id === id ? { ...item, status: newStatus, lastReview: new Date().toISOString().split('T')[0] } : item
    );
    setCompliance(updated);
    onUpdate(updated);
  };

  const filteredCompliance = selectedStandard === 'all' 
    ? compliance 
    : compliance.filter(item => item.standard === selectedStandard);

  const getComplianceStats = () => {
    const total = compliance.length;
    const compliant = compliance.filter(item => item.status === 'compliant').length;
    const nonCompliant = compliance.filter(item => item.status === 'non-compliant').length;
    const pending = compliance.filter(item => item.status === 'pending').length;
    
    return {
      total,
      compliant,
      nonCompliant,
      pending,
      complianceRate: total > 0 ? (compliant / total) * 100 : 0
    };
  };

  const stats = getComplianceStats();
  const standards = ['SQF', 'BRC', 'FSSC22000', 'GFSI', 'HACCP'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Compliance Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Compliant</p>
                  <p className="text-lg font-semibold">{stats.compliant}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Non-Compliant</p>
                  <p className="text-lg font-semibold">{stats.nonCompliant}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-lg font-semibold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-lg font-semibold">{stats.complianceRate.toFixed(1)}%</p>
                <Progress value={stats.complianceRate} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requirements" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="standards">By Standard</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="space-y-4">
            <div className="space-y-4">
              {filteredCompliance.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStandardIcon(item.standard)}
                          <Badge variant="outline">{item.standard}</Badge>
                          <Badge variant="outline">{item.clause}</Badge>
                        </div>
                        <h4 className="font-medium mb-2">{item.requirement}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {item.lastReview && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Last reviewed: {new Date(item.lastReview).toLocaleDateString()}</span>
                            </div>
                          )}
                          {item.responsiblePerson && (
                            <span>Responsible: {item.responsiblePerson}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant={item.status === 'compliant' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateComplianceStatus(item.id, 'compliant')}
                      >
                        Mark Compliant
                      </Button>
                      <Button
                        variant={item.status === 'non-compliant' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => updateComplianceStatus(item.id, 'non-compliant')}
                      >
                        Mark Non-Compliant
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateComplianceStatus(item.id, 'not-applicable')}
                      >
                        Not Applicable
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="standards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {standards.map((standard) => {
                const standardItems = compliance.filter(item => item.standard === standard);
                const standardCompliant = standardItems.filter(item => item.status === 'compliant').length;
                const standardRate = standardItems.length > 0 ? (standardCompliant / standardItems.length) * 100 : 0;

                return (
                  <Card key={standard}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        {getStandardIcon(standard)}
                        <CardTitle className="text-lg">{standard}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Compliance Rate</span>
                            <span>{standardRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={standardRate} className="h-2" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{standardCompliant} of {standardItems.length} requirements compliant</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedStandard(standard)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Compliance Review Timeline</h4>
              <div className="space-y-3">
                {compliance
                  .filter(item => item.lastReview || item.nextReview)
                  .sort((a, b) => new Date(a.nextReview || a.lastReview).getTime() - new Date(b.nextReview || b.lastReview).getTime())
                  .map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {getStandardIcon(item.standard)}
                        <Badge variant="outline">{item.standard}</Badge>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.clause}</p>
                        <p className="text-sm text-muted-foreground">{item.requirement}</p>
                      </div>
                      <div className="text-right">
                        {item.nextReview && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Next review: </span>
                            {new Date(item.nextReview).toLocaleDateString()}
                          </p>
                        )}
                        {item.lastReview && (
                          <p className="text-xs text-muted-foreground">
                            Last: {new Date(item.lastReview).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {getStatusIcon(item.status)}
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CAPAComplianceTracker;