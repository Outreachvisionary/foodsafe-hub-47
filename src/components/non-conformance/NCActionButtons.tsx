
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NonConformance, NCStatus } from '@/types/non-conformance';

interface NCActionButtonsProps {
  nonConformance: NonConformance;
  onUpdate: (updated: NonConformance) => void;
}

export const NCActionButtons: React.FC<NCActionButtonsProps> = ({ nonConformance, onUpdate }) => {
  const handleUpdateStatus = (newStatus: string) => {
    // In a real implementation, this would call an API to update the status
    onUpdate({
      ...nonConformance,
      status: newStatus as any
    });
  };

  const currentStatus = typeof nonConformance.status === 'string' ? nonConformance.status : nonConformance.status.toString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {currentStatus === 'On Hold' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateStatus('Under Investigation')}
              >
                Start Investigation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateStatus('Released')}
              >
                Release Item
              </Button>
            </>
          )}
          
          {currentStatus === 'Under Investigation' && (
            <>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus('Resolved')}
              >
                Mark as Resolved
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus('Rejected')}
              >
                Reject Item
              </Button>
            </>
          )}
          
          {(currentStatus === 'Resolved' || currentStatus === 'Rejected') && (
            <Button 
              variant="outline"
              onClick={() => handleUpdateStatus('Closed')}
            >
              Close Non-Conformance
            </Button>
          )}
          
          {!nonConformance.capa_id && (
            <Button variant="secondary">
              Create CAPA
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NCActionButtons;
