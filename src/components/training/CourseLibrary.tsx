
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

const CourseLibrary: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Library</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
            Course Library
          </CardTitle>
          <CardDescription>
            Manage your organization's training courses and materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Course Library Component</h3>
            <p className="text-muted-foreground mb-4">This component will allow you to create and manage courses and training materials</p>
            <Button>Start Building Courses</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseLibrary;
