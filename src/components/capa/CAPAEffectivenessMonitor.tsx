
import React, { useEffect, useState } from 'react';
import { fetchCAPAById } from '@/services/capa/capaFetchService';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/capa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface CAPAEffectivenessMonitorProps {
  id: string;
  implementationDate?: string;
}

const getStatusIcon = (verified: boolean | undefined, rating: string | undefined) => {
  if (!verified) {
    return <Clock className="h-8 w-8 text-warning" />;
  }
  if (rating === "Highly_Effective" || rating === "Effective") {
    return <CheckCircle className="h-8 w-8 text-success" />;
  }
  return <AlertCircle className="h-8 w-8 text-destructive" />;
};

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({ id, implementationDate }) => {
  const [capa, setCapa] = useState<CAPA | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const capaData = await fetchCAPAById(id);
        
        // Transform the API data to match the CAPA interface
        const transformedCapa: CAPA = {
          id: capaData.id,
          title: capaData.title,
          description: capaData.description,
          status: mapStatusToEnum(capaData.status),
          priority: mapPriorityToEnum(capaData.priority),
          createdAt: capaData.created_at,
          createdBy: capaData.created_by,
          dueDate: capaData.due_date,
          assignedTo: capaData.assigned_to,
          source: mapSourceToEnum(capaData.source),
          completionDate: capaData.completion_date,
          rootCause: capaData.root_cause,
          correctiveAction: capaData.corrective_action,
          preventiveAction: capaData.preventive_action,
          effectivenessCriteria: capaData.effectiveness_criteria,
          effectivenessRating: mapEffectivenessRatingToEnum(capaData.effectiveness_rating),
          effectivenessVerified: capaData.effectiveness_verified,
          verificationDate: capaData.verification_date,
          verificationMethod: capaData.verification_method,
          verifiedBy: capaData.verified_by,
          department: capaData.department,
          sourceId: capaData.source_id,
          fsma204Compliant: capaData.fsma204_compliant,
          sourceReference: capaData.source_reference || '',
          relatedDocuments: [],
          relatedTraining: []
        };
        
        setCapa(transformedCapa);
      } catch (err) {
        setError('Failed to load CAPA effectiveness data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Helper functions to map string values to enum types
  const mapStatusToEnum = (status: string): CAPAStatus => {
    if (!status) return 'Open';
    
    // Convert spaces to underscores first
    status = status.replace(/ /g, '_');
    
    switch(status.toLowerCase()) {
      case 'open': return 'Open';
      case 'in_progress': return 'In_Progress';
      case 'under_review': return 'Under_Review';
      case 'completed': return 'Completed';
      case 'closed': return 'Closed';
      case 'rejected': return 'Rejected';
      case 'on_hold': return 'On_Hold';
      case 'overdue': return 'Overdue';
      case 'pending_verification': return 'Pending_Verification';
      case 'verified': return 'Verified';
      default: return 'Open';
    }
  };

  const mapPriorityToEnum = (priority: string): CAPAPriority => {
    if (priority === 'Low' || priority === 'Medium' || priority === 'High' || priority === 'Critical') {
      return priority as CAPAPriority;
    }
    return 'Medium';
  };

  const mapSourceToEnum = (source: string): CAPASource => {
    if (source === 'Audit' || source === 'Customer Complaint' || source === 'Internal' || 
        source === 'Regulatory' || source === 'Other') {
      return source as CAPASource;
    }
    return 'Other';
  };

  const mapEffectivenessRatingToEnum = (rating: string | undefined): CAPAEffectivenessRating | undefined => {
    if (!rating) return undefined;
    
    // Convert spaces to underscores first
    rating = rating.replace(/ /g, '_');
    
    switch(rating.toLowerCase()) {
      case 'not_effective': return 'Not_Effective';
      case 'partially_effective': return 'Partially_Effective';
      case 'effective': return 'Effective';
      case 'highly_effective': return 'Highly_Effective';
      default: return undefined;
    }
  };

  if (loading) {
    return <Card className="animate-pulse bg-secondary/30"><CardContent className="p-6 h-40"></CardContent></Card>;
  }

  if (error || !capa) {
    return (
      <Card className="bg-destructive/10 border-destructive/20">
        <CardContent className="p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            <p className="text-destructive">{error || 'CAPA data not available'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusText = () => {
    if (!capa.effectivenessVerified) {
      return 'Effectiveness verification pending';
    }
    
    switch (capa.effectivenessRating) {
      case 'Highly_Effective':
        return 'Highly effective - No recurrence';
      case 'Effective':
        return 'Effective - Meets criteria';
      case 'Partially_Effective':
        return 'Partially effective - Needs improvement';
      case 'Not_Effective':
        return 'Not effective - Recurrence or failure';
      default:
        return 'Status unknown';
    }
  };

  const getEffectivenessClass = () => {
    if (!capa.effectivenessVerified) {
      return 'bg-warning-muted text-warning-foreground';
    }
    
    switch (capa.effectivenessRating) {
      case 'Highly_Effective':
      case 'Effective':
        return 'bg-success-muted text-success';
      case 'Partially_Effective':
        return 'bg-warning-muted text-warning-foreground';
      case 'Not_Effective':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-secondary text-foreground-secondary';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Effectiveness Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            {getStatusIcon(capa.effectivenessVerified, capa.effectivenessRating)}
            <div className="ml-3">
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEffectivenessClass()}`}>
                {getStatusText()}
              </div>
              <p className="text-sm text-foreground-muted mt-1">
                {implementationDate 
                  ? `Implemented on ${implementationDate}` 
                  : capa.completionDate 
                    ? `Implemented on ${new Date(capa.completionDate).toLocaleDateString()}` 
                    : 'Implementation date not set'}
              </p>
            </div>
          </div>
          
          {capa.effectivenessVerified && (
            <div className="text-sm">
              <p className="font-medium">Verification Details:</p>
              <p className="text-foreground-muted">
                {capa.verificationMethod || 'No verification method specified'}
              </p>
              {capa.verificationDate && (
                <p className="text-foreground-muted mt-1">
                  Verified on {new Date(capa.verificationDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
