import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { NonConformance } from '@/types/non-conformance';
import { Badge } from '@/components/ui/badge';
import { useNonConformanceService } from '@/hooks/useNonConformanceService';
import { Separator } from '@/components/ui/separator';
import { NCWorkflowTimeline } from './NCWorkflowTimeline';
import { NCActionButtons } from './NCActionButtons';
import { LinkedCAPAsList } from './LinkedCAPAsList';

export interface NCDetailsProps {
  id: string;
  onClose?: () => void;
}

export const NCDetails: React.FC<NCDetailsProps> = ({ id, onClose }) => {
  const { fetchNonConformanceById, loading } = useNonConformanceService();
  const [nonConformance, setNonConformance] = useState<NonConformance | null>(null);

  React.useEffect(() => {
    const loadNC = async () => {
      const data = await fetchNonConformanceById(id);
      setNonConformance(data);
    };
    
    loadNC();
  }, [id, fetchNonConformanceById]);

  if (loading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <CardContent>Loading non-conformance details...</CardContent>
      </Card>
    );
  }

  if (!nonConformance) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Non-conformance not found</h3>
            <p className="text-muted-foreground mt-2">
              The requested non-conformance could not be found or may have been removed.
            </p>
            {onClose && (
              <Button className="mt-4" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasLinkedCAPA = !!nonConformance.capa_id;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{nonConformance.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Reported on {format(new Date(nonConformance.reported_date), 'PPP')}
              </p>
            </div>
            <Badge variant={nonConformance.status === 'On Hold' ? 'destructive' : 'outline'}>
              {nonConformance.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{nonConformance.description}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Item</h3>
                <p className="mt-1">{nonConformance.item_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Item Category</h3>
                <p className="mt-1">{nonConformance.item_category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Reason Category</h3>
                <p className="mt-1">{nonConformance.reason_category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Risk Level</h3>
                <p className="mt-1">{nonConformance.risk_level}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Linked CAPA</h3>
              {hasLinkedCAPA ? (
                <div className="mt-2">
                  <LinkedCAPAsList capaIds={[nonConformance.capa_id]} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No CAPA linked to this non-conformance</p>
              )}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                <p className="mt-1">{nonConformance.created_by}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                <p className="mt-1">{nonConformance.assigned_to || 'Unassigned'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                <p className="mt-1">{nonConformance.department}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p className="mt-1">{nonConformance.location}</p>
              </div>
            </div>
            
            {onClose && (
              <div className="flex justify-end">
                <Button onClick={onClose}>Close</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <NCWorkflowTimeline nonConformanceId={nonConformance.id} />
      
      <NCActionButtons
        nonConformance={nonConformance}
        onUpdate={(updated) => setNonConformance(updated)}
      />
    </div>
  );
};

export default NCDetails;
