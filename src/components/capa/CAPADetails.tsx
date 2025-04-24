
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Clock, FileText, AlertTriangle, UserCheck, Calendar } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getCAPAById } from '@/services/capaService';
import { mapDbStatusToInternal } from '@/services/capa/capaStatusMapper';
import { RelatedDocumentsList } from './RelatedDocumentsList';
import { RelatedTrainingList } from './RelatedTrainingList';
import { CAPAStatusBadge } from './CAPAStatusBadge';
import { CAPATimeline } from './CAPATimeline';
import { CAPAEffectivenessForm } from './CAPAEffectivenessForm';

interface CAPADetailsProps {
  capa: CAPA;
  onClose: () => void;
  onUpdate: (updatedCAPA: CAPA) => void;
}

const CAPADetails: React.FC<CAPADetailsProps> = ({ capa, onClose, onUpdate }) => {
  const { toast } = useToast();

  const handleEdit = () => {
    // Implementation
  };

  const handleDelete = async () => {
    // Implementation
    console.log('Delete CAPA:', capa.id);
    toast({
      title: "CAPA Deleted",
      description: "The CAPA has been successfully deleted.",
    });
  };

  if (!capa) {
    return <p>CAPA not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CAPA Details</h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleEdit}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{capa.title}</h3>
            <CAPAStatusBadge status={capa.status} />
          </div>

          <p className="text-sm text-gray-500">{capa.description}</p>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">Priority</div>
              <div className="text-sm">{capa.priority}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Source</div>
              <div className="text-sm">{capa.source}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Assigned To</div>
              <div className="text-sm">{capa.assignedTo}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Created By</div>
              <div className="text-sm">{capa.createdBy}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Due Date</div>
              <div className="text-sm">
                <Clock className="h-3 w-3 mr-1 inline-block" />
                {format(new Date(capa.dueDate), 'MMM d, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Created At</div>
              <div className="text-sm">
                <Calendar className="h-3 w-3 mr-1 inline-block" />
                {format(new Date(capa.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">Root Cause</div>
              <div className="text-sm">{capa.rootCause || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Corrective Action</div>
              <div className="text-sm">{capa.correctiveAction || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Preventive Action</div>
              <div className="text-sm">{capa.preventiveAction || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Verification Method</div>
              <div className="text-sm">{capa.verificationMethod || 'Not specified'}</div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-xs font-medium text-gray-500">Effectiveness Criteria</div>
            <div className="text-sm">{capa.effectivenessCriteria || 'Not specified'}</div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">Verified By</div>
              <div className="text-sm">{capa.verifiedBy || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Completion Date</div>
              <div className="text-sm">
                {capa.completionDate ? format(new Date(capa.completionDate), 'MMM d, yyyy') : 'Not completed'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <RelatedDocumentsList documentIds={['1', '2', '3']} />
        </div>
        <div>
          <RelatedTrainingList trainingIds={['A', 'B', 'C']} />
        </div>
      </div>

      <CAPATimeline capaId={capa.id} />

      <CAPAEffectivenessForm capaId={capa.id} />
    </div>
  );
};

export default CAPADetails;
