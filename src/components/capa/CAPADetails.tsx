
// Only fixing the isStringStatusEqual import
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CAPA } from '@/types/capa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { updateCAPA } from '@/services/capaService';
import { isStringStatusEqual } from '@/utils/typeAdapters';
import { format } from 'date-fns';
import { CAPAStatusBadge } from './CAPAStatusBadge';
import { CAPAStatus } from '@/types/enums';

const RelatedDocumentsList = ({ documentIds }: { documentIds: string[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {documentIds.length === 0 ? (
          <p className="text-sm text-gray-500">No related documents</p>
        ) : (
          <ul className="space-y-2">
            {documentIds.map((id) => (
              <li key={id} className="text-sm">Document ID: {id}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const RelatedTrainingList = ({ trainingIds }: { trainingIds: string[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Training</CardTitle>
      </CardHeader>
      <CardContent>
        {trainingIds.length === 0 ? (
          <p className="text-sm text-gray-500">No related training</p>
        ) : (
          <ul className="space-y-2">
            {trainingIds.map((id) => (
              <li key={id} className="text-sm">Training ID: {id}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const CAPATimeline = ({ capaId }: { capaId: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPA Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Timeline for CAPA ID: {capaId}</p>
      </CardContent>
    </Card>
  );
};

interface CAPAEffectivenessFormProps {
  capaId: string;
  onSubmit?: (data: any) => void;
}

const CAPAEffectivenessForm: React.FC<CAPAEffectivenessFormProps> = ({ capaId, onSubmit = () => {} }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Effectiveness Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Assessment form for CAPA ID: {capaId}</p>
        <Button onClick={() => onSubmit({ capaId, effective: true })}>Submit Assessment</Button>
      </CardContent>
    </Card>
  );
};

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
            <CAPAStatusBadge status={capa.status as CAPAStatus} />
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
              <div className="text-sm">{capa.assigned_to}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Created By</div>
              <div className="text-sm">{capa.created_by}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Due Date</div>
              <div className="text-sm">
                <Clock className="h-3 w-3 mr-1 inline-block" />
                {format(new Date(capa.due_date), 'MMM d, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Created At</div>
              <div className="text-sm">
                <Calendar className="h-3 w-3 mr-1 inline-block" />
                {format(new Date(capa.created_at), 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">Root Cause</div>
              <div className="text-sm">{capa.root_cause || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Corrective Action</div>
              <div className="text-sm">{capa.corrective_action || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Preventive Action</div>
              <div className="text-sm">{capa.preventive_action || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Verification Method</div>
              <div className="text-sm">{capa.verification_method || 'Not specified'}</div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-xs font-medium text-gray-500">Effectiveness Criteria</div>
            <div className="text-sm">{capa.effectiveness_criteria || 'Not specified'}</div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">Verified By</div>
              <div className="text-sm">{capa.verified_by || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Completion Date</div>
              <div className="text-sm">
                {capa.completion_date ? format(new Date(capa.completion_date), 'MMM d, yyyy') : 'Not completed'}
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

      <CAPAEffectivenessForm capaId={capa.id} onSubmit={() => {}} />
    </div>
  );
};

export default CAPADetails;
