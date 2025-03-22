
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DocumentStatus {
  label: string;
  count: number;
  percentage: number;
}

interface DocumentStatusCardProps {
  documents: DocumentStatus[];
}

const DocumentStatusCard: React.FC<DocumentStatusCardProps> = ({ documents }) => {
  return (
    <Card className="animate-fade-in delay-400">
      <CardHeader>
        <CardTitle>Document Status</CardTitle>
        <CardDescription>Policy & procedure updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{doc.label}</span>
                <span className="text-sm text-gray-500">{doc.count}</span>
              </div>
              <Progress value={doc.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentStatusCard;
