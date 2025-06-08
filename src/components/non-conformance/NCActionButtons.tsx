
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NonConformance } from '@/types/non-conformance';
import { NCStatus } from '@/types/enums';
import { isStatusEqual } from '@/utils/typeAdapters';

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

  // Use the isStatusEqual helper to safely compare status values
  const isCurrentStatus = (compareStatus: NCStatus): boolean => {
    return isStatusEqual(nonConformance.status, compareStatus);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {isCurrentStatus(NCStatus.On_Hold) && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateStatus(NCStatus.Under_Review)}
              >
                Start Investigation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateStatus(NCStatus.Released)}
              >
                Release Item
              </Button>
            </>
          )}
          
          {isCurrentStatus(NCStatus.Under_Review) && (
            <>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus(NCStatus.Resolved)}
              >
                Mark as Resolved
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus(NCStatus.Disposed)}
              >
                Dispose Item
              </Button>
            </>
          )}
          
          {(isCurrentStatus(NCStatus.Resolved) || isCurrentStatus(NCStatus.Disposed)) && (
            <Button 
              variant="outline"
              onClick={() => handleUpdateStatus(NCStatus.Closed)}
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
