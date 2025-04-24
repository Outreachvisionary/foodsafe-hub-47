
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';

interface RelatedTrainingListProps {
  trainingIds: string[];
}

export const RelatedTrainingList: React.FC<RelatedTrainingListProps> = ({ trainingIds }) => {
  if (!trainingIds || trainingIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Training</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No training records linked</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Training</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {trainingIds.map((trainingId) => (
            <li key={trainingId} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-green-500" />
                <span className="text-sm">Training {trainingId}</span>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RelatedTrainingList;
