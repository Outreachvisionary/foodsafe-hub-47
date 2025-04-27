
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource } from '@/types/capa';
import { fetchCAPAById } from '@/services/capa/capaFetchService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/ui/status-badge';

const LinkedCAPAsList = ({ capaIds }: { capaIds: string[] }) => {
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkedCAPAs = async () => {
      if (!capaIds || capaIds.length === 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const capaPromises = capaIds.map(id => fetchCAPAById(id));
        const fetchedCapasData = await Promise.all(capaPromises);
        
        // Transform API response to match CAPA interface
        const transformedCapas: CAPA[] = fetchedCapasData.map(data => ({
          id: data.id,
          title: data.title,
          description: data.description,
          status: mapStatusToEnum(data.status),
          priority: mapPriorityToEnum(data.priority),
          createdAt: data.created_at,
          createdBy: data.created_by,
          dueDate: data.due_date,
          assignedTo: data.assigned_to,
          source: mapSourceToEnum(data.source),
          completionDate: data.completion_date,
          rootCause: data.root_cause,
          correctiveAction: data.corrective_action,
          preventiveAction: data.preventive_action,
          effectivenessCriteria: data.effectiveness_criteria,
          effectivenessRating: mapEffectivenessRatingToEnum(data.effectiveness_rating),
          effectivenessVerified: data.effectiveness_verified,
          verificationDate: data.verification_date,
          verificationMethod: data.verification_method,
          verifiedBy: data.verified_by,
          department: data.department,
          sourceId: data.source_id,
          fsma204Compliant: data.fsma204_compliant,
          sourceReference: data.source_reference,
          relatedDocuments: [],
          relatedTraining: []
        }));

        setCapas(transformedCapas);
      } catch (error) {
        console.error('Error fetching linked CAPAs:', error);
        setError('Failed to load linked CAPA items');
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedCAPAs();
  }, [capaIds]);

  // Helper functions to map string values to enum types
  const mapStatusToEnum = (status: string): CAPAStatus => {
    if (!status) return 'Open';
    
    status = status.replace(' ', '_');
    
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
  
  const mapEffectivenessRatingToEnum = (rating: string | undefined) => {
    if (!rating) return undefined;
    
    rating = rating.replace(' ', '_');
    
    switch(rating.toLowerCase()) {
      case 'not_effective': return 'Not_Effective';
      case 'partially_effective': return 'Partially_Effective';
      case 'effective': return 'Effective';
      case 'highly_effective': return 'Highly_Effective';
      default: return undefined;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center">
            <div className="animate-spin mr-2">
              <Loader2 size={16} />
            </div>
            Loading Linked CAPAs...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/10">
        <CardContent className="p-4">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!capaIds || capaIds.length === 0 || capas.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-foreground-muted">No linked CAPA items found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Linked CAPAs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {capas.map((capa) => (
            <li key={capa.id} className="px-4 py-3 hover:bg-secondary/30 transition-colors">
              <Link to={`/capa/${capa.id}`} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{capa.title}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <StatusBadge status={capa.status} />
                    <span className="text-xs text-foreground-muted">
                      {new Date(capa.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-foreground-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
