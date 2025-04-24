import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { updateCAPAStatus } from '@/services/capa/capaUpdateService';
import { getCAPAById, updateCAPA } from '@/services/capaService';
import { isStatusEqual } from '@/services/capa/capaStatusService';
import { format } from 'date-fns';
import { CAPAStatusBadge } from '@/components/capa/CAPAStatusBadge';
import RelatedDocumentsList from '@/components/capa/RelatedDocumentsList';
import RelatedTrainingList from '@/components/capa/RelatedTrainingList';

interface CAPADetailsProps {
  // Define props if needed
}

const CAPADetails: React.FC<CAPADetailsProps> = ({ /* props */ }) => {
  const { id } = useParams<{ id: string }>();
  const [capa, setCapa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadCAPA = async () => {
      try {
        setLoading(true);
        const capaData = await getCAPAById(id);
        setCapa(capaData);
      } catch (error) {
        console.error('Error loading CAPA:', error);
        toast({
          title: 'Error',
          description: 'Failed to load CAPA details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCAPA();
  }, [id, toast]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      // Assuming you have a user ID available
      const userId = 'user-123';
      const updatedCAPA = await updateCAPAStatus(id, newStatus, userId, comments);
      setCapa(updatedCAPA);
      toast({
        title: 'CAPA Updated',
        description: `CAPA status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating CAPA status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update CAPA status.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/capa/${id}/edit`);
  };

  const handleDelete = async () => {
    // Implementation
    console.log('Delete CAPA:', id);
    toast({
      title: "CAPA Deleted",
      description: "The CAPA has been successfully deleted.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading CAPA details...</span>
      </div>
    );
  }

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

      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Textarea
                placeholder="Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('In_Progress')}
                disabled={isStatusEqual(capa.status, 'In_Progress')}
              >
                Mark In Progress
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('Pending_Verification')}
                disabled={isStatusEqual(capa.status, 'Pending_Verification')}
              >
                Mark Pending Verification
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('Verified')}
                disabled={isStatusEqual(capa.status, 'Verified')}
              >
                Mark Verified
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('Closed')}
                disabled={isStatusEqual(capa.status, 'Closed')}
              >
                Mark Closed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RelatedDocumentsList documentIds={capa.relatedDocuments || []} />
        <RelatedTrainingList trainingIds={capa.relatedTraining || []} />
      </div>
    </div>
  );
};

export default CAPADetails;
