
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ClipboardCheck, 
  CalendarClock,
  BarChart3,
  ListChecks,
  MessageSquare,
  Plus,
  Download,
  RefreshCw
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const StandardsModule = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Standards & Certifications
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 border-accent/30 text-accent hover:bg-accent/10">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Status</span>
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white shadow-md hover:shadow-lg transition-all">
            <Plus className="h-4 w-4" />
            <span>Add Standard</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border border-border shadow-md p-1 gap-1 mb-6">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
          >
            <BarChart3 className="h-5 w-5" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="requirements" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
          >
            <ListChecks className="h-5 w-5" />
            <span>Requirements</span>
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
          >
            <FileText className="h-5 w-5" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger 
            value="audits" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
          >
            <ClipboardCheck className="h-5 w-5" />
            <span>Audits</span>
          </TabsTrigger>
          <TabsTrigger 
            value="timeline" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
          >
            <CalendarClock className="h-5 w-5" />
            <span>Timeline</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StandardCard 
              title="SQF Certification" 
              status="certified" 
              level="Level 3" 
              expiryDate="2024-12-15" 
              progress={92} 
            />
            <StandardCard 
              title="FSSC 22000" 
              status="in-progress" 
              level="V5.1" 
              expiryDate="N/A" 
              progress={68} 
            />
            <StandardCard 
              title="BRC Global Standard" 
              status="expired" 
              level="Issue 9" 
              expiryDate="2023-08-30" 
              progress={100} 
            />
            <StandardCard 
              title="HACCP" 
              status="certified" 
              level="Complete" 
              expiryDate="2025-03-10" 
              progress={100} 
            />
            <StandardCard 
              title="ISO 9001:2015" 
              status="pending-audit" 
              level="2015 Edition" 
              expiryDate="N/A" 
              progress={85} 
            />
            <StandardCard 
              title="Global GAP" 
              status="planning" 
              level="V6" 
              expiryDate="N/A" 
              progress={20} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="col-span-2 bg-gradient-to-br from-white to-accent/5 border border-accent/20 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Certification Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-none w-32 text-sm text-muted-foreground">Jan 2024</div>
                    <div className="flex-1 flex items-center">
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                      <div className="h-0.5 flex-1 bg-primary"></div>
                      <div className="ml-2 p-2 bg-primary/10 rounded">
                        <p className="text-sm font-medium">SQF Surveillance Audit</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-none w-32 text-sm text-muted-foreground">Mar 2024</div>
                    <div className="flex-1 flex items-center">
                      <div className="w-4 h-4 rounded-full bg-accent"></div>
                      <div className="h-0.5 flex-1 bg-accent"></div>
                      <div className="ml-2 p-2 bg-accent/10 rounded">
                        <p className="text-sm font-medium">FSSC 22000 Certification Audit</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-none w-32 text-sm text-muted-foreground">Jun 2024</div>
                    <div className="flex-1 flex items-center">
                      <div className="w-4 h-4 rounded-full bg-warning"></div>
                      <div className="h-0.5 flex-1 bg-warning"></div>
                      <div className="ml-2 p-2 bg-warning/10 rounded">
                        <p className="text-sm font-medium">BRC Recertification</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-none w-32 text-sm text-muted-foreground">Oct 2024</div>
                    <div className="flex-1 flex items-center">
                      <div className="w-4 h-4 rounded-full bg-info"></div>
                      <div className="h-0.5 flex-1 bg-info"></div>
                      <div className="ml-2 p-2 bg-info/10 rounded">
                        <p className="text-sm font-medium">ISO 9001 Certification Audit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-primary/5 border border-primary/20 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Compliance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">SQF Requirements</span>
                      <span className="text-sm font-medium text-success">92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-muted" indicatorClassName="bg-success" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">FSSC 22000 Requirements</span>
                      <span className="text-sm font-medium text-warning">68%</span>
                    </div>
                    <Progress value={68} className="h-2 bg-muted" indicatorClassName="bg-warning" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">BRC Requirements</span>
                      <span className="text-sm font-medium text-destructive">48%</span>
                    </div>
                    <Progress value={48} className="h-2 bg-muted" indicatorClassName="bg-destructive" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">HACCP Requirements</span>
                      <span className="text-sm font-medium text-success">100%</span>
                    </div>
                    <Progress value={100} className="h-2 bg-muted" indicatorClassName="bg-success" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">ISO 9001 Requirements</span>
                      <span className="text-sm font-medium text-info">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-muted" indicatorClassName="bg-info" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="requirements">
          <Card className="bg-white border border-accent/10 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Standard Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <StandardRequirements 
                  title="SQF Code Edition 9"
                  completed={92}
                  total={100}
                />
                <StandardRequirements 
                  title="FSSC 22000 Version 5.1"
                  completed={42}
                  total={62}
                />
                <StandardRequirements 
                  title="BRC Global Standard for Food Safety Issue 9"
                  completed={85}
                  total={175}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card className="bg-white border border-accent/10 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-medium">Standard Documentation</CardTitle>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export All</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/20 px-4 py-2 font-medium">
                    SQF Documentation
                  </div>
                  <div className="divide-y divide-border">
                    <DocumentItem 
                      title="SQF Food Safety Manual"
                      type="Manual"
                      status="approved"
                      lastUpdated="2023-12-01"
                    />
                    <DocumentItem 
                      title="Internal Audit Procedure"
                      type="Procedure"
                      status="approved"
                      lastUpdated="2023-11-15"
                    />
                    <DocumentItem 
                      title="Approved Supplier Program"
                      type="Program"
                      status="draft"
                      lastUpdated="2023-12-10"
                    />
                  </div>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/20 px-4 py-2 font-medium">
                    FSSC 22000 Documentation
                  </div>
                  <div className="divide-y divide-border">
                    <DocumentItem 
                      title="Food Safety Policy"
                      type="Policy"
                      status="approved"
                      lastUpdated="2023-10-22"
                    />
                    <DocumentItem 
                      title="HACCP Plan"
                      type="Plan"
                      status="in-review"
                      lastUpdated="2023-12-05"
                    />
                    <DocumentItem 
                      title="PRP Programs"
                      type="Program"
                      status="approved"
                      lastUpdated="2023-09-18"
                    />
                  </div>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/20 px-4 py-2 font-medium">
                    BRC Documentation
                  </div>
                  <div className="divide-y divide-border">
                    <DocumentItem 
                      title="Product Recall Procedure"
                      type="Procedure"
                      status="approved"
                      lastUpdated="2023-08-14"
                    />
                    <DocumentItem 
                      title="Food Fraud Risk Assessment"
                      type="Assessment"
                      status="expired"
                      lastUpdated="2022-07-30"
                    />
                    <DocumentItem 
                      title="Site Security Protocol"
                      type="Protocol"
                      status="approved"
                      lastUpdated="2023-11-02"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audits">
          <Card className="bg-white border border-accent/10 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Audit Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 border border-success/30 rounded-lg p-4 bg-success/5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">Upcoming Audits</h3>
                        <p className="text-4xl font-bold text-success">3</p>
                      </div>
                      <CalendarClock className="h-10 w-10 text-success/70" />
                    </div>
                  </div>
                  <div className="flex-1 border border-warning/30 rounded-lg p-4 bg-warning/5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">Open Findings</h3>
                        <p className="text-4xl font-bold text-warning">7</p>
                      </div>
                      <AlertTriangle className="h-10 w-10 text-warning/70" />
                    </div>
                  </div>
                  <div className="flex-1 border border-accent/30 rounded-lg p-4 bg-accent/5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">Completed Audits</h3>
                        <p className="text-4xl font-bold text-accent">12</p>
                      </div>
                      <CheckCircle className="h-10 w-10 text-accent/70" />
                    </div>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/20 px-4 py-2 font-medium flex justify-between items-center">
                    <span>Recent & Upcoming Audits</span>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                  <div className="divide-y divide-border">
                    <AuditItem
                      title="SQF Annual Recertification"
                      date="2024-01-15"
                      status="scheduled"
                      auditor="John Smith, SQF"
                      findings={0}
                    />
                    <AuditItem
                      title="FSSC 22000 Surveillance"
                      date="2023-11-22"
                      status="completed"
                      auditor="Maria Rodriguez, SGS"
                      findings={3}
                    />
                    <AuditItem
                      title="Internal GMP Audit"
                      date="2023-12-05"
                      status="completed"
                      auditor="Internal Team"
                      findings={5}
                    />
                    <AuditItem
                      title="ISO 9001 Gap Assessment"
                      date="2024-02-28"
                      status="scheduled"
                      auditor="Alex Johnson, BSI"
                      findings={0}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card className="bg-white border border-accent/10 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Certification Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-primary/30 ml-4 pl-8 py-4 space-y-12">
                <TimelineItem 
                  title="SQF Certification Achieved"
                  date="2022-06-15"
                  description="Successfully certified to SQF Code Edition 9, Level 3 with a score of 96/100"
                  status="complete"
                />
                <TimelineItem 
                  title="SQF Surveillance Audit"
                  date="2023-06-10"
                  description="Passed surveillance audit with minor findings. All findings closed within 30 days."
                  status="complete"
                />
                <TimelineItem 
                  title="FSSC 22000 Gap Assessment"
                  date="2023-09-18"
                  description="Gap assessment completed. Action plan developed to address all findings."
                  status="complete"
                />
                <TimelineItem 
                  title="FSSC 22000 Document Review"
                  date="2023-12-01"
                  description="All documentation reviewed by certification body. Document updates in progress."
                  status="in-progress"
                />
                <TimelineItem 
                  title="FSSC 22000 Stage 1 Audit"
                  date="2024-02-15"
                  description="Scheduled on-site Stage 1 audit to verify readiness for Stage 2 certification audit."
                  status="scheduled"
                />
                <TimelineItem 
                  title="FSSC 22000 Stage 2 Audit"
                  date="2024-03-15"
                  description="Full certification audit scheduled."
                  status="scheduled"
                />
                <TimelineItem 
                  title="SQF Recertification Audit"
                  date="2024-06-10"
                  description="Full recertification audit scheduled to maintain SQF certification."
                  status="scheduled"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StandardCardProps {
  title: string;
  status: 'certified' | 'in-progress' | 'expired' | 'pending-audit' | 'planning';
  level: string;
  expiryDate: string;
  progress: number;
}

