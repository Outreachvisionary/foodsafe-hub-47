
import React, { useState, useEffect } from 'react';
import { useTraceability } from '@/hooks/useTraceability';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { Recall } from '@/types/traceability';

interface CAPATraceabilityIntegrationProps {
  capaId: string;
}

const CAPATraceabilityIntegration: React.FC<CAPATraceabilityIntegrationProps> = ({ capaId }) => {
  const { recalls, loadRecalls, addRecall, loading } = useTraceability();
  const [linkedRecalls, setLinkedRecalls] = useState<Recall[]>([]);

  useEffect(() => {
    loadRecalls();
  }, [loadRecalls]);

  useEffect(() => {
    if (recalls.length > 0) {
      // Filter recalls that are linked to this CAPA
      // In a real implementation, you would have a proper relationship table
      // For now, we'll check if the recall has this CAPA ID in its description
      const linked = recalls.filter(
        recall => recall.description?.includes(capaId)
      );
      setLinkedRecalls(linked);
    }
  }, [recalls, capaId]);

  const handleCreateRecall = async () => {
    // Create a mock recall linked to this CAPA
    const newRecall = {
      title: `Recall for CAPA ${capaId.substring(0, 8)}`,
      description: `This recall was initiated from CAPA ${capaId}`,
      recall_type: 'Mock' as const,
      status: 'Scheduled' as const,
      initiated_by: 'System',
      recall_reason: 'CAPA-initiated recall for verification',
      created_by: 'System'
    };

    await addRecall(newRecall);
    loadRecalls();
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Traceability Integration</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {linkedRecalls.length > 0 ? (
              <div>
                <h4 className="font-medium mb-2">Linked Recalls:</h4>
                <ul className="space-y-2">
                  {linkedRecalls.map(recall => (
                    <li key={recall.id} className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {recall.title} ({recall.status})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recalls linked to this CAPA.</p>
            )}
            <Button
              size="sm"
              onClick={handleCreateRecall}
              disabled={loading}
            >
              Initiate Related Recall
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPATraceabilityIntegration;
