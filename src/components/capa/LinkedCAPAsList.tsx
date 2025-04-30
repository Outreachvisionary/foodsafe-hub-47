
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Unlink } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { formatEnumValue, convertToCAPAStatus } from '@/utils/typeAdapters';
import CAPAStatusBadge from './CAPAStatusBadge';

interface LinkedCAPAsListProps {
  capas?: CAPA[];
  allowAdd?: boolean;
  allowRemove?: boolean;
  onAddClick?: () => void;
  onRemoveClick?: (capaId: string) => void;
  onCAPAClick?: (capa: CAPA) => void;
}

const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({
  capas = [],
  allowAdd = false,
  allowRemove = false,
  onAddClick,
  onRemoveClick,
  onCAPAClick,
}) => {
  // If there are no CAPAs and we're not allowing addition, don't render anything
  if (capas.length === 0 && !allowAdd) {
    return null;
  }

  // Show a message if there are no linked CAPAs
  if (capas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Linked CAPAs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="mb-4 text-muted-foreground">No CAPAs are linked to this item</p>
            {allowAdd && (
              <Button onClick={onAddClick} className="flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                Link CAPA
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sample CAPAs for demo purposes
  const mockCAPAs: CAPA[] = [
    {
      id: "capa-1",
      title: "Corrective Action for Product X Contamination",
      description: "Implement measures to prevent contamination of Product X",
      status: CAPAStatus.Open,
      priority: CAPAPriority.Medium,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: "Jane Smith",
      created_by: "John Doe",
      source: CAPASource.Audit,
      fsma204_compliant: false,
    },
    {
      id: "capa-2",
      title: "Preventive Action for Equipment Maintenance",
      description: "Implement regular maintenance schedule for packaging equipment",
      status: CAPAStatus.InProgress,
      priority: CAPAPriority.High,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: "Mike Johnson",
      created_by: "John Doe",
      source: CAPASource.SupplierIssue,
      fsma204_compliant: true,
    }
  ];

  // Use the provided CAPAs if available, otherwise use the mock data
  const displayCAPAs = capas.length > 0 ? capas : mockCAPAs;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Linked CAPAs</CardTitle>
        {allowAdd && (
          <Button onClick={onAddClick} size="sm" variant="outline" className="flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            Link CAPA
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {displayCAPAs.map((capa) => (
            <li key={capa.id} className="py-3">
              <div className="flex justify-between items-start">
                <div
                  className={onCAPAClick ? "cursor-pointer flex-grow" : "flex-grow"}
                  onClick={() => onCAPAClick && onCAPAClick(capa)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium">{capa.title}</h4>
                    <CAPAStatusBadge status={capa.status} className="ml-2" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {capa.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>Priority: {formatEnumValue(capa.priority.toString())}</span>
                    <span>•</span>
                    <span>Source: {formatEnumValue(capa.source.toString())}</span>
                    <span>•</span>
                    <span>Due: {new Date(capa.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
                {allowRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-destructive"
                    onClick={() => onRemoveClick && onRemoveClick(capa.id)}
                  >
                    <Unlink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
