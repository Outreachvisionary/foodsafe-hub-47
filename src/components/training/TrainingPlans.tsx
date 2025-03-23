
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

const TrainingPlans: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Plans</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            Training Plans
          </CardTitle>
          <CardDescription>
            Create and manage training plans tailored to departments, roles, or individuals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Training Plans Component</h3>
            <p className="text-muted-foreground mb-4">This component will allow you to create and manage training plans</p>
            <Button>Start Building Plans</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingPlans;
