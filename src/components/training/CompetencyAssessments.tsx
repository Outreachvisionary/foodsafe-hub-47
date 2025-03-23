
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Plus } from 'lucide-react';

const CompetencyAssessments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Competency Assessments</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </Button>
      </div>
      
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
    </div>
  );
};

export default CompetencyAssessments;
