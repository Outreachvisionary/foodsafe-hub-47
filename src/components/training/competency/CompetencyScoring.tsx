
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  BookOpen,
  BarChart2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompetencyScoreCardProps {
  employeeName: string;
  employeeId: string;
  courseName: string;
  date: string;
  score: number;
  passThreshold: number;
  competencies: {
    name: string;
    score: number;
    targetScore: number;
  }[];
  remediationRequired: boolean;
}

const CompetencyScoreCard: React.FC<CompetencyScoreCardProps> = ({
  employeeName,
  employeeId,
  courseName,
  date,
  score,
  passThreshold,
  competencies,
  remediationRequired
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const getScoreColor = (score: number, threshold: number) => {
    if (score >= threshold) return 'text-green-600';
    if (score >= threshold * 0.8) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getProgressColor = (score: number, threshold: number) => {
    if (score >= threshold) return 'bg-green-600';
    if (score >= threshold * 0.8) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{employeeName}</CardTitle>
            <CardDescription>{employeeId}</CardDescription>
          </div>
          {remediationRequired ? (
            <Badge variant="destructive" className="flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Remediation Required
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Passed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="flex-1">{courseName}</span>
            <span className="text-xs text-muted-foreground">{formatDate(date)}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span>Overall Score</span>
              <span className={`font-medium ${getScoreColor(score, passThreshold)}`}>
                {score}% (Pass: {passThreshold}%)
              </span>
            </div>
            <Progress value={(score / 100) * 100} className={`h-2 ${getProgressColor(score, passThreshold)}`} />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Competency Assessment Details</DialogTitle>
                <DialogDescription>
                  Assessment for {employeeName} on {formatDate(date)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Course: {courseName}</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Overall Score:</span>
                    <span className={`font-medium ${getScoreColor(score, passThreshold)}`}>
                      {score}% (Pass: {passThreshold}%)
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-medium">Individual Competencies</h4>
                  {competencies.map((comp, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span>{comp.name}</span>
                        <span className={getScoreColor(comp.score, comp.targetScore)}>
                          {comp.score}% (Target: {comp.targetScore}%)
                        </span>
                      </div>
                      <Progress 
                        value={(comp.score / 100) * 100} 
                        className={`h-1.5 ${getProgressColor(comp.score, comp.targetScore)}`} 
                      />
                    </div>
                  ))}
                  
                  {remediationRequired && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        Remediation Plan
                      </h4>
                      <p className="text-sm mt-1">
                        Automatic remediation has been scheduled. The employee will be assigned:
                      </p>
                      <ul className="text-sm list-disc list-inside mt-2">
                        <li>SPC Fundamentals Refresher (Due in 14 days)</li>
                        <li>Control Chart Interpretation Practice (Due in 21 days)</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

const CompetencyScoring: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Automated Competency Scoring</h2>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 text-blue-500 mr-2" />
            Competency Automation System
          </CardTitle>
          <CardDescription>
            Automatic scoring, analysis, and remediation of employee competency assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">Recent Assessments</TabsTrigger>
              <TabsTrigger value="remediation">Requires Remediation</TabsTrigger>
              <TabsTrigger value="spc">SPC Competency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <CompetencyScoreCard 
                    employeeName="John Smith"
                    employeeId="EMP001"
                    courseName="SPC Fundamentals"
                    date="2023-05-15"
                    score={92}
                    passThreshold={80}
                    competencies={[
                      { name: "Control Chart Understanding", score: 95, targetScore: 80 },
                      { name: "Process Capability Analysis", score: 88, targetScore: 75 },
                      { name: "Root Cause Investigation", score: 90, targetScore: 80 }
                    ]}
                    remediationRequired={false}
                  />
                  
                  <CompetencyScoreCard 
                    employeeName="Sarah Johnson"
                    employeeId="EMP002"
                    courseName="HACCP Implementation"
                    date="2023-05-12"
                    score={85}
                    passThreshold={75}
                    competencies={[
                      { name: "Hazard Analysis", score: 82, targetScore: 75 },
                      { name: "Critical Control Points", score: 88, targetScore: 75 },
                      { name: "Verification Procedures", score: 85, targetScore: 70 }
                    ]}
                    remediationRequired={false}
                  />
                  
                  <CompetencyScoreCard 
                    employeeName="Michael Chen"
                    employeeId="EMP003"
                    courseName="Process Variation Analysis"
                    date="2023-05-10"
                    score={65}
                    passThreshold={80}
                    competencies={[
                      { name: "Control Chart Understanding", score: 60, targetScore: 80 },
                      { name: "Process Capability Analysis", score: 70, targetScore: 75 },
                      { name: "Root Cause Investigation", score: 65, targetScore: 80 }
                    ]}
                    remediationRequired={true}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="remediation">
              <div className="space-y-4 mt-4">
                <Card className="bg-red-50 border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      Automated Remediation System
                    </CardTitle>
                    <CardDescription>
                      The system has identified 3 employees requiring remediation training
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <CompetencyScoreCard 
                          employeeName="Michael Chen"
                          employeeId="EMP003"
                          courseName="Process Variation Analysis"
                          date="2023-05-10"
                          score={65}
                          passThreshold={80}
                          competencies={[
                            { name: "Control Chart Understanding", score: 60, targetScore: 80 },
                            { name: "Process Capability Analysis", score: 70, targetScore: 75 },
                            { name: "Root Cause Investigation", score: 65, targetScore: 80 }
                          ]}
                          remediationRequired={true}
                        />
                        
                        <CompetencyScoreCard 
                          employeeName="Lisa Williams"
                          employeeId="EMP005"
                          courseName="Statistical Quality Control"
                          date="2023-05-08"
                          score={68}
                          passThreshold={75}
                          competencies={[
                            { name: "Sampling Methods", score: 72, targetScore: 75 },
                            { name: "Data Interpretation", score: 65, targetScore: 80 },
                            { name: "Corrective Actions", score: 68, targetScore: 75 }
                          ]}
                          remediationRequired={true}
                        />
                        
                        <CompetencyScoreCard 
                          employeeName="Robert Garcia"
                          employeeId="EMP008"
                          courseName="GMP Implementation"
                          date="2023-05-05"
                          score={66}
                          passThreshold={70}
                          competencies={[
                            { name: "Documentation", score: 60, targetScore: 70 },
                            { name: "Sanitation Procedures", score: 74, targetScore: 75 },
                            { name: "Personnel Practices", score: 65, targetScore: 70 }
                          ]}
                          remediationRequired={true}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" className="mr-2">
                          <HelpCircle className="h-4 w-4 mr-1" />
                          Review Settings
                        </Button>
                        <Button>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve All Remediations
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="spc">
              <div className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
                      SPC Competency Overview
                    </CardTitle>
                    <CardDescription>
                      Statistical Process Control competency across departments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Department-wise SPC Competency</h3>
                        
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Production</span>
                              <span className="font-medium">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Quality</span>
                              <span className="font-medium">92%</span>
                            </div>
                            <Progress value={92} className="h-2" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Maintenance</span>
                              <span className="font-medium">65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>R&D</span>
                              <span className="font-medium">89%</span>
                            </div>
                            <Progress value={89} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gray-50">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm">SPC Tool Proficiency</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-blue-600">82%</div>
                              <p className="text-xs text-muted-foreground">Average across organization</p>
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Control Charts</span>
                                <span>85%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Capability Analysis</span>
                                <span>78%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Root Cause Analysis</span>
                                <span>83%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gray-50">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm">Automated Training</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-green-600">18</div>
                              <p className="text-xs text-muted-foreground">Auto-assigned SPC courses</p>
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Basic SPC</span>
                                <span>7 assignees</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Advanced Control Charts</span>
                                <span>5 assignees</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Process Capability</span>
                                <span>6 assignees</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gray-50">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm">Remediation Status</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-amber-600">5</div>
                              <p className="text-xs text-muted-foreground">SPC remediations in progress</p>
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Production</span>
                                <span>3 employees</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Maintenance</span>
                                <span>2 employees</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Average Improvement</span>
                                <span>+18%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencyScoring;
