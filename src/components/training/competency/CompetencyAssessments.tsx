
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCheck, Plus, BarChart2, FileText, Award, BookOpen } from 'lucide-react';
import CompetencyScoring from './CompetencyScoring';
import SPCSimulation from '../spc/SPCSimulation';

const CompetencyAssessments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assessments');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Competency Assessments</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </Button>
      </div>
      
      <Tabs defaultValue="assessments" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assessments">
            <ClipboardCheck className="h-4 w-4 mr-1" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="spc-training">
            <BarChart2 className="h-4 w-4 mr-1" />
            SPC Training
          </TabsTrigger>
          <TabsTrigger value="scoring">
            <Award className="h-4 w-4 mr-1" />
            Automated Scoring
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-1" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="h-4 w-4 mr-1" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardCheck className="h-5 w-5 text-blue-500 mr-2" />
                Competency Assessments
              </CardTitle>
              <CardDescription>
                Evaluate and track employee competency and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Competency Assessments Component</h3>
                <p className="text-muted-foreground mb-4">This component will allow you to create and manage competency assessments</p>
                <Button>Start Building Assessments</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spc-training" className="mt-6">
          <SPCSimulation />
        </TabsContent>
        
        <TabsContent value="scoring" className="mt-6">
          <CompetencyScoring />
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                Assessment Templates
              </CardTitle>
              <CardDescription>
                Create reusable assessment templates for different positions and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Assessment Templates</h3>
                <p className="text-muted-foreground mb-4">This component will allow you to create and manage assessment templates</p>
                <Button>Create Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
                Competency Analytics
              </CardTitle>
              <CardDescription>
                View trends and insights on employee skills and training effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Competency Analytics</h3>
                <p className="text-muted-foreground mb-4">This component will display analytics about competency assessments</p>
                <Button>View Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetencyAssessments;
