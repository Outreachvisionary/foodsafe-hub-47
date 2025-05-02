
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, Link as LinkIcon } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { stringToCAPAStatus } from '@/utils/capaAdapters';
import { CAPAStatusBadge } from './CAPAStatusBadge';

interface LinkedCAPAsListProps {
  capas: CAPA[];
  onLinkCAPA?: () => void;
}

const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({ capas = [], onLinkCAPA }) => {
  // Function to format date for display
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Linked CAPAs</CardTitle>
        {onLinkCAPA && (
          <Button size="sm" variant="outline" onClick={onLinkCAPA}>
            <Plus className="h-4 w-4 mr-1" />
            Link CAPA
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {capas.length > 0 ? (
          <div className="space-y-3">
            {capas.map((capa) => (
              <div key={capa.id} className="flex items-start p-3 border rounded-md">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="font-medium">{capa.title}</div>
                    <CAPAStatusBadge status={stringToCAPAStatus(capa.status.toString())} />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {capa.description && capa.description.length > 120
                      ? capa.description.substring(0, 120) + '...'
                      : capa.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <span className="mr-1 font-medium">Due:</span>
                      <span>{formatDate(capa.due_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1 font-medium">Assigned to:</span>
                      <span>{capa.assigned_to || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No CAPAs linked</p>
            {onLinkCAPA && (
              <Button variant="outline" size="sm" className="mt-4" onClick={onLinkCAPA}>
                <LinkIcon className="h-4 w-4 mr-1" />
                Link CAPA
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
