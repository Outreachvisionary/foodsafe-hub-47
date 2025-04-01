
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import NCTrainingIntegration from './NCTrainingIntegration';

interface NCActionsPanelProps {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  severity?: string;
  capaId?: string;
  onEdit: () => void;
  onGenerateCapa: () => void;
  onViewCapa?: () => void;
}

const NCActionsPanel: React.FC<NCActionsPanelProps> = ({
  id,
  title = '',
  description = '',
  category = '',
  severity = '',
  capaId,
  onEdit,
  onGenerateCapa,
  onViewCapa
}) => {
  const handleGenerateCapa = () => {
    console.log('Generate CAPA button clicked for NC ID:', id);
    onGenerateCapa();
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={onEdit}>
            Edit
          </Button>
          
          {capaId && onViewCapa ? (
            <Button className="w-full" variant="outline" onClick={onViewCapa}>
              View CAPA
            </Button>
          ) : (
            <Button className="w-full" variant="outline" onClick={handleGenerateCapa}>
              Generate CAPA
            </Button>
          )}
          
          {/* Add Training Integration Component */}
          <NCTrainingIntegration 
            ncId={id}
            ncTitle={title}
            ncDescription={description}
            category={category}
            severity={severity}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NCActionsPanel;
