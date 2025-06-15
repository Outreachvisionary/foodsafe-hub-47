
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCcw, Search, TrendingUp, AlertTriangle, Clock, CheckCircle2, GraduationCap, Users, Award, BookOpen } from 'lucide-react';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import TrainingMatrix from '@/components/training/TrainingMatrix';
import CourseLibrary from '@/components/training/CourseLibrary';
import TrainingRecords from '@/components/training/TrainingRecords';
import CompetencyAssessments from '@/components/training/CompetencyAssessments';
import ReportsAnalytics from '@/components/training/ReportsAnalytics';

const TrainingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock stats - in real app these would come from service
  const trainingStats = {
    totalSessions: 156,
    activeLearners: 89,
    completionRate: 92,
    upcomingDeadlines: 23
  };

  const getTabCounts = () => {
    return {
      dashboard: 0,
      matrix: 45,
      library: 78,
      records: 234,
      assessments: 34,
      reports: 0
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Training Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Comprehensive training programs and employee development with real-time tracking and analytics
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-all duration-300 border-green-200 hover:border-green-300 hover:bg-green-50"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Training
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Total Sessions</p>
                  <p className="text-3xl font-bold">{trainingStats.totalSessions}</p>
                  <p className="text-green-200 text-xs">Active programs</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Active Learners</p>
                  <p className="text-3xl font-bold">{trainingStats.activeLearners}</p>
                  <p className="text-blue-200 text-xs">Currently enrolled</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Completion Rate</p>
                  <p className="text-3xl font-bold">{trainingStats.completionRate}%</p>
                  <p className="text-purple-200 text-xs">Overall success</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">Upcoming Deadlines</p>
                  <p className="text-3xl font-bold">{trainingStats.upcomingDeadlines}</p>
                  <p className="text-orange-200 text-xs">Due this month</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-6 bg-white/70 backdrop-blur-sm shadow-md border border-gray-200/50">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-200">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="matrix" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200">
                  Matrix ({tabCounts.matrix})
                </TabsTrigger>
                <TabsTrigger value="library" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200">
                  Library ({tabCounts.library})
                </TabsTrigger>
                <TabsTrigger value="records" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200">
                  Records ({tabCounts.records})
                </TabsTrigger>
                <TabsTrigger value="assessments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200">
                  Assessments ({tabCounts.assessments})
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-200">
                  Reports
                </TabsTrigger>
              </TabsList>
              
              {/* Enhanced Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search training sessions, courses, or employees..."
                  className="pl-12 pr-4 py-3 shadow-lg border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <TabsContent value="dashboard" className="mt-0">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200/50">
                  <CardTitle className="text-xl text-green-800 flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Training Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <TrainingDashboard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="matrix" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50">
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Training Matrix ({tabCounts.matrix} assignments)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <TrainingMatrix />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="library" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200/50">
                  <CardTitle className="text-lg text-purple-800 flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    Course Library ({tabCounts.library} courses)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <CourseLibrary />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-200/50">
                  <CardTitle className="text-lg text-indigo-800 flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    Training Records ({tabCounts.records} records)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <TrainingRecords />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessments" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200/50">
                  <CardTitle className="text-lg text-orange-800 flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    Competency Assessments ({tabCounts.assessments} assessments)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <CompetencyAssessments />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200/50">
                  <CardTitle className="text-lg text-teal-800 flex items-center gap-3">
                    <div className="p-2 bg-teal-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Reports & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ReportsAnalytics />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingModule;
