
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';

interface AutomatedIssue {
  id: string;
  type: string;
  description: string;
  source: string;
  severity: 'high' | 'medium' | 'low';
  detectionDate: string;
}

interface AutomatedCAPAGeneratorProps {
  onCAPACreated: (capaData: any) => void;
}

const AutomatedCAPAGenerator: React.FC<AutomatedCAPAGeneratorProps> = ({ onCAPACreated }) => {
  const [issues] = React.useState<AutomatedIssue[]>([
    {
      id: '1',
      type: 'Temperature Excursion',
      description: 'Storage temperature exceeded critical limit (8°C) for cold storage unit CSU-103 for more than 2 hours',
      source: 'Monitoring System',
      severity: 'high',
      detectionDate: new Date().toISOString()
    },
    {
      id: '2',
      type: 'Missing Documentation',
      description: 'Required supplier certification documents missing for ingredient batch IN-45321',
      source: 'Quality Check',
      severity: 'medium',
      detectionDate: new Date().toISOString()
    }
  ]);
  
  const [selectedIssue, setSelectedIssue] = React.useState<AutomatedIssue | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const { toast } = useToast();

  const handleCreateCAPAFromIssue = (issue: AutomatedIssue) => {
    setSelectedIssue(issue);
    setDialogOpen(true);
  };

  const handleCAPACreated = (data: any) => {
    toast({
      title: 'CAPA Created',
      description: `CAPA created from automated issue: ${data.title}`
    });
    onCAPACreated(data);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Auto-Detected Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No issues have been automatically detected at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-base">{issue.type}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded bg-gray-100">
                          {issue.source}
                        </span>
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded capitalize ${getSeverityColor(issue.severity)}`}>
                          {issue.severity} severity
                        </span>
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded bg-gray-100">
                          {new Date(issue.detectionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleCreateCAPAFromIssue(issue)}
                    >
                      Create CAPA
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedIssue && (
        <CreateCAPADialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCAPACreated={handleCAPACreated}
        />
      )}
    </>
  );
};

export default AutomatedCAPAGenerator;
