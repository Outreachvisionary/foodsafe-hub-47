import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { NonConformance, NonConformanceStatus } from '@/types/non-conformance';
import { useToast } from '@/hooks/use-toast';
import { useNonConformanceService } from '@/hooks/useNonConformanceService';
import NCStatusBadge from './NCStatusBadge';
import NCWorkflowTimeline from './NCWorkflowTimeline';
import NCActionsPanel from './NCActionsPanel';
import { Badge } from '@/components/ui/badge';
import { LinkedCAPAsList } from './LinkedCAPAsList';

interface NCDetailsProps {
  id: string;
  onEdit: (id: string) => void;
  onGenerateCapa: (id: string) => void;
  onViewCapa?: (capaId: string) => void;
}

const NCDetails: React.FC<NCDetailsProps> = ({ id, onEdit, onGenerateCapa, onViewCapa }) => {
  const [nonConformance, setNonConformance] = React.useState<NonConformance | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const nonConformanceService = useNonConformanceService();

  React.useEffect(() => {
    const loadNonConformance = async () => {
      try {
        setLoading(true);
        setError(null);
        const nc = await nonConformanceService.fetchNonConformanceById(id);
        if (nc) {
          setNonConformance(nc);
        } else {
          setError('Non-Conformance not found');
        }
      } catch (error) {
        console.error('Error loading non-conformance:', error);
        setError('Failed to load non-conformance');
        toast({
          title: 'Error',
          description: 'Failed to load non-conformance',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadNonConformance();
  }, [id, nonConformanceService, toast]);

  if (loading) {
    return <p>Loading non-conformance details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!nonConformance) {
    return <p>Non-Conformance not found.</p>;
  }

  const handleGenerateCapa = () => {
    onGenerateCapa(id);
  };

  const handleViewCapa = () => {
    if (nonConformance.capaId && onViewCapa) {
      onViewCapa(nonConformance.capaId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Non-Conformance Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{nonConformance.title}</h3>
                <p className="text-sm text-gray-500">
                  Created on {format(new Date(nonConformance.created_at), 'PPP')}
                </p>
              </div>
              <div>
                <NCStatusBadge status={nonConformance.status} />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-md font-semibold">Description</h4>
              <p>{nonConformance.description}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-md font-semibold">Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p>{nonConformance.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Severity</p>
                  <p>{nonConformance.severity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Source</p>
                  <p>{nonConformance.source}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p>{nonConformance.location}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-md font-semibold">Linked CAPA</h4>
              {nonConformance.capaId ? (
                <Badge variant="outline">
                  Linked to CAPA: {nonConformance.capaId}
                </Badge>
              ) : (
                <p>No CAPA linked to this non-conformance.</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-md font-semibold">Workflow Timeline</h4>
              <NCWorkflowTimeline nonConformance={nonConformance} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <NCActionsPanel
          id={id}
          title={nonConformance.title}
          description={nonConformance.description}
          category={nonConformance.category}
          severity={nonConformance.severity}
          capaId={nonConformance.capaId}
          onEdit={() => onEdit(id)}
          onGenerateCapa={handleGenerateCapa}
          onViewCapa={handleViewCapa}
        />
      </div>
    </div>
  );
};

export default NCDetails;
