
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

interface StandardCardProps {
  title: string;
  status: 'certified' | 'in-progress' | 'expired' | 'pending-audit' | 'planning';
  level: string;
  expiryDate: string;
  progress: number;
}

interface StandardRequirementsProps {
  title: string;
  completed: number;
  total: number;
}

const DocumentItem = ({ title, type, status, lastUpdated }: { 
  title: string; 
  type: string; 
  status: 'approved' | 'draft' | 'in-review' | 'expired'; 
  lastUpdated: string;
}) => {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <div className="flex-1">
        <h4 className="text-base font-medium">{title}</h4>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <span className="bg-muted px-2 py-0.5 rounded-full">{type}</span>
          <span className="mx-2">•</span>
          <span>Updated: {lastUpdated}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge className={
          status === 'approved' ? 'bg-success/20 text-success border-success/30' :
          status === 'draft' ? 'bg-muted/50 text-muted-foreground border-muted' :
          status === 'in-review' ? 'bg-warning/20 text-warning border-warning/30' :
          'bg-destructive/20 text-destructive border-destructive/30'
        }>
          {status}
        </Badge>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const StandardRequirements = ({ title, completed, total }: StandardRequirementsProps) => {
  const percentage = Math.round((completed / total) * 100);
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-muted/20 px-4 py-2 font-medium flex justify-between items-center">
        <span>{title}</span>
        <Badge className={
          percentage >= 90 ? 'bg-success/20 text-success border-success/30' :
          percentage >= 70 ? 'bg-info/20 text-info border-info/30' :
          percentage >= 50 ? 'bg-warning/20 text-warning border-warning/30' :
          'bg-destructive/20 text-destructive border-destructive/30'
        }>
          {percentage}% Complete
        </Badge>
      </div>
      <div className="px-4 py-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{completed} of {total} requirements met</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </div>
  );
};

const StandardCard = ({ title, status, level, expiryDate, progress }: StandardCardProps) => {
  const formattedDate = new Date(expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card className="bg-gradient-to-br from-white to-accent/5 border border-accent/20 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <Badge className={
            status === 'certified' ? 'bg-success/20 text-success border-success/30' :
            status === 'in-progress' ? 'bg-info/20 text-info border-info/30' :
            status === 'expired' ? 'bg-destructive/20 text-destructive border-destructive/30' :
            status === 'pending-audit' ? 'bg-warning/20 text-warning border-warning/30' :
            'bg-muted/50 text-muted-foreground border-muted'
          }>
            {status === 'certified' && <CheckCircle className="mr-1 h-3 w-3" />}
            {status === 'expired' && <AlertTriangle className="mr-1 h-3 w-3" />}
            {status.replace('-', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Level: {level}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Compliance: {progress}%</span>
              <span>
                {status === 'expired' ? 'Expired:' : 'Valid until:'} {
                  expiryDate === 'N/A' ? 'N/A' : formattedDate
                }
              </span>
            </div>
            <Progress value={progress} className="h-2 mt-1" />
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark hover:bg-primary/5">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
                    <Progress value={92} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">FSSC 22000 Requirements</span>
                      <span className="text-sm font-medium text-warning">68%</span>
                    </div>
                    <Progress value={68} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">BRC Requirements</span>
                      <span className="text-sm font-medium text-destructive">48%</span>
                    </div>
                    <Progress value={48} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">HACCP Requirements</span>
                      <span className="text-sm font-medium text-success">100%</span>
                    </div>
                    <Progress value={100} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">ISO 9001 Requirements</span>
                      <span className="text-sm font-medium text-info">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-muted" />
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
                      lastUpdated="2023-06-12"
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
              <CardTitle className="text-xl font-medium">Scheduled Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-center text-muted-foreground">
                <p>Audit schedule content will appear here</p>
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
              <div className="space-y-6 text-center text-muted-foreground">
                <p>Certification timeline content will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StandardsModule;
