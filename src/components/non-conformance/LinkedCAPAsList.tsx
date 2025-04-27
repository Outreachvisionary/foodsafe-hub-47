
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CAPA, CAPAStatus, CAPAEffectivenessRating } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';

interface LinkedCAPAsListProps {
  capaIds: string[];
}

const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({ capaIds }) => {
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCAPAs = async () => {
      if (!capaIds || capaIds.length === 0) {
        setCapas([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('capa_actions')
          .select('*')
          .in('id', capaIds);

        if (error) throw error;

        // Convert DB data to CAPA objects
        const transformedCapas = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          status: mapStatusToEnum(item.status),
          priority: mapPriorityToEnum(item.priority),
          createdAt: item.created_at,
          createdBy: item.created_by,
          dueDate: item.due_date,
          assignedTo: item.assigned_to,
          source: item.source,
          completionDate: item.completion_date,
          rootCause: item.root_cause,
          correctiveAction: item.corrective_action,
          preventiveAction: item.preventive_action,
          effectivenessCriteria: item.effectiveness_criteria,
          effectivenessRating: mapEffectivenessRatingToEnum(item.effectiveness_rating),
          effectivenessVerified: item.effectiveness_verified,
          verificationDate: item.verification_date,
          verificationMethod: item.verification_method,
          verifiedBy: item.verified_by,
          department: item.department,
          sourceId: item.source_id,
          fsma204Compliant: item.fsma204_compliant,
          sourceReference: item.source_reference || '',
          relatedDocuments: [],
          relatedTraining: [],
        }));
        
        setCapas(transformedCapas as CAPA[]);
      } catch (err) {
        console.error('Error fetching linked CAPAs:', err);
        setError('Failed to load linked CAPAs');
      } finally {
        setLoading(false);
      }
    };

    fetchCAPAs();
  }, [capaIds]);

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

  const mapPriorityToEnum = (priority: string): string => {
    if (priority === 'Low' || priority === 'Medium' || priority === 'High' || priority === 'Critical') {
      return priority;
    }
    return 'Medium';
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
