
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  Award,
  PieChart,
  TrendingUp,
  FileText,
  BarChart2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define types for our data
interface DepartmentCompliance {
  name: string;
  compliance: number;
}

interface TrainingStatus {
  name: string;
  value: number;
  color: string;
}

interface SPCCompetency {
  name: string;
  beginner: number;
  intermediate: number;
  advanced: number;
}

interface QualityMetric {
  name: string;
  value: number;
}

interface TrainingImpact {
  name: string;
  improvement: number;
}

interface SkillGap {
  area: string;
  gap: number;
}

interface RecommendedCourse {
  title: string;
  id: string;
}

const ReportsAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('90days');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  // State for data
  const [complianceByDepartment, setComplianceByDepartment] = useState<DepartmentCompliance[]>([]);
  const [trainingStatusData, setTrainingStatusData] = useState<TrainingStatus[]>([]);
  const [spcCompetencyData, setSpcCompetencyData] = useState<SPCCompetency[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [trainingImpacts, setTrainingImpacts] = useState<TrainingImpact[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define status colors for consistency
  const statusColors = {
    'Completed': '#10b981',
    'In Progress': '#3b82f6',
    'Not Started': '#9ca3af',
    'Overdue': '#ef4444'
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch department compliance data
        const { data: complianceData, error: complianceError } = await supabase
          .from('department_compliance')
          .select('name, compliance')
          .order('compliance', { ascending: false });
          
        if (complianceError) throw complianceError;
        
        // Fetch training status distribution
        const { data: statusData, error: statusError } = await supabase
          .from('training_status_distribution')
          .select('name, value');
          
        if (statusError) throw statusError;
        
        // Transform status data to include colors
        const transformedStatusData = statusData?.map(item => ({
          ...item,
          color: statusColors[item.name] || '#9ca3af'
        })) || [];
        
        // Fetch SPC competency data
        const { data: competencyData, error: competencyError } = await supabase
          .from('spc_competency')
          .select('name, beginner, intermediate, advanced');
          
        if (competencyError) throw competencyError;
        
        // Fetch quality metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('quality_metrics')
          .select('name, value');
          
        if (metricsError) throw metricsError;
        
        // Fetch training impacts
        const { data: impactsData, error: impactsError } = await supabase
          .from('training_impacts')
          .select('name, improvement');
          
        if (impactsError) throw impactsError;
        
        // Fetch skill gaps
        const { data: gapsData, error: gapsError } = await supabase
          .from('skill_gaps')
          .select('area, gap');
          
        if (gapsError) throw gapsError;
        
        // Fetch recommended courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('recommended_courses')
          .select('title, id');
          
        if (coursesError) throw coursesError;
        
        // Update state with fetched data
        setComplianceByDepartment(complianceData || []);
        setTrainingStatusData(transformedStatusData);
        setSpcCompetencyData(competencyData || []);
        setQualityMetrics(metricsData || []);
        setTrainingImpacts(impactsData || []);
        setSkillGaps(gapsData || []);
        setRecommendedCourses(coursesData || []);
        
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load analytics data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [dateRange]); // Refetch when date range changes

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="text-red-500 h-10 w-10 mb-2" />
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="spc">SPC Competency</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance by Department</CardTitle>
                <CardDescription>
                  Training completion rates across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complianceByDepartment.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={complianceByDepartment}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="compliance" name="Compliance %" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No compliance data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Status Distribution</CardTitle>
                <CardDescription>
                  Current status of assigned training across organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trainingStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={trainingStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trainingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No training status data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Training compliance reports for audit preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 flex flex-col items-center justify-center">
                <p className="text-xl font-semibold mb-4">Compliance Reporting</p>
                <p className="mb-6 text-muted-foreground">
                  This section will display detailed compliance reports
                </p>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Compliance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spc" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SPC Training Competency Analysis</CardTitle>
                <CardDescription>
                  Statistical Process Control knowledge and skill levels across the organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {spcCompetencyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={spcCompetencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="beginner" name="Beginner" fill="#ef4444" />
                      <Bar dataKey="intermediate" name="Intermediate" fill="#f59e0b" />
                      <Bar dataKey="advanced" name="Advanced" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[350px]">
                    <p className="text-muted-foreground">No SPC competency data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SPC Course Effectiveness</CardTitle>
                <CardDescription>
                  Impact of SPC training on quality metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      {qualityMetrics.map((metric, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{metric.name}</span>
                            <span className="text-primary">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Correlation with Quality KPIs</h4>
                    <div className="space-y-4">
                      {trainingImpacts.map((impact, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <TrendingUp className="text-green-500 h-5 w-5" />
                          <span>{impact.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {impact.improvement}% Improvement
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SPC Training Recommendations</CardTitle>
                <CardDescription>
                  AI-generated recommendations for improving SPC competency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Focus Areas for Improvement</h4>
                    <div className="space-y-2">
                      {skillGaps.map((gap, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertCircle className="text-amber-500 h-5 w-5" />
                          <span>{gap.area} ({gap.gap}% skill gap)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Recommended Courses</h4>
                    <div className="space-y-2">
                      {recommendedCourses.map((course, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Award className="text-blue-500 h-5 w-5" />
                          <span>{course.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Implementation Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-indigo-500 h-5 w-5" />
                        <span>Short-term (30 days)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-indigo-500 h-5 w-5" />
                        <span>Medium-term (90 days)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-indigo-500 h-5 w-5" />
                        <span>Long-term (180 days)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>
                  Training compliance by department and requirement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 flex flex-col items-center justify-center">
                  <p className="text-xl font-semibold mb-4">Compliance Dashboard</p>
                  <p className="mb-6 text-muted-foreground">
                    This section will display compliance metrics and trends
                  </p>
                  <Button>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Detailed Compliance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certification Overview</CardTitle>
                <CardDescription>
                  Employee certification status and expiration tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 flex flex-col items-center justify-center">
                  <p className="text-xl font-semibold mb-4">Certification Management</p>
                  <p className="mb-6 text-muted-foreground">
                    This section will display certification tracking and management tools
                  </p>
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    View Employee Certifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;