const StandardCard: React.FC<StandardCardProps> = ({ 
  title, 
  status, 
  level, 
  expiryDate, 
  progress 
}) => {
  const getBadgeContent = () => {
    switch (status) {
      case 'certified':
        return (
          <Badge className="bg-success/20 text-success hover:bg-success/30 px-3 py-1">
            <CheckCircle className="h-3 w-3 mr-1" /> Certified
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-warning/20 text-warning hover:bg-warning/30 px-3 py-1">
            <RefreshCw className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 px-3 py-1">
            <AlertTriangle className="h-3 w-3 mr-1" /> Expired
          </Badge>
        );
      case 'pending-audit':
        return (
          <Badge className="bg-info/20 text-info hover:bg-info/30 px-3 py-1">
            <ClipboardCheck className="h-3 w-3 mr-1" /> Pending Audit
          </Badge>
        );
      case 'planning':
        return (
          <Badge className="bg-accent/20 text-accent hover:bg-accent/30 px-3 py-1">
            <ListChecks className="h-3 w-3 mr-1" /> Planning
          </Badge>
        );
    }
  };
  
  const getProgressColor = () => {
    if (progress >= 90) return 'bg-success';
    if (progress >= 70) return 'bg-info';
    if (progress >= 50) return 'bg-warning';
    return 'bg-destructive';
  };
  
  const getBorderColor = () => {
    switch (status) {
      case 'certified': return 'border-success/20 hover:border-success/40';
      case 'in-progress': return 'border-warning/20 hover:border-warning/40';
      case 'expired': return 'border-destructive/20 hover:border-destructive/40';
      case 'pending-audit': return 'border-info/20 hover:border-info/40';
      case 'planning': return 'border-accent/20 hover:border-accent/40';
    }
  };
  
  const getBackgroundColor = () => {
    switch (status) {
      case 'certified': return 'bg-gradient-to-br from-white to-success/5';
      case 'in-progress': return 'bg-gradient-to-br from-white to-warning/5';
      case 'expired': return 'bg-gradient-to-br from-white to-destructive/5';
      case 'pending-audit': return 'bg-gradient-to-br from-white to-info/5';
      case 'planning': return 'bg-gradient-to-br from-white to-accent/5';
    }
  };
  
  return (
    <Card className={`${getBackgroundColor()} ${getBorderColor()} shadow-md hover:shadow-lg transition-all`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {getBadgeContent()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Level/Version</p>
              <p className="font-medium">{level}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expiry Date</p>
              <p className={`font-medium ${status === 'expired' ? 'text-destructive' : ''}`}>
                {expiryDate === 'N/A' ? 'N/A' : new Date(expiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Implementation Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getProgressColor()}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" className="text-xs">
              <FileText className="h-3 w-3 mr-1" /> Documents
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <ClipboardCheck className="h-3 w-3 mr-1" /> Requirements
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" /> Notes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StandardRequirementsProps {
  title: string;
  completed: number;
  total: number;
}

const StandardRequirements: React.FC<StandardRequirementsProps> = ({ title, completed, total }) => {
  const percent = Math.round((completed / total) * 100);
  
  const getProgressColor = () => {
    if (percent >= 90) return 'bg-success';
    if (percent >= 70) return 'bg-info';
    if (percent >= 50) return 'bg-warning';
    return 'bg-destructive';
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">{title}</h3>
        <Badge variant="outline" className="bg-muted/20">
          {completed}/{total} Complete
        </Badge>
      </div>
      
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${getProgressColor()}`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 text-center text-sm">
        <div className="bg-success/10 p-2 rounded border border-success/20">
          <p className="font-medium text-success">Compliant</p>
          <p className="font-bold text-lg">{Math.floor(completed * 0.9)}</p>
        </div>
        <div className="bg-warning/10 p-2 rounded border border-warning/20">
          <p className="font-medium text-warning">Partial</p>
          <p className="font-bold text-lg">{Math.floor(completed * 0.1)}</p>
        </div>
        <div className="bg-destructive/10 p-2 rounded border border-destructive/20">
          <p className="font-medium text-destructive">Non-Compliant</p>
          <p className="font-bold text-lg">{Math.floor((total - completed) * 0.7)}</p>
        </div>
        <div className="bg-muted/20 p-2 rounded border border-muted">
          <p className="font-medium text-muted-foreground">Not Assessed</p>
          <p className="font-bold text-lg">{Math.floor((total - completed) * 0.3)}</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" className="text-sm">
          <ListChecks className="h-4 w-4 mr-1" /> View Requirements
        </Button>
        <Button variant="outline" size="sm" className="text-sm">
          <FileText className="h-4 w-4 mr-1" /> Generate Report
        </Button>
      </div>
    </div>
  );
};

interface DocumentItemProps {
  title: string;
  type: string;
  status: 'draft' | 'in-review' | 'approved' | 'expired';
  lastUpdated: string;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ title, type, status, lastUpdated }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-success/20 text-success hover:bg-success/30">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-muted/40 text-muted-foreground hover:bg-muted/60">
            Draft
          </Badge>
        );
      case 'in-review':
        return (
          <Badge className="bg-warning/20 text-warning hover:bg-warning/30">
            <ClipboardCheck className="h-3 w-3 mr-1" /> In Review
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">
            <AlertTriangle className="h-3 w-3 mr-1" /> Expired
          </Badge>
        );
    }
  };
  
  return (
    <div className="px-4 py-3 hover:bg-muted/5 transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">{title}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="bg-muted/10 text-xs font-normal">
                {type}
              </Badge>
              <span>•</span>
              <span>Updated {new Date(lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface AuditItemProps {
  title: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  auditor: string;
  findings: number;
}

const AuditItem: React.FC<AuditItemProps> = ({ title, date, status, auditor, findings }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge className="bg-info/20 text-info hover:bg-info/30">
            <CalendarClock className="h-3 w-3 mr-1" /> Scheduled
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-warning/20 text-warning hover:bg-warning/30">
            <RefreshCw className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-success/20 text-success hover:bg-success/30">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">
            <AlertTriangle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
    }
  };
  
  return (
    <div className="px-4 py-3 hover:bg-muted/5 transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">{title}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{new Date(date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{auditor}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {status === 'completed' && (
            <Badge className={`${findings > 0 ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
              {findings} {findings === 1 ? 'Finding' : 'Findings'}
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface TimelineItemProps {
  title: string;
  date: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'complete' | 'cancelled';
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, date, description, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'complete': return 'bg-success text-white';
      case 'in-progress': return 'bg-warning text-white';
      case 'scheduled': return 'bg-info text-white';
      case 'cancelled': return 'bg-destructive text-white';
    }
  };
  
  const getIcon = () => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <RefreshCw className="h-4 w-4" />;
      case 'scheduled': return <CalendarClock className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="relative">
      <div className={`absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full shadow-md ${getStatusColor()}`}>
        {getIcon()}
      </div>
      <div className={`absolute -left-4 top-4 w-2 h-2 rounded-full ${status === 'complete' ? 'bg-success' : 'bg-muted'}`}></div>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <time className="text-sm font-medium text-muted-foreground">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        <p className="mt-2 text-foreground/80">{description}</p>
      </div>
    </div>
  );
};

export default StandardsModule;
